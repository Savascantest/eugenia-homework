import React from 'react';
import NovemberLessonHomework from './NovemberLessonHomework';

const mc = (id, q, a, opt) => ({ id, q, a, opt, type: 'mc' });

const data = {
  id: '20261113_connections_weak_ties_16',
  dateLabel: '13 November 2026',
  title: 'Connections, Review & Weak Ties',
  subtitle: 'Consolidate grammar and communication skills through relationships, reading and listening practice.',
  notes: [
    'Review modal verbs for advice and suggestions: can, should and could.',
    'Use at, on and in accurately with time expressions.',
    'Choose past simple or past continuous carefully with while and when.',
    'The optional writing challenge uses the idea of weak ties and small social connections.'
  ],
  grammar: [
    { title: 'Advice and suggestions', rule: 'Use should for advice, could for a possible idea, and can for ability or possibility.', example: 'You should join the walk. We could meet after work.' },
    { title: 'While and when', rule: 'Use while with an action in progress and when for a shorter event that happens during it.', example: 'While Marta was waiting, she recognised someone from class.' },
    { title: 'Past simple and past continuous', rule: 'Use past simple for completed events and was/were + verb-ing for an action in progress.', example: 'They started talking while they were waiting for coffee.' },
    { title: 'Time prepositions', rule: 'Use at for times, on for days and dates, and in for months, years and longer periods.', example: 'at 7 p.m.; on Monday; in November.' }
  ],
  vocabulary: [
    ['weak tie', 'a friendly but less close social connection', ['small connection', 'acquaintance'], 'A weak tie can introduce you to a new group.'],
    ['sociability', 'the ability or desire to enjoy being with people', ['friendliness', 'social confidence'], 'Her sociability made conversations easy.'],
    ['outsider', 'a person who feels outside a group', ['newcomer', 'person outside the group'], 'He felt like an outsider on his first day.'],
    ['get to know', 'to begin to know a person or place', ['become familiar with', 'learn about'], 'I want to get to know my new neighbours.'],
    ['make an effort', 'to try hard to do something', ['try hard', 'do your best'], 'She made an effort to remember names.'],
    ['reunite', 'to meet again after time apart', ['meet again', 'come together again'], 'The friends reunited after many years.'],
    ['belong', 'to feel accepted as part of a group', ['fit in', 'be accepted'], 'Small conversations can help people belong.'],
    ['keep in touch', 'to continue communicating with someone', ['stay connected', 'stay in contact'], 'They kept in touch after the course.']
  ],
  practice: [
    mc('p1', 'You ___ call a friend if you need advice.', 'should', ['should', 'should to', 'are should']),
    mc('p2', 'We ___ meet for coffee after work.', 'could', ['could to', 'could', 'are could']),
    mc('p3', 'I met Lina ___ a conference.', 'at', ['at', 'on', 'in']),
    mc('p4', 'They moved to this city ___ 2024.', 'in', ['at', 'on', 'in']),
    mc('p5', 'While I ___ for the bus, I saw an old colleague.', 'was waiting', ['waited', 'was waiting', 'wait']),
    mc('p6', 'When the meeting ended, we ___ home.', 'went', ['were going', 'go', 'went']),
    mc('p7', 'A weak tie can be:', 'a friendly connection', ['a close relative only', 'a friendly connection', 'a grammar mistake']),
    mc('p8', 'Someone who feels outside a group may feel like an:', 'outsider', ['outsider', 'organiser', 'expert']),
    mc('p9', 'We still ___ in touch after university.', 'keep', ['keep', 'kept', 'keeping']),
    mc('p10', 'Which sentence gives advice?', 'You should try a new class.', ['You should try a new class.', 'You should to try a new class.', 'You are should try a new class.'])
  ],
  reading: {
    title: 'Reading: A Familiar Face at the Café',
    text: 'Marta had recently moved to a new area and did not know many people. One Saturday, while she was waiting for coffee, she recognised a woman from her yoga class. They started talking about the class and discovered that they both enjoyed walking in the park. The woman suggested a group walk the following weekend.\n\nMarta did not expect to make a close friend immediately, but the conversation made the area feel friendlier. At the walk, she met several more people and learned their names. She realised that small connections can make it easier to belong in a new place. After the walk, she kept in touch with two people and made an effort to join another activity.',
    questions: [
      mc('r1', 'Where did Marta recognise the woman?', 'At a yoga class', ['At a yoga class', 'At work', 'On a train']),
      mc('r2', 'What were they doing when they started talking?', 'Waiting for coffee', ['Waiting for coffee', 'Walking in the park', 'Travelling home']),
      mc('r3', 'What did Marta learn from the experience?', 'Small connections can help people belong', ['Small connections can help people belong', 'She should move again', 'Yoga classes are difficult']),
      mc('r4', 'Keep in touch means:', 'continue communicating', ['stop talking', 'continue communicating', 'change jobs'])
    ]
  },
  listening: [
    mc('l1', 'On a first listen, focus on:', 'the main idea', ['the main idea', 'every individual word', 'only spelling']),
    mc('l2', 'On a second listen, look for:', 'key events and relationship words', ['only names', 'key events and relationship words', 'your own opinion'])
  ],
  writing: [
    'Optional writing challenge: write 100–120 words about a weak tie or small connection that helped someone feel welcome. Use at least two relationship words, one modal verb and one past continuous sentence.',
    'Write a short message inviting a classmate or colleague to an activity. Include one suggestion with could or should and one time expression.',
    'Describe a time when you met someone unexpectedly. Use while or when, past simple and past continuous.'
  ],
  quiz: [
    mc('q1', 'You ___ ask a colleague for help.', 'should', ['should', 'should to', 'are should', 'shoulding']),
    mc('q2', 'We ___ try a new club this week.', 'could', ['could to', 'could', 'are could', 'coulding']),
    mc('q3', 'I saw her ___ Monday evening.', 'on', ['at', 'in', 'on', 'for']),
    mc('q4', 'They met ___ 7 p.m.', 'at', ['in', 'on', 'for', 'at']),
    mc('q5', 'While he ___ home, he called his friend.', 'was walking', ['was walking', 'walked', 'walks', 'is walking']),
    mc('q6', 'When the class ended, we ___.', 'left', ['were leaving', 'left', 'leave', 'leaving']),
    mc('q7', 'A weak tie is usually:', 'a friendly connection', ['a close family member', 'a grammar rule', 'a friendly connection', 'a job title']),
    mc('q8', 'To keep in touch means to:', 'continue communicating', ['stop talking', 'change jobs', 'visit a museum', 'continue communicating']),
    mc('q9', 'Someone outside a group may feel like an:', 'outsider', ['outsider', 'organiser', 'expert', 'neighbourhood']),
    mc('q10', 'Which sentence is correct?', 'You could call her.', ['You could to call her.', 'You could call her.', 'You should calling her.', 'You are could call her.']),
    mc('q11', 'We started the course ___ September.', 'in', ['on', 'at', 'in', 'by']),
    mc('q12', 'She was reading ___ the phone rang.', 'when', ['while', 'because', 'although', 'when']),
    mc('q13', 'Which action was in progress?', 'They were talking.', ['They were talking.', 'They talked yesterday.', 'They will talk.', 'They talk every day.']),
    mc('q14', 'Make an effort means:', 'try hard', ['leave early', 'try hard', 'feel tired', 'avoid people']),
    mc('q15', 'Which is a suggestion?', 'We could meet after work.', ['You should to join.', 'Could you joining?', 'We could meet after work.', 'We are could meet.']),
    mc('q16', 'A person can belong to:', 'a group', ['a tense', 'a preposition', 'a question mark', 'a group']),
    mc('q17', 'Which question is about an action in progress?', 'What were you doing?', ['What were you doing?', 'What did you do?', 'What do you do?', 'What will you do?']),
    mc('q18', 'The best first-listening strategy is to find:', 'the main idea', ['all grammar mistakes', 'the main idea', 'every spelling word', 'one exact number']),
    mc('q19', 'Which sentence uses while correctly?', 'While I was cooking, she arrived.', ['While I arrived, she cooked.', 'While I was arriving, she cook.', 'While I was cooking, she arrived.', 'While I cook, she arrived.']),
    mc('q20', 'The optional writing challenge asks for:', 'a story about a weak tie or small connection', ['a job application', 'a list of irregular verbs', 'a travel timetable', 'a story about a weak tie or small connection'])
  ]
};

export default function Homework20261113(props) { return <NovemberLessonHomework {...props} data={data} />; }
