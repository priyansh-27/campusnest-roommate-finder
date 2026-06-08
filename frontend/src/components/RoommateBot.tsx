import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot, X, Send, Sparkles,
  MapPin, MessageCircle,
  RefreshCw
} from 'lucide-react';

// ─── Roommate Profiles (full database with rich parameters) ──────────────────

interface RoommateProfile {
  id: number;
  name: string;
  age: number;
  major: string;
  year: string;
  avatar: string;
  budget: [number, number];
  city: string;
  lookingFor: string;
  sleep: 'Early Bird' | 'Night Owl' | 'Flexible';
  cleanliness: 'Very Clean' | 'Moderate' | 'Relaxed';
  study: 'Silence Only' | 'Low Background' | 'Anywhere';
  diet: 'Vegetarian' | 'Vegan' | 'Non-Veg' | 'Anything';
  smoking: 'No' | 'Sometimes' | 'Yes';
  guests: 'Rarely' | 'Weekends' | 'Often';
  pets: 'Love' | 'Okay' | 'No';
  ac: number; // preferred temp
  music: string;
  hobbies: string[];
  personality: string;
  bio: string;
  score?: number;
}

const PROFILES: RoommateProfile[] = [
  {
    id: 1, name: 'Priya Mehta', age: 21, major: 'Economics', year: 'Junior',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    budget: [8000, 15000], city: 'Noida', lookingFor: '2BHK flat or premium PG',
    sleep: 'Early Bird', cleanliness: 'Very Clean', study: 'Silence Only',
    diet: 'Vegetarian', smoking: 'No', guests: 'Rarely', pets: 'Okay',
    ac: 23, music: 'Acoustic / Classical', hobbies: ['Jogging', 'Cooking', 'Reading'],
    personality: 'Introverted & Organized',
    bio: 'I love meal prepping on Sundays and early morning runs. Hyper-organized, love labelled shelves. Looking for a quiet, clean co-living setup.',
  },
  {
    id: 2, name: 'Rahul Kumar', age: 20, major: 'Computer Science', year: 'Sophomore',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    budget: [7000, 14000], city: 'Noida', lookingFor: '2BHK near Gate 2',
    sleep: 'Night Owl', cleanliness: 'Very Clean', study: 'Silence Only',
    diet: 'Vegetarian', smoking: 'No', guests: 'Rarely', pets: 'Love',
    ac: 22, music: 'Lo-Fi / Indie', hobbies: ['Coding', 'Gaming', 'Anime'],
    personality: 'Introverted & Nerdy',
    bio: 'Night coder who keeps the desk spotless. My dual-monitor setup needs space. PS5 is shareable. Looking for a fellow introvert who respects deep-focus hours.',
  },
  {
    id: 3, name: 'Ananya Singh', age: 22, major: 'Architecture', year: 'Senior',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    budget: [9000, 16000], city: 'Delhi', lookingFor: 'Shared flat with big windows',
    sleep: 'Night Owl', cleanliness: 'Very Clean', study: 'Low Background',
    diet: 'Vegetarian', smoking: 'No', guests: 'Weekends', pets: 'Love',
    ac: 24, music: 'Jazz / Soft Pop', hobbies: ['Sketching', 'Pottery', 'Hiking'],
    personality: 'Creative & Calm',
    bio: 'Architecture student with a huge drawing board. Need natural light and organized space. Very creative but also very respectful of others\' schedules.',
  },
  {
    id: 4, name: 'Karan Mehta', age: 23, major: 'MBA', year: '1st Year',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    budget: [12000, 20000], city: 'Pune', lookingFor: 'Studio or flat near business district',
    sleep: 'Flexible', cleanliness: 'Moderate', study: 'Anywhere',
    diet: 'Anything', smoking: 'No', guests: 'Weekends', pets: 'Okay',
    ac: 21, music: 'EDM / Bollywood', hobbies: ['Cricket', 'Travel', 'Networking'],
    personality: 'Extroverted & Energetic',
    bio: 'MBA hustle mode most days — mostly out at campus or events. Super chill roommate when home. Have a car, happy to share rides.',
  },
  {
    id: 5, name: 'Sneha Joshi', age: 21, major: 'Design', year: 'Sophomore',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    budget: [6000, 12000], city: 'Bangalore', lookingFor: 'PG or hostel near design college',
    sleep: 'Early Bird', cleanliness: 'Moderate', study: 'Low Background',
    diet: 'Vegan', smoking: 'No', guests: 'Often', pets: 'Love',
    ac: 25, music: 'Pop / R&B', hobbies: ['Painting', 'Yoga', 'Baking'],
    personality: 'Warm & Social',
    bio: 'Very social, love hosting small study groups and Sunday baking sessions. Vegan kitchen, very welcoming. Looking for someone equally friendly and open-minded.',
  },
  {
    id: 6, name: 'Dev Sharma', age: 22, major: 'Civil Engineering', year: 'Junior',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    budget: [7500, 13000], city: 'Hyderabad', lookingFor: '3BHK flat share with 2-3 others',
    sleep: 'Flexible', cleanliness: 'Moderate', study: 'Low Background',
    diet: 'Non-Veg', smoking: 'No', guests: 'Weekends', pets: 'No',
    ac: 22, music: 'Rock / Hip-Hop', hobbies: ['Gym', 'Football', 'Cooking'],
    personality: 'Balanced & Easygoing',
    bio: 'Gym-goer who cooks great Rajasthani food on weekends. Very laid-back, hate conflict. Happy to split chores equally. Need a large flat with good kitchen.',
  },
];

