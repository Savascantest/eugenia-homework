const PROHIBITED_FIELD_REASONS = new Map([
  ['meetinguuid', 'raw meeting UUID'],
  ['rawmeetinguuid', 'raw meeting UUID'],
  ['zoommeetinguuid', 'raw meeting UUID'],
  ['meetingid', 'raw meeting ID'],
  ['rawmeetingid', 'raw meeting ID'],
  ['zoommeetingid', 'raw meeting ID'],
  ['meetingnumber', 'raw meeting ID'],
  ['transcript', 'transcript content'],
  ['zoomtranscript', 'transcript content'],
  ['transcriptitems', 'transcript items'],
  ['meetingtranscript', 'transcript content'],
  ['transcriptpath', 'private transcript path'],
  ['sourcetranscriptpath', 'private transcript path'],
  ['exportedtranscriptpath', 'private transcript path'],
  ['transcripthash', 'transcript hash'],
  ['transcriptsha256', 'transcript hash'],
  ['privatesourceevidence', 'private source evidence'],
  ['sourceevidence', 'private source evidence'],
  ['privateteacherevidence', 'private teacher evidence'],
  ['teachersourceevidence', 'private teacher/source evidence'],
  ['teachernote', 'private teacher note'],
  ['teachernotes', 'private teacher notes'],
  ['privateevidence', 'private execution evidence'],
  ['executionreceipt', 'private execution evidence'],
  ['validationreport', 'private execution evidence'],
]);

export class PublicPackagePrivacyError extends Error {
  constructor(source, violations) {
    super(`${source}: public homework privacy validation failed:\n- ${violations.join('\n- ')}`);
    this.name = 'PublicPackagePrivacyError';
    this.source = source;
    this.violations = violations;
  }
}

export function normalizeFieldName(value) {
  return String(value).toLocaleLowerCase('en-US').replace(/[^a-z0-9]/g, '');
}

function prohibitedReason(field) {
  const normalized = normalizeFieldName(field);
  const exact = PROHIBITED_FIELD_REASONS.get(normalized);
  if (exact) return exact;
  if (/meeting(?:uuid|id|number)$/.test(normalized)) return 'raw meeting identifier';
  if (normalized.includes('transcript')) return 'transcript content or source metadata';
  if (/teacher(?:source)?notes?$/.test(normalized)) return 'private teacher note';
  if (normalized.includes('evidence') && /(private|source|teacher|execution)/.test(normalized)) {
    return 'private source, teacher, or execution evidence';
  }
  return undefined;
}

export function collectPublicPackagePrivacyOccurrences(value, location = '$') {
  const occurrences = [];

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      occurrences.push(...collectPublicPackagePrivacyOccurrences(item, `${location}[${index}]`));
    });
    return occurrences;
  }

  if (value && typeof value === 'object') {
    for (const [field, item] of Object.entries(value)) {
      const child = `${location}.${field}`;
      const reason = prohibitedReason(field);
      if (reason) occurrences.push({ path: child, message: `prohibited ${reason} field`, value: item });
      occurrences.push(...collectPublicPackagePrivacyOccurrences(item, child));
    }
    return occurrences;
  }

  if (typeof value === 'string') {
    const normalized = value.toLocaleLowerCase('en-US').replaceAll('\\', '/');
    if (normalized.includes('/private/') || normalized.includes('private-transcript')) {
      occurrences.push({ path: location, message: 'private source path/value', value });
    }
  }

  return occurrences;
}

export function collectPublicPackagePrivacyViolations(value, location = '$') {
  return collectPublicPackagePrivacyOccurrences(value, location)
    .map(({ path: occurrencePath, message }) => `${occurrencePath}: ${message}`);
}

export function assertPublicHomeworkPackagePrivacy(homework, { source = 'HomeworkPackage' } = {}) {
  const violations = collectPublicPackagePrivacyViolations(homework);
  if (violations.length) throw new PublicPackagePrivacyError(source, violations);
  return homework;
}

export const prohibitedPublicPackageFields = Object.freeze([...PROHIBITED_FIELD_REASONS.keys()]);
