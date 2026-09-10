import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  PublicPackagePrivacyError,
  assertPublicHomeworkPackagePrivacy,
  collectPublicPackagePrivacyViolations,
} from '../scripts/lib/public-package-privacy.mjs';
import {
  assertModifiedPackagePrivacy,
  validateChangedPublicHomeworkPackages,
} from '../scripts/validate-public-package-privacy.mjs';

const validPackage = () => ({
  id: 'public-homework-2026-09-11-a1b2c3',
  packageId: 'package-7',
  lessonId: 'public-lesson-7',
  title: 'Future Plans',
  lessonNotes: ['Use will for quick decisions and offers.'],
  grammar: { explanation: 'Use going to for plans and evidence-based predictions.' },
  exercises: [{ prompt: 'Choose the correct future form.', options: ['will', 'going to'] }],
});

test('a learner-facing package with public IDs and semantic notes passes', () => {
  assert.equal(assertPublicHomeworkPackagePrivacy(validPackage()).packageId, 'package-7');
});

for (const [name, field, value] of [
  ['meeting UUID', 'meetingUuid', 'raw-uuid'],
  ['meeting UUID variant', 'meeting_uuid', 'raw-uuid'],
  ['raw meeting ID', 'rawMeetingId', '123456789'],
  ['raw meeting ID variant', 'zoom_meeting_id', '123456789'],
  ['compound meeting UUID variant', 'zoom_raw_meeting_uuid', 'raw-uuid'],
  ['transcript content', 'transcript', 'private lesson words'],
  ['transcript items', 'transcriptItems', [{ text: 'private item' }]],
  ['transcript path', 'exported_transcript_path', 'C:/private/lesson.txt'],
  ['transcript hash', 'transcriptHash', 'abc123'],
  ['compound transcript hash variant', 'source_transcript_sha_256', 'abc123'],
  ['teacher note', 'teacherNote', 'private teacher evidence'],
  ['private source evidence', 'privateSourceEvidence', { checked: true }],
  ['compound teacher evidence variant', 'private_teacher_source_evidence', { checked: true }],
]) {
  test(`${name} is rejected`, () => {
    assert.throws(
      () => assertPublicHomeworkPackagePrivacy({ ...validPackage(), [field]: value }),
      PublicPackagePrivacyError,
    );
  });
}

test('nested prohibited fields are rejected with their object path', () => {
  const homework = validPackage();
  homework.exercises[0].debug = { source: { transcript_path: 'C:/private/source.txt' } };
  const violations = collectPublicPackagePrivacyViolations(homework);
  assert.ok(violations.some((value) => value.includes('$.exercises[0].debug.source.transcript_path')));
});

test('normal lesson content, grammar notes, explanations, and archive IDs remain allowed', () => {
  const homework = { ...validPackage(), archiveId: 'archive-homework-7' };
  assert.deepEqual(collectPublicPackagePrivacyViolations(homework), []);
});

test('the public index builder does not republish raw meeting UUIDs', async () => {
  const source = await readFile(new URL('../scripts/build-homework-index.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /meetingUuid/);
});

const legacyRelative = '2026-09-07-d0db0400cfd/homework.json';
const legacyFile = fileURLToPath(new URL(`../public/homeworks/${legacyRelative}`, import.meta.url));
const newPackageFile = fileURLToPath(new URL('../public/homeworks/2026-09-09-d2100490efd/homework.json', import.meta.url));
const publishedBase = 'd2f79d1527f0046fa06aa6fc20d43fd31930c29b';
const acknowledgedTeacherNote = new Set([`${legacyRelative}\u0000$.teacherNote`]);

test('the changed-package gate accepts an unchanged acknowledged legacy teacher note', async () => {
  await assert.doesNotReject(validateChangedPublicHomeworkPackages({
    base: publishedBase,
    entries: [{ file: legacyFile, kind: 'modified' }],
  }));
});

test('the changed-package gate applies absolute validation to a new clean package', async () => {
  await assert.doesNotReject(validateChangedPublicHomeworkPackages({
    base: publishedBase,
    entries: [{ file: newPackageFile, kind: 'new' }],
  }));
});

test('the changed-package gate rejects a new package with a teacher note', async () => {
  await assert.rejects(validateChangedPublicHomeworkPackages({
    base: publishedBase,
    entries: [{ file: legacyFile, kind: 'new' }],
  }), PublicPackagePrivacyError);
});

test('removing an acknowledged legacy occurrence is allowed', () => {
  assert.doesNotThrow(() => assertModifiedPackagePrivacy({
    current: validPackage(),
    baseHomeworkPackage: { ...validPackage(), teacherNote: 'historical note' },
    relative: legacyRelative,
    allowedDebtPaths: acknowledgedTeacherNote,
    source: legacyRelative,
  }));
});

for (const [name, current] of [
  ['changing a legacy teacher note', { ...validPackage(), teacherNote: 'changed note' }],
  ['expanding a legacy teacher note', { ...validPackage(), teacherNote: 'historical note plus more' }],
  ['adding another prohibited field', { ...validPackage(), teacherNote: 'historical note', meetingUuid: 'new-id' }],
  ['adding another prohibited occurrence', {
    ...validPackage(),
    teacherNote: 'historical note',
    exercises: [{ prompt: 'Choose.', teacherNote: 'another note' }],
  }],
]) {
  test(`${name} fails the legacy baseline gate`, () => {
    assert.throws(() => assertModifiedPackagePrivacy({
      current,
      baseHomeworkPackage: { ...validPackage(), teacherNote: 'historical note' },
      relative: legacyRelative,
      allowedDebtPaths: acknowledgedTeacherNote,
      source: legacyRelative,
    }), /new, changed, or not explicitly acknowledged legacy debt/);
  });
}

test('an unacknowledged legacy occurrence fails the changed-package gate', () => {
  assert.throws(() => assertModifiedPackagePrivacy({
    current: { ...validPackage(), teacherNote: 'historical note' },
    baseHomeworkPackage: { ...validPackage(), teacherNote: 'historical note' },
    relative: legacyRelative,
    allowedDebtPaths: new Set(),
    source: legacyRelative,
  }), /not explicitly acknowledged legacy debt/);
});

test('a modified package with no base package fails closed', async () => {
  await assert.rejects(validateChangedPublicHomeworkPackages({
    base: publishedBase,
    entries: [{ file: newPackageFile, kind: 'modified' }],
  }), /Unable to read base package/);
});

test('a modified clean package with no readable base fails closed', async () => {
  await assert.rejects(validateChangedPublicHomeworkPackages({
    base: '',
    entries: [{ file: newPackageFile, kind: 'modified' }],
  }), /requires a readable base commit/);
});

test('missing legacy debt data fails closed when a modified package requires it', async () => {
  await assert.rejects(validateChangedPublicHomeworkPackages({
    base: publishedBase,
    entries: [{ file: legacyFile, kind: 'modified' }],
    loadDebtPaths: async () => { throw new Error('debt data unavailable'); },
  }), /debt data unavailable/);
});
