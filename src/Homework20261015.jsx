import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, PenTool, Headphones, Star, Eye, EyeOff, ExternalLink } from 'lucide-react';

const KEY = 'eugenia_homework_20261015_stories_state';
const mc = (id, q, a, opt) => ({ id, q, a, opt, type: 'mc' });
const fill = (id, q, a) => ({ id, q, a, type: 'fill' });
const open = (id, q) => ({ id, q, type: 'open' });
const tf = (id, q, a) => mc(id, q, a, a === 'True' ? ['True', 'False'] : ['False', 'True']);

const grammar = [
  {
    title: '1. Past Simple: finished actions',
    rule: 'Use the Past Simple for an action that started and finished in the past. Regular verbs usually end in -ed; irregular verbs have a special second form.',
    examples: ['We visited the museum yesterday.', 'He bought a new bag last week.', 'She replied to the message.'],
    questions: [
      mc('g1', 'Yesterday, Leo ___ his old friend at the station.', 'met', ['meets', 'met', 'was meeting']),
      mc('g2', 'Choose the correct Past Simple sentence.', 'They discovered a quiet cafe.', ['They discover a quiet cafe.', 'They discovered a quiet cafe.', 'They were discover a quiet cafe.']),
      fill('g3', 'Last night, I ___ (watch) a strange film.', 'watched'),
      mc('g4', 'Which is the Past Simple form of leave?', 'left', ['leaved', 'left', 'was leaving']),
      mc('g5', 'A few weeks ago, we ___ an incredible exhibition.', 'saw', ['see', 'saw', 'were seeing'])
    ]
  },
  {
    title: '2. Past Simple negatives and questions',
    rule: 'Use did not + base verb for negatives. Use Did + subject + base verb for questions. After did or did not, never use the Past Simple form of the main verb.',
    examples: ['I did not understand the question.', 'Did you enjoy the conversation?', 'Where did they go after school?'],
    questions: [
      mc('g6', 'Choose the correct negative sentence.', 'She did not call her sister.', ['She did not called her sister.', 'She did not call her sister.', 'She not called her sister.']),
      mc('g7', '___ you run into your teacher yesterday?', 'Did', ['Do', 'Did', 'Were']),
      fill('g8', 'They did not ___ (stay) for the whole film.', 'stay'),
      mc('g9', 'Choose the correct question.', 'What did he discover?', ['What he did discover?', 'What did he discovered?', 'What did he discover?']),
      mc('g10', 'Did the class enjoy the story?', 'Yes, they did.', ['Yes, they enjoyed.', 'Yes, they did.', 'Yes, they were.'])
    ]
  },
  {
    title: '3. Past Continuous and an interruption',
    rule: 'Use was or were + verb-ing for an action in progress at a particular time in the past. Use the Past Simple for a shorter completed action that interrupted it.',
    examples: ['I was reading when the phone rang.', 'While they were travelling, they discovered a small town.', 'What were you doing at eight?'],
    questions: [
      mc('g11', 'At 8 p.m., I ___ dinner with my family.', 'was having', ['had', 'was having', 'were having']),
      mc('g12', 'While we ___ for the bus, it started to rain.', 'were waiting', ['waited', 'were waiting', 'was waiting']),
      fill('g13', 'She ___ (sleep) when the alarm rang.', 'was sleeping'),
      mc('g14', 'Choose the best sentence.', 'They were talking when the train arrived.', ['They talked when the train was arriving.', 'They were talking when the train arrived.', 'They were talk when the train arrived.']),
      mc('g15', 'What ___ you doing when I called?', 'were', ['did', 'were', 'was'])
    ]
  },
  {
    title: '4. Prepositions of time: in, on and at',
    rule: 'Use in for months, years, seasons and longer periods; on for days and dates; at for exact times and some fixed expressions.',
    examples: ['in October / in 2024 / in the morning', 'on Friday / on 12 May', 'at 7:30 / at night'],
    questions: [
      mc('g16', 'The class starts ___ 10:00.', 'at', ['in', 'on', 'at']),
      mc('g17', 'We travelled to Prague ___ July.', 'in', ['in', 'on', 'at']),
      fill('g18', 'Her birthday is ___ Monday.', 'on'),
      mc('g19', 'I usually study ___ the evening.', 'in', ['in', 'on', 'at']),
      mc('g20', 'They met ___ 3 March.', 'on', ['in', 'on', 'at'])
    ]
  },
  {
    title: '5. Used to: past habits and states',
    rule: 'Use used to + base verb for a past habit or state that is no longer true. In negatives and questions use did not use to or Did ... use to?',
    examples: ['I used to skip school sometimes.', 'She did not use to like public speaking.', 'Did you use to live near here?'],
    questions: [
      mc('g21', 'I ___ shy, but now I enjoy meeting people.', 'used to be', ['use to be', 'used to be', 'was use to be']),
      mc('g22', 'Choose the correct negative sentence.', 'He did not use to drink coffee.', ['He did not used to drink coffee.', 'He did not use to drink coffee.', 'He not used to drink coffee.']),
      fill('g23', 'Did you use to ___ (play) an instrument?', 'play'),
      mc('g24', 'Which sentence describes a past habit that changed?', 'We used to walk to high school.', ['We are used to walk to high school.', 'We used to walk to high school.', 'We use walking to high school.']),
      mc('g25', '___ she use to be overactive as a child?', 'Did', ['Does', 'Did', 'Was'])
    ]
  }
];

