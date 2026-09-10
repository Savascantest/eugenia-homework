import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  assertPublicHomeworkPackagePrivacy,
  collectPublicPackagePrivacyOccurrences,
} from './lib/public-package-privacy.mjs';

const PUBLIC_ROOT = path.resolve('public/homeworks');
const LEGACY_DEBT_FILE = path.resolve('scripts/fixtures/legacy-public-package-privacy-debt.json');

function git(args, { required = false, description = 'run Git' } = {}) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr?.trim() || `git exited with status ${result.status}`;
    if (required) throw new Error(`Unable to ${description}: ${detail}`);
    return undefined;
  }
  return result.stdout;
}

function gitLines(args, options) {
  return (git(args, options) || '')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim());
}

function relativePackagePath(candidate) {
  const renamedPath = candidate.split(' -> ').at(-1).replaceAll('\\', '/');
  if (!renamedPath.match(/^public\/homeworks\/.+\/homework\.json$/)) return undefined;
  const absolute = path.resolve(renamedPath);
  if (absolute === PUBLIC_ROOT || !absolute.startsWith(`${PUBLIC_ROOT}${path.sep}`)) {
    throw new Error(`Refusing to validate a package outside ${PUBLIC_ROOT}: ${candidate}`);
  }
  return path.relative(PUBLIC_ROOT, absolute).replaceAll('\\', '/');
}

function addPackagePath(files, candidate, kind) {
  const relative = relativePackagePath(candidate);
  if (!relative) return;
  const existing = files.get(relative);
  files.set(relative, existing || kind);
}

function resolveBase(base = process.env.PUBLIC_PACKAGE_PRIVACY_BASE) {
  const requestedBase = base?.trim();
  const candidate = requestedBase && !/^0+$/.test(requestedBase)
    ? requestedBase
    : process.env.CI
      ? 'HEAD^'
      : undefined;
  if (!candidate) return undefined;
  return git(['rev-parse', '--verify', `${candidate}^{commit}`], {
    required: true,
    description: `resolve public-package privacy base ${candidate}`,
  }).trim();
}

export function changedPublicHomeworkPackageEntries({ base = process.env.PUBLIC_PACKAGE_PRIVACY_BASE } = {}) {
  const files = new Map();
  for (const line of gitLines(
    ['status', '--porcelain=v1', '--untracked-files=all', '--', 'public/homeworks'],
    { required: true, description: 'determine changed public packages' },
  )) addPackagePath(files, line.slice(3));

  const resolvedBase = resolveBase(base);
  if (resolvedBase) {
    for (const line of gitLines(
      ['diff', '--name-status', '--diff-filter=AMR', resolvedBase, 'HEAD', '--', 'public/homeworks'],
      { required: true, description: 'determine changed public packages' },
    )) {
      const [status, ...paths] = line.split('\t');
      addPackagePath(files, paths.at(-1), status.startsWith('A') ? 'new' : 'modified');
    }
    for (const [relative, kind] of files) {
      if (!kind) files.set(relative, basePackageExists(relative, resolvedBase) ? 'modified' : 'new');
    }
  }
  return [...files]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([relative, kind]) => ({ file: path.join(PUBLIC_ROOT, relative), kind: kind || 'new' }));
}

export function changedPublicHomeworkPackages(options) {
  return changedPublicHomeworkPackageEntries(options).map(({ file }) => file);
}

function canonicalValue(value) {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalValue(value[key])]));
  }
  return value;
}

export function canonicalPrivacyOccurrence({ path: occurrencePath, value }) {
  return JSON.stringify({ path: occurrencePath, value: canonicalValue(value) });
}

