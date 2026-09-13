import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertArchitectureV1Package } from './lib/architecture-v1-package.mjs';

const ROOT = path.resolve('public/homeworks');
const PRESERVED_HISTORICAL_IDS = [
  '2026-08-18-homework-1',
  '2026-08-21-homework-2',
  '2026-08-25-32EDDB85',
  '2026-08-29-A303F12D',
  '2026-09-01-70e747daa869',
  '2026-09-07-d0db0400cfd',
  '2026-09-09-d2100490efd',
];

const index = JSON.parse(await readFile(path.join(ROOT, 'index.json'), 'utf8'));
if (!Array.isArray(index)) throw Error('Homework archive index must be an array');
const ids = new Set();
const packages = [];
let previousDate;

for (const entry of index) {
  if (!entry?.id || !entry?.date || !entry?.title || !entry?.path) throw Error('Homework archive entry is incomplete');
  if (ids.has(entry.id)) throw Error(`Duplicate homework archive ID: ${entry.id}`);
  if (previousDate && previousDate < entry.date) throw Error('Homework archive must remain newest first');
  if (!entry.path.match(/^homeworks\/[^/]+\/homework\.json$/u)) throw Error(`Unsafe homework archive path: ${entry.path}`);
  const file = path.resolve('public', entry.path);
  if (!file.startsWith(`${ROOT}${path.sep}`)) throw Error(`Homework archive path escapes public homeworks: ${entry.path}`);
  const homework = JSON.parse(await readFile(file, 'utf8'));
  if (homework.id !== entry.id || homework.date !== entry.date || homework.title !== entry.title) {
    throw Error(`Homework archive entry does not match package data: ${entry.id}`);
  }
  assertArchitectureV1Package(homework, entry.path);
  ids.add(entry.id);
  packages.push({ entry, homework });
  previousDate = entry.date;
}

for (const id of PRESERVED_HISTORICAL_IDS) {
  if (!ids.has(id)) throw Error(`Preserved historical homework is missing from the archive: ${id}`);
}

const preserved = packages.find(({ entry }) => entry.id === '2026-09-09-d2100490efd')?.homework;
if (!preserved) throw Error('Preserved 9 September package is missing');
if (preserved.meetingKeyHash !== 'd2100490efd9909c34e790ad5c5a03cdad1c50595901d5967748a02efba2eb38') {
  throw Error('Preserved 9 September package identity hash mismatch');
}
if ('meetingUuid' in preserved || JSON.stringify(preserved).includes('AE54725F-537F-462F-9E07-A38389B3B752')) {
  throw Error('Private meeting ID leaked from preserved 9 September package');
}
for (const key of ['lessonNotes', 'grammar', 'flashcards', 'dailyUsage', 'dailyQuestions', 'practice', 'conversation', 'quiz']) {
  if (!preserved[key]?.length) throw Error(`Preserved 9 September package is missing ${key}`);
}
if (!preserved.reading?.text || !preserved.reading?.questions?.length || !preserved.listening?.script || !preserved.listening?.questions?.length || !preserved.writing?.prompt) {
  throw Error('Preserved 9 September package is missing reading, listening, or writing');
}
if (preserved.reading.text.split('\n\n').length !== 2) throw Error('Preserved 9 September reading must contain exactly two paragraphs');
if (/Curiosity Club|Hobby Fair|photography fair|numismatics/iu.test(`${preserved.reading.text} ${preserved.listening.script} ${preserved.writing.prompt}`)) {
  throw Error('Preserved 9 September package repeats earlier reading, listening, or writing themes');
}
for (const set of [preserved.dailyQuestions, preserved.practice, preserved.conversation, preserved.reading.questions, preserved.listening.questions, preserved.quiz]) {
  if (set.some((question) => question.opt.length < 3 || !question.a || !question.opt.includes(question.a))) {
    throw Error('Preserved 9 September question data is invalid');
  }
}
const preservedMaterial = JSON.stringify(preserved);
if (/\bEugenia\b/iu.test(preservedMaterial) || /[çğıöşüÇĞİÖŞÜ]/u.test(preservedMaterial)) {
  throw Error('Preserved 9 September learner material violates its existing privacy or language checks');
}
if (!/will/iu.test(preservedMaterial) || !/going to/iu.test(preservedMaterial) || !/21-Day Challenge/u.test(preservedMaterial) || !/mental health/iu.test(preservedMaterial)) {
  throw Error('Preserved 9 September lesson commitments are missing');
}
const component = await readFile('src/Homework20260909.jsx', 'utf8');
const app = await readFile('src/App.jsx', 'utf8');
if (!component.includes('None of these answers.') || !component.includes('Math.random') || !component.includes('rounded-2xl rounded-bl-md')) {
  throw Error('Preserved 9 September hybrid interaction is incomplete');
}
if (!app.includes('<Homework20260909')) throw Error('Preserved 9 September hybrid component is no longer wired into the application');

console.log(`Validated ${packages.length} archived homework package(s), preserved historical compatibility, and future Architecture v1 requirements.`);