const vocabulary = [
  ['magic', 'a special and wonderful quality, or something that seems impossible'],
  ['experience', 'something that happens to you, or knowledge gained from doing something'],
  ['incredible', 'extremely good, surprising or difficult to believe'],
  ['ugly', 'unpleasant to look at'],
  ['strange', 'unusual or unexpected'],
  ['enormous', 'extremely large'],
  ['discover', 'to find something for the first time'],
  ['identical', 'exactly the same'],
  ['twin', 'one of two children born at the same time to the same mother'],
  ['run into', 'to meet someone by chance'],
  ['instead of', 'in place of something or someone'],
  ['confused', 'unable to understand something clearly'],
  ['wounded', 'injured, especially in an accident or fight'],
  ['afterwards', 'after an event or time'],
  ['eventually', 'in the end, after some time'],
  ['first', 'before all others in order'],
  ['second', 'next after first'],
  ['next', 'after that'],
  ['finally', 'at the end of a sequence'],
  ['then', 'after that; at that time'],
  ['while', 'during the time that something else happens'],
  ['a few weeks later', 'some weeks after the earlier event'],
  ['gifted', 'having a natural ability'],
  ['organised', 'able to plan and arrange things well'],
  ['dramatic', 'exciting, surprising or full of strong feeling'],
  ['hardworking', 'putting a lot of effort into work'],
  ['overactive', 'too active, energetic or busy'],
  ['goofy', 'silly in a funny, friendly way'],
  ['sociable', 'enjoying the company of other people'],
  ['skip school', 'to stay away from school without permission'],
  ['high school', 'a school for older children and teenagers'],
  ['reunion', 'a meeting of people who have not seen each other for a long time'],
  ['conversation', 'an informal talk between people'],
  ['drop out of school', 'to leave school before completing a course'],
  ['class reunion', 'a meeting of former classmates']
];

const vocabExercises = [
  fill('v1', 'The mountain was so ___ that it disappeared into the clouds.', 'enormous'),
  fill('v2', 'I ___ my old neighbour at the market by chance.', 'ran into'),
  fill('v3', 'The two sisters wore ___ dresses.', 'identical'),
  fill('v4', 'We were ___ because the map had no street names.', 'confused'),
  fill('v5', 'He is very ___: he always makes a clear plan.', 'organised'),
  fill('v6', 'The actor gave an ___ performance; everyone loved it.', 'incredible'),
  fill('v7', 'They had a long ___ about their school memories.', 'conversation'),
  fill('v8', 'She is ___ and enjoys meeting new people.', 'sociable'),
  fill('v9', '___, we found the correct platform and caught the train.', 'eventually'),
  fill('v10', 'A ___ brings former classmates together after many years.', 'reunion'),
  mc('v11', 'Which word means to find something for the first time?', 'discover', ['discover', 'repeat', 'confuse']),
  mc('v12', 'A friendly person who is silly in a funny way is ...', 'goofy', ['wounded', 'goofy', 'identical']),
  mc('v13', 'Choose the best word: ___ taking a taxi, we walked.', 'Instead of', ['Eventually', 'Instead of', 'While']),
  mc('v14', 'What does a few weeks later mean?', 'some weeks after the earlier event', ['at the same time', 'some weeks after the earlier event', 'every week']),
  mc('v15', 'Which word means extremely large?', 'enormous', ['strange', 'enormous', 'ugly']),
  mc('v16', 'A person with a natural talent for music may be ...', 'gifted', ['confused', 'gifted', 'wounded']),
  mc('v17', 'What does drop out of school mean?', 'leave school before finishing a course', ['start high school', 'leave school before finishing a course', 'visit a school']),
  mc('v18', 'The plot was dramatic means it was ...', 'exciting and full of strong feeling', ['very organised', 'exciting and full of strong feeling', 'exactly the same']),
  mc('v19', 'Which word describes someone who works with a lot of effort?', 'hardworking', ['overactive', 'hardworking', 'ugly']),
  mc('v20', 'A class reunion is ...', 'a meeting of former classmates', ['a new school lesson', 'a meeting of former classmates', 'an exam result']),
  open('v21', 'Write one sentence using magic or magical.'),
  open('v22', 'Write one sentence using while to connect two past actions.'),
  open('v23', 'Write one sentence using instead of.'),
  open('v24', 'Describe a strange or incredible experience in one sentence.'),
  open('v25', 'Write a sentence about someone who used to be overactive or goofy.'),
  open('v26', 'Write one sentence using afterwards or finally.'),
  open('v27', 'Write a respectful sentence using wounded.'),
  open('v28', 'Write one sentence about high school or a school reunion.'),
  open('v29', 'Write one sentence using run into in the Past Simple.'),
  open('v30', 'Write one sentence about a gifted, hardworking or sociable person.')
];