// ─── Chat types ──────────────────────────────────────────────────────────────

type Step =
  | 'intro' | 'city' | 'budget' | 'sleep' | 'cleanliness'
  | 'diet' | 'smoking' | 'guests' | 'study' | 'hobbies'
  | 'personality' | 'results' | 'chat';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  options?: string[];
  profiles?: RoommateProfile[];
  typing?: boolean;
}

interface Preferences {
  city?: string;
  budget?: [number, number];
  sleep?: string;
  cleanliness?: string;
  diet?: string;
  smoking?: string;
  guests?: string;
  study?: string;
  hobbies?: string[];
  personality?: string;
}

// ─── Scoring engine ──────────────────────────────────────────────────────────

function scoreProfile(profile: RoommateProfile, prefs: Preferences): number {
  let score = 60; // base

  if (prefs.city && profile.city.toLowerCase() === prefs.city.toLowerCase()) score += 20;
  if (prefs.sleep && profile.sleep === prefs.sleep) score += 10;
  if (prefs.cleanliness && profile.cleanliness === prefs.cleanliness) score += 8;
  if (prefs.diet) {
    if (profile.diet === prefs.diet) score += 8;
    if (prefs.diet === 'Vegetarian' && profile.diet === 'Vegan') score += 4;
    if (prefs.diet === 'Anything') score += 4;
  }
  if (prefs.smoking && profile.smoking === prefs.smoking) score += 7;
  if (prefs.guests && profile.guests === prefs.guests) score += 6;
  if (prefs.study && profile.study === prefs.study) score += 6;
  if (prefs.personality && profile.personality.toLowerCase().includes(prefs.personality.toLowerCase())) score += 8;
  if (prefs.hobbies && prefs.hobbies.length > 0) {
    const overlap = prefs.hobbies.filter(h =>
      profile.hobbies.some(ph => ph.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(ph.toLowerCase()))
    );
    score += overlap.length * 3;
  }
  if (prefs.budget) {
    const [min, max] = prefs.budget;
    const [pMin, pMax] = profile.budget;
    if (max >= pMin && min <= pMax) score += 5;
  }

  return Math.min(99, score);
}

// ─── Bot conversation flow ───────────────────────────────────────────────────

