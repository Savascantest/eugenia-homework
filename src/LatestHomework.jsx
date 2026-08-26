import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BookOpen, CheckCircle, ChevronDown, ChevronUp,
  Lightbulb, PenTool, RefreshCw, Star, Brain, CircleHelp,
  Sparkles, ClipboardCheck, MessageCircle, Volume2, Eye, EyeOff
} from 'lucide-react';

const STORAGE_KEY = 'eugenia_homework_2026_08_21_progress';
const MISTAKE_KEY = 'eugenia_homework_2026_08_21_mistakes';

const PRACTICE = [
  { group: 'Routine vs temporary exception', type: 'MC', q: 'I usually ______ to work by car, but this week I ______ by bus.', opt: ['go / am going', 'am going / go', 'go / go'], a: 'go / am going', why: 'Present Simple gives the usual routine. Present Continuous gives the temporary situation this week.' },
  { type: 'MC', q: 'We usually ______ in the office, but this week we ______ at home.', opt: ['work / are working', 'are working / work', 'work / work'], a: 'work / are working' },
  { type: 'MC', q: 'I drink coffee every morning, but today I ______ water.', opt: ['drink', 'am drinking', 'drinks'], a: 'am drinking' },
  { type: 'MC', q: 'Which sentence best shows a normal habit plus a temporary exception?', opt: ['I ride my horse every weekend.', 'I am riding my horse now.', 'I usually train in the evening, but this week I am training in the morning.'], a: 'I usually train in the evening, but this week I am training in the morning.' },

  { group: 'BE: state or continuous?', type: 'MC', q: 'Which sentence describes a STATE, not an action in progress?', opt: ['I am tired.', 'I am working.', 'I am driving.'], a: 'I am tired.', why: 'am/is/are does not automatically mean Present Continuous. Continuous needs BE + a verb ending in -ing.' },
  { type: 'MC', q: 'Which sentence is Present Continuous?', opt: ['She is busy.', 'She is a doctor.', 'She is working today.'], a: 'She is working today.' },
  { type: 'MC', q: '“They are in Germany.” What comes after BE here?', opt: ['a location/state', 'an -ing action', 'a Present Simple auxiliary'], a: 'a location/state' },
  { type: 'MC', q: 'Choose the correct explanation.', opt: ['Every sentence with am/is/are is continuous.', 'Present Continuous needs am/is/are + verb-ing.', 'Present Continuous never uses am/is/are.'], a: 'Present Continuous needs am/is/are + verb-ing.' },

  { group: 'Negatives and questions', type: 'MC', q: 'Make this negative: “I am a student.”', opt: ["I don't a student.", "I am not a student.", "I don't be a student."], a: 'I am not a student.' },
  { type: 'MC', q: 'Make this a question: “You are upset.”', opt: ['Do you upset?', 'Are you upset?', 'Are you get upset?'], a: 'Are you upset?' },
  { type: 'MC', q: 'Make this negative: “My cat sleeps a lot.”', opt: ["My cat isn't sleep a lot.", "My cat doesn't sleep a lot.", "My cat doesn't sleeps a lot."], a: "My cat doesn't sleep a lot." },
  { type: 'MC', q: 'Make this a question: “My cat sleeps a lot.”', opt: ['Does my cat sleep a lot?', 'Is my cat sleep a lot?', 'Does my cat sleeps a lot?'], a: 'Does my cat sleep a lot?' },
  { type: 'MC', q: 'Make this negative: “He is driving a car.”', opt: ["He doesn't driving a car.", "He isn't driving a car.", "He not is driving a car."], a: "He isn't driving a car." },
  { type: 'MC', q: 'Make this a question: “He is driving a car.”', opt: ['Does he driving a car?', 'Is he driving a car?', 'Is driving he a car?'], a: 'Is he driving a car?' },

  { group: 'Always + Continuous', type: 'MC', q: 'Which sentence sounds like a neutral routine?', opt: ['She always calls me early.', "She's always calling me early!", 'She is call me early.'], a: 'She always calls me early.', why: 'Present Simple + always can simply report a regular habit.' },
  { type: 'MC', q: 'Which sentence most strongly suggests the speaker is annoyed?', opt: ['He always comes at noon.', "He's always coming late!", 'He comes at noon on Mondays.'], a: "He's always coming late!" },
  { type: 'MC', q: 'Choose the best meaning of “She is always calling me early.”', opt: ['A neutral timetable only', 'Repeated behaviour that the speaker finds irritating or remarkable', 'Something happening only once'], a: 'Repeated behaviour that the speaker finds irritating or remarkable' },
  { type: 'MC', q: 'Which is a natural complaint?', opt: ["You're never listening to me!", 'You never are listening to me.', 'You do never listening to me.'], a: "You're never listening to me!" },

  { group: 'State, change and meaning', type: 'MC', q: 'Which question asks about your current emotional STATE?', opt: ['Are you upset?', 'Do you get upset?', 'Are you get upset?'], a: 'Are you upset?', why: 'BE + adjective describes the state now.' },
  { type: 'MC', q: 'Which question asks whether becoming upset happens to you in general?', opt: ['Are you upset?', 'Do you get upset?', 'Do you upset?'], a: 'Do you get upset?' },
  { type: 'MC', q: '“I am getting upset.” means:', opt: ['I am in a fixed permanent state.', 'My emotion is changing and I am becoming upset.', 'I usually become upset every day.'], a: 'My emotion is changing and I am becoming upset.' },
  { type: 'MC', q: 'Which sentence uses “annoying” as an adjective describing a person?', opt: ['She is annoying.', 'She is annoying me right now.', 'She annoy me.'], a: 'She is annoying.' },
  { type: 'MC', q: 'Which sentence uses “annoy” as an action happening now?', opt: ['She is annoying.', 'She is annoying me right now.', 'She annoying me.'], a: 'She is annoying me right now.' },

  { group: 'Stative verbs and -ing forms', type: 'MC', q: 'Choose the natural sentence for understanding something.', opt: ["I'm not understanding this rule.", "I don't understand this rule.", "I not understand this rule."], a: "I don't understand this rule.", why: 'At this level, treat understand as a stative verb that normally does not use the continuous form.' },
  { type: 'MC', q: '“I think you are very active.” Here “think” means:', opt: ['I am doing a mental process right now.', 'This is my opinion.', 'I do not understand.'], a: 'This is my opinion.' },
  { type: 'MC', q: '“I am thinking about my next holiday.” Here “thinking” means:', opt: ['an opinion only', 'a mental activity happening around now', 'a permanent fact'], a: 'a mental activity happening around now' },
  { type: 'MC', q: 'Which sentence is correct?', opt: ['I like work.', 'I like working.', 'I like am working.'], a: 'I like working.' },
  { type: 'MC', q: 'Which sentence is correct?', opt: ['I want drink water.', 'I want drinking water.', 'I want to drink water.'], a: 'I want to drink water.' },
  { type: 'MC', q: 'In “Reading is fun,” the word “Reading” functions as:', opt: ['the subject, an -ing form used like a noun', 'Present Continuous', 'an auxiliary verb'], a: 'the subject, an -ing form used like a noun' },

  { group: 'Have and have got', type: 'MC', q: 'Choose the normal negative form of “I have a car.”', opt: ["I haven't a car.", "I don't have a car.", "I am not have a car."], a: "I don't have a car." },
  { type: 'MC', q: 'Choose the correct Present Simple negative.', opt: ["She doesn't have a car.", "She doesn't has a car.", "She isn't have a car."], a: "She doesn't have a car." },
  { type: 'MC', q: 'Choose the correct “have got” negative.', opt: ["She hasn't a cat.", "She hasn't got a cat.", "She doesn't got a cat."], a: "She hasn't got a cat." },

  { group: 'Signal words', type: 'MC', q: '“Hardly ever” is closest in meaning to:', opt: ['very often', 'very rarely / almost never', 'right now'], a: 'very rarely / almost never' },
  { type: 'MC', q: 'Which expression most strongly points to a temporary Present Continuous situation?', opt: ['every day', 'hardly ever', 'this week'], a: 'this week' },
];

