import { readFile } from 'node:fs/promises';

const index = JSON.parse(await readFile('public/homeworks/index.json', 'utf8'));
if (index.length !== 5) throw Error(`Expected 5 preserved packages, found ${index.length}`);
if (index[0].id !== '2026-09-01-70e747daa869') throw Error('Newest package is not first');

const data = JSON.parse(await readFile(`public/homeworks/${index[0].id}/homework.json`, 'utf8'));
if (data.meetingKeyHash !== '70e747daa869c84c1d9508422b1709ab33c137d491e6c5e79e9b5b1ae4f05de3' || !data.teacherNote?.applied) throw Error('Identity or teacher note mismatch');
if (data.sourceLessons?.[0]?.meetingKeyHash !== '304f4b9683d8bf5a9d8da2087f26654c5ad97c0bda2850eb88e7efed5c188e72') throw Error('Previous lesson source is missing');
if ('meetingUuid' in data || data.sourceLessons.some(lesson => 'meetingUuid' in lesson)) throw Error('Raw meeting identifier must not be published');

for (const key of ['lessonNotes', 'grammar', 'flashcards', 'dailyUsage', 'dailyQuestions', 'practice', 'conversation', 'reading', 'listening', 'writing', 'quiz']) {
  if (!data[key] || (Array.isArray(data[key]) && !data[key].length)) throw Error(`Missing ${key} content`);
}
if (data.flashcards.length < 45) throw Error('Stative flashcard coverage is not broad enough');
if (new Set(data.flashcards.map(card => card.category)).size < 6) throw Error('Stative verb categories are incomplete');
if (data.dailyUsage.length < 8 || data.dailyQuestions.length !== 8) throw Error('Everyday state/action practice is incomplete');
if (data.practice.length !== 12 || data.conversation.length !== 5 || data.reading.questions.length !== 7 || data.listening.questions.length !== 5 || data.quiz.length !== 20) throw Error('Exercise counts do not match the lesson plan');
if (!data.listening.script || !data.writing.prompt || data.writing.checklist.length < 5) throw Error('Listening or writing task is incomplete');

const learnerMaterial = JSON.stringify({ lessonNotes: data.lessonNotes, grammar: data.grammar, remember: data.remember, watchOut: data.watchOut, flashcards: data.flashcards, dailyUsage: data.dailyUsage, dailyQuestions: data.dailyQuestions, practice: data.practice, conversation: data.conversation, reading: data.reading, listening: data.listening, writing: data.writing, quiz: data.quiz });
if (/\bEugenia\b/i.test(learnerMaterial)) throw Error('Student name appears inside learning material');
if (/[çğıöşüÇĞİÖŞÜ]|\b(Hatırla|Dikkat|Kural|Türkçe)\b/.test(learnerMaterial)) throw Error('Non-English instructional text detected in current lesson');
if (!learnerMaterial.includes('numismatics') || !learnerMaterial.includes('quite like') || !learnerMaterial.includes('spends time on')) throw Error('Previous lesson content was not incorporated');

const component = await readFile('src/Homework20260901.jsx', 'utf8');
const app = await readFile('src/App.jsx', 'utf8');
for (const tab of ['notes', 'grammar', 'flashcards', 'daily', 'practice', 'conversation', 'reading', 'listening', 'writing', 'quiz']) {
  if (!component.includes(`['${tab}',`)) throw Error(`${tab} tab is not wired`);
}
for (const key of ['PROGRESS_KEY', 'MISTAKE_KEY', 'WRITING_KEY']) {
  if (!component.includes(`localStorage.setItem(${key}`)) throw Error(`${key} persistence is missing`);
}
if (!component.includes('aria-pressed={isFlipped}') || !component.includes('speechSynthesis')) throw Error('Flashcard or listening interaction is missing');
if (!app.includes("useState('homework5')") || !app.includes('<Homework20260901')) throw Error('Latest lesson does not open by default');

console.log('Validated five preserved packages, exact meeting identities, original-design current lesson, ten working tabs, broad stative coverage, English-only content, local persistence and archive navigation.');
