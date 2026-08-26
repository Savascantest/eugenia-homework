import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LatestHomework from './LatestHomework';
import Homework20260825 from './Homework20260825';
import { 
  BookOpen, PenTool, Headphones, Star, 
  CheckCircle, ArrowLeft, Eye, EyeOff, Volume2, AlertCircle,
  ChevronDown, ChevronUp, RefreshCw, Lightbulb, Pause, Play, ExternalLink, Settings,
  Search
} from 'lucide-react';

// --- DATA ARCHITECTURE ---
const HOMEWORK_DATA = {
  grammar: {
    title: "Present Simple vs Present Continuous",
    icon: <PenTool className="w-6 h-6" />,
    color: "emerald",
    content: {
      intro: "Let's review the difference between what happens regularly and what is happening right now.",
      presentSimple: {
        title: "Present Simple",
        use: ["routines", "habits", "repeated actions", "general facts", "usual situations"],
        examples: [
          "I walk my dog every day.",
          "I spend time with my family in the evening.",
          "I see my friends twice a week.",
          "I ride my horse regularly.",
          "She works every day."
        ],
        rule: "I / you / we / they → work\nHe / she / it → works",
        negative: "I don't work.\nShe doesn't work.",
        question: "Do you work?\nDoes she work?"
      },
      presentContinuous: {
        title: "Present Continuous",
        use: ["something happening now", "something happening around now", "temporary situations"],
        examples: [
          "I am studying English now.",
          "She is riding her horse.",
          "They are having dinner.",
          "I am talking to my teacher."
        ],
        rule: "am / is / are + verb-ing",
      },
      contrast: {
        title: "IMPORTANT CONTRAST",
        pairs: [
          {
            q: "What do you do?",
            meaning: "Asks about someone's normal activity or job.",
            ex: '"I work with horses."'
          },
          {
            q: "What are you doing?",
            meaning: "Asks about what is happening right now.",
            ex: '"I\'m doing my English homework."'
          }
        ]
      },
      exercises: [
        { blockTitle: "Practice 1: Present Simple or Continuous?", type: "MC", q: "I usually ______ at 7:00 AM.", opt: ["wake up", "am waking up"], a: "wake up", hint: { type: "hint", text: "Look for a routine expression like 'usually'." } },
        { type: "MC", q: "Look! The dogs ______ in the garden.", opt: ["play", "are playing"], a: "are playing", hint: { type: "hint", text: "The word 'Look!' means it is happening right now." } },
        { type: "MC", q: "She ______ to the clinic every weekday.", opt: ["drives", "is driving"], a: "drives", errCat: "present_simple" },
        
        { blockTitle: "Practice 2: Questions & Negatives", type: "MC", q: "______ you like your job?", opt: ["Are", "Do", "Does"], a: "Do", errCat: "do_does" },
        { type: "GAP", before: "She", after: "not work on Sundays. (Present Simple)", a: "does", hint: { type: "remember", text: "Use 'does' for he/she/it in negative routines." }, errCat: "do_does" },
        { type: "MC", q: "Where ______ she going right now?", opt: ["does", "is", "are"], a: "is", errCat: "am_is_are" },
        
        { blockTitle: "Practice 3: What do you do? vs What are you doing?", type: "MC", q: "Someone asks: 'What do you do?' What is the best answer?", opt: ["I am a manager.", "I am reading a book."], a: "I am a manager.", errCat: "routine_vs_now", hint: { type: "difference", text: "'What do you do?' asks about your job or general life." } },
        { type: "GAP", before: "Question: What", after: "you doing? - Answer: I'm making dinner.", a: "are", errCat: "am_is_are" },
        
        { blockTitle: "Practice 4: Correct the Mistake", type: "MC", q: "Choose the CORRECT sentence:", opt: ["She don't like lazy people.", "She doesn't like lazy people.", "She doesn't likes lazy people."], a: "She doesn't like lazy people.", errCat: "third_person_s", hint: { type: "remember", text: "After 'does' or 'doesn't', always use the base verb (no -s)." } },
        { type: "MC", q: "Choose the CORRECT sentence:", opt: ["I working right now.", "I am working right now.", "I am work right now."], a: "I am working right now.", errCat: "missing_ing" }
      ]
    }
  },
  vocabulary: {
    title: "Describing People & Personality",
    icon: <BookOpen className="w-6 h-6" />,
    color: "blue",
    content: {
      flashcards: [
        { w: "honest", def: "Always tells the truth.", ex: "I like him because he is completely honest.", syn: ["truthful", "sincere"] },
        { w: "easygoing", def: "Relaxed, flexible, doesn't worry much.", ex: "'Where should we eat?' 'I don't mind. I'm easygoing.'", syn: ["relaxed", "laid-back"] },
        { w: "silly", def: "Not serious or sensible (softer than stupid).", ex: "He told a silly joke that made us laugh.", syn: ["funny", "foolish"] },
        { w: "sensitive", def: "Easily affected by feelings, or easily irritated (like skin).", ex: "She is very sensitive and cries at movies.", syn: ["emotional", "delicate"] },
        { w: "jealous", def: "Upset when someone you love pays attention to others.", ex: "He gets jealous when his girlfriend talks to her ex.", syn: ["possessive"] },
        { w: "arrogant", def: "Thinks they are better than other people.", ex: "He is so arrogant; he never listens to anyone.", syn: ["conceited", "proud"] },
        { w: "annoying", def: "Making you feel slightly angry.", ex: "That loud music is very annoying.", syn: ["irritating", "bothersome"] },
        { w: "generous", def: "Happy to give money, time, or help.", ex: "She is generous with her time and helps me study.", syn: ["giving", "kind-hearted"] },
        { w: "charming", def: "Pleasant and attractive; makes people like them.", ex: "He is very charming and polite.", syn: ["appealing", "sweet"] },
        { w: "smart", def: "Intelligent.", ex: "She is smart and learns quickly.", syn: ["intelligent", "clever"] },
        { w: "confident", def: "Believing in your own ability.", ex: "She is confident she will win the competition.", syn: ["self-assured", "bold"] },
        { w: "big-hearted", def: "Very kind and generous to others.", ex: "My mother is big-hearted and loves helping animals.", syn: ["kind", "generous"] },
        { w: "lazy", def: "Not wanting to work or be active.", ex: "I feel lazy today. I just want to sleep.", syn: ["inactive", "sluggish"] },
        { w: "hardworking", def: "Putting a lot of effort into work.", ex: "She is hardworking and trains every day.", syn: ["diligent", "industrious"] }
      ],
      differences: [
        { title: "SMART vs CONFIDENT", text: "Smart = Intelligent (She knows a lot). Confident = Believes in their own ability (She believes she can do it)." },
        { title: "JEALOUS vs ENVIOUS", text: "Jealous = Usually involves relationships or fear of losing attention. Envious = Wishing you had a thing that someone else has (e.g., a nice car)." },
        { title: "GENEROUS", text: "Not just about money! You can be generous with your money, generous with your time, or generous with your help." },
        { title: "EASYGOING", text: "Relaxed and flexible. If you ask an easygoing person where to go, they often say, 'I don't mind.'" }
      ],
      exercises: [
        { blockTitle: "Practice 1: Match the Definition", type: "MATCH_CHIPS", pairs: [{l: "easygoing", r: "relaxed and flexible"}, {l: "smart", r: "intelligent"}, {l: "arrogant", r: "thinks they are the best"}, {l: "generous", r: "gives time or money"}] },
        { blockTitle: "Practice 2: Choose the Adjective", type: "MC", q: "Maria never stresses about plans. If you change the restaurant, she says, 'I don't mind!' Maria is:", opt: ["arrogant", "sensitive", "easygoing"], a: "easygoing" },
        { type: "MC", q: "John always brings a smile to the room. He says funny, un-serious things to make us laugh. He is:", opt: ["silly", "jealous", "lazy"], a: "silly" },
        { blockTitle: "Practice 3: Confident vs Smart", type: "GAP", before: "She studies a lot and understands complex math. She is very", after: ".", a: "smart", hint: { type: "difference", text: "Intelligence vs. Self-belief." } },
        { type: "GAP", before: "She isn't afraid to speak in front of 100 people. She is very", after: ".", a: "confident" },
        { blockTitle: "Practice 4: Opposites", type: "MATCH_CHIPS", pairs: [{l: "lazy", r: "hardworking"}, {l: "polite", r: "rude"}, {l: "confident", r: "insecure"}] },
        { blockTitle: "Practice 5: In Context", type: "MC", q: "What does 'I don't mind' mean?", opt: ["I hate it.", "Either choice is fine with me.", "I am very smart."], a: "Either choice is fine with me." },
        { type: "GAP", before: "We found a dog with no home on the street. It was a", after: "dog.", a: "stray" }
      ]
    }
  },
  reading: {
    title: "Reading: Clara's Weekend",
    icon: <BookOpen className="w-6 h-6" />,
    color: "rose",
    content: {
      text: "Clara is a very energetic and big-hearted woman. She lives in a small house with her two stray dogs, Max and Bella. Clara is a vet. She works at an animal clinic every day. Her routine is usually the same. She wakes up at 6:00 AM, walks the dogs, and has a quick breakfast. She starts work at 8:00 AM. Clara is very hardworking, but she is also easygoing. When her friends change plans at the last minute, she always says, 'I don't mind!'\n\nBut today is different. Today is Saturday, and Clara isn't working at the clinic. Right now, she is organizing a special adoption event for stray animals in the park. She is setting up tables and talking to people. She is wearing a bright blue t-shirt. Her friends are helping her. They are playing with the dogs and answering questions.\n\nClara is a very confident person when she works with animals, but sometimes she feels a little shy when she speaks to large groups of people. However, today she is smiling and charming everyone she meets. A generous man is donating money to the clinic right now, and Clara feels very happy. She loves her daily routine, but she enjoys these special weekend events even more.",
      targetWords: ["energetic", "big-hearted", "stray dogs", "wakes up", "walks", "starts", "hardworking", "easygoing", "I don't mind", "isn't working", "is organizing", "is setting up", "is wearing", "are helping", "are playing", "confident", "charming", "generous"],
      exercises: [
        { blockTitle: "Comprehension Check", type: "TF", q: "Clara usually starts work at 8:00 AM.", a: "True" },
        { type: "TF", q: "Clara gets angry when her friends change plans.", a: "False", hint: { type: "hint", text: "Look for the word 'easygoing' in the text." } },
        { type: "MC", q: "What is Clara doing right now?", opt: ["She is working at the clinic.", "She is organizing an event in the park.", "She is sleeping."], a: "She is organizing an event in the park." },
        { type: "MC", q: "How is Clara feeling about speaking to large groups today?", opt: ["She is being arrogant.", "She is smiling and charming everyone.", "She is very lazy."], a: "She is smiling and charming everyone." },
        { blockTitle: "Vocabulary in Context", type: "GAP", before: "Clara helps animals without a home. The text calls them", after: "animals.", a: "stray" },
        { type: "MC", q: "A man is giving money to the clinic. The text describes him as...", opt: ["jealous", "generous", "silly"], a: "generous" }
      ]
    }
  },
  listening: {
    title: "Listening: Family Traits",
    source: "ELLLO.org (English Listening Lesson Library Online)",
    level: "A2",
    duration: "1 min 30 sec",
    url: "https://www.elllo.org/english/0651/T696-AJ-Traits.htm",
    icon: <Headphones className="w-6 h-6" />,
    color: "violet",
    content: {
      script: "Todd: Adrienne, we are talking about your family. Can you describe the people in your family? Like, what's your mother like, and your father like and your sister?\n\nAdrienne: OK, well, let me start with my mother. She has a great sense of humor and she's a very kind woman, very generous woman. She's also not afraid to say what she is thinking.\n\nTodd: What about your father? How would you describe your dad?\n\nAdrienne: My dad is probably the nicest man you'll ever meet. He's very kind, very generous, very warm-hearted and he's really a good guy and I love him very much.\n\nTodd: And actually I met your father and he's a very big guy.\n\nAdrienne: He is. Which means he has a very big heart.\n\nTodd: OK, now you have a sister. Is she younger or older?\n\nAdrienne: Younger sister.\n\nTodd: How would you describe her personality?\n\nAdrienne: My sister is actually quite similar to my dad in that she has a very good heart and she's very generous and very open, very friendly. And she is probably the only person on the planet who can make me laugh at any moment.",
      exercises: [
        { blockTitle: "Before you listen", type: "MC", q: "What do you think Adrienne will talk about?", opt: ["Her job", "Her family's personalities", "Her pets"], a: "Her family's personalities" },
        { blockTitle: "Comprehension: Who is it?", type: "MC", q: "Who does Adrienne say is 'a very big guy' with a 'big heart'?", opt: ["Her father", "Her brother", "Todd"], a: "Her father", category: "listening" },
        { type: "TF", q: "Adrienne's mother is very generous.", a: "True", category: "listening" },
        { type: "MC", q: "How does Adrienne describe her younger sister?", opt: ["Lazy and annoying", "Generous, friendly, and funny", "Arrogant and smart"], a: "Generous, friendly, and funny", category: "listening" },
        { blockTitle: "Vocabulary in context", type: "GAP", before: "Adrienne's father is 'warm-hearted'. This means he is very", after: "and kind.", a: "generous", hint: { type: "hint", text: "Look for another word that means kind and giving." }, category: "vocab" }
      ]
    }
  },
  quiz: {
    title: "Final Homework Quiz",
    icon: <Star className="w-6 h-6" />,
    color: "amber",
    content: {
      exercises: [
        // Vocab (8)
        { q: "A person who thinks they are better than everyone else.", opt: ["smart", "arrogant", "easygoing"], a: "arrogant", type: "MC", category: "vocab" },
        { q: "A dog or cat without a home.", opt: ["silly animal", "stray animal", "jealous animal"], a: "stray animal", type: "MC", category: "vocab" },
        { q: "She gives her time to help younger students. She is...", opt: ["generous", "annoying", "lazy"], a: "generous", type: "MC", category: "vocab" },
        { q: "Someone who believes in their own ability is...", opt: ["sensitive", "smart", "confident"], a: "confident", type: "MC", category: "vocab" },
        { q: "He cries easily when watching sad movies. He is...", opt: ["energetic", "sensitive", "polite"], a: "sensitive", type: "MC", category: "vocab" },
        { q: "Which phrase means 'Either choice is fine with me'?", opt: ["I don't mind.", "I am jealous.", "I am smart."], a: "I don't mind.", type: "MC", category: "vocab" },
        { q: "I wish I had her beautiful new car! I feel...", opt: ["jealous", "envious", "silly"], a: "envious", type: "MC", category: "vocab" },
        { q: "The opposite of 'lazy' is...", opt: ["hardworking", "rude", "charming"], a: "hardworking", type: "MC", category: "vocab" },
        
        // Grammar (8)
        { q: "I ______ coffee every morning.", opt: ["drink", "am drinking", "drinks"], a: "drink", type: "MC", category: "grammar", errCat: "routine_vs_now" },
        { q: "Shh! The baby ______ right now.", opt: ["sleeps", "is sleeping", "sleep"], a: "is sleeping", type: "MC", category: "grammar", errCat: "routine_vs_now" },
        { q: "______ she work at the hospital?", opt: ["Do", "Does", "Is"], a: "Does", type: "MC", category: "grammar", errCat: "do_does" },
        { q: "What ______ you doing?", opt: ["do", "does", "are"], a: "are", type: "MC", category: "grammar", errCat: "am_is_are" },
        { q: "Someone asks: 'What do you do?' What do they want to know?", opt: ["What you are doing right now.", "What your job/routine is."], a: "What your job/routine is.", type: "MC", category: "grammar", errCat: "meaning" },
        { before: "I", after: "not studying today. It's Sunday.", a: "am", type: "GAP", category: "grammar", errCat: "am_is_are" },
        { before: "She", after: "not like arrogant people. (Present Simple)", a: "does", type: "GAP", category: "grammar", errCat: "do_does" },
        { q: "My brother usually ______ dinner on Fridays.", opt: ["cook", "cooks", "is cooking"], a: "cooks", type: "MC", category: "grammar", errCat: "third_person_s" },

        // Sentence Correction (4)
        { q: "Find the CORRECT sentence:", opt: ["She don't work on Sunday.", "She doesn't works on Sunday.", "She doesn't work on Sunday."], a: "She doesn't work on Sunday.", type: "MC", category: "grammar", errCat: "do_does" },
        { q: "Find the CORRECT sentence:", opt: ["I am work right now.", "I working right now.", "I am working right now."], a: "I am working right now.", type: "MC", category: "grammar", errCat: "missing_ing" },
        { q: "Find the CORRECT question:", opt: ["What you are doing?", "What are you doing?", "What doing you are?"], a: "What are you doing?", type: "MC", category: "grammar", errCat: "question_order" },
        { q: "Find the CORRECT sentence:", opt: ["He plays tennis every day.", "He play tennis every day.", "He is play tennis every day."], a: "He plays tennis every day.", type: "MC", category: "grammar", errCat: "third_person_s" },

        // Reading/Listening Comprehension & Review (5)
        { q: "In the reading, Clara usually works at a clinic, but TODAY she is...", opt: ["sleeping.", "organizing a park event.", "working at the clinic."], a: "organizing a park event.", type: "MC", category: "reading" },
        { q: "In the reading, how did Clara react to the large group of people today?", opt: ["She was arrogant.", "She smiled and was charming.", "She went home."], a: "She smiled and was charming.", type: "MC", category: "reading" },
        { q: "In the listening, Adrienne said her father takes up a lot of space, which means he is a...", opt: ["big guy.", "lazy guy.", "sensitive guy."], a: "big guy.", type: "MC", category: "listening" },
        { q: "In the listening, who can make Adrienne laugh?", opt: ["Her mother", "Her father", "Her younger sister"], a: "Her younger sister", type: "MC", category: "listening" },
        { q: "Which term means belief in your own abilities?", opt: ["self-confidence", "arrogance", "sensitivity"], a: "self-confidence", type: "MC", category: "vocab" }
      ]
    }
  }
};

