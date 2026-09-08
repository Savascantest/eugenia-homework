import { readFile } from 'node:fs/promises';

const index = JSON.parse(await readFile('public/homeworks/index.json', 'utf8'));
if (index.length !== 6 || index[0].id !== '2026-09-07-d0db0400cfd') throw Error('Newest package or archive count is incorrect');
const data = JSON.parse(await readFile(`public/homeworks/${index[0].id}/homework.json`, 'utf8'));
if (data.meetingKeyHash !== 'd0db0400cfdec2b8a7c07779b913594a8ce8d0ee15a91f1a85329a31a69f9afa') throw Error('Meeting identity hash mismatch');
if ('meetingUuid' in data || JSON.stringify(data).includes('AE54725F-537F-462F-9E07-A38389B3B752')) throw Error('Private meeting ID leaked');
for (const key of ['lessonNotes','grammar','flashcards','dailyUsage','dailyQuestions','practice','conversation','quiz']) if (!data[key]?.length) throw Error(`Missing ${key}`);
if (!data.reading?.text || !data.reading?.questions?.length || !data.listening?.script || !data.listening?.questions?.length || !data.writing?.prompt) throw Error('Reading, listening or writing is missing');
for (const set of [data.dailyQuestions, data.practice, data.conversation, data.reading.questions, data.listening.questions, data.quiz]) if (set.some(q => q.opt.length < 3 || !q.a || !q.opt.includes(q.a))) throw Error('Question data is invalid');
const material = JSON.stringify(data);
if (/\\bEugenia\\b/i.test(material) || /[çğıöşüÇĞİÖŞÜ]/.test(material)) throw Error('Learner material violates privacy or language rules');
if (!/play|go|do/i.test(material) || !/cope with stress/i.test(material) || !/is being/i.test(material)) throw Error('Lesson commitments are missing');
const component = await readFile('src/Homework20260907.jsx', 'utf8');
const app = await readFile('src/App.jsx', 'utf8');
if (!component.includes('None of these answers.') || !component.includes('Math.random') || !component.includes('rounded-2xl rounded-bl-md')) throw Error('Four-option shuffle or message UI missing');
if (!app.includes("useState('homework6')") || !app.includes('<Homework20260907')) throw Error('Latest lesson is not default');
console.log('Validated six preserved packages, private-source protection, exact hashed identity, shuffled four-choice interaction, messaging-style conversation, and latest/archive wiring.');