const practice = [
  mc('p1', 'Last weekend, my friends ___ to a new art gallery.', 'went', ['go', 'went', 'were going']),
  mc('p2', 'Where ___ you yesterday afternoon?', 'were', ['did', 'were', 'was']),
  fill('p3', 'I did not ___ (understand) the joke at first.', 'understand'),
  mc('p4', 'While Amir ___ home, he saw an enormous dog.', 'was walking', ['walked', 'was walking', 'were walking']),
  mc('p5', 'The message arrived ___ 6:15.', 'at', ['in', 'on', 'at']),
  mc('p6', 'My grandmother ___ tell us stories before bed.', 'used to', ['use to', 'used to', 'was use to']),
  mc('p7', 'Choose the correct question.', 'Did they visit the museum?', ['Did they visited the museum?', 'Did they visit the museum?', 'Were they visit the museum?']),
  fill('p8', 'We ___ (wait) for the train when it stopped raining.', 'were waiting'),
  mc('p9', 'The twins looked the same because they were ...', 'identical', ['wounded', 'identical', 'confused']),
  mc('p10', 'I ran into my teacher ___ the way home.', 'on', ['in', 'on', 'at']),
  mc('p11', 'He did not use to ___ coffee.', 'drink', ['drank', 'drink', 'drinking']),
  mc('p12', '___ did you meet at the class reunion?', 'Who', ['What', 'Who', 'Where']),
  fill('p13', 'The students ___ (not / skip) school yesterday.', 'did not skip'),
  mc('p14', 'First we bought tickets; ___, we found our seats.', 'then', ['instead of', 'then', 'while']),
  mc('p15', 'She ___ a photo while we were having lunch.', 'took', ['was taking', 'took', 'takes']),
  mc('p16', 'Choose the correct sentence.', 'I was reading when the lights went out.', ['I read when the lights were going out.', 'I was reading when the lights went out.', 'I was read when the lights went out.']),
  fill('p17', 'The reunion is ___ Saturday, 21 November.', 'on'),
  mc('p18', 'Which person is most likely to make a detailed plan?', 'an organised person', ['a confused person', 'an organised person', 'a wounded person']),
  mc('p19', 'Did you use to live here?', 'No, I did not.', ['No, I did not.', 'No, I did not live.', 'No, I was not.']),
  mc('p20', 'The boy was ___, so the nurse cleaned his arm.', 'wounded', ['gifted', 'wounded', 'goofy']),
  fill('p21', 'What ___ you doing when the door opened?', 'were'),
  mc('p22', 'We first spoke ___ the morning and met again at night.', 'in', ['in', 'on', 'at']),
  mc('p23', 'A good synonym for very surprising is ...', 'incredible', ['ugly', 'incredible', 'ordinary']),
  mc('p24', 'They did not ___ the address, so they asked for help.', 'know', ['knew', 'know', 'knowing']),
  fill('p25', 'A few weeks later, she ___ (discover) the answer.', 'discovered'),
  mc('p26', 'While the adults were talking, the children ___ outside.', 'were playing', ['played', 'were playing', 'was playing']),
  mc('p27', 'Which is a past state that changed?', 'I used to be very shy.', ['I use to be very shy.', 'I used to be very shy.', 'I am used to be very shy.']),
  mc('p28', 'The story had a ___ ending, with lots of surprises.', 'dramatic', ['sociable', 'dramatic', 'identical']),
  fill('p29', 'She did not use to ___ (like) crowded places.', 'like'),
  mc('p30', 'We met ___ Friday evening.', 'on', ['in', 'on', 'at']),
  mc('p31', 'Choose the correct answer: Why did he leave?', 'Because he felt tired.', ['Because he feels tired.', 'Because he felt tired.', 'Because he was feel tired.']),
  mc('p32', 'Instead of the bus, we walked means ...', 'we walked, not took the bus', ['we walked, not took the bus', 'we walked after the bus', 'we waited for the bus']),
  fill('p33', 'At nine o clock last night, they ___ (have) a conversation.', 'were having'),
  mc('p34', 'Afterwards, we ___ home and made tea.', 'went', ['go', 'went', 'were go']),
  mc('p35', 'She is a ___ student who puts a lot of effort into every task.', 'hardworking', ['strange', 'hardworking', 'wounded']),
  mc('p36', 'Did your father use to ___ school by bike?', 'go to', ['went to', 'go to', 'going to']),
  fill('p37', 'The concert began ___ 8 p.m.', 'at'),
  mc('p38', 'The teacher was speaking ___ the students were taking notes.', 'while', ['then', 'while', 'eventually']),
  mc('p39', 'Which sentence is correct?', 'We were travelling when we ran into an old friend.', ['We travelled when we were running into an old friend.', 'We were travelling when we ran into an old friend.', 'We were travel when we ran into an old friend.']),
  mc('p40', 'A person who likes being with other people is ...', 'sociable', ['sociable', 'confused', 'ugly'])
];