const READING_TEXT = `Maya works at a riding stable outside the city. She usually starts work at seven o'clock and spends most of the morning feeding the horses and cleaning the stalls. She normally drives to work because it is faster, and she hardly ever takes the bus.

This week is different. Her car is at the garage, so she is taking the bus to work every day. She usually drinks coffee before work, but this week she is drinking more water because she is trying to have a healthier week. She says the change is temporary, but she is enjoying it more than she expected.

Maya is usually easygoing, but one colleague is testing her patience. He is always arriving late and asking Maya to finish his jobs. Maya says, “He always comes late” when she is simply describing his routine, but when she is frustrated she says, “He is always coming late!” The grammar changes the feeling of the sentence.

Today Maya is tired, but she is not upset. “I am tired” describes her state. Later, when the colleague arrives late again, Maya says, “I am getting upset.” Now her feeling is changing. She also says, “I think he needs a new alarm clock.” Here, think gives her opinion. A few minutes later, she is thinking about how to reorganize the afternoon schedule. This time, thinking describes a mental activity in progress.`;

const READING_QS = [
  { type: 'TF', q: 'Maya normally takes the bus to work.', a: 'False' },
  { type: 'MC', q: 'Why is Maya taking the bus this week?', opt: ['She sold her car.', 'Her car is at the garage.', 'She always prefers the bus.'], a: 'Her car is at the garage.' },
  { type: 'MC', q: 'Which sentence in the text shows a usual routine plus a temporary exception?', opt: ['Maya works at a riding stable.', 'She usually drives to work, but this week she is taking the bus.', 'Today Maya is tired.'], a: 'She usually drives to work, but this week she is taking the bus.' },
  { type: 'MC', q: 'What extra feeling does “He is always coming late!” communicate?', opt: ['Maya is annoyed.', 'Maya is giving a neutral timetable.', 'Maya is talking about one single arrival.'], a: 'Maya is annoyed.' },
  { type: 'MC', q: 'In “I am tired,” what is “tired”?', opt: ['a state/adjective after BE', 'a continuous action', 'an auxiliary verb'], a: 'a state/adjective after BE' },
  { type: 'MC', q: 'What does “I am getting upset” show?', opt: ['A change in Maya’s emotional state', 'A permanent personality trait', 'A daily habit only'], a: 'A change in Maya’s emotional state' },
  { type: 'MC', q: 'In “I think he needs a new alarm clock,” think expresses:', opt: ['an opinion', 'a physical action', 'a timetable'], a: 'an opinion' },
  { type: 'MC', q: 'In “she is thinking about how to reorganize the afternoon,” thinking expresses:', opt: ['an opinion only', 'a mental process happening now', 'a permanent fact'], a: 'a mental process happening now' },
];

