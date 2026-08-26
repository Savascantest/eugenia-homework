import { readFile } from 'node:fs/promises';

const index = JSON.parse(await readFile('public/homeworks/index.json', 'utf8'));
if (index.length !== 3) throw new Error(`Expected 3 preserved homework packages, found ${index.length}`);
if (index[0].id !== '2026-08-25-32EDDB85') throw new Error('The newest homework is not first in the generated index');

const data = JSON.parse(await readFile('public/homeworks/2026-08-25-32EDDB85/homework.json', 'utf8'));
if (data.meetingUuid !== '32EDDB85-E24C-4AE3-8EB5-DFFDCC709F35') throw new Error('Meeting UUID mismatch');
if (!data.teacherNote?.detected || !data.teacherNote?.applied) throw new Error('Teacher-only end note was not recorded as applied');
if (data.wordOrder.length < 10) throw new Error('Word-order practice is too short');
if (data.conversation.length !== 5) throw new Error('Situational conversation must contain five exchanges');
if (data.reading.questions.length < 7) throw new Error('Reading section is incomplete');
if (data.listening.questions.length < 6 || !data.listening.url.startsWith('https://learnenglish.britishcouncil.org/')) throw new Error('Listening section is incomplete or uses an unexpected source');
if (data.quiz.length !== 20) throw new Error('Final quiz must contain 20 questions');
if (!data.writing?.prompt || !data.writing?.checklist?.length) throw new Error('Writing task is incomplete');

const currentComponent = await readFile('src/Homework20260825.jsx', 'utf8');
const app = await readFile('src/App.jsx', 'utf8');
const previousComponent = await readFile('src/LatestHomework.jsx', 'utf8');
for (const tab of ['notes', 'grammar', 'vocabulary', 'practice', 'conversation', 'reading', 'listening', 'writing', 'quiz']) {
  if (!currentComponent.includes(`['${tab}',`)) throw new Error(`The ${tab} tab is not wired into the current homework`);
}
for (const key of ['PROGRESS_KEY', 'MISTAKE_KEY', 'WRITING_KEY']) {
  if (!currentComponent.includes(`localStorage.setItem(${key}`)) throw new Error(`${key} is not persisted`);
}
if (!app.includes("useState('homework3')") || !app.includes("setHomeworkVersion('homework2')") || !app.includes("setHomeworkVersion('previous')")) {
  throw new Error('The three-homework switcher is incomplete');
}
if (!previousComponent.includes('onOpenLatest')) throw new Error('Homework 2 cannot return to the current homework');
console.log('Validated 3 packages, newest-first index, 9 wired tabs, local persistence, archive navigation, and teacher-note requirements.');