// --- REUSABLE COMPONENTS ---

// Hint System
function Hint({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!data) return null;
  
  let icon = <Lightbulb className="w-4 h-4" />;
  let label = "Hint";
  let colorClass = "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50";
  let contentBg = "bg-amber-50/50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800";

  if (data.type === 'remember') {
    icon = <PenTool className="w-4 h-4" />;
    label = "Remember";
    colorClass = "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/50";
    contentBg = "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800";
  } else if (data.type === 'difference') {
    icon = <Search className="w-4 h-4" />;
    label = "What's the difference?";
    colorClass = "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/50";
    contentBg = "bg-blue-50/50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800";
  }

  return (
    <div className="mt-3 text-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${colorClass}`}
      >
        {icon} {label} {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {isOpen && (
        <div className={`mt-2 p-3 rounded-xl border ${contentBg} animate-in fade-in slide-in-from-top-1 text-slate-700 dark:text-slate-300`}>
          {data.text}
        </div>
      )}
    </div>
  );
}

// Text-to-Speech Player
function AudioPlayer({ text, isTranscriptOpen, setIsTranscriptOpen, buttonText = "Listen to Audio" }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [isPlaying, text]);

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <button 
        onClick={handlePlayPause}
        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />} 
        {isPlaying ? "Pause" : buttonText}
      </button>
      
      {setIsTranscriptOpen && (
        <button 
          onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
          className="text-stone-500 hover:text-slate-800 dark:text-stone-400 dark:hover:text-white font-bold text-sm flex items-center gap-1 transition-colors"
        >
          {isTranscriptOpen ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          {isTranscriptOpen ? "Hide Transcript" : "Show Transcript"}
        </button>
      )}
    </div>
  );
}