const QUIZ = [
  { type: 'MC', q: 'Present Continuous always needs:', opt: ['do/does + verb', 'BE + verb-ing', 'have + noun'], a: 'BE + verb-ing' },
  { type: 'MC', q: 'Which is a state?', opt: ['I am hungry.', 'I am eating.', 'I am running.'], a: 'I am hungry.' },
  { type: 'MC', q: 'Choose the correct temporary-exception sentence.', opt: ['I usually work mornings, but this week I am working evenings.', 'I am usually working mornings, but this week I work evenings.', 'I usually am work mornings.'], a: 'I usually work mornings, but this week I am working evenings.' },
  { type: 'MC', q: 'Correct negative: “She works on Saturday.”', opt: ["She doesn't work on Saturday.", "She doesn't works on Saturday.", "She isn't work on Saturday."], a: "She doesn't work on Saturday." },
  { type: 'MC', q: 'Correct question: “She works on Saturday.”', opt: ['Is she work on Saturday?', 'Does she work on Saturday?', 'Does she works on Saturday?'], a: 'Does she work on Saturday?' },
  { type: 'MC', q: 'Correct negative: “They are studying.”', opt: ["They don't studying.", "They aren't studying.", "They aren't study."], a: "They aren't studying." },
  { type: 'MC', q: 'Correct question: “They are studying.”', opt: ['Do they studying?', 'Are they studying?', 'Are studying they?'], a: 'Are they studying?' },
  { type: 'MC', q: 'Which sounds like a complaint?', opt: ['She always calls me.', "She's always calling me!", 'She calls me on Fridays.'], a: "She's always calling me!" },
  { type: 'MC', q: 'Which asks about a current state?', opt: ['Are you upset?', 'Do you get upset?', 'Are you get upset?'], a: 'Are you upset?' },
  { type: 'MC', q: 'Which asks about a general tendency?', opt: ['Are you upset?', 'Do you get upset?', 'Do you upset?'], a: 'Do you get upset?' },
  { type: 'MC', q: 'Which describes a change happening now?', opt: ['I am upset.', 'I get upset easily.', 'I am getting upset.'], a: 'I am getting upset.' },
  { type: 'MC', q: 'Choose the normal form.', opt: ["I'm not understanding.", "I don't understand.", "I am don't understand."], a: "I don't understand." },
  { type: 'MC', q: '“I think she is smart” expresses:', opt: ['an opinion', 'an action in progress', 'a location'], a: 'an opinion' },
  { type: 'MC', q: '“I am thinking about dinner” expresses:', opt: ['an opinion only', 'a mental activity in progress', 'a repeated schedule'], a: 'a mental activity in progress' },
  { type: 'MC', q: 'Choose the correct sentence.', opt: ['I like working.', 'I like work.', 'I like am work.'], a: 'I like working.' },
  { type: 'MC', q: 'Choose the correct sentence.', opt: ['I want to drink.', 'I want drinking.', 'I want drink.'], a: 'I want to drink.' },
  { type: 'MC', q: '“Reading is relaxing.” Reading is:', opt: ['an -ing form used as the subject', 'Present Continuous', 'an auxiliary'], a: 'an -ing form used as the subject' },
  { type: 'MC', q: 'Correct possession negative:', opt: ["I don't have a car.", "I haven't a car.", "I not have a car."], a: "I don't have a car." },
  { type: 'MC', q: 'Correct “have got” negative:', opt: ["She hasn't got a cat.", "She hasn't a cat.", "She doesn't got a cat."], a: "She hasn't got a cat." },
  { type: 'MC', q: 'Hardly ever means:', opt: ['very often', 'very rarely / almost never', 'at the moment'], a: 'very rarely / almost never' },
];

