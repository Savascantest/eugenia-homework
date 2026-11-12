import React from 'react';
import NovemberLessonHomework from './NovemberLessonHomework';

const mc = (id, q, a, opt) => ({ id, q, a, opt, type: 'mc' });
const gap = (id, q, a) => ({ id, q, a, type: 'gap' });

const data = {
  id: '20261110_past_time_revision_15',
  dateLabel: '10 November 2026',
  title: 'Past Time, Stories & Revision',
  subtitle: 'Short revision for grammar, vocabulary, reading and listening before the progress test.',
  notes: [
    'This is a revision package for the upcoming progress test.',
    'Review past simple, past continuous, used to, time prepositions and question forms.',
    'Use irregular past forms accurately; regular past forms usually end in -ed.',
    'Do not start a new unit: use this package to consolidate what you already studied.'
  ],
  grammar: [
    { title: 'Past simple', rule: 'Use the past simple for completed past actions. Irregular verbs change form: catch → caught; bring → brought; keep → kept; think → thought. Cut, let and read are also irregular even when the spelling does not change.', example: 'I caught the train yesterday. We read the message last night.' },
    { title: 'Past continuous', rule: 'Use was/were + verb-ing for an action in progress at a past time. It often gives background to a past simple event.', example: 'I was travelling when I met a fellow traveller.' },
    { title: 'Used to', rule: 'Use used to + base verb for past habits or states that are no longer true.', example: 'I used to play music after school.' },
    { title: 'Time prepositions', rule: 'Use at for times and at night; on for days, dates and on Friday morning; in for months, years, seasons and parts of the day. Do not use a preposition after last, this, next or every.', example: 'at 6 p.m.; on Monday; in July; next summer.' },
    { title: 'Question forms', rule: 'In a subject question, the question word is the subject: Who called? In an object question, use do/did: Who did you call?', example: 'What happened? What did you do?' }
  ],
  vocabulary: [
    ['conference', 'a large formal meeting for people with the same interests or work', ['meeting', 'event'], 'The writers met at a conference.'],
    ['conversation', 'a talk between two or more people', ['chat', 'discussion'], 'We had a friendly conversation on the train.'],
    ['fellow traveller', 'a person who is travelling with you or at the same time', ['other passenger', 'traveller'], 'A fellow traveller helped me find my seat.'],
    ['by mistake', 'accidentally; not on purpose', ['accidentally', 'unintentionally'], 'I took the wrong bag by mistake.'],
    ['compartment', 'one separate area inside a train', ['section', 'carriage area'], 'Their compartment was quiet.'],
    ['behaviour', 'the way a person acts', ['conduct', 'actions'], 'Her behaviour was polite and calm.'],
    ['poor behaviour', 'unacceptable or rude actions', ['bad behaviour', 'rudeness'], 'Shouting in class is poor behaviour.'],
    ['chit-chat', 'friendly informal conversation about unimportant things', ['small talk', 'chat'], 'They made chit-chat before the meeting started.'],
    ['skip school', 'to miss school for a day without permission', ['miss school', 'stay away from school'], 'He never wanted to skip school.'],
    ['drop out of school', 'to leave school before finishing', ['leave school early', 'quit school'], 'She did not drop out of school; she completed her course.'],
    ['get together', 'to meet socially', ['meet up', 'spend time together'], 'The family gets together on holidays.'],
    ['relationship', 'the connection between people', ['connection', 'bond'], 'Trust is important in a relationship.']
  ],
  practice: [
    mc('p1', 'Yesterday I ___ the bus to town.', 'caught', ['catch', 'caught', 'was catching']),
    mc('p2', 'While I ___ to my friend, the phone rang.', 'was talking', ['talked', 'was talking', 'talk']),
    gap('p3', 'I used to ___ football after school.', 'play'),
    mc('p4', 'We met ___ Friday morning.', 'on', ['at', 'on', 'in']),
    mc('p5', 'My parents moved here ___ 2018.', 'in', ['at', 'on', 'in']),
    gap('p6', 'The train left ___ night.', 'at'),
    mc('p7', 'Who ___ you the message?', 'sent', ['did send', 'sent', 'sending']),
    mc('p8', 'Who did you ___ at the conference?', 'meet', ['met', 'meet', 'meeting']),
    mc('p9', 'I ___ my keys by mistake yesterday.', 'took', ['take', 'took', 'was taking']),
    gap('p10', 'We were sitting in the same train ___.', 'compartment'),
    mc('p11', 'Which sentence is about a past habit?', 'I used to read before bed.', ['I read now.', 'I used to read before bed.', 'I am reading now.']),
    mc('p12', 'Choose the correct form: She ___ dinner when I arrived.', 'was making', ['made', 'was making', 'makes']),
    gap('p13', 'He ___ his promise last week.', 'kept'),
    mc('p14', 'We do not use a preposition before:', 'next Monday', ['next Monday', 'Friday', 'July']),
    mc('p15', 'A fellow traveller is:', 'another passenger', ['a teacher', 'another passenger', 'a family member']),
    gap('p16', 'They were having a friendly ___.', 'conversation'),
    mc('p17', 'Which question is a subject question?', 'Who opened the door?', ['Who did open the door?', 'Who opened the door?', 'Who did you open the door?']),
    mc('p18', 'Which question is an object question?', 'Who did you invite?', ['Who invited you?', 'Who did you invite?', 'Who invite you?']),
    gap('p19', 'I ___ my old teacher at the station.', 'met'),
    mc('p20', 'Poor behaviour means:', 'unacceptable actions', ['excellent manners', 'unacceptable actions', 'a long journey']),
    mc('p21', 'They ___ during the film when the lights went out.', 'were talking', ['talked', 'were talking', 'talk']),
    gap('p22', 'We visited them ___ the summer.', 'in'),
    mc('p23', 'To skip school means to:', 'miss school without permission', ['finish school early', 'miss school without permission', 'study harder']),
    mc('p24', 'To drop out of school means to:', 'leave before finishing', ['leave before finishing', 'arrive late', 'change classrooms']),
    gap('p25', 'She ___ a new friend at the conference.', 'made'),
    mc('p26', 'Which is correct?', 'I brought my notebook.', ['I bringed my notebook.', 'I brought my notebook.', 'I was bring my notebook.']),
    mc('p27', 'We ___ get together every Sunday when we were children.', 'used to', ['use to', 'used to', 'were used']),
    gap('p28', 'There was some polite ___ before the meeting.', 'chit-chat'),
    mc('p29', 'The correct phrase is:', 'at 7 o’clock', ['in 7 o’clock', 'on 7 o’clock', 'at 7 o’clock']),
    mc('p30', 'Which sentence is correct?', 'I thought about the answer.', ['I thinked about the answer.', 'I thought about the answer.', 'I was thought about the answer.'])
  ],
  reading: {
    title: 'Reading: The Train to the Conference',
    text: 'Last spring, Elif travelled by train to a small conference in another city. She was feeling nervous because she had never travelled alone for work before. At the station, she checked her ticket twice and got on the train early. By mistake, she entered the wrong compartment. A fellow traveller looked at her ticket and kindly showed her the correct seat.\n\nDuring the journey, they started a conversation. The other traveller was also going to the conference. At first, they made small chit-chat about the weather and the train. Later, they talked about work, travel and learning languages. Elif noticed that he listened carefully and never interrupted. She thought his behaviour was very polite.\n\nWhen they arrived, Elif felt more confident. She did not know anyone at the conference, but she remembered the friendly conversation on the train. At lunch, she spoke to two new people and asked them questions about their work. At the end of the day, she sent a message to her fellow traveller: “Thank you for your help. You made my first work trip much easier.”',
    questions: [
      mc('r1', 'Why was Elif nervous?', 'She had not travelled alone for work before.', ['The train was late.', 'She had not travelled alone for work before.', 'She lost her ticket.']),
      mc('r2', 'What did Elif do by mistake?', 'She entered the wrong compartment.', ['She missed the train.', 'She entered the wrong compartment.', 'She called the conference.']),
      mc('r3', 'What did the travellers talk about later?', 'work, travel and learning languages', ['only the weather', 'work, travel and learning languages', 'a school test']),
      gap('r4', 'Write the word meaning “another passenger”: fellow ___.', 'traveller')
    ]
  },
  listening: [
    mc('l1', 'For a progress-test listening task, listen first for:', 'the main idea', ['every spelling detail', 'the main idea', 'one new grammar rule']),
    mc('l2', 'When a speaker tells a story, listen for:', 'time words and key events', ['only long words', 'time words and key events', 'your own opinion'])
  ],
  writing: [
    'Write 90–110 words about a memorable journey or meeting. Use past simple and past continuous, and include at least four words from this package.',
    'Write about a past habit that has changed. Use used to at least three times and add correct time expressions with at, on or in.',
    'Make a short progress-test revision plan. Include grammar, vocabulary, listening and reading, with one specific action for each area.'
  ],
  quiz: [
    mc('q1', 'Yesterday we ___ a new neighbour.', 'met', ['meet', 'met', 'were meeting', 'meets']),
    mc('q2', 'I ___ dinner when my friend called.', 'was making', ['made', 'was making', 'make', 'am making']),
    mc('q3', 'She used to ___ near the sea.', 'live', ['lived', 'live', 'living', 'lives']),
    mc('q4', 'The lesson starts ___ 6 p.m.', 'at', ['in', 'on', 'at', 'by']),
    mc('q5', 'We have English ___ Tuesday.', 'on', ['at', 'on', 'in', 'to']),
    mc('q6', 'They moved here ___ 2020.', 'in', ['at', 'on', 'in', 'for']),
    mc('q7', 'Who ___ the window?', 'opened', ['did open', 'opened', 'opening', 'open']),
    mc('q8', 'Who did you ___ yesterday?', 'call', ['called', 'calling', 'calls', 'call']),
    mc('q9', 'I ___ my phone by mistake.', 'took', ['took', 'take', 'was taking', 'takes']),
    mc('q10', 'A fellow traveller is:', 'another passenger', ['a teacher', 'another passenger', 'a relative', 'a neighbour']),
    mc('q11', 'They ___ when the lights went out.', 'were talking', ['talked', 'talk', 'were talking', 'talks']),
    mc('q12', 'We do not use a preposition before:', 'next week', ['at night', 'on Friday', 'in July', 'next week']),
    mc('q13', 'To skip school means to:', 'miss school without permission', ['miss school without permission', 'finish a course', 'study abroad', 'teach a class']),
    mc('q14', 'Good behaviour means:', 'polite actions', ['a train journey', 'polite actions', 'a school subject', 'a problem']),
    mc('q15', 'The past of bring is:', 'brought', ['bringed', 'brought', 'brang', 'bringing']),
    mc('q16', 'The past of think is:', 'thought', ['thinked', 'thought', 'thinks', 'thinking']),
    mc('q17', 'We ___ get together after school when we were young.', 'used to', ['use to', 'used to', 'were use', 'are used']),
    mc('q18', 'Chit-chat is:', 'informal small talk', ['a serious exam', 'a long journey', 'informal small talk', 'poor behaviour']),
    mc('q19', 'Which sentence is correct?', 'I kept the ticket.', ['I keeped the ticket.', 'I kept the ticket.', 'I was kept the ticket.', 'I keeping the ticket.']),
    mc('q20', 'Progress-test preparation should include:', 'grammar, vocabulary, listening and reading', ['only a final score', 'only grammar', 'only vocabulary', 'grammar, vocabulary, listening and reading'])
  ]
};

export default function Homework20261110(props) { return <NovemberLessonHomework {...props} data={data} />; }