// Clickable Match Chips
function MatchChipsEngine({ pairs, onChange, disabled, val, isChecked }) {
  const { shuffledLeft, shuffledRight } = useMemo(() => {
    const lefts = pairs.map(p => ({ text: p.l, id: p.l }));
    const rights = pairs.map(p => ({ text: p.r, id: p.l }));
    const shuffle = (array) => array.slice().sort(() => Math.random() - 0.5);
    return { shuffledLeft: shuffle(lefts), shuffledRight: shuffle(rights) };
  }, [pairs]);

  const [matches, setMatches] = useState(val || []);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);

  useEffect(() => {
    if (val && val.length === 0) { setMatches([]); setSelectedLeft(null); setSelectedRight(null); }
  }, [val]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft.id === selectedRight.id) {
        const newMatches = [...matches, { l: selectedLeft.text, r: selectedRight.text }];
        setMatches(newMatches);
        onChange(newMatches);
      }
      setTimeout(() => { setSelectedLeft(null); setSelectedRight(null); }, 300);
    }
  }, [selectedLeft, selectedRight, matches, onChange]);

  const isMatchedLeft = (text) => matches.some(m => m.l === text);
  const isMatchedRight = (text) => matches.some(m => m.r === text);

  return (
    <div className="grid grid-cols-2 gap-4 relative mt-4">
       {isChecked && matches.length === pairs.length && (
         <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
            <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm border border-emerald-200">
               <CheckCircle className="w-5 h-5"/> All Matched
            </div>
         </div>
       )}
       
       <div className="space-y-3">
         {shuffledLeft.map(item => (
           <button
             key={item.text} onClick={() => !disabled && !isMatchedLeft(item.text) && setSelectedLeft(item)} disabled={disabled || isMatchedLeft(item.text)}
             className={`w-full p-4 rounded-xl font-bold text-left border transition-all duration-200 shadow-sm
               ${isMatchedLeft(item.text) ? 'bg-stone-100 text-stone-400 border-stone-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' : 
                 selectedLeft?.text === item.text ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900' : 
                 'bg-white text-slate-800 border-stone-300 hover:border-blue-400 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700'}`}
           >
             {item.text}
           </button>
         ))}
       </div>
       <div className="space-y-3">
         {shuffledRight.map(item => (
           <button
             key={item.text} onClick={() => !disabled && !isMatchedRight(item.text) && setSelectedRight(item)} disabled={disabled || isMatchedRight(item.text)}
             className={`w-full p-4 rounded-xl font-bold text-left border transition-all duration-200 shadow-sm
               ${isMatchedRight(item.text) ? 'bg-stone-100 text-stone-400 border-stone-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' : 
                 selectedRight?.text === item.text ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900' : 
                 'bg-white text-slate-800 border-stone-300 hover:border-blue-400 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700'}`}
           >
             {item.text}
           </button>
         ))}
       </div>
    </div>
  )
}