async function legacyDebtPaths() {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(LEGACY_DEBT_FILE, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read explicit legacy privacy debt record ${LEGACY_DEBT_FILE}: ${error.message}`);
  }
  if (parsed?.schemaVersion !== 1 || parsed?.studentKey !== 'eugenia' || !Array.isArray(parsed.violations)) {
    throw new Error(`Invalid explicit legacy privacy debt record ${LEGACY_DEBT_FILE}`);
  }
  const allowed = new Set();
  for (const entry of parsed.violations) {
    if (typeof entry?.file !== 'string' || !Array.isArray(entry.fields)) {
      throw new Error(`Invalid explicit legacy privacy debt entry in ${LEGACY_DEBT_FILE}`);
    }
    for (const field of entry.fields) {
      if (typeof field !== 'string') throw new Error(`Invalid legacy privacy debt field in ${LEGACY_DEBT_FILE}`);
      allowed.add(`${entry.file}\u0000${field}`);
    }
  }
  return allowed;
}

function baseHomework(relative, base) {
  const gitPath = `public/homeworks/${relative}`;
  const raw = git(['show', `${base}:${gitPath}`], {
    required: true,
    description: `read base package ${gitPath}`,
  });
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to parse base package ${gitPath}: ${error.message}`);
  }
}

function basePackageExists(relative, base) {
  return git(['cat-file', '-e', `${base}:public/homeworks/${relative}`]) !== undefined;
}

export function assertModifiedPackagePrivacy({ current, baseHomeworkPackage, relative, allowedDebtPaths, source }) {
  const baseOccurrences = new Set(
    collectPublicPackagePrivacyOccurrences(baseHomeworkPackage).map(canonicalPrivacyOccurrence),
  );
  for (const occurrence of collectPublicPackagePrivacyOccurrences(current)) {
    const debtKey = `${relative}\u0000${occurrence.path}`;
    if (!allowedDebtPaths.has(debtKey) || !baseOccurrences.has(canonicalPrivacyOccurrence(occurrence))) {
      throw new Error(
        `${source}: prohibited privacy occurrence ${occurrence.path} is new, changed, or not explicitly acknowledged legacy debt`,
      );
    }
  }
}

export async function validateChangedPublicHomeworkPackages({
  base = process.env.PUBLIC_PACKAGE_PRIVACY_BASE,
  entries = changedPublicHomeworkPackageEntries({ base }),
  loadDebtPaths = legacyDebtPaths,
} = {}) {
  const resolvedBase = resolveBase(base);
  const targets = entries.map(({ file, kind }) => ({ file: path.resolve(file), kind }));
  let allowedDebtPaths;

  for (const { file, kind } of targets) {
    if (file === PUBLIC_ROOT || !file.startsWith(`${PUBLIC_ROOT}${path.sep}`)) {
      throw new Error(`Refusing to validate a package outside ${PUBLIC_ROOT}: ${file}`);
    }
    const current = JSON.parse(await readFile(file, 'utf8'));
    const relative = path.relative(PUBLIC_ROOT, file).replaceAll('\\', '/');

    if (kind === 'new') {
      assertPublicHomeworkPackagePrivacy(current, { source: path.relative(process.cwd(), file) });
      continue;
    }

    if (!resolvedBase) {
      throw new Error(
        `${path.relative(process.cwd(), file)}: modified public package privacy validation requires a readable base commit`,
      );
    }

    if (!allowedDebtPaths) allowedDebtPaths = await loadDebtPaths();
    assertModifiedPackagePrivacy({
      current,
      baseHomeworkPackage: baseHomework(relative, resolvedBase),
      relative,
      allowedDebtPaths,
      source: path.relative(process.cwd(), file),
    });
  }
  return targets.map(({ file }) => file);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const explicit = process.argv.slice(2);
  const entries = explicit.length
    ? explicit.map((value) => ({ file: path.resolve(value), kind: 'new' }))
    : undefined;
  const validated = await validateChangedPublicHomeworkPackages({ entries });
  console.log(
    validated.length
      ? `Validated public-package privacy for ${validated.length} new or modified package(s).`
      : 'No new or modified public homework packages require privacy validation.',
  );
}
