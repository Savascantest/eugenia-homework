import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BookOpen, CheckCircle, ChevronDown, ChevronUp, ClipboardCheck,
  ExternalLink, Eye, EyeOff, Headphones, Lightbulb, MessageCircle,
  PenTool, RefreshCw, Sparkles, Star, Volume2
} from 'lucide-react';

const PACKAGE_ID = '2026-08-29-A303F12D';
const DATA_URL = `${import.meta.env.BASE_URL}homeworks/${PACKAGE_ID}/homework.json`;
const PROGRESS_KEY = `eugenia_homework_${PACKAGE_ID}_progress`;
const MISTAKE_KEY = `eugenia_homework_${PACKAGE_ID}_mistakes`;
const WRITING_KEY = `eugenia_homework_${PACKAGE_ID}_writing`;

function HintBox({ children, title = 'Remember' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
        <Lightbulb className="w-4 h-4" /> {title} {open ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
      </button>
      {open && <div className="mt-2 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}

function QuestionSet({ questions, section, onComplete, saved, label = 'Finish section' }) {
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const score = useMemo(() => questions.reduce((n, q, i) => n + (answers[i] === q.a ? 1 : 0), 0), [answers, questions]);

  const choose = (index, answer) => setAnswers({ ...answers, [index]: answer });
  const finish = () => {
    setFinished(true);
    onComplete(section, score, questions.length, answers, questions);
  };

  return (
    <div className="space-y-5">
      {questions.map((q, i) => {
        const answered = answers[i] !== undefined;
        const correct = answers[i] === q.a;
        return (
          <div key={`${section}-${i}`} className={`rounded-2xl border p-5 bg-white dark:bg-slate-800 ${answered ? (correct ? 'border-emerald-300 dark:border-emerald-700' : 'border-rose-300 dark:border-rose-700') : 'border-stone-200 dark:border-slate-700'}`}>
            {q.speaker && <div className="mb-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20"><strong>{q.speaker}:</strong> “{q.line}”</div>}
            <p className="font-semibold mb-4">{i + 1}. {q.q}</p>
            <div className="grid md:grid-cols-3 gap-3">
              {q.opt.map(option => (
                <button key={option} onClick={() => choose(i, option)} className={`text-left p-3 rounded-xl border font-medium transition ${answers[i] === option ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-700'}`}>{option}</button>
              ))}
            </div>
            {answered && <div className={`mt-4 p-3 rounded-xl text-sm font-semibold ${correct ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300'}`}>{correct ? 'Correct — keep going.' : <>Not quite. Correct answer: <strong>{q.a}</strong></>}</div>}
            {q.why && <HintBox title="Why?">{q.why}</HintBox>}
          </div>
        );
      })}
      <div className="pt-5 border-t border-stone-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
        {!finished ? <button onClick={finish} className="px-7 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold">{label}</button> : (
          <>
            <div className="font-extrabold text-lg">Score: {score}/{questions.length}</div>
            <button onClick={() => { setFinished(false); setAnswers({}); }} className="px-5 py-3 rounded-xl border border-stone-300 dark:border-slate-600 font-bold"><RefreshCw className="w-4 h-4 inline mr-2"/>Try again</button>
          </>
        )}
        {saved && <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><CheckCircle className="w-4 h-4"/>Saved</span>}
      </div>
    </div>
  );
}

function WritingTask({ task, onComplete, saved }) {
  const [text, setText] = useState(() => { try { return localStorage.getItem(WRITING_KEY) || ''; } catch (_) { return ''; } });
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const save = () => {
    try { localStorage.setItem(WRITING_KEY, text); } catch (_) {}
    onComplete('writing', words >= 70 && words <= 100 ? 1 : 0, 1, {}, []);
  };
  return (
    <div className="space-y-7">
      <div className="rounded-3xl p-7 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <h2 className="text-2xl font-extrabold font-serif mb-3">Short writing</h2>
        <p className="leading-relaxed">{task.prompt}</p>
      </div>
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={10} placeholder="Write your description here..." className="w-full p-4 rounded-2xl border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <div className={`mt-2 text-sm font-bold ${words >= 70 && words <= 100 ? 'text-emerald-600' : 'text-stone-500'}`}>{words} words · target: 70–100</div>
        <div className="mt-5 grid sm:grid-cols-2 gap-2">{task.checklist.map(item => <div key={item} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-blue-500"/>{item}</div>)}</div>
        <button onClick={save} className="mt-6 px-7 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold">Save writing</button>
        {saved && <span className="ml-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">Saved in this browser</span>}
      </div>
    </div>
  );
}

export default function Homework20260829({ onOpenLatest, onOpenHomework3, onOpenHomework2, onOpenHomework1, darkMode, toggleDarkMode }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('notes');
  const [progress, setProgress] = useState({});
  const [mistakes, setMistakes] = useState({});

  useEffect(() => {
    fetch(DATA_URL).then(r => { if (!r.ok) throw new Error(`Homework data returned ${r.status}`); return r.json(); }).then(setData).catch(e => setError(e.message));
    try {
      const p = localStorage.getItem(PROGRESS_KEY);
      const m = localStorage.getItem(MISTAKE_KEY);
      if (p) setProgress(JSON.parse(p));
      if (m) setMistakes(JSON.parse(m));
    } catch (_) {}
  }, []);

  const complete = (section, score, total, answers, questions) => {
    const next = { ...progress, [section]: { score, total } };
    setProgress(next);
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch (_) {}
    if (questions.length) {
      const nextMistakes = { ...mistakes };
      questions.forEach((q, i) => {
        const key = `${section}-${i}`;
        if (answers[i] && answers[i] !== q.a) nextMistakes[key] = { q: q.q, a: q.a };
        else if (answers[i] === q.a) delete nextMistakes[key];
      });
      setMistakes(nextMistakes);
      try { localStorage.setItem(MISTAKE_KEY, JSON.stringify(nextMistakes)); } catch (_) {}
    }
  };

  const completed = Object.keys(progress).length;
  const totalSections = 9;
  const pct = Math.round((completed / totalSections) * 100);
  const tabs = [
    ['notes', 'Lesson Notes', BookOpen], ['grammar', 'Grammar', PenTool], ['vocabulary', 'Vocabulary', Sparkles],
    ['practice', 'Word Order', PenTool], ['conversation', 'Conversation', MessageCircle], ['reading', 'Reading', BookOpen],
    ['listening', 'Listening', Headphones], ['writing', 'Writing', PenTool], ['quiz', 'Final Quiz', Star]
  ];

  if (error) return <div className="min-h-screen p-10 bg-stone-50 dark:bg-slate-900 text-rose-700">Could not load this homework: {error}</div>;
  if (!data) return <div className="min-h-screen grid place-items-center bg-stone-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">Loading Eugenia's homework…</div>;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white"><BookOpen className="w-5 h-5"/></div><div><div className="font-extrabold">Eugenia's Homework Workspace</div><div className="text-xs text-stone-500 dark:text-slate-400">Homework 4 · {data.dateLabel}</div></div></div>
          <div className="flex gap-2 items-center flex-wrap">
            <button onClick={onOpenLatest} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold">Homework 5 <span className="ml-1 text-[10px] uppercase bg-white/20 px-2 py-1 rounded-full">Latest</span></button>
            <button className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-600 text-xs font-bold bg-white dark:bg-slate-800">Homework 4 · 29 Aug</button>
            <button onClick={onOpenHomework3} className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-600 text-xs font-bold bg-white dark:bg-slate-800">Homework 3 · 25 Aug</button>
            <button onClick={onOpenHomework2} className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-600 text-xs font-bold bg-white dark:bg-slate-800">Homework 2 · 21 Aug</button>
            <button onClick={onOpenHomework1} className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-600 text-xs font-bold bg-white dark:bg-slate-800">Homework 1 · 18 Aug</button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-stone-500 dark:text-slate-300" aria-label="Toggle dark mode">{darkMode ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="rounded-3xl p-8 md:p-10 mb-8 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/30 border border-blue-100 dark:border-blue-900">
          <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
            <div><div className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-300 mb-3">Lesson-based practice</div><h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-4">{data.title}</h1><p className="text-lg text-stone-600 dark:text-slate-300 max-w-3xl">{data.subtitle}</p></div>
            <div className="shrink-0 w-36 text-center p-5 rounded-2xl bg-white/80 dark:bg-slate-800 border border-white dark:border-slate-700"><div className="text-3xl font-black">{pct}%</div><div className="text-xs font-bold uppercase text-stone-500">{completed}/{totalSections} sections</div></div>
          </div>
        </div>

        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 mb-10 p-2 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
          {tabs.map(([id, label, Icon]) => <button key={id} onClick={() => { setTab(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${tab === id ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'hover:bg-stone-50 dark:hover:bg-slate-700'}`}><Icon className="w-4 h-4"/>{label}{progress[id] && <CheckCircle className="w-3 h-3 text-emerald-400"/>}</button>)}
        </nav>

        {tab === 'notes' && <div className="space-y-7"><div className="rounded-3xl p-7 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"><h2 className="text-2xl font-extrabold font-serif mb-3">What this lesson explored</h2><p>Review the conversation themes first, then use the other tabs for focused practice.</p></div>{data.lessonNotes.map((note, i) => <div key={note} className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex gap-4"><div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 grid place-items-center font-black text-blue-700 dark:text-blue-300">{i + 1}</div><p className="leading-relaxed">{note}</p></div>)}<button onClick={() => complete('notes', 1, 1, {}, [])} className="px-7 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold">Mark notes complete</button></div>}

        {tab === 'grammar' && <div className="space-y-6">{data.grammar.map(item => <section key={item.title} className="rounded-3xl p-6 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700"><h3 className="text-2xl font-extrabold font-serif mb-3">{item.title}</h3><p className="leading-relaxed mb-5">{item.rule}</p><div className="grid md:grid-cols-3 gap-3">{item.examples.map(ex => <div key={ex} className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 font-semibold">{ex}</div>)}</div></section>)}<div className="grid md:grid-cols-2 gap-5"><div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800"><h3 className="font-extrabold mb-2">Remember</h3><p>{data.remember}</p></div><div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-900/15 border border-rose-200 dark:border-rose-800"><h3 className="font-extrabold mb-2">Watch Out</h3><p>{data.watchOut}</p></div></div><button onClick={() => complete('grammar', 1, 1, {}, [])} className="px-7 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold">Mark grammar complete</button></div>}

        {tab === 'vocabulary' && <div className="space-y-5"><div className="grid md:grid-cols-2 gap-5">{data.vocabulary.map(item => <article key={item.word} className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700"><h3 className="text-xl font-extrabold text-blue-700 dark:text-blue-300">{item.word}</h3><p className="mt-2">{item.meaning}</p><p className="mt-3 text-sm italic text-stone-500 dark:text-slate-400">{item.example}</p></article>)}</div><button onClick={() => complete('vocabulary', 1, 1, {}, [])} className="px-7 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold">Mark vocabulary complete</button></div>}

        {tab === 'practice' && <QuestionSet questions={data.wordOrder} section="practice" onComplete={complete} saved={!!progress.practice}/>} 
        {tab === 'conversation' && <div className="space-y-7"><div className="rounded-3xl p-7 bg-violet-50 dark:bg-violet-900/15 border border-violet-200 dark:border-violet-800"><MessageCircle className="w-7 h-7 mb-3 text-violet-600"/><h2 className="text-2xl font-extrabold font-serif mb-2">Five-exchange situational conversation</h2><p>Choose the best answer at every turn. Keep the conversation friendly, natural and grammatically complete.</p></div><QuestionSet questions={data.conversation} section="conversation" onComplete={complete} saved={!!progress.conversation}/></div>}

        {tab === 'reading' && <div className="space-y-8"><div className="rounded-3xl p-7 md:p-10 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700"><div className="text-xs font-black uppercase tracking-widest text-rose-600 mb-2">{data.reading.level} reading</div><h2 className="text-3xl font-extrabold font-serif mb-6">{data.reading.title}</h2><p className="whitespace-pre-line text-lg leading-loose font-serif">{data.reading.text}</p></div><QuestionSet questions={data.reading.questions} section="reading" onComplete={complete} saved={!!progress.reading}/></div>}

        {tab === 'listening' && <div className="space-y-8"><div className="rounded-3xl p-7 bg-violet-50 dark:bg-violet-900/15 border border-violet-200 dark:border-violet-800"><Volume2 className="w-8 h-8 text-violet-600 mb-3"/><h2 className="text-3xl font-extrabold font-serif mb-2">{data.listening.title}</h2><p className="font-bold mb-2">{data.listening.source} · {data.listening.level}</p><p className="mb-5">{data.listening.instructions}</p><a href={data.listening.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-bold">Open listening lesson <ExternalLink className="w-4 h-4"/></a></div><QuestionSet questions={data.listening.questions} section="listening" onComplete={complete} saved={!!progress.listening}/></div>}

        {tab === 'writing' && <WritingTask task={data.writing} onComplete={complete} saved={!!progress.writing}/>} 
        {tab === 'quiz' && <div className="space-y-8"><div className="rounded-3xl p-7 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800"><h2 className="text-2xl font-extrabold font-serif mb-2">Final Quiz</h2><p>20 mixed, slightly tricky questions. Aim for at least 16/20.</p></div><QuestionSet questions={data.quiz} section="quiz" onComplete={complete} saved={!!progress.quiz} label="Submit quiz"/></div>}

        {Object.keys(mistakes).length > 0 && !['notes','grammar','vocabulary','writing'].includes(tab) && <div className="mt-12 rounded-3xl p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30"><h3 className="font-extrabold flex items-center gap-2 mb-4"><ClipboardCheck className="w-5 h-5"/>Mistake Review</h3><div className="grid md:grid-cols-2 gap-3">{Object.values(mistakes).slice(0, 8).map((m, i) => <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-rose-100 dark:border-slate-700"><div className="text-sm mb-2">{m.q}</div><div className="font-bold text-emerald-700 dark:text-emerald-400">✓ {m.a}</div></div>)}</div></div>}
      </main>
    </div>
  );
}
