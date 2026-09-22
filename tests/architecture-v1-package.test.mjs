import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  APPROVED_ARCHITECTURE_V1_CONTRACT,
  APPROVED_ASSESSMENT_POLICY_VERSION,
  APPROVED_POLICY_VERSION,
  APPROVED_TEMPLATE_VERSION,
  ARCHITECTURE_V1_EFFECTIVE_DATE,
  assertArchitectureV1Package,
  collectArchitectureV1PackageErrors,
} from '../scripts/lib/architecture-v1-package.mjs';

function balancedQuiz() {
  return Array.from({ length: 20 }, (_, index) => {
    const opt = ['choice A', 'choice B', 'choice C', 'choice D'];
    return { q: `Question ${index + 1}`, opt, a: opt[index % 4] };
  });
}

function futurePackage(overrides = {}) {
  return {
    id: '2026-09-15-eugenia-future',
    date: '2026-09-15',
    dateLabel: '15 September 2026',
    title: 'Future Lesson Practice',
    lessonNotes: ['Use the grammar point from today’s lesson in natural sentences.'],
    grammar: [{ title: 'Future forms', rule: 'Use the form that matches the meaning.' }],
    practice: [{ q: 'Choose the most natural answer.', opt: ['A', 'B', 'C'], a: 'B' }],
    quiz: balancedQuiz(),
    policyVersion: APPROVED_POLICY_VERSION,
    templateContractVersion: APPROVED_TEMPLATE_VERSION,
    assessmentPolicyVersion: APPROVED_ASSESSMENT_POLICY_VERSION,
    ...overrides,
  };
}

test('approved Eugenia Architecture v1 public contract loads', () => {
  assert.deepEqual(APPROVED_ARCHITECTURE_V1_CONTRACT, {
    policyVersion: 'eugenia-lesson-based@1',
    templateContractVersion: 'eugenia-interactive-hybrid@1',
    assessmentPolicyVersion: 'eugenia-section-and-final-checks@1',
    effectiveDate: '2026-09-14',
    learnerFacingLanguage: 'ENGLISH_ONLY',
    cadence: 'LESSON_BASED',
    finalQuiz: { questionCount: 20, learnerFacingTarget: '16/20', nonGating: true },
  });
});

test('effective date is 2026-09-14', () => {
  assert.equal(ARCHITECTURE_V1_EFFECTIVE_DATE, '2026-09-14');
});

for (const [name, patch, message] of [
  ['policyVersion', { policyVersion: undefined }, /policyVersion must equal eugenia-lesson-based@1/],
  ['templateContractVersion', { templateContractVersion: undefined }, /templateContractVersion must equal eugenia-interactive-hybrid@1/],
  ['assessmentPolicyVersion', { assessmentPolicyVersion: undefined }, /assessmentPolicyVersion must equal eugenia-section-and-final-checks@1/],
  ['unknown policy ID', { policyVersion: 'other-policy@1' }, /policyVersion must equal eugenia-lesson-based@1/],
  ['Sümeyye policy ID', {
    policyVersion: 'sumeyye-weekend-monday@1',
    templateContractVersion: 'sumeyye-six-tab-interactive@1',
    assessmentPolicyVersion: 'sumeyye-section-and-final-checks@1',
  }, /policyVersion must equal eugenia-lesson-based@1/],
]) {
  test(`future package requires approved ${name}`, () => {
    assert.throws(() => assertArchitectureV1Package(futurePackage(patch)), message);
  });
}

test('historical package remains valid without Architecture v1 metadata', () => {
  const historical = futurePackage({ date: '2026-09-13', policyVersion: undefined, templateContractVersion: undefined, assessmentPolicyVersion: undefined });
  assert.deepEqual(collectArchitectureV1PackageErrors(historical), []);
});

test('lesson-based future Tuesday package is accepted without a Monday rule', () => {
  assert.doesNotThrow(() => assertArchitectureV1Package(futurePackage({ date: '2026-09-15' })));
});

test('English-only learner-facing fixture passes', () => {
  assert.doesNotThrow(() => assertArchitectureV1Package(futurePackage()));
});

test('Turkish learner-facing fixture fails the implemented safeguard', () => {
  assert.throws(
    () => assertArchitectureV1Package(futurePackage({ lessonNotes: ['Bu bir Türkçe açıklamadır.'] })),
    /learner-facing text appears to contain Turkish/,
  );
});

test('a pathological all-first-answer quiz fails', () => {
  const quiz = balancedQuiz().map((question) => ({ ...question, a: question.opt[0] }));
  assert.throws(() => assertArchitectureV1Package(futurePackage({ quiz })), /every correct answer is option 0/);
});

test('a nearly single-position assessment fails', () => {
  const quiz = balancedQuiz().map((question, index) => ({ ...question, a: question.opt[index < 17 ? 0 : index - 16] }));
  assert.throws(() => assertArchitectureV1Package(futurePackage({ quiz })), /one correct-answer position dominates/);
});

test('a fixed alternating answer-position sequence fails', () => {
  const quiz = balancedQuiz().map((question, index) => ({ ...question, a: question.opt[index % 2] }));
  assert.throws(() => assertArchitectureV1Package(futurePackage({ quiz })), /fixed alternating correct-answer positions/);
});

test('a reasonably mixed four-choice final quiz passes', () => {
  assert.doesNotThrow(() => assertArchitectureV1Package(futurePackage({ quiz: balancedQuiz() })));
});

test('the final-quiz target remains 16/20 and non-gating', () => {
  assert.deepEqual(APPROVED_ARCHITECTURE_V1_CONTRACT.finalQuiz, { questionCount: 20, learnerFacingTarget: '16/20', nonGating: true });
});

test('future public packages reject private LessonRecord and source fields', () => {
  assert.throws(
    () => assertArchitectureV1Package(futurePackage({ lessonRecordPath: 'private/lesson-record.json', sourceHash: 'abc123' })),
    /private LessonRecord path/,
  );
});

test('historical privacy debt remains explicit and unchanged', async () => {
  const debt = JSON.parse(await readFile(new URL('../scripts/fixtures/legacy-public-package-privacy-debt.json', import.meta.url), 'utf8'));
  assert.equal(debt.studentKey, 'eugenia');
  assert.deepEqual(debt.violations.map(({ file }) => file), [
    '2026-08-25-32EDDB85/homework.json',
    '2026-08-29-A303F12D/homework.json',
    '2026-09-01-70e747daa869/homework.json',
    '2026-09-07-d0db0400cfd/homework.json',
  ]);
});

test('existing archive and hybrid BrowserProgress implementation remain present', async () => {
  const [index, app, component] = await Promise.all([
    readFile(new URL('../public/homeworks/index.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/Homework20260920.jsx', import.meta.url), 'utf8'),
  ]);
  assert.equal(JSON.parse(index).length, 8);
  assert.match(app, /eugenia_homework_v1_progress/);
  assert.match(component, /eugenia_homework_\$\{PACKAGE_ID\}_progress/);
});