function HintBox({ children, title = 'Remember' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
        <Lightbulb className="w-4 h-4" /> {title} {open ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
      </button>
      {open && <div className="mt-2 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}

function ExerciseBlock({ questions, onComplete, saved = false, label = 'Check Answers' }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const score = useMemo(() => questions.reduce((n, q, i) => {
    const v = answers[i];
    return n + (v && String(v).trim().toLowerCase() === String(q.a).toLowerCase() ? 1 : 0);
  }, 0), [answers, questions]);

  const complete = () => {
    setChecked(true);
    if (onComplete) onComplete(score, questions.length, answers);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i}>
          {q.group && <h3 className="text-xl font-extrabold font-serif mt-10 mb-4">{q.group}</h3>}
          <div className={`rounded-2xl border p-5 bg-white dark:bg-slate-800 ${checked ? (String(answers[i] || '').toLowerCase() === String(q.a).toLowerCase() ? 'border-emerald-300 dark:border-emerald-700' : 'border-rose-300 dark:border-rose-700') : 'border-stone-200 dark:border-slate-700'}`}>
            <p className="font-semibold mb-4">{i + 1}. {q.q}</p>
            {q.type === 'TF' ? (
              <div className="grid grid-cols-2 gap-3">
                {['True','False'].map(o => <button key={o} disabled={checked} onClick={() => setAnswers({...answers,[i]:o})} className={`p-3 rounded-xl border font-semibold ${answers[i] === o ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-stone-200 dark:border-slate-600'}`}>{o}</button>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {q.opt.map(o => <button key={o} disabled={checked} onClick={() => setAnswers({...answers,[i]:o})} className={`text-left p-3 rounded-xl border font-medium ${answers[i] === o ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-700'}`}>{o}</button>)}
              </div>
            )}
            {q.why && !checked && <HintBox title="Why?">{q.why}</HintBox>}
            {checked && String(answers[i] || '').toLowerCase() !== String(q.a).toLowerCase() && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200 text-sm">Correct answer: <strong>{q.a}</strong></div>
            )}
          </div>
        </div>
      ))}
      <div className="pt-5 border-t border-stone-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
        {!checked ? <button onClick={complete} className="px-7 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold">{label}</button> : (
          <>
            <div className="font-extrabold text-lg">Score: {score}/{questions.length}</div>
            <button onClick={() => { setChecked(false); setAnswers({}); }} className="px-5 py-3 rounded-xl border border-stone-300 dark:border-slate-600 font-bold"><RefreshCw className="w-4 h-4 inline mr-2"/>Try Again</button>
          </>
        )}
        {saved && <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><CheckCircle className="w-4 h-4"/>Saved</span>}
      </div>
    </div>
  );
}

function NotesTab() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl p-7 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <h2 className="text-2xl font-extrabold font-serif mb-3">The main idea from the lesson</h2>
        <p className="leading-relaxed">You already know Present Simple and Present Continuous. This homework focuses on <strong>why we choose one structure instead of another</strong>, especially when a sentence contains a normal routine and a temporary exception.</p>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
          <div className="text-xs font-black tracking-widest uppercase text-emerald-600 mb-2">Usual / general</div>
          <h3 className="text-xl font-extrabold mb-3">Present Simple</h3>
          <p className="mb-4">Use it for routines, usual situations and repeated actions.</p>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 font-semibold">I usually go to work by car.</div>
        </div>
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
          <div className="text-xs font-black tracking-widest uppercase text-violet-600 mb-2">Temporary / around now</div>
          <h3 className="text-xl font-extrabold mb-3">Present Continuous</h3>
          <p className="mb-4">Use it for a temporary situation happening now or around the current period.</p>
          <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 font-semibold">But this week, I am going by bus.</div>
        </div>
      </section>

      <div className="rounded-3xl p-7 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800">
        <h3 className="text-xl font-extrabold mb-3">Put them together</h3>
        <p className="text-lg font-semibold">I usually go to work by car, <strong>but this week I am going by bus.</strong></p>
        <p className="mt-3 text-sm opacity-80">The first part gives the normal routine. The second part gives the temporary exception.</p>
      </div>

      <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4"><Brain className="w-6 h-6 text-blue-600"/><h3 className="text-2xl font-extrabold font-serif">BE does not automatically mean “continuous”</h3></div>
        <p className="mb-5">The forms <strong>am / is / are</strong> can simply describe identity, condition, feeling or location. Present Continuous specifically needs <strong>BE + a verb ending in -ing</strong>.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700"><strong>State:</strong><br/>I am a student.<br/>She is busy.<br/>I am tired.<br/>They are in Germany.</div>
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"><strong>Action in progress:</strong><br/>I am studying.<br/>She is working.<br/>They are driving.</div>
        </div>
      </section>

      <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <h3 className="text-2xl font-extrabold font-serif mb-5">The auxiliary-verb logic</h3>
        <div className="space-y-5">
          <div><strong>BE state:</strong> I am a student → I am <strong>not</strong> a student → <strong>Are</strong> you a student?</div>
          <div><strong>Present Simple action:</strong> My cat sleeps → My cat <strong>doesn't sleep</strong> → <strong>Does</strong> my cat sleep?</div>
          <div><strong>Present Continuous:</strong> He is driving → He <strong>isn't driving</strong> → <strong>Is</strong> he driving?</div>
        </div>
        <HintBox title="Pattern">With ordinary Present Simple verbs, <strong>do/does</strong> appears in negatives and questions. With BE or Present Continuous, the BE verb is already there, so we use it directly.</HintBox>
      </section>

      <section className="rounded-3xl p-7 bg-rose-50 dark:bg-rose-900/15 border border-rose-200 dark:border-rose-800">
        <h3 className="text-2xl font-extrabold font-serif mb-4">Special pattern: always + Present Continuous</h3>
        <p className="mb-4">This was the extra rule that created the most questions in the lesson. We can use <strong>always + Present Continuous</strong> to emphasize repeated behaviour that feels annoying, surprising or emotionally noticeable.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800"><strong>Neutral routine:</strong><br/>She always calls me early.</div>
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800"><strong>Complaint / frustration:</strong><br/>She's always calling me early!</div>
        </div>
        <p className="mt-4 text-sm">The same idea can sometimes appear with words such as <strong>constantly</strong> or in complaints like <strong>You're never listening!</strong></p>
      </section>

      <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <h3 className="text-2xl font-extrabold font-serif mb-5">State vs change: upset and annoying</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-900"><strong>Are you upset?</strong> = What is your emotional state now?</div>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-900"><strong>Do you get upset?</strong> = Does becoming upset happen to you in general?</div>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-900"><strong>I am getting upset.</strong> = My feeling is changing now, I am becoming upset.</div>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-900"><strong>She is annoying.</strong> = annoying is an adjective describing her.<br/><strong>She is annoying me.</strong> = annoy is the action, happening now.</div>
        </div>
      </section>

      <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <h3 className="text-2xl font-extrabold font-serif mb-5">Stative verbs and meaning changes</h3>
        <div className="space-y-4">
          <div><strong>understand:</strong> I don't understand. At this level, avoid “I'm not understanding.”</div>
          <div><strong>I think you are active.</strong> = think gives an opinion.</div>
          <div><strong>I am thinking about my next holiday.</strong> = thinking is a mental activity happening now.</div>
        </div>
      </section>

      <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <h3 className="text-2xl font-extrabold font-serif mb-5">Bonus from the lesson: another -ing job</h3>
        <p className="mb-4">An <strong>-ing</strong> word is not automatically Present Continuous. It can also work like a noun.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20"><strong>I like working.</strong><br/><span className="text-sm">working follows like.</span></div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20"><strong>Reading is fun.</strong><br/><span className="text-sm">Reading is the subject.</span></div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20"><strong>I want to drink.</strong><br/><span className="text-sm">want uses to + base verb.</span></div>
        </div>
        <HintBox title="Important">Different verbs take different patterns after them. For now, remember the examples from the lesson rather than trying to make one rule for every verb.</HintBox>
      </section>

      <section className="rounded-3xl p-7 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <h3 className="text-2xl font-extrabold font-serif mb-5">Have vs have got</h3>
        <div className="space-y-3">
          <p>I have a car. → <strong>I don't have a car.</strong></p>
          <p>She has a car. → <strong>She doesn't have a car.</strong></p>
          <p>British-style alternative: She has got a cat. → <strong>She hasn't got a cat.</strong></p>
        </div>
      </section>

      <section className="rounded-3xl p-7 bg-slate-900 text-white dark:bg-slate-800 border border-slate-700">
        <h3 className="text-2xl font-extrabold font-serif mb-4">Signal words from the lesson</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div><strong>Present Simple clues:</strong><br/>usually, always, rarely, hardly ever, every day, twice a week</div>
          <div><strong>Present Continuous clues:</strong><br/>now, right now, at the moment, today, this week, this month</div>
        </div>
        <p className="mt-4 text-sm text-slate-300">These are useful clues, but meaning is more important than memorizing a signal-word list.</p>
      </section>
    </div>
  );
}