const readings = [
  {
    title: 'The Photograph in the Compartment',
    text: 'Last autumn, Nora was travelling by train to visit her aunt. She found a quiet compartment and was looking out of the window when an older woman sat opposite her. The woman had an enormous blue bag and a small, old-fashioned camera. At first, Nora felt slightly confused because the woman kept smiling at the camera but did not take any photographs.\n\nAfter a few minutes, the woman opened her bag and showed Nora a black-and-white photograph. It showed two identical girls standing outside a high school. "They were my twin sister and me," she explained. "We used to wear the same clothes, although we had very different personalities." While the woman was telling the story, the train suddenly stopped between two stations. Everyone in the compartment became quiet.\n\nThen the woman laughed and said that the delay was a little bit of magic: it gave her time to finish the story. She and her sister had planned to meet at a class reunion, but her sister was ill and could not come. Instead of throwing the photograph away, she carried it with her for years. Eventually, Nora’s station arrived. Before leaving, Nora thanked the woman for the incredible conversation and promised to call her own twin cousins more often.',
    questions: [
      mc('r1a', 'Why did Nora first feel confused?', 'The woman smiled at the camera but did not take photos.', ['The train was moving too fast.', 'The woman smiled at the camera but did not take photos.', 'The woman lost her bag.']),
      mc('r1b', 'What happened while the woman was telling her story?', 'The train stopped between stations.', ['Nora called her aunt.', 'The train stopped between stations.', 'The woman took a new photograph.']),
      tf('r1c', 'The photograph showed the woman and her twin sister.', 'True'),
      tf('r1d', 'The woman threw the photograph away after the reunion.', 'False'),
      open('r1e', 'Why did the woman describe the delay as a little bit of magic?')
    ]
  },
  {
    title: 'An Unexpected Reunion',
    text: 'When Daniel was at high school, he was quiet and not very sociable. He used to spend most breaks in the library because he enjoyed drawing maps and reading adventure stories. His best friend, Karim, was different: he was overactive, goofy and always ready to start a conversation. Although the boys had different habits, they worked well together and often helped each other with difficult homework.\n\nTen years later, Daniel received an invitation to a class reunion. He did not want to go at first. He was worried that nobody would remember him, and he did not know what to say. However, his sister encouraged him to try. On the evening of the reunion, Daniel was walking towards the restaurant when he ran into Karim outside. Karim was still funny, but he had become a hardworking designer who organised community projects.\n\nInside, the former classmates shared stories about their experiences. One student had discovered a talent for cooking; another had travelled around the world. Daniel showed everyone a map he had made for a local walking group, and people were impressed. Afterwards, he realised that he had changed too: he was no longer the quiet boy who avoided conversation. He was still thoughtful, but now he felt comfortable meeting new people.',
    questions: [
      mc('r2a', 'What did Daniel use to do during many school breaks?', 'Spend time in the library.', ['Play football outside.', 'Spend time in the library.', 'Organise events.']),
      mc('r2b', 'What was Karim doing when Daniel saw him again?', 'He was waiting outside the restaurant.', ['He was waiting outside the restaurant.', 'He was travelling abroad.', 'He was drawing a map.']),
      tf('r2c', 'Daniel and Karim had exactly the same personalities at school.', 'False'),
      tf('r2d', 'Daniel felt more comfortable meeting people by the end.', 'True'),
      open('r2e', 'How had Daniel changed since high school?')
    ]
  }
];

const listening = [
  {
    title: 'A voicemail message',
    focus: 'Listen for a past event, an exact time and a reason.',
    url: 'https://learnenglish.britishcouncil.org/free-resources/listening/a1/voicemail-message?page=2',
    questions: [
      mc('l1a', 'Before listening, which detail should you listen for especially carefully?', 'times and dates', ['only new vocabulary', 'times and dates', 'the speaker’s clothes']),
      mc('l1b', 'What is a helpful first-listen goal?', 'understand the main reason for the message', ['write every word', 'understand the main reason for the message', 'translate before listening']),
      tf('l1c', 'Listening once for the main idea and again for details is a useful strategy.', 'True'),
      tf('l1d', 'You should stop as soon as you do not understand one word.', 'False'),
      open('l1e', 'Write one past-time phrase or useful sentence you noticed in the listening.')
    ]
  },
  {
    title: 'A morning briefing',
    focus: 'Listen for a sequence of events and the difference between plans and completed actions.',
    url: 'https://learnenglish.britishcouncil.org/free-resources/listening/a2/morning-briefing?page=0',
    questions: [
      mc('l2a', 'Which connector can help you follow the order of events?', 'then', ['instead of', 'then', 'identical']),
      mc('l2b', 'If you miss a detail, what should you do?', 'listen again and focus on the key question', ['guess without listening', 'listen again and focus on the key question', 'stop the task']),
      tf('l2c', 'Names, times and actions are useful details to note.', 'True'),
      tf('l2d', 'Every listening task requires you to understand every single word.', 'False'),
      open('l2e', 'Write one key detail or short phrase you heard.')
    ]
  },
  {
    title: 'Transport announcements',
    focus: 'Listen for travel vocabulary, times and practical information.',
    url: 'https://learnenglish.britishcouncil.org/sites/podcasts/files/LearnEnglish-Listening-A2-Transport-announcements.pdf',
    questions: [
      mc('l3a', 'Which question helps you listen for the main idea?', 'What happened, and how did the speaker feel?', ['How many difficult words are there?', 'What happened, and how did the speaker feel?', 'Which word is longest?']),
      mc('l3b', 'Which note is most useful after listening?', 'one complete detail from the recording', ['a random word only', 'one complete detail from the recording', 'the page colour']),
      tf('l3c', 'A short complete sentence is a good way to record a detail.', 'True'),
      tf('l3d', 'You should use only one listening strategy for every task.', 'False'),
      open('l3e', 'Write one detail, phrase or idea from the listening task.')
    ]
  }
];