// Core Exercise Engine (Used across all sections)
function ExerciseEngine({ exercises, hideSubmit = false, onAnswersChange = null, recordMistake, activeIndices = null }) {
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle'); // idle, checked

  const handleChange = (index, value) => {
    const newAnswers = { ...answers, [index]: value };
    setAnswers(newAnswers);
    if (onAnswersChange) onAnswersChange(newAnswers);
    if (status === 'checked') setStatus('idle');
  };

  const handleCheck = () => {
    setStatus('checked');
    // Log mistakes
    exercises.forEach((ex, idx) => {
      // If we are passing specific active indices (like in Retry mode), only check those
      if (activeIndices && !activeIndices.includes(idx)) return;

      if (ex.type === 'MC' || ex.type === 'GAP' || ex.type === 'TF') {
         const isCorrect = answers[idx] && answers[idx].trim().toLowerCase() === ex.a.toLowerCase();
         if (!isCorrect && answers[idx] && recordMistake) {
            recordMistake(ex.q || ex.before + " ___ " + ex.after, ex.a, ex.category || 'general');
         }
      }
    });
  };
  
  const handleReset = () => { 
    if (activeIndices) {
      // Only reset the currently active ones
      const newAnswers = {...answers};
      activeIndices.forEach(idx => delete newAnswers[idx]);
      setAnswers(newAnswers);
    } else {
      setAnswers({}); 
    }
    setStatus('idle'); 
  };

  return (
    <div className="space-y-8">
      {exercises.map((ex, idx) => {
         // Skip rendering if we provided an activeIndices filter and this isn't in it
         if (activeIndices && !activeIndices.includes(idx)) return null;

         const val = answers[idx];
         let isCorrect = false;
         
         if (status === 'checked') {
           if (ex.type === 'MATCH_CHIPS') {
             isCorrect = val && Array.isArray(val) && val.length === ex.pairs.length;
           } else {
             isCorrect = val && val.trim().toLowerCase() === ex.a.toLowerCase();
           }
         }

         return (
           <div key={idx} className="space-y-4">
              {ex.blockTitle && <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-stone-200 dark:border-slate-700 pb-2 mt-8 first:mt-0">{ex.blockTitle}</h3>}
              
              <div className={`p-5 bg-white dark:bg-slate-800 border rounded-2xl transition-colors ${status === 'checked' ? (isCorrect ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-900/10' : 'border-rose-300 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-900/10') : 'border-stone-200 dark:border-slate-700 shadow-sm'}`}>
                {ex.q && <p className="font-medium text-slate-800 dark:text-slate-200 mb-4">{idx + 1}. {ex.q}</p>}
                
                {ex.type === 'MC' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ex.opt.map(o => (
                      <label key={o} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer min-h-[48px] transition-colors ${val === o ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-700'}`}>
                        <input type="radio" checked={val === o} onChange={() => handleChange(idx, o)} disabled={status === 'checked'} className="w-4 h-4 text-blue-600 accent-blue-600" />
                        <span className="text-base text-slate-800 dark:text-slate-200 font-medium leading-tight">{o}</span>
                      </label>
                    ))}
                  </div>
                )}

                {ex.type === 'GAP' && (
                  <div className="text-lg leading-loose text-slate-800 dark:text-slate-200">
                    <span className="mr-2 text-stone-400 text-sm font-bold">{idx + 1}.</span>
                    {ex.before}
                    <input
                      type="text" value={val || ''} onChange={(e) => handleChange(idx, e.target.value)} disabled={status === 'checked'}
                      className={`mx-2 min-h-[40px] px-3 border-b-2 bg-stone-50 dark:bg-slate-900 font-bold focus:outline-none focus:bg-white dark:focus:bg-slate-800 rounded-t w-32 md:w-48 transition-colors ${status === 'checked' ? (isCorrect ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/20') : 'border-blue-300 dark:border-blue-700 focus:border-blue-600 dark:focus:border-blue-400 text-blue-900 dark:text-blue-100'}`}
                    />
                    {ex.after}
                  </div>
                )}

                {ex.type === 'TF' && (
                  <div className="flex gap-4">
                    {['True', 'False'].map(o => (
                      <label key={o} className={`flex items-center justify-center gap-2 p-3 rounded-xl border flex-1 cursor-pointer min-h-[48px] transition-colors ${val === o ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-stone-200 dark:border-slate-600 hover:bg-stone-50 dark:hover:bg-slate-700'}`}>
                        <input type="radio" checked={val === o} onChange={() => handleChange(idx, o)} disabled={status === 'checked'} className="w-4 h-4 text-blue-600 accent-blue-600"/>
                        <span className="font-bold text-base text-slate-800 dark:text-slate-200">{o}</span>
                      </label>
                    ))}
                  </div>
                )}

                {ex.type === 'MATCH_CHIPS' && (
                  <MatchChipsEngine pairs={ex.pairs} onChange={(v) => handleChange(idx, v)} disabled={status === 'checked'} val={val} isChecked={status === 'checked'} />
                )}

                {/* Show Hints if available */}
                {ex.hint && <Hint data={ex.hint} />}

                {status === 'checked' && !isCorrect && ex.type !== 'PROD' && (
                  <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200 text-sm rounded-xl flex items-start gap-2 border border-rose-100 dark:border-rose-800/30">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Not quite right.</p>
                      {/* For non-quiz environments, give them the answer to learn */}
                      {!hideSubmit && <p>The correct answer is: <span className="font-bold">{ex.a}</span></p>}
                    </div>
                  </div>
                )}
                {status === 'checked' && isCorrect && !hideSubmit && (
                   <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 text-sm rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/30">
                     <CheckCircle className="w-5 h-5 shrink-0" /> <span className="font-bold">Correct!</span>
                   </div>
                )}
              </div>
           </div>
         )
      })}

      {!hideSubmit && (
        <div className="flex flex-wrap gap-4 pt-6 border-t border-stone-200 dark:border-slate-700 mt-8">
          <button onClick={handleCheck} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 shadow-sm transition-colors">
            Check Answers
          </button>
          {status === 'checked' && (
            <button onClick={handleReset} className="bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-stone-300 dark:border-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors">
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// --- SECTION VIEWS ---

function GrammarView({ data, markCompleted, recordMistake }) {
  const c = data.content;
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-16">
      <div className="text-lg text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
        {c.intro}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Present Simple Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-stone-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">{c.presentSimple.title}</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-3">Use For</h4>
            <div className="flex flex-wrap gap-2">
              {c.presentSimple.use.map(u => <span key={u} className="bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg text-sm font-medium">{u}</span>)}
            </div>
          </div>

          <div className="mb-6">
             <h4 className="text-sm font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-3">Examples</h4>
             <ul className="space-y-2">
               {c.presentSimple.examples.map((ex, i) => <li key={i} className="flex gap-2 text-slate-800 dark:text-slate-200"><span className="text-emerald-500">•</span> {ex}</li>)}
             </ul>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-2">Form</h4>
            <div className="whitespace-pre-line font-bold text-slate-800 dark:text-slate-200 mb-4">{c.presentSimple.rule}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold mb-1">Negative</div>
                <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">{c.presentSimple.negative}</div>
              </div>
              <div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold mb-1">Question</div>
                <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">{c.presentSimple.question}</div>
              </div>
            </div>
          </div>
          
          <Hint data={{ type: 'remember', text: "After does / doesn't, use the base verb.\n✅ Does she work?\n❌ Does she works?" }} />
        </div>

        {/* Present Continuous Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-stone-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">{c.presentContinuous.title}</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-3">Use For</h4>
            <div className="flex flex-wrap gap-2">
              {c.presentContinuous.use.map(u => <span key={u} className="bg-stone-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg text-sm font-medium">{u}</span>)}
            </div>
          </div>

          <div className="mb-6">
             <h4 className="text-sm font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-3">Examples</h4>
             <ul className="space-y-2">
               {c.presentContinuous.examples.map((ex, i) => <li key={i} className="flex gap-2 text-slate-800 dark:text-slate-200"><span className="text-emerald-500">•</span> {ex}</li>)}
             </ul>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 mb-4">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-2">Form</h4>
            <div className="whitespace-pre-line font-bold text-slate-800 dark:text-slate-200">{c.presentContinuous.rule}</div>
          </div>

          <Hint data={{ type: 'remember', text: "Present Continuous needs two parts: BE + -ing verb.\n✅ She is working.\n❌ She working." }} />
        </div>
      </div>

      {/* Prominent Contrast */}
      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-3xl p-8 border border-amber-300 dark:border-amber-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-800 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <h3 className="text-2xl font-black text-amber-900 dark:text-amber-400 mb-6 flex items-center gap-2"><AlertCircle className="w-6 h-6"/> Don't Confuse These!</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {c.contrast.pairs.map((p, i) => (
             <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">"{p.q}"</div>
                <div className="text-stone-600 dark:text-slate-400 mb-4">{p.meaning}</div>
                <div className="bg-amber-50 dark:bg-slate-700 p-3 rounded-xl italic font-medium text-amber-900 dark:text-amber-100 border border-amber-100 dark:border-slate-600">Example: {p.ex}</div>
             </div>
           ))}
        </div>
      </div>

      <div className="pt-8 border-t border-stone-200 dark:border-slate-700">
         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Homework Practice</h3>
         <ExerciseEngine exercises={c.exercises} recordMistake={recordMistake} />
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={markCompleted} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold shadow-md transition-colors flex items-center gap-2">
          Mark Grammar as Complete <CheckCircle className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
}

function VocabularyView({ data, markCompleted, recordMistake }) {
  const c = data.content;
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (w) => setFlippedCards(prev => ({ ...prev, [w]: !prev[w] }));

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-16">
      
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Core Adjectives</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.flashcards.map(fc => (
              <div 
                key={fc.w} 
                className="relative w-full h-64 cursor-pointer rounded-2xl group"
                style={{ perspective: "1000px" }}
                onClick={() => toggleFlip(fc.w)}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-500 shadow-sm hover:shadow-md rounded-2xl ${flippedCards[fc.w] ? '[transform:rotateY(180deg)]' : ''}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  
                  {/* Front Face */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateX(0deg)" }}
                  >
                      <button 
                        onClick={(e) => { e.stopPropagation(); playAudio(fc.w); }}
                        className="absolute top-3 right-3 text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-10"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">{fc.w}</h3>
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 italic mb-4">"{fc.ex}"</p>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest absolute bottom-4">Click to flip</span>
                  </div>
                  
                  {/* Back Face */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-base md:text-lg mb-3">{fc.def}</p>
                      
                      {fc.syn && (
                        <div className="bg-blue-100/50 dark:bg-blue-800/30 px-4 py-2 rounded-lg mt-2 border border-blue-200/50 dark:border-blue-700/50">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Synonyms / Similar</span>
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{fc.syn.join(', ')}</span>
                        </div>
                      )}
                  </div>
                  
                </div>
              </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {c.differences.map((diff, i) => (
           <div key={i} className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <Hint data={{ type: 'difference', text: diff.text }} />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-2">{diff.title}</h4>
           </div>
        ))}
      </div>

      <div className="pt-8 border-t border-stone-200 dark:border-slate-700">
         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Homework Practice</h3>
         <ExerciseEngine exercises={c.exercises} recordMistake={(q, a) => recordMistake(q, a, 'vocab')} />
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={markCompleted} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-md transition-colors flex items-center gap-2">
          Mark Vocabulary as Complete <CheckCircle className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
}

function ReadingView({ data, markCompleted, recordMistake }) {
  const c = data.content;
  const [highlightActive, setHighlightActive] = useState(false);

  const renderText = () => {
    if (!highlightActive || !c.targetWords) return c.text;
    let highlightedText = c.text;
    const words = [...c.targetWords].sort((a,b) => b.length - a.length);
    
    words.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, '___HIGHLIGHT___$1___ENDHIGHLIGHT___');
    });

    const parts = highlightedText.split(/___HIGHLIGHT___|___ENDHIGHLIGHT___/g);
    return parts.map((part, i) => {
      if (words.some(w => w.toLowerCase() === part.toLowerCase())) {
        return <mark key={i} className="bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100 font-bold px-1 rounded mx-0.5">{part}</mark>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-16 max-w-4xl">
      <div className="bg-[#fcfaf8] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-3xl p-8 md:p-12 shadow-sm font-serif relative">
         <div className="absolute top-6 right-6">
           <button 
             onClick={() => setHighlightActive(!highlightActive)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${highlightActive ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900 dark:text-rose-100 dark:border-rose-700' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600'}`}
           >
             {highlightActive ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>} 
             {highlightActive ? 'Hide target words' : 'Highlight target words'}
           </button>
         </div>
         <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 mt-4">{data.title}</h3>
         <p className="text-lg md:text-xl text-slate-800 dark:text-slate-300 leading-loose whitespace-pre-line">
            {renderText()}
         </p>
      </div>

      <div className="pt-8 border-t border-stone-200 dark:border-slate-700">
         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Comprehension</h3>
         <ExerciseEngine exercises={c.exercises} recordMistake={(q, a) => recordMistake(q, a, 'reading')} />
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={markCompleted} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold shadow-md transition-colors flex items-center gap-2">
          Mark Reading as Complete <CheckCircle className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
}

function ListeningView({ data, markCompleted, recordMistake }) {
  const c = data.content;
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-16 max-w-4xl">
      <div className="bg-violet-900 text-violet-50 rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
         <div className="absolute right-0 top-0 w-64 h-64 bg-violet-800 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/4"></div>
         <div className="relative z-10">
           <h3 className="text-2xl md:text-3xl font-extrabold mb-3 font-serif text-white">{data.title}</h3>
           
           {data.source && (
             <div className="text-violet-200 mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-medium text-sm">
               <span>Source: {data.source}</span>
               <span className="hidden sm:inline">•</span>
               <span>Level: {data.level}</span>
               <span className="hidden sm:inline">•</span>
               <span>Length: {data.duration}</span>
             </div>
           )}
           
           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
             {data.url && (
                <a 
                  href={data.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-violet-900 hover:bg-violet-50 px-6 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" /> Listen on {data.source.split(' ')[0]}
                </a>
             )}
             
             {/* Keep TTS Fallback but style it secondary */}
             <AudioPlayer 
               text={c.script} 
               isTranscriptOpen={isTranscriptOpen} 
               setIsTranscriptOpen={setIsTranscriptOpen} 
               buttonText="Play TTS Fallback" 
             />
           </div>
         </div>
      </div>

      {isTranscriptOpen && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-stone-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-top-4">
           <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-violet-600"/> Transcript</h4>
           <p className="text-lg text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-line">{c.script}</p>
        </div>
      )}

      <div className="pt-8 border-t border-stone-200 dark:border-slate-700">
         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Comprehension</h3>
         <ExerciseEngine exercises={c.exercises} recordMistake={(q, a) => recordMistake(q, a, 'listening')} />
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={markCompleted} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl font-bold shadow-md transition-colors flex items-center gap-2">
          Mark Listening as Complete <CheckCircle className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
}

function QuizView({ data, markCompleted, recordMistake, savedScore }) {
  const c = data.content;
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [retryMode, setRetryMode] = useState(false);

  const handleSubmit = () => {
    let s = 0;
    const errors = { grammar: 0, vocab: 0, reading: 0, listening: 0 };
    const errorIndices = [];
    
    c.exercises.forEach((ex, idx) => {
      // If we are in retry mode and this question was already correct, skip checking it again and count it as correct
      if (retryMode && results && !results.errorIndices.includes(idx)) {
         s++;
         return;
      }

      const val = answers[idx];
      let isCorrect = false;
      if (val && val.trim().toLowerCase() === ex.a.toLowerCase()) isCorrect = true;
      
      if (isCorrect) {
         s++;
      } else {
         errorIndices.push(idx);
         if (ex.category) errors[ex.category]++;
         if (recordMistake && val) recordMistake(ex.q || ex.before + " ___ " + ex.after, ex.a, ex.category);
      }
    });
    
    setResults({ score: s, errors, errorIndices });
    setSubmitted(true);
    setRetryMode(false);
    markCompleted(s); // Save score
  };

  const handleRetry = () => {
    setRetryMode(true);
    setSubmitted(false);
  };

  const activeIndices = retryMode ? results.errorIndices : c.exercises.map((_, i) => i);

  if (submitted && results) {
    const accuracy = Math.round((results.score / c.exercises.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in zoom-in-95 text-center">
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
           <Star className={`w-12 h-12 ${accuracy === 100 ? 'text-yellow-400 fill-current' : 'text-amber-500 dark:text-amber-400'}`} />
        </div>
        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 font-serif">Quiz Complete</h3>
        <p className="text-2xl text-stone-600 dark:text-slate-400 mb-8">Score: <span className="font-bold text-amber-600 dark:text-amber-400">{results.score} / {c.exercises.length}</span> ({accuracy}%)</p>
        
        {accuracy < 100 && (
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-stone-200 dark:border-slate-700 shadow-sm text-left mb-8">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-500"/> Areas to Review</h4>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                 {results.errors.grammar > 0 && <li><span className="font-bold text-rose-600 dark:text-rose-400">• Grammar:</span> {results.errors.grammar} mistakes. Review Present Simple vs Continuous.</li>}
                 {results.errors.vocab > 0 && <li><span className="font-bold text-blue-600 dark:text-blue-400">• Vocabulary:</span> {results.errors.vocab} mistakes. Review personality adjectives.</li>}
                 {results.errors.reading > 0 && <li><span className="font-bold text-emerald-600 dark:text-emerald-400">• Reading:</span> {results.errors.reading} mistakes.</li>}
                 {results.errors.listening > 0 && <li><span className="font-bold text-violet-600 dark:text-violet-400">• Listening:</span> {results.errors.listening} mistakes.</li>}
              </ul>
              
              <button onClick={handleRetry} className="mt-8 w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-sm">
                Retry Incorrect Answers
              </button>
           </div>
        )}
        
        {accuracy === 100 && (
           <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">Perfect score! Fantastic job.</p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl pb-16">
      <div className="text-lg text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800 mb-8">
        {retryMode ? "Retry the questions you missed. Take your time!" : "Complete all 25 questions. They mix grammar, vocabulary, reading, and listening concepts from this homework."}
      </div>
      
      <ExerciseEngine 
        exercises={c.exercises} 
        hideSubmit={true} 
        onAnswersChange={setAnswers} 
        activeIndices={activeIndices}
      />
      
      <div className="mt-12 flex justify-end border-t border-stone-200 dark:border-slate-700 pt-8">
         <button 
           onClick={handleSubmit} 
           disabled={Object.keys(answers).length < activeIndices.length}
           className="bg-amber-500 disabled:bg-stone-300 dark:disabled:bg-slate-700 disabled:text-stone-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-amber-600 transition-colors shadow-md text-lg w-full md:w-auto"
         >
           Submit Quiz
         </button>
      </div>
    </div>
  )
}

const SECTION_COLOR_CLASSES = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
};

// --- MAIN APP ---

export default function App() {
  const [homeworkVersion, setHomeworkVersion] = useState('homework3');
  const [currentSection, setCurrentSection] = useState('DASHBOARD'); // DASHBOARD, grammar, vocabulary, reading, listening, quiz
  const [progress, setProgress] = useState({ grammar: false, vocabulary: false, reading: false, listening: false, quizScore: null });
  const [mistakes, setMistakes] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  // Load progress & theme
  useEffect(() => {
    try {
      const savedProg = localStorage.getItem('eugenia_homework_v1_progress');
      if (savedProg) setProgress(JSON.parse(savedProg));
      
      const savedMistakes = localStorage.getItem('eugenia_homework_v1_mistakes');
      if (savedMistakes) setMistakes(JSON.parse(savedMistakes));
      
      const isDark = localStorage.getItem('eugenia_homework_dark_mode') === 'true';
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {
      console.error("Could not load data", e);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('eugenia_homework_dark_mode', newMode);
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    try { localStorage.setItem('eugenia_homework_v1_progress', JSON.stringify(newProgress)); } catch (e) {}
  };

  const recordMistake = (questionText, answerText, category = 'general') => {
    const key = questionText.slice(0, 50);
    const newMistakes = { ...mistakes, [key]: { q: questionText, a: answerText, cat: category, count: (mistakes[key]?.count || 0) + 1 } };
    setMistakes(newMistakes);
    try { localStorage.setItem('eugenia_homework_v1_mistakes', JSON.stringify(newMistakes)); } catch (e) {}
  };

  const markSectionComplete = (key, score = null) => {
    const newProg = key === 'quiz'
      ? { ...progress, quizScore: score ?? 0 }
      : { ...progress, [key]: true };
    saveProgress(newProg);
    setCurrentSection('DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate overall progress percentage
  const calcOverallProgress = () => {
    let completed = 0;
    if (progress.grammar) completed++;
    if (progress.vocabulary) completed++;
    if (progress.reading) completed++;
    if (progress.listening) completed++;
    if (progress.quizScore !== null) completed++;
    return Math.round((completed / 5) * 100);
  };

  const renderActiveSection = () => {
    const props = { 
      data: HOMEWORK_DATA[currentSection], 
      markCompleted: (score) => markSectionComplete(currentSection, typeof score === 'number' ? score : null),
      recordMistake,
      savedScore: currentSection === 'quiz' ? progress.quizScore : undefined
    };

    switch (currentSection) {
      case 'grammar': return <GrammarView {...props} />;
      case 'vocabulary': return <VocabularyView {...props} />;
      case 'reading': return <ReadingView {...props} />;
      case 'listening': return <ListeningView {...props} />;
      case 'quiz': return <QuizView {...props} />;
      default: return null;
    }
  };

  if (homeworkVersion === 'homework3') {
    return <Homework20260825 darkMode={darkMode} toggleDarkMode={toggleDarkMode} onOpenHomework2={() => { setHomeworkVersion('homework2'); window.scrollTo({ top: 0 }); }} onOpenHomework1={() => { setHomeworkVersion('previous'); setCurrentSection('DASHBOARD'); window.scrollTo({ top: 0 }); }} />;
  }

  if (homeworkVersion === 'homework2') {
    return <LatestHomework darkMode={darkMode} toggleDarkMode={toggleDarkMode} onOpenLatest={() => { setHomeworkVersion('homework3'); window.scrollTo({ top: 0 }); }} onOpenPrevious={() => { setHomeworkVersion('previous'); setCurrentSection('DASHBOARD'); window.scrollTo({ top: 0 }); }} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-stone-50 text-slate-800'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-stone-200'}`}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentSection('DASHBOARD')}>
            <div className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
               <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-tight text-lg hidden sm:block">Eugenia's Homework Workspace</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={() => { setHomeworkVersion('homework3'); setCurrentSection('DASHBOARD'); window.scrollTo({ top: 0 }); }} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold">Homework 3 <span className="hidden sm:inline">· Latest</span></button>
             <button onClick={() => { setHomeworkVersion('homework2'); setCurrentSection('DASHBOARD'); window.scrollTo({ top: 0 }); }} className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-600 text-xs sm:text-sm font-bold">Homework 2</button>
             <span className="hidden md:inline text-xs font-bold text-stone-400">Viewing Homework 1 · 18 Aug</span>
             <button onClick={toggleDarkMode} className="text-stone-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-full transition-colors">
               {darkMode ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {currentSection === 'DASHBOARD' ? (
          <div className="animate-in fade-in duration-500 space-y-10 pb-16">
            
            {/* Hero Dashboard */}
            <div className={`rounded-3xl p-8 md:p-12 shadow-sm border relative overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'}`}>
               <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}></div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Previous Homework · 18 August 2026</div><h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-serif">Homework 1</h1>
                    <p className={`text-lg mb-6 ${darkMode ? 'text-slate-300' : 'text-stone-600'}`}>Your current homework focuses on describing people and understanding routines vs. right now.</p>
                  </div>
                  
                  {/* Circular Progress Indicator */}
                  <div className="shrink-0 flex flex-col items-center">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" className={darkMode ? 'stroke-slate-700' : 'stroke-stone-200'} />
                          <circle cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * calcOverallProgress()) / 100} strokeLinecap="round" className="stroke-blue-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black">{calcOverallProgress()}%</span>
                          <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-stone-400'}`}>Done</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sections Grid */}
            <h2 className="text-2xl font-bold font-serif mb-6">Homework Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Object.entries(HOMEWORK_DATA).map(([key, data]) => {
                 const isQuiz = key === 'quiz';
                 const isCompleted = isQuiz ? progress.quizScore !== null : progress[key];
                 
                 return (
                   <button 
                     key={key}
                     onClick={() => setCurrentSection(key)}
                     className={`text-left rounded-3xl p-6 border transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg flex flex-col h-full
                       ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'}
                     `}
                   >
                     <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-2xl ${SECTION_COLOR_CLASSES[data.color]} group-hover:scale-110 transition-transform`}>
                          {data.icon}
                        </div>
                        {isCompleted && !isQuiz && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                        {isQuiz && progress.quizScore !== null && (
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-black px-3 py-1 rounded-full text-sm">
                            {progress.quizScore}/{data.content.exercises.length}
                          </div>
                        )}
                     </div>
                     <h3 className="text-xl font-bold mb-2 capitalize">{key}</h3>
                     <p className={`text-sm mb-6 flex-1 ${darkMode ? 'text-slate-400' : 'text-stone-500'}`}>{data.title}</p>
                     
                     <div className={`text-sm font-bold flex items-center gap-1 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {isCompleted ? 'Review' : 'Start'} <ExternalLink className="w-4 h-4 ml-1" />
                     </div>
                   </button>
                 )
               })}
            </div>

            {/* Review Bank Widget (Only show if mistakes exist) */}
            {Object.keys(mistakes).length > 0 && (
              <div className={`mt-12 rounded-3xl p-6 md:p-8 border shadow-sm ${darkMode ? 'bg-rose-900/10 border-rose-900/30' : 'bg-rose-50 border-rose-100'}`}>
                 <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-rose-400' : 'text-rose-900'}`}>
                   <RefreshCw className="w-5 h-5" /> Words & Grammar to Review
                 </h3>
                 <p className={`text-sm mb-6 ${darkMode ? 'text-rose-200/60' : 'text-rose-700/80'}`}>The system tracked mistakes from your exercises. Review these before your next lesson.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(mistakes).sort((a,b) => b.count - a.count).slice(0, 6).map((m, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'}`}>
                        <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{m.cat}</div>
                        <p className={`text-sm mb-2 opacity-70 line-through ${darkMode ? 'text-slate-300' : 'text-stone-500'}`}>{m.q.replace(/Question: /g, '')}</p>
                        <p className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>✅ {m.a}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}
            
          </div>
        ) : (
          // ACTIVE SECTION VIEW
          <div className="animate-in fade-in duration-300">
             {/* Section Header */}
             <div className="mb-8 flex items-center justify-between">
                <button 
                  onClick={() => setCurrentSection('DASHBOARD')}
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-stone-500 hover:text-slate-900'}`}
                >
                  <ArrowLeft className="w-4 h-4"/> Back to Dashboard
                </button>
             </div>
             
             <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${SECTION_COLOR_CLASSES[HOMEWORK_DATA[currentSection].color]}`}>
                  {HOMEWORK_DATA[currentSection].icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold font-serif capitalize">{currentSection}</h2>
             </div>

             {/* Dynamic Content */}
             {renderActiveSection()}
          </div>
        )}
      </main>
    </div>
  );
}