function ReadingTab({ onComplete, saved }) {
  const [showFocus, setShowFocus] = useState(false);
  return (
    <div className="space-y-8">
      <div className="rounded-3xl p-7 md:p-10 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 font-serif">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div><div className="text-xs font-black uppercase tracking-widest text-rose-600 mb-2">A2 reading</div><h2 className="text-3xl font-extrabold">A Different Week at the Stable</h2></div>
          <button onClick={() => setShowFocus(!showFocus)} className="text-xs font-bold px-3 py-2 rounded-full border border-stone-200 dark:border-slate-600 flex items-center gap-2">{showFocus ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}{showFocus ? 'Hide guide' : 'Show guide'}</button>
        </div>
        {showFocus && <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-sm font-sans">While reading, notice: <strong>usual routine vs this week</strong>, <strong>always + continuous</strong>, <strong>BE states</strong>, <strong>getting upset</strong>, and <strong>think vs thinking</strong>.</div>}
        <p className="whitespace-pre-line text-lg leading-loose">{READING_TEXT}</p>
      </div>
      <ExerciseBlock questions={READING_QS} onComplete={onComplete} saved={saved}/>
    </div>
  );
}

export default function LatestHomework({ onOpenLatest, onOpenPrevious, darkMode, toggleDarkMode }) {
  const [tab, setTab] = useState('notes');
  const [progress, setProgress] = useState({ practice: null, reading: null, quiz: null });
  const [mistakes, setMistakes] = useState({});

  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEY);
      const m = localStorage.getItem(MISTAKE_KEY);
      if (p) setProgress(JSON.parse(p));
      if (m) setMistakes(JSON.parse(m));
    } catch (_) {}
  }, []);

  const saveResult = (key) => (score, total, answers) => {
    const next = { ...progress, [key]: { score, total } };
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
    if (key !== 'reading') {
      const bank = { ...mistakes };
      const source = key === 'practice' ? PRACTICE : QUIZ;
      source.forEach((q, i) => {
        if (answers[i] && String(answers[i]).toLowerCase() !== String(q.a).toLowerCase()) {
          bank[`${key}-${i}`] = { q: q.q, a: q.a };
        } else if (String(answers[i] || '').toLowerCase() === String(q.a).toLowerCase()) {
          delete bank[`${key}-${i}`];
        }
      });
      setMistakes(bank);
      try { localStorage.setItem(MISTAKE_KEY, JSON.stringify(bank)); } catch (_) {}
    }
  };

  const tabs = [
    ['notes', 'Lesson Notes', BookOpen],
    ['practice', 'Practice', PenTool],
    ['reading', 'Reading', Brain],
    ['quiz', 'Final Quiz', Star],
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white"><BookOpen className="w-5 h-5"/></div>
            <div><div className="font-extrabold">Eugenia's Homework Workspace</div><div className="text-xs text-stone-500 dark:text-slate-400">Homework 2 · 21 August 2026</div></div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <button onClick={onOpenLatest} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm">Homework 3 <span className="ml-1 text-[10px] uppercase bg-white/20 px-2 py-1 rounded-full">Latest</span></button>
            <button className="px-4 py-2 rounded-xl border border-blue-300 dark:border-blue-700 text-sm font-bold bg-blue-50 dark:bg-blue-900/20">Homework 2 · 21 Aug</button>
            <button onClick={onOpenPrevious} className="px-4 py-2 rounded-xl border border-stone-300 dark:border-slate-600 text-sm font-bold bg-white dark:bg-slate-800">Homework 1 · 18 Aug</button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-stone-500 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800" aria-label="Toggle dark mode">{darkMode ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-20">
        <div className="rounded-3xl p-8 md:p-10 mb-8 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/30 border border-blue-100 dark:border-blue-900">
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-300 mb-3"><Sparkles className="w-4 h-4"/> Latest homework</div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-4">States, Actions & Temporary Exceptions</h1>
              <p className="text-lg text-stone-600 dark:text-slate-300 max-w-3xl">A focused review of the grammar discussed in Friday's lesson: Present Simple vs Present Continuous, BE, auxiliary verbs, stative verbs, “always” for complaints, and state vs change.</p>
            </div>
            <div className="shrink-0 text-sm font-bold px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800 border border-white dark:border-slate-700">Next lesson: Tuesday · 19:00</div>
          </div>
        </div>

        <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10 p-2 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
          {tabs.map(([id,label,Icon]) => <button key={id} onClick={() => setTab(id)} className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${tab === id ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'hover:bg-stone-50 dark:hover:bg-slate-700'}`}><Icon className="w-4 h-4"/>{label}{progress[id] && <CheckCircle className="w-4 h-4 text-emerald-400"/>}</button>)}
        </nav>

        {tab === 'notes' && <NotesTab/>}
        {tab === 'practice' && <ExerciseBlock questions={PRACTICE} onComplete={saveResult('practice')} saved={!!progress.practice}/>} 
        {tab === 'reading' && <ReadingTab onComplete={saveResult('reading')} saved={!!progress.reading}/>}
        {tab === 'quiz' && (
          <div className="space-y-8">
            <div className="rounded-3xl p-7 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800">
              <h2 className="text-2xl font-extrabold font-serif mb-2">Final Quiz</h2>
              <p>20 mixed questions from the Aug 21 lesson. Aim for at least 16/20 before Tuesday.</p>
            </div>
            <ExerciseBlock questions={QUIZ} onComplete={saveResult('quiz')} saved={!!progress.quiz} label="Submit Quiz"/>
          </div>
        )}

        {Object.keys(mistakes).length > 0 && tab !== 'notes' && (
          <div className="mt-12 rounded-3xl p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
            <h3 className="font-extrabold flex items-center gap-2 mb-4"><ClipboardCheck className="w-5 h-5"/>Review Again</h3>
            <div className="grid md:grid-cols-2 gap-3">{Object.values(mistakes).slice(0,6).map((m,i)=><div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-rose-100 dark:border-slate-700"><div className="text-sm mb-2">{m.q}</div><div className="font-bold text-emerald-700 dark:text-emerald-400">✓ {m.a}</div></div>)}</div>
          </div>
        )}
      </main>
    </div>
  );
}
