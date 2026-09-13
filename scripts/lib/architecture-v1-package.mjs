export const ARCHITECTURE_V1_EFFECTIVE_DATE = '2026-09-14';
export const APPROVED_POLICY_VERSION = 'eugenia-lesson-based@1';
export const APPROVED_TEMPLATE_VERSION = 'eugenia-interactive-hybrid@1';
export const APPROVED_ASSESSMENT_POLICY_VERSION = 'eugenia-section-and-final-checks@1';

export const APPROVED_ARCHITECTURE_V1_CONTRACT = Object.freeze({
  policyVersion: APPROVED_POLICY_VERSION,
  templateContractVersion: APPROVED_TEMPLATE_VERSION,
  assessmentPolicyVersion: APPROVED_ASSESSMENT_POLICY_VERSION,
  effectiveDate: ARCHITECTURE_V1_EFFECTIVE_DATE,
  learnerFacingLanguage: 'ENGLISH_ONLY',
  cadence: 'LESSON_BASED',
  finalQuiz: Object.freeze({ questionCount: 20, learnerFacingTarget: '16/20', nonGating: true }),
});

const FUTURE_PRIVATE_FIELD_REASONS = new Map([
  ['meetingkeyhash', 'private lesson/source hash'],
  ['sourcehash', 'private lesson/source hash'],
  ['sourceid', 'private source identifier'],
  ['sourcelessons', 'private source lesson trace'],
  ['lessonrecord', 'private LessonRecord'],
  ['lessonrecordpath', 'private LessonRecord path'],
  ['planningnote', 'private planning note'],
  ['planningnotes', 'private planning notes'],
  ['teacherinstruction', 'private teacher instruction'],
  ['teacherinstructions', 'private teacher instructions'],
  ['packagespecificoverride', 'private package-specific override'],
  ['packagespecificoverrides', 'private package-specific overrides'],
  ['executionreceipt', 'private execution receipt'],
  ['validationreport', 'private validation report'],
]);

const NON_LEARNER_TEXT_FIELDS = new Set([
  'id', 'packageid', 'lessonid', 'date', 'datelabel', 'policyversion',
  'templatecontractversion', 'assessmentpolicyversion', 'url', 'href', 'path',
]);
const TURKISH_DIACRITICS = /[çğıöşüÇĞİÖŞÜ]/u;
const TURKISH_PHRASES = /\b(?:lütfen|türkçe|bu\s+bir|doğru\s+cevap|yanlış\s+cevap|açıklama|örnek\s+cümle|soru|cevap|ödev|ders|kelime|dinleme|okuma|yazma|gramer)\b/iu;

function normalizedField(field) {
  return String(field).toLocaleLowerCase('en-US').replace(/[^a-z0-9]/g, '');
}

function futurePrivateFieldReason(field) {
  const normalized = normalizedField(field);
  if (FUTURE_PRIVATE_FIELD_REASONS.has(normalized)) return FUTURE_PRIVATE_FIELD_REASONS.get(normalized);
  if (normalized.includes('transcript') || normalized.includes('meetinguuid') || normalized.includes('meetingid')) {
    return 'private transcript or meeting identifier';
  }
  if (normalized.includes('teacher') && /(note|evidence|source)/.test(normalized)) return 'private teacher evidence';
  if (normalized.includes('source') && /(hash|identifier|record|evidence|lesson)/.test(normalized)) {
    return 'private source metadata';
  }
  return undefined;
}

function isFuturePackage(homework) {
  return typeof homework?.date === 'string' && homework.date >= ARCHITECTURE_V1_EFFECTIVE_DATE;
}

function addEnglishOnlyErrors(value, location, field, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => addEnglishOnlyErrors(item, `${location}[${index}]`, field, errors));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [childField, child] of Object.entries(value)) {
      addEnglishOnlyErrors(child, `${location}.${childField}`, childField, errors);
    }
    return;
  }
  if (typeof value !== 'string') return;
  const normalized = normalizedField(field);
  if (NON_LEARNER_TEXT_FIELDS.has(normalized) || /^https?:\/\//iu.test(value)) return;
  if (TURKISH_DIACRITICS.test(value) || TURKISH_PHRASES.test(value)) {
    errors.push(`${location}: learner-facing text appears to contain Turkish`);
  }
}