const writingTopics = [
  {
    title: 'A strange journey',
    intro: 'You were travelling alone when you met a person with an unusual story.',
    task: 'Write 80-110 words about the journey. Say what you were doing, what happened, and what you did afterwards.',
    use: 'while, then, afterwards, strange and conversation'
  },
  {
    title: 'Something you used to do',
    intro: 'Think about a hobby, routine or personality trait from your childhood.',
    task: 'Write 80-110 words comparing the past with now. Include one thing you used to do and one thing you did not use to do.',
    use: 'used to, did not use to, high school and hardworking'
  },
  {
    title: 'An incredible discovery',
    intro: 'During a family visit, you discovered an old object or photograph with a surprising history.',
    task: 'Write 80-110 words telling the story. Include an interrupted action and a final result.',
    use: 'discovered, was looking, while, eventually and incredible'
  },
  {
    title: 'The class reunion',
    intro: 'Former classmates met after many years and everyone had changed in some way.',
    task: 'Write 80-110 words about the reunion. Compare one person’s past and present, and include one surprising moment.',
    use: 'used to, reunion, instead of and conversation'
  },
  {
    title: 'A small act of magic',
    intro: 'An ordinary day changed because of an unexpected, kind or dramatic event.',
    task: 'Write 80-110 words with a clear beginning, middle and ending.',
    use: 'first, next, while, finally, magic and experience'
  }
];

const quiz = [
  mc('q1', 'Yesterday, we ___ a very strange shop.', 'found', ['find', 'found', 'were finding', 'have found']),
  mc('q2', 'She did not ___ the answer.', 'know', ['knew', 'know', 'knowing', 'known']),
  mc('q3', '___ you use to play chess?', 'Did', ['Do', 'Were', 'Did', 'Are']),
  mc('q4', 'At 7 p.m., they ___ dinner.', 'were having', ['had', 'were having', 'have', 'are having']),
  mc('q5', 'We meet ___ Friday.', 'on', ['in', 'at', 'on', 'by']),
  mc('q6', 'A person with a natural talent is ___.', 'gifted', ['wounded', 'gifted', 'confused', 'ugly']),
  mc('q7', 'While I ___ home, I saw my teacher.', 'was walking', ['walked', 'was walking', 'walk', 'am walking']),
  mc('q8', 'They ___ to Paris last year.', 'went', ['go', 'were going', 'went', 'gone']),
  mc('q9', 'A meeting of former classmates is a ___.', 'class reunion', ['high school', 'conversation', 'class reunion', 'compartment']),
  mc('q10', 'Choose the correct question.', 'Where did she go?', ['Where she did go?', 'Where did she go?', 'Where did she went?', 'Where was she go?']),
  mc('q11', 'He ___ very shy, but now he loves parties.', 'used to be', ['used to be', 'use to be', 'used be', 'was used be']),
  mc('q12', 'The film starts ___ 8:30.', 'at', ['on', 'in', 'at', 'during']),
  mc('q13', 'Run into means ...', 'meet by chance', ['run very fast', 'meet by chance', 'leave quickly', 'be confused']),
  mc('q14', 'We were waiting when the bus ___.', 'arrived', ['was arriving', 'arrive', 'arrived', 'arrives']),
  mc('q15', 'She ___ use to like coffee.', 'did not', ['does not', 'did not', 'was not', 'do not']),
  mc('q16', 'Which word means extremely large?', 'enormous', ['identical', 'enormous', 'dramatic', 'goofy']),
  mc('q17', 'The twins were ___; they looked exactly the same.', 'identical', ['identical', 'incredible', 'sociable', 'wounded']),
  mc('q18', '___ were you doing when I called?', 'What', ['Where', 'Why', 'What', 'When']),
  mc('q19', 'I usually read ___ the evening.', 'in', ['at', 'on', 'in', 'by']),
  mc('q20', 'Instead of the train, they ___ a bus.', 'took', ['take', 'were taking', 'took', 'takes']),
  mc('q21', 'He is very ___; he enjoys talking to new people.', 'sociable', ['confused', 'sociable', 'wounded', 'ugly']),
  mc('q22', 'She ___ a book when the lights went out.', 'was reading', ['read', 'was reading', 'reads', 'is reading']),
  mc('q23', 'Choose the correct question.', 'Did they visit London?', ['Did they visited London?', 'Did they visit London?', 'Were they visit London?', 'They did visit London?']),
  mc('q24', '___ 2026, the school organised a reunion.', 'In', ['At', 'On', 'In', 'From']),
  mc('q25', 'Eventually means ...', 'in the end', ['at first', 'in the end', 'at the same time', 'instead']),
  mc('q26', 'My brother ___ skip school, but he attends every day now.', 'used to', ['used to', 'use to', 'was used to', 'did used to']),
  mc('q27', 'The doctor helped the ___ runner.', 'wounded', ['gifted', 'wounded', 'organised', 'identical']),
  mc('q28', 'We ___ a lovely cafe after the museum.', 'discovered', ['discover', 'discovered', 'were discover', 'discovering']),
  mc('q29', 'Which sentence is correct?', 'She did not buy a ticket.', ['She did not bought a ticket.', 'She did not buy a ticket.', 'She not bought a ticket.', 'She was not buy a ticket.']),
  mc('q30', '___ Monday, I have an English lesson.', 'On', ['In', 'At', 'On', 'During']),
  mc('q31', 'The story was very ___, with many surprises.', 'dramatic', ['goofy', 'dramatic', 'organised', 'sociable']),
  mc('q32', 'They ___ football while it was raining.', 'were playing', ['played', 'were playing', 'play', 'are playing']),
  mc('q33', 'Did he use to live here? Yes, ___.', 'he did', ['he used', 'he did', 'he was', 'he lived']),
  mc('q34', 'First we ate; ___, we went for a walk.', 'then', ['while', 'instead of', 'then', 'at']),
  mc('q35', 'A person who plans carefully is ___.', 'organised', ['overactive', 'organised', 'ugly', 'confused']),
  mc('q36', 'The students ___ the museum last Saturday.', 'visited', ['visit', 'visited', 'were visit', 'visits']),
  mc('q37', 'Which sentence is correct?', 'I was sleeping when you called.', ['I sleeping when you called.', 'I was sleep when you called.', 'I was sleeping when you called.', 'I slept when you were calling.']),
  mc('q38', 'A twin is ...', 'one of two children born at the same time', ['a close friend', 'one of two children born at the same time', 'a former teacher', 'a school building']),
  mc('q39', 'We arrived ___ midnight.', 'at', ['in', 'on', 'at', 'by']),
  mc('q40', 'They did not use to ___ so much.', 'travel', ['travelled', 'travel', 'travelling', 'travels']),
  mc('q41', 'The painting was ___; I had never seen anything like it.', 'incredible', ['ordinary', 'incredible', 'wounded', 'confused']),
  mc('q42', 'While the guide was speaking, we ___ notes.', 'were taking', ['took', 'were taking', 'take', 'are taking']),
  mc('q43', 'Which question is correct?', 'Why did you leave?', ['Why you did leave?', 'Why did you left?', 'Why did you leave?', 'Why were you leave?']),
  mc('q44', 'A person who works with effort is ___.', 'hardworking', ['goofy', 'hardworking', 'strange', 'identical']),
  mc('q45', 'A few weeks ___, they met again.', 'later', ['then', 'at', 'later', 'while']),
  mc('q46', 'She ___ a difficult experience last year.', 'had', ['has', 'was having', 'had', 'have']),
  mc('q47', 'Which word means unusual?', 'strange', ['strange', 'enormous', 'sociable', 'organised']),
  mc('q48', 'He used to ___ very overactive as a child.', 'be', ['was', 'be', 'being', 'been']),
  mc('q49', 'We talked ___ the journey.', 'during', ['on', 'at', 'during', 'in']),
  mc('q50', 'Finally, the teacher ___ the answer.', 'explained', ['explains', 'was explaining', 'explained', 'explain'])
];