const BOT_QUESTIONS: Record<Step, { text: string; options?: string[] }> = {
  intro: {
    text: `Yo! 👋 I'm **NestAI**, your AI roommate matchmaker. No cap, I'm here to find you the absolute best roommate so you don't end up living with a nightmare.\n\nI'll run a quick vibe check (lifestyle, sleep, budget), and my god-tier algorithm will pull up your perfect matches.\n\nReady to secure the ultimate flatmate? 🚀`,
    options: ["Let's Go! 🚀"],
  },
  city: {
    text: "First things first, which city are we targeting? 🏙️",
    options: ['Noida', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Mumbai'],
  },
  budget: {
    text: "What's the budget looking like for your share of the rent? 💰",
    options: ['₹5k–8k', '₹8k–12k', '₹12k–16k', '₹16k–20k', '₹20k+'],
  },
  sleep: {
    text: "Are you a morning person or a night owl? 🌙\n\n*(Crucial vibe check — 3 AM alarm conflicts are the worst!)*",
    options: ['Early Bird 🌅', 'Night Owl 🦉', 'Flexible 😴'],
  },
  cleanliness: {
    text: "Cleanliness standards? 🧹\n\n*(Be real — mismatched standards cause 90% of roommate beef)*",
    options: ['Very Clean 🧽', 'Moderate 🙂', 'Relaxed 😌'],
  },
  diet: {
    text: "What's your diet looking like? 🥗\n\n*(Affects the shared kitchen and fridge space!)*",
    options: ['Vegetarian 🥦', 'Vegan 🌱', 'Non-Veg 🍗', 'Anything 😄'],
  },
  smoking: {
    text: "Thoughts on smoking? 🚬",
    options: ['Non-smoker ✅', 'Smoke sometimes (outside)', 'Yes, indoors ok'],
  },
  guests: {
    text: "How often do you have the squad over? 🏠",
    options: ['Rarely — need my space', 'Weekends are fine', 'Often — social person'],
  },
  study: {
    text: "Study environment? 📚",
    options: ['Pin-drop silence 🤫', 'Lo-fi background noise ok 🎵', 'I study in library/café 🏛️'],
  },
  hobbies: {
    text: "Pick up to 3 hobbies! (Shared hobbies = instant W) 🎯",
    options: ['Gaming 🎮', 'Cooking 🍳', 'Gym 💪', 'Music 🎸', 'Reading 📖', 'Travelling ✈️', 'Sports 🏏', 'Art/Design 🎨'],
  },
  personality: {
    text: "Final question: What's your core personality type? 🧠",
    options: ['Introverted — recharge alone', 'Extroverted — love social energy', 'Ambivert — balanced mix'],
  },
  results: { text: '' },
  chat: { text: '' },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RoommateBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>('intro');
  const [prefs, setPrefs] = useState<Preferences>({});
  const [matches, setMatches] = useState<RoommateProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<RoommateProfile | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [msgId, setMsgId] = useState(100);
  const bottomRef = useRef<HTMLDivElement>(null);

  const nextId = () => { setMsgId(p => p + 1); return msgId + 1; };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatHistory, aiTyping]);

  // Open → show first message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => addBotMessage('intro'), 300);
    }
  }, [isOpen]);

  const addBotMessage = (s: Step, extra?: Partial<Message>) => {
    const q = BOT_QUESTIONS[s];
    if (!q) return;
    const msg: Message = {
      id: nextId(),
      from: 'bot',
      text: q.text,
      options: q.options,
      ...extra,
    };
    setMessages(prev => [...prev, msg]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: nextId(), from: 'user', text }]);
  };

  // ── Step flow handler ──
  const handleOption = (option: string, currentStep: Step) => {
    // Hobbies step — multi-select
    if (currentStep === 'hobbies') {
      const full = option;
      setSelectedHobbies(prev => {
        if (prev.includes(full)) return prev.filter(h => h !== full);
        if (prev.length >= 3) return prev;
        return [...prev, full];
      });
      return;
    }

    addUserMessage(option);

    // Update preferences

    let newPrefs = { ...prefs };
    switch (currentStep) {
      case 'intro': break;
      case 'city':   newPrefs.city = option; break;
      case 'budget':
        const ranges: Record<string, [number, number]> = {
          '₹5k–8k': [5000, 8000], '₹8k–12k': [8000, 12000],
          '₹12k–16k': [12000, 16000], '₹16k–20k': [16000, 20000], '₹20k+': [20000, 35000],
        };
        newPrefs.budget = ranges[option] || [8000, 15000];
        break;
      case 'sleep':
        newPrefs.sleep = option.includes('Early') ? 'Early Bird' : option.includes('Night') ? 'Night Owl' : 'Flexible';
        break;
      case 'cleanliness':
        newPrefs.cleanliness = option.includes('Very') ? 'Very Clean' : option.includes('Moderate') ? 'Moderate' : 'Relaxed';
        break;
      case 'diet':
        newPrefs.diet = option.includes('Veg') && !option.includes('Non') ? 'Vegetarian' : option.includes('Vegan') ? 'Vegan' : option.includes('Non') ? 'Non-Veg' : 'Anything';
        break;
      case 'smoking':
        newPrefs.smoking = option.includes('Non') ? 'No' : option.includes('sometimes') ? 'Sometimes' : 'Yes';
        break;
      case 'guests':
        newPrefs.guests = option.includes('Rarely') ? 'Rarely' : option.includes('Weekends') ? 'Weekends' : 'Often';
        break;
      case 'study':
        newPrefs.study = option.includes('silence') ? 'Silence Only' : option.includes('background') ? 'Low Background' : 'Anywhere';
        break;
      case 'personality':
        newPrefs.personality = option.includes('Intro') ? 'Introverted' : option.includes('Extro') ? 'Extroverted' : 'Ambivert';
        break;
    }
    setPrefs(newPrefs);

    // Advance to next step
    const flow: Step[] = ['intro', 'city', 'budget', 'sleep', 'cleanliness', 'diet', 'smoking', 'guests', 'study', 'hobbies', 'personality', 'results'];
    const idx = flow.indexOf(currentStep);
    const next = flow[idx + 1] as Step;

    if (next === 'results') {
      // Compute matches
      const scored = PROFILES.map(p => ({ ...p, score: scoreProfile(p, newPrefs) }))
        .sort((a, b) => (b.score || 0) - (a.score || 0));
      setMatches(scored);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: nextId(),
          from: 'bot',
          text: `🎉 Analysis complete! Based on your **${Object.keys(newPrefs).length} lifestyle responses**, I found **${scored.length} compatible roommates**. Here are your top matches — ranked by compatibility:`,
          profiles: scored,
        }]);
        setStep('results');
      }, 600);
    } else if (next) {
      setTimeout(() => {
        addBotMessage(next);
        setStep(next);
      }, 500);
    }
  };

  // Confirm hobby selection
  const confirmHobbies = () => {
    if (selectedHobbies.length === 0) return;
    addUserMessage(selectedHobbies.join(', '));
    setPrefs(p => ({ ...p, hobbies: selectedHobbies.map(h => h.split(' ')[0]) }));
    setSelectedHobbies([]);
    setTimeout(() => {
      addBotMessage('personality');
      setStep('personality');
    }, 500);
  };

  // ── Per-profile AI chat ──
  const handleProfileChat = (profile: RoommateProfile) => {
    setSelectedProfile(profile);
    setStep('chat');
    setChatHistory([{
      from: 'ai',
      text: `Hi! I'm ${profile.name} 😊 I saw we matched on NestAI — would love to connect! My compatibility score with you is ${profile.score}%. What would you like to know about me?`,
    }]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedProfile) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { from: 'user', text: userMsg }]);
    setAiTyping(true);

    // Generate contextual AI reply
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));

    const reply = generateReply(userMsg, selectedProfile);
    setChatHistory(prev => [...prev, { from: 'ai', text: reply }]);
    setAiTyping(false);
  };

  const generateReply = (msg: string, p: RoommateProfile): string => {
    const lower = msg.toLowerCase();
    if (lower.includes('budget') || lower.includes('rent') || lower.includes('money')) {
      return `My budget is ₹${p.budget[0].toLocaleString('en-IN')}–₹${p.budget[1].toLocaleString('en-IN')} per month. I prefer splitting everything (rent, utilities, WiFi) down the middle. Zero financial drama, you know? 💸`;
    }
    if (lower.includes('sleep') || lower.includes('wake') || lower.includes('night') || lower.includes('morning')) {
      return `I'm a ${p.sleep}! ${p.sleep === 'Night Owl' ? "I'm up till 2–3 AM grinding or chilling, but I'm super quiet. No loud TikToks without headphones, promise! 🎧" : p.sleep === 'Early Bird' ? "Early to bed, early to rise! Usually up by 6 AM hitting the gym or studying. I'm basically a human alarm clock but I respect your sleep! 🌅" : "Honestly my sleep schedule is whatever it needs to be. Very flexible, so no stress! 😴"}`;
    }
    if (lower.includes('clean') || lower.includes('mess') || lower.includes('dirty')) {
      return `Cleanliness check: ${p.cleanliness}. ${p.cleanliness === 'Very Clean' ? "I'm borderline OCD with the kitchen and bathroom. If we live together, the sink stays empty! 🧽✨" : p.cleanliness === 'Moderate' ? "I keep things neat but I'm not gonna freak out over a coffee mug on the table. A weekend chore chart works perfect! 🙂" : "I'm super chill. As long as there are no weird science experiments growing in the fridge, we good! 😂"}`;
    }
    if (lower.includes('food') || lower.includes('cook') || lower.includes('eat') || lower.includes('diet')) {
      return `I'm ${p.diet}! ${p.diet === 'Vegetarian' ? 'Strictly veg! I cook some insane paneer dishes. No non-veg in the shared utensils please! 🥦' : p.diet === 'Vegan' ? 'Plant-based all the way 🌱 If you want to try some elite vegan baking on weekends, I got you!' : p.diet === 'Non-Veg' ? 'I eat everything. I whip up chicken curry sometimes. Totally fine sharing the kitchen! 🍗' : 'I am literally a human garbage disposal, I eat everything and love trying new spots! 🍔'}`;
    }
    if (lower.includes('hobby') || lower.includes('interest') || lower.includes('free time') || lower.includes('weekend')) {
      return `My main vibes are ${p.hobbies.join(', ')}! ${p.hobbies.includes('Gaming') ? 'I play a lot of Valo/CS — but I use a mic with noise gate so I won\'t yell during clutches! 🎮' : p.hobbies.includes('Gym') ? 'Gym rat here. Always meal prepping! 💪' : 'I love keeping busy and exploring the city.'} What about you?`;
    }
    if (lower.includes('guest') || lower.includes('friend') || lower.includes('party') || lower.includes('visit')) {
      return `Guest policy: ${p.guests}. ${p.guests === 'Rarely' ? "I treat my room as my sanctuary. Not a huge fan of random people coming over all the time. Need that peace! 🧘‍♂️" : p.guests === 'Weekends' ? "Having the squad over for weekend movie/game nights is a W. Just need a heads-up first! 🍕" : "My door is always open! Love hosting and having a lively flat. 🎉"}`;
    }
    if (lower.includes('smoke') || lower.includes('smoking') || lower.includes('cigarette')) {
      return `On smoking: ${p.smoking === 'No' ? "I'm strictly smoke-free. No smoking in the flat or balcony, it's a hard boundary for me! 🚭" : p.smoking === 'Sometimes' ? "I occasionally smoke, but I'll always take it outside or to the balcony. Respect the shared air! 🌬️" : "I do smoke indoors sometimes, so need a flatmate who's chill with that."}`;
    }
    if (lower.includes('study') || lower.includes('noise') || lower.includes('quiet') || lower.includes('music')) {
      return `Study mode: ${p.study}. ${p.study === 'Silence Only' ? "When it's exam season, I need absolute silence. Library vibes in the flat, fr! 🤫" : p.study === 'Low Background' ? "I always have a lo-fi playlist running in the background. Good vibes only! 🎵" : "I can literally study anywhere. Noise doesn't bother me at all! 📚"}`;
    }
    if (lower.includes('personality') || lower.includes('social') || lower.includes('intro') || lower.includes('extro')) {
      return `I'm definitely ${p.personality}! ${p.personality.includes('Intro') ? "Social battery drains fast, so I love my alone time. I'll be the most low-drama roommate ever! 🔋" : p.personality.includes('Extro') ? "Super extroverted! Let's explore cafes and hang out! 🌟" : "Ambivert vibes. I love hanging out but also respect when we both just want to put headphones on and chill."}`;
    }
    if (lower.includes('city') || lower.includes('location') || lower.includes('where') || lower.includes('area')) {
      return `I'm looking to lock down a spot in ${p.city}! Specifically ${p.lookingFor}. We should definitely check out some places on CampusNest! 📍`;
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('yo')) {
      return `Yooo! 👋 So hyped to connect! NestAI said our vibe match is ${p.score}% — that's literally goated! I'm ${p.name}, a ${p.year} ${p.major} major. What do you want to know about living with me?`;
    }
    if (lower.includes('meet') || lower.includes('call') || lower.includes('number') || lower.includes('contact') || lower.includes('phone')) {
      return `Bet! Let's set up a quick 15-min video call on Discord or GMeet just to vibe check in person. If we click, we can start touring flats together! 📱`;
    }
    if (lower.includes('move') || lower.includes('when') || lower.includes('available') || lower.includes('date')) {
      return `I'm trying to move by the end of the month. I want to secure a spot before the good ones get sniped! What's your timeline looking like? ⏳`;
    }
    if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat')) {
      return p.pets === 'Love' ? `I am OBSESSED with pets! 🐾 If you have a cat or dog, I will literally be their best friend. Win-win!` :
             p.pets === 'Okay' ? `I'm totally chill with pets as long as they don't destroy the furniture haha. What kind of pet do you have?` :
             `I have bad allergies, so I strictly need a pet-free flat. Hope that's not a dealbreaker! 🤧`;
    }
    // Default
    const defaults = [
      `That's a W question. Honestly, finding a flatmate is stressful, but a ${p.score}% match is pretty rare! Want to jump on a quick call this weekend? 📞`,
      `I totally agree. Living together is basically a relationship, so setting boundaries on Day 1 is key. No passive-aggressive sticky notes! 😂`,
      `We actually have so much in common! Let's shortlist some flats on CampusNest and split the legwork of calling landlords. Sound like a plan? 🏠`,
      `No cap, I've had terrible roommates in the past. This is why I trust the NestAI algorithm to filter the weirdos out! 🙌`,
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const resetBot = () => {
    setMessages([]);
    setStep('intro');
    setPrefs({});
    setMatches([]);
    setSelectedProfile(null);
    setChatHistory([]);
    setSelectedHobbies([]);
    setTimeout(() => addBotMessage('intro'), 300);
  };

  // ─── Render Helpers ──────────────────────────────────────────────────────────

  const ScoreRing = ({ score }: { score: number }) => {
    const color = score >= 90 ? 'text-emerald-600' : score >= 80 ? 'text-blue-600' : score >= 70 ? 'text-amber-600' : 'text-slate-500';
    const bg = score >= 90 ? 'bg-emerald-50' : score >= 80 ? 'bg-blue-50' : score >= 70 ? 'bg-amber-50' : 'bg-slate-50';
    return (
      <div className={`${bg} rounded-xl px-3 py-2 text-center min-w-16`}>
        <div className={`text-xl font-black ${color}`}>{score}%</div>
        <div className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">match</div>
      </div>
    );
  };

  const ProfileCard = ({ profile }: { profile: RoommateProfile }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <img src={profile.avatar} alt={profile.name} className="w-14 h-14 rounded-xl object-cover border-2 border-slate-100" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-black text-slate-900 text-sm">{profile.name}</div>
              <div className="text-xs text-slate-500">{profile.age} yrs · {profile.major} · {profile.year}</div>
              <div className="text-xs text-blue-600 font-medium flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-3 h-3" /> {profile.city} · {profile.lookingFor}
              </div>
            </div>
            <ScoreRing score={profile.score || 0} />
          </div>
        </div>
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
        {[
          [profile.sleep === 'Early Bird' ? '🌅' : profile.sleep === 'Night Owl' ? '🌙' : '😴', profile.sleep],
          ['🧹', profile.cleanliness],
          ['🥗', profile.diet],
          ['📚', profile.study.split(' ')[0] + (profile.study.includes('Only') ? ' Silence' : profile.study.includes('Low') ? ' BG ok' : ' Library')],
          ['🚬', profile.smoking === 'No' ? 'Non-smoker' : profile.smoking],
          ['❄️', `${profile.ac}°C AC`],
        ].map(([icon, val], i) => (
          <div key={i} className="bg-slate-50 rounded-lg p-1.5 text-center">
            <div className="text-sm">{icon}</div>
            <div className="text-slate-600 font-medium leading-tight truncate">{val}</div>
          </div>
        ))}
      </div>

      {/* Hobbies */}
      <div className="flex flex-wrap gap-1">
        {profile.hobbies.map(h => (
          <span key={h} className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{h}</span>
        ))}
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-600 italic leading-relaxed border-l-2 border-blue-200 pl-2">"{profile.bio.slice(0, 100)}..."</p>

      {/* Budget */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          Budget: <span className="font-black text-slate-900">₹{profile.budget[0].toLocaleString('en-IN')}–{profile.budget[1].toLocaleString('en-IN')}</span>/mo
        </div>
        <button
          onClick={() => handleProfileChat(profile)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Chat with AI
        </button>
      </div>
    </div>
  );

  // ─── Main render ─────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        </div>
        <span>AI Roommate Match</span>
        <Sparkles className="w-4 h-4 text-blue-200" />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-24px)] h-[620px] max-h-[calc(100vh-48px)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slideUp">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-black text-white text-sm flex items-center gap-1.5">
                  NestAI <span className="text-[10px] bg-emerald-400 text-slate-900 px-1.5 py-0.2 rounded-full font-bold">LIVE</span>
                </div>
                <div className="text-blue-200 text-xs">
                  {step === 'chat' && selectedProfile
                    ? `Chatting with ${selectedProfile.name}`
                    : step === 'results'
                    ? `${matches.length} matches found`
                    : 'AI Roommate Matching'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(step === 'results' || step === 'chat') && (
                <button onClick={resetBot} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition" title="Start over">
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              {step === 'chat' && (
                <button onClick={() => { setStep('results'); setSelectedProfile(null); setChatHistory([]); }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition text-xs font-bold px-3"
                >
                  ← Back
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Chat with profile AI ── */}
          {step === 'chat' && selectedProfile && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Profile header strip */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3 shrink-0">
                <img src={selectedProfile.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{selectedProfile.name}</div>
                  <div className="text-xs text-slate-500">{selectedProfile.major} · {selectedProfile.year} · {selectedProfile.city}</div>
                </div>
                <ScoreRing score={selectedProfile.score || 0} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'ai' && (
                      <img src={selectedProfile.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                    )}
                    <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.from === 'user' && (
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=6366f1&color=fff`}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                    )}
                  </div>
                ))}

                {aiTyping && (
                  <div className="flex gap-2 items-center">
                    <img src={selectedProfile.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested questions */}
              <div className="px-4 py-2 border-t border-slate-100 flex gap-1.5 overflow-x-auto">
                {['Budget?', 'Sleep habits?', 'Hobbies?', 'Guests policy?', 'Move-in date?'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q); }}
                    className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-200 flex gap-2 shrink-0">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder={`Ask ${selectedProfile.name.split(' ')[0]} anything…`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Q&A Conversation flow ── */}
          {step !== 'chat' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {/* Bot message */}
                    {msg.from === 'bot' && !msg.profiles && (
                      <div className="flex gap-2.5 items-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed max-w-[85%]">
                            {msg.text.split('\n').map((line, i) => (
                              <span key={i}>
                                {line.split(/\*\*(.*?)\*\*/).map((part, j) =>
                                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                )}
                                {i < msg.text.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>

                          {/* Options */}
                          {msg.options && step !== 'results' && (
                            <div className={`flex flex-wrap gap-2 ${step === 'hobbies' ? 'mt-1' : ''}`}>
                              {msg.options.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => handleOption(opt, step)}
                                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-all ${
                                    step === 'hobbies' && selectedHobbies.includes(opt)
                                      ? 'bg-blue-600 border-blue-600 text-white'
                                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                              {step === 'hobbies' && (
                                <button
                                  onClick={confirmHobbies}
                                  disabled={selectedHobbies.length === 0}
                                  className="text-xs font-bold px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition"
                                >
                                  Confirm ({selectedHobbies.length}/3) ✓
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Profiles message */}
                    {msg.from === 'bot' && msg.profiles && (
                      <div className="space-y-3">
                        <div className="flex gap-2.5 items-start">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed max-w-[88%]">
                            {msg.text.split(/\*\*(.*?)\*\*/).map((part, j) =>
                              j % 2 === 1 ? <strong key={j} className="text-blue-700">{part}</strong> : part
                            )}
                          </div>
                        </div>
                        <div className="space-y-3 pl-10">
                          {msg.profiles.map(profile => (
                            <ProfileCard key={profile.id} profile={profile} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* User message */}
                    {msg.from === 'user' && (
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm max-w-[80%]">
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Bottom hint for results state */}
              {step === 'results' && (
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 text-xs text-blue-700 font-medium text-center shrink-0">
                  💡 Click <strong>"Chat with AI"</strong> on any profile to simulate a real conversation!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out both; }
      `}</style>
    </>
  );
}