function addFuturePrivateFieldErrors(value, location, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => addFuturePrivateFieldErrors(item, `${location}[${index}]`, errors));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [field, child] of Object.entries(value)) {
    const reason = futurePrivateFieldReason(field);
    if (reason) errors.push(`${location}.${field}: prohibited ${reason} in a future public package`);
    addFuturePrivateFieldErrors(child, `${location}.${field}`, errors);
  }
}

function collectQuestionGroups(value, location = '$', groups = []) {
  if (Array.isArray(value)) {
    const questions = value.filter((item) => item && typeof item === 'object' && (Array.isArray(item.opt) || Array.isArray(item.options)) && item.a !== undefined);
    if (questions.length) groups.push({ location, questions });
    value.forEach((item, index) => collectQuestionGroups(item, `${location}[${index}]`, groups));
    return groups;
  }
  if (value && typeof value === 'object') {
    for (const [field, child] of Object.entries(value)) collectQuestionGroups(child, `${location}.${field}`, groups);
  }
  return groups;
}

function correctOptionPositions(group, errors) {
  const positions = [];
  for (const [index, question] of group.questions.entries()) {
    const options = question.opt || question.options;
    const position = options.findIndex((option) => option === question.a);
    if (position < 0) {
      errors.push(`${group.location}[${index}]: correct answer must appear in its options`);
    } else {
      positions.push({ position, optionCount: options.length });
    }
  }
  return positions;
}

function repeatsPattern(positions, period) {
  return positions.length >= period * 4
    && positions.every((entry, index) => entry.position === positions[index % period].position);
}

function addAnswerDistributionErrors(homework, errors) {
  for (const group of collectQuestionGroups(homework)) {
    const positions = correctOptionPositions(group, errors);
    if (positions.length < 3) continue;
    const counts = new Map();
    positions.forEach(({ position }) => counts.set(position, (counts.get(position) || 0) + 1));
    const dominant = Math.max(...counts.values());
    if (dominant === positions.length && positions[0].position === 0) {
      errors.push(`${group.location}: every correct answer is option 0`);
    } else if (positions.length >= 6 && dominant / positions.length >= 0.8) {
      errors.push(`${group.location}: one correct-answer position dominates this substantial question set`);
    }
    if (repeatsPattern(positions, 2) && positions[0].position !== positions[1].position) {
      errors.push(`${group.location}: fixed alternating correct-answer positions are prohibited`);
    }
    if (group.location.endsWith('.quiz') && positions.length >= 8 && positions.every(({ optionCount }) => optionCount === 4)) {
      const fourChoiceCounts = [0, 1, 2, 3].map((position) => counts.get(position) || 0);
      if (Math.max(...fourChoiceCounts) - Math.min(...fourChoiceCounts) > Math.max(2, Math.ceil(positions.length * 0.2))) {
        errors.push(`${group.location}: four-choice final-quiz positions are not reasonably balanced`);
      }
    }
  }
}

export function collectArchitectureV1PackageErrors(homework) {
  if (!isFuturePackage(homework)) return [];
  const errors = [];
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(homework.date) || Number.isNaN(Date.parse(`${homework.date}T12:00:00Z`))) {
    errors.push('future Architecture v1 package date must be a valid YYYY-MM-DD lesson date');
  }
  if (homework.policyVersion !== APPROVED_POLICY_VERSION) errors.push(`policyVersion must equal ${APPROVED_POLICY_VERSION}`);
  if (homework.templateContractVersion !== APPROVED_TEMPLATE_VERSION) errors.push(`templateContractVersion must equal ${APPROVED_TEMPLATE_VERSION}`);
  if (homework.assessmentPolicyVersion !== APPROVED_ASSESSMENT_POLICY_VERSION) {
    errors.push(`assessmentPolicyVersion must equal ${APPROVED_ASSESSMENT_POLICY_VERSION}`);
  }
  addFuturePrivateFieldErrors(homework, '$', errors);
  addEnglishOnlyErrors(homework, '$', '', errors);
  addAnswerDistributionErrors(homework, errors);
  return errors;
}

export function assertArchitectureV1Package(homework, source = 'HomeworkPackage') {
  const errors = collectArchitectureV1PackageErrors(homework);
  if (errors.length) throw new Error(`${source}: Architecture v1 package validation failed:\n- ${errors.join('\n- ')}`);
  return homework;
}