function Question({ item, value, attempts, checked, onDraft, onCheck }) {
  const current = value || '';
  const correct = String(current).trim().toLowerCase() === String(item.a || '').trim().toLowerCase();
  const feedback = item.type === 'open'
    ? current && 'Saved for teacher review.'
    : checked && (correct ? 'Correct!' : attempts >= 3 ? 'Not quite. Correct answer: ' + item.a : 'Incorrect. Try again. Attempt ' + attempts + '/3.');
  const feedbackClass = correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300';

  if (item.type === 'open') {
    return <article className="rounded-2xl border p-4 bg-white dark:bg-slate-800"><p className="font-bold mb-3">{item.q}</p><textarea value={current} onChange={event => onDraft(event.target.value)} className="w-full min-h-24 p-3 rounded-xl border bg-stone-50 dark:bg-slate-900" placeholder="Write your answer. It saves automatically." />{feedback && <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">{feedback}</p>}</article>;
  }
  if (item.type === 'fill') {
    return <article className="rounded-2xl border p-4 bg-white dark:bg-slate-800"><p className="font-bold mb-3">{item.q}</p><div className="flex gap-2"><input value={current} onChange={event => onDraft(event.target.value)} className="flex-1 p-3 rounded-xl border bg-stone-50 dark:bg-slate-900" placeholder="Type your answer" /><button onClick={() => onCheck(current)} className="px-4 rounded-xl bg-slate-900 text-white font-bold">Check</button></div>{feedback && <p className={'mt-3 text-sm font-bold ' + feedbackClass}>{feedback}</p>}</article>;
  }
  return <article className="rounded-2xl border p-4 bg-white dark:bg-slate-800"><p className="font-bold mb-3">{item.q}</p><div className="grid sm:grid-cols-2 gap-2">{item.opt.map(option => <button key={option} onClick={() => onCheck(option)} className={'p-3 text-left rounded-xl border transition-colors ' + (current === option ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400')}>{option}</button>)}</div>{feedback && <p className={'mt-3 text-sm font-bold ' + feedbackClass}>{feedback}</p>}</article>;
}

function TaskSet({ questions, answers, attempts, checked, setAnswer, checkAnswer, onReset }) {
  return <div className="space-y-4">{onReset && <div className="flex justify-end"><button onClick={onReset} className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 dark:text-rose-300 font-bold text-sm">Reset this section</button></div>}{questions.map(item => <Question key={item.id} item={item} value={answers[item.id]} attempts={attempts[item.id] || 0} checked={checked[item.id]} onDraft={value => setAnswer(item.id, value)} onCheck={value => checkAnswer(item, value)} />)}</div>;
}

function ResetButton({ onClick, label = 'Reset this section' }) {
  return <div className="flex justify-end"><button onClick={onClick} className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 dark:text-rose-300 font-bold text-sm">{label}</button></div>;
}

export default function Homework20261015({ darkMode, toggleDarkMode, onOpenPrevious }) {
  const [tab, setTab] = useState('review');
  const [state, setState] = useState({ answers: {}, attempts: {}, checked: {}, writing: '', topic: 0 });
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (saved && typeof saved === 'object') setState(current => ({ ...current, ...saved, answers: saved.answers || {}, attempts: saved.attempts || {}, checked: saved.checked || {} }));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const allGrammar = useMemo(() => grammar.flatMap(group => group.questions), []);
  const setAnswer = (id, value) => setState(current => ({ ...current, answers: { ...current.answers, [id]: value }, checked: { ...current.checked, [id]: false } }));
  const checkAnswer = (item, value) => setState(current => {
    const correct = String(value).trim().toLowerCase() === String(item.a || '').trim().toLowerCase();
    return {
      ...current,
      answers: { ...current.answers, [item.id]: value },
      checked: { ...current.checked, [item.id]: true },
      attempts: correct ? current.attempts : { ...current.attempts, [item.id]: Math.min(3, (current.attempts[item.id] || 0) + 1) }
    };
  });
  const questionsForSection = () => ({
    grammar: allGrammar,
    vocabulary: vocabExercises,
    practice,
    reading: readings.flatMap(reading => reading.questions),
    listening: listening.flatMap(task => task.questions),
    quiz
  })[tab] || [];
  const resetSection = () => {
    if (tab === 'writing') {
      setState(current => ({ ...current, writing: '', topic: 0 }));
      return;
    }
    const ids = new Set(questionsForSection().map(item => item.id));
    setState(current => ({
      ...current,
      answers: Object.fromEntries(Object.entries(current.answers).filter(([id]) => !ids.has(id))),
      attempts: Object.fromEntries(Object.entries(current.attempts).filter(([id]) => !ids.has(id))),
      checked: Object.fromEntries(Object.entries(current.checked).filter(([id]) => !ids.has(id)))
    }));
  };
  const resetAll = () => setState({ answers: {}, attempts: {}, checked: {}, writing: '', topic: 0 });
  const completed = Object.keys(state.answers).length + (state.writing.trim() ? 1 : 0);
  const tabs = [['review', 'Lesson overview', BookOpen], ['grammar', 'Grammar', PenTool], ['vocabulary', 'Vocabulary', BookOpen], ['practice', 'Practice', PenTool], ['reading', 'Reading', BookOpen], ['listening', 'Listening', Headphones], ['writing', 'Writing', PenTool], ['quiz', 'Final quiz', Star]];
  const taskProps = { answers: state.answers, attempts: state.attempts, checked: state.checked, setAnswer, checkAnswer };

  return <div className="min-h-screen bg-stone-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between gap-3">
        <div><b>Eugenia's Homework Workspace</b><div className="text-xs text-stone-500">Homework 10 · 15 October 2026</div></div>
        <div className="flex gap-2"><button className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">Homework 10 · Latest</button><button onClick={onOpenPrevious} className="px-3 py-2 rounded-xl border text-xs font-bold">Homework 9 · Revision</button><button onClick={toggleDarkMode} aria-label="Toggle dark mode" className="p-2">{darkMode ? <Eye /> : <EyeOff />}</button></div>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
      <section className="rounded-3xl p-8 mb-8 bg-gradient-to-br from-amber-50 to-blue-50 dark:from-amber-950/30 dark:to-blue-950/30"><p className="text-xs font-black uppercase tracking-widest text-blue-700">Lesson 10 · stories from the past</p><h1 className="text-4xl font-extrabold font-serif my-3">Past Stories, Time & Memories</h1><p>Practise telling stories clearly: finished actions, actions in progress, past habits, time phrases and rich vocabulary. Every answer and draft saves automatically on this device.</p><p className="mt-3 font-bold">{completed} saved responses</p></section>
      <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8 p-2 rounded-2xl bg-white dark:bg-slate-800 border">{tabs.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={'p-3 rounded-xl text-xs font-bold ' + (tab === id ? 'bg-slate-900 dark:bg-blue-600 text-white' : '')}><Icon className="inline w-4 h-4 mr-1" />{label}</button>)}</nav>

      {tab === 'review' && <section className="space-y-4"><h2 className="text-3xl font-extrabold font-serif">Your lesson plan</h2>{[
        ['Past Simple', 'Use regular and irregular verbs for finished past actions. Give special attention to did and did not plus a base verb in questions and negatives.'],
        ['Past Continuous', 'Use was or were plus verb-ing for an action in progress, often with while or when.'],
        ['Time language', 'Choose in, on or at accurately, and use connectors to make a story easy to follow.'],
        ['Used to', 'Describe habits and states from the past that changed.'],
        ['Vocabulary', 'Use story words, connectors and school or personality vocabulary in realistic sentences.']
      ].map(([title, detail]) => <article key={title} className="rounded-2xl p-5 bg-white dark:bg-slate-800 border"><h3 className="font-extrabold text-lg text-blue-700 dark:text-blue-300">{title}</h3><p className="mt-1">{detail}</p></article>)}<article className="rounded-2xl p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900"><h3 className="font-extrabold text-lg">Lesson note</h3><p className="mt-1">You saw a brief introduction to passive voice in the lesson. It is included as background knowledge only, not as a separate grammar rule or exercise set here.</p></article><article className="rounded-2xl p-5 bg-white dark:bg-slate-800 border"><h3 className="font-extrabold text-lg mb-2">Reset saved work</h3><p className="text-sm mb-4">Use a section reset while working, or clear every saved answer and writing draft here.</p><button onClick={resetAll} className="px-5 py-3 rounded-xl bg-rose-600 text-white font-bold">Reset all saved answers</button></article></section>}

      {tab === 'grammar' && <section className="space-y-8"><ResetButton onClick={resetSection} />{grammar.map(group => <div key={group.title} className="space-y-4"><article className="rounded-3xl p-6 bg-white dark:bg-slate-800 border"><h2 className="text-2xl font-extrabold font-serif">{group.title}</h2><p className="mt-2">{group.rule}</p><ul className="mt-4 list-disc ml-5 text-sm space-y-1">{group.examples.map(example => <li key={example}>{example}</li>)}</ul></article><TaskSet questions={group.questions} {...taskProps} /></div>)}</section>}

      {tab === 'vocabulary' && <section className="space-y-8"><ResetButton onClick={resetSection} /><article className="grid sm:grid-cols-2 gap-3">{vocabulary.map(([word, meaning]) => <div key={word} className="rounded-2xl p-4 bg-white dark:bg-slate-800 border"><b className="text-blue-600">{word}</b><p>{meaning}</p></div>)}</article><h2 className="text-2xl font-extrabold">30 vocabulary tasks: fill-ins, choices and personal sentences</h2><TaskSet questions={vocabExercises} {...taskProps} /></section>}

      {tab === 'practice' && <section className="space-y-5"><ResetButton onClick={resetSection} /><div><h2 className="text-3xl font-extrabold font-serif mb-3">40 mixed grammar and vocabulary questions</h2><p>Use the context to choose the right grammar form or word. No reading or listening comprehension is included here.</p></div><TaskSet questions={practice} {...taskProps} /></section>}

      {tab === 'reading' && <section className="space-y-10"><ResetButton onClick={resetSection} />{readings.map(reading => <article key={reading.title} className="space-y-5"><div className="rounded-3xl p-7 bg-white dark:bg-slate-800 border"><p className="text-xs font-black uppercase text-blue-600">B1 reading</p><h2 className="text-3xl font-extrabold font-serif my-3">{reading.title}</h2><p className="whitespace-pre-line leading-loose">{reading.text}</p></div><TaskSet questions={reading.questions} {...taskProps} /></article>)}</section>}

      {tab === 'listening' && <section className="space-y-10"><ResetButton onClick={resetSection} />{listening.map(task => <article key={task.title} className="rounded-3xl p-6 bg-white dark:bg-slate-800 border"><h2 className="text-2xl font-extrabold font-serif">{task.title}</h2><p className="my-2">Focus: {task.focus}</p><a href={task.url} target="_blank" rel="noreferrer" className="inline-flex gap-2 px-4 py-2 mb-5 rounded-xl bg-violet-600 text-white font-bold">Open listening task <ExternalLink className="w-4" /></a><p className="mb-4 text-sm">Listen once for the main idea, then again for details. Complete two choices, two true/false checks and one typed response. Your answers save automatically.</p><TaskSet questions={task.questions} {...taskProps} /></article>)}</section>}

      {tab === 'writing' && <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border"><div className="flex flex-wrap justify-between gap-3 mb-3"><h2 className="text-3xl font-extrabold font-serif">Writing practice</h2><ResetButton onClick={resetSection} label="Reset writing" /></div><p>Choose one topic. Write 80-110 words with a clear beginning, middle and ending. Try to use at least three unit words.</p><div className="grid sm:grid-cols-2 gap-2 my-5">{writingTopics.map((topic, index) => <button key={topic.title} onClick={() => setState(current => ({ ...current, topic: index }))} className={'p-3 rounded-xl border text-left font-bold ' + (state.topic === index ? 'bg-blue-600 text-white' : '')}>{index + 1}. {topic.title}</button>)}</div><article className="rounded-2xl p-5 mb-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900"><h3 className="font-extrabold text-lg mb-2">{writingTopics[state.topic].title}</h3><p className="leading-relaxed"><b>Backstory:</b> {writingTopics[state.topic].intro}</p><p className="leading-relaxed mt-2"><b>Your task:</b> {writingTopics[state.topic].task}</p><p className="leading-relaxed mt-2"><b>Useful language:</b> {writingTopics[state.topic].use}</p></article><textarea value={state.writing} onChange={event => setState(current => ({ ...current, writing: event.target.value }))} rows={12} className="w-full p-4 rounded-2xl border bg-stone-50 dark:bg-slate-900" placeholder="Write here. Your draft saves automatically." /><p className="mt-2 font-bold">{state.writing.trim() ? state.writing.trim().split(/\s+/).length : 0} words · target 80-110</p></section>}

      {tab === 'quiz' && <section className="space-y-5"><ResetButton onClick={resetSection} /><article className="rounded-3xl p-6 bg-amber-50 dark:bg-amber-900/15 border"><h2 className="text-3xl font-extrabold font-serif">Final quiz · 50 multiple-choice questions</h2><p>Grammar and vocabulary only. Each choice gets immediate feedback, and the answer appears after three unsuccessful tries.</p></article><TaskSet questions={quiz} {...taskProps} /></section>}
    </main>
  </div>;
}
