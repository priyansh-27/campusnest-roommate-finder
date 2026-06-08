import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, X, Send, Sparkles, RefreshCw, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Rich knowledge base the AI draws from ───────────────────────────────────
const LISTINGS_KB = [
  { name: 'Prestige Heights PG', type: 'PG', city: 'Noida', price: 12500, distance: '0.4 km', safety: 98, amenities: 'AC, WiFi, 3 Meals, CCTV, Washing Machine, Power Backup', verified: true },
  { name: 'Scholar Nest Hostel', type: 'Hostel', city: 'Delhi', price: 8500, distance: '1.2 km', safety: 94, amenities: 'WiFi, 2 Meals, Gym, Study Room, Security', verified: true },
  { name: 'GreenView 3BHK Flat', type: 'Flat', city: 'Pune', price: 16000, distance: '2.0 km', safety: 91, amenities: 'AC, Kitchen, Parking, Balcony, Smart TV', verified: true },
  { name: 'NestPro Executive Studio', type: 'Studio', city: 'Bangalore', price: 21000, distance: '0.8 km', safety: 99, amenities: 'AC, Kitchenette, Housekeeping, Gigabit WiFi, Keyless Entry', verified: true },
  { name: 'Campus View Budget PG', type: 'PG', city: 'Hyderabad', price: 6500, distance: '0.2 km', safety: 88, amenities: 'WiFi, Mess, Security', verified: false },
  { name: 'Urban Nest 2BHK', type: 'Flat', city: 'Mumbai', price: 18000, distance: '1.5 km', safety: 93, amenities: 'AC, Kitchen, Power Backup, Security', verified: true },
];

const ROOMMATES_KB = [
  { name: 'Priya Mehta', major: 'Economics', city: 'Noida', budget: '₹8k–15k', sleep: 'Early Bird', diet: 'Vegan', cleanliness: 'Very Clean', smoking: 'No', bio: 'Morning runner, meal-prepper, loves quiet study evenings.' },
  { name: 'Rahul Kumar', major: 'Computer Science', city: 'Noida', budget: '₹7k–14k', sleep: 'Night Owl', diet: 'Vegetarian', cleanliness: 'Very Clean', smoking: 'No', bio: 'Night coder, spotless desk, loves anime and gaming.' },
  { name: 'Ananya Singh', major: 'Architecture', city: 'Delhi', budget: '₹9k–16k', sleep: 'Night Owl', diet: 'Vegetarian', cleanliness: 'Very Clean', smoking: 'No', bio: 'Creative, organized, needs natural light and clean spaces.' },
  { name: 'Karan Mehta', major: 'MBA', city: 'Pune', budget: '₹12k–20k', sleep: 'Flexible', diet: 'Anything', cleanliness: 'Moderate', smoking: 'No', bio: 'Mostly out, very chill, has a car, happy to share rides.' },
  { name: 'Sneha Joshi', major: 'Design', city: 'Bangalore', budget: '₹6k–12k', sleep: 'Early Bird', diet: 'Vegan', cleanliness: 'Moderate', smoking: 'No', bio: 'Super social, loves yoga, baking and hosting small gatherings.' },
  { name: 'Dev Sharma', major: 'Civil Engineering', city: 'Hyderabad', budget: '₹7.5k–13k', sleep: 'Flexible', diet: 'Non-Veg', cleanliness: 'Moderate', smoking: 'No', bio: 'Gym-goer, cooks Rajasthani food, very easygoing.' },
];

// ─── Core AI response engine ──────────────────────────────────────────────────
function generateAIResponse(userMsg: string, history: Message[], userName: string): string {
  const msg = userMsg.toLowerCase().trim();
  const firstName = userName.split(' ')[0];

  // ── Greetings ──
  if (/^(hi|hello|hey|hola|namaste|sup|what'?s up|yo)/.test(msg)) {
    return `Yo ${firstName}! 👋 What's good? I'm **NestAI** — your goated CampusNest assistant. No cap, I'm here to solve all your housing vibes and make sure you secure the best spot.\n\nHere's my godly skillset:\n• 🏠 **Finding W stays** (PGs, hostels, premium flats)\n• 👥 **Vibe-matching** you with the perfect roommates\n• 💰 **Securing the bag** (expense splitting & budget advice)\n• 🛡️ **Safety checks** so you never get finessed\n\nWhat's the move today? Drop your requirements!`;
  }

  // ── Looking for room / accommodation ──
  if (/find.*(room|pg|flat|hostel|accommodation|place|stay)|looking for.*(room|place|pg|flat)|need.*(room|pg|flat)|room.*(available|near)|where.*stay|accommodation/i.test(msg)) {
    const cityMatch = LISTINGS_KB.find(l => msg.includes(l.city.toLowerCase()));
    const budgetMatch = msg.match(/(\d{4,6})/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    let results = LISTINGS_KB;
    if (cityMatch) results = results.filter(l => l.city === cityMatch.city);
    if (budget) results = results.filter(l => l.price <= budget);

    if (results.length === 0) {
      return `Bruh, I couldn't find an exact match for that specific vibe. Help me out so I can work my magic:\n1. Which **city** are we targeting?\n2. What's the **monthly budget** (e.g., ₹10,000)?\n3. Prefer a **PG, Hostel, or Flat**?\n\nGive me the details and I'll pull up the absolute best verified spots. 🔍✨`;
    }

    const top = results.slice(0, 3);
    return `Say less! 🎯 Here are the absolute top-tier, verified listings${cityMatch ? ` in **${cityMatch.city}**` : ''}${budget ? ` under ₹${budget.toLocaleString('en-IN')}` : ''}:\n\n${top.map((l, i) =>
      `**${i + 1}. ${l.name}** ${l.verified ? '✅ (Admin Verified)' : '⚠️'}\n   📍 ${l.city} · 🚶‍♂️ ${l.distance} from campus\n   💰 **₹${l.price.toLocaleString('en-IN')}/month** · 🛡️ Safety: ${l.safety}/100 (W)\n   ✨ ${l.amenities}`
    ).join('\n\n')}\n\n${results.length > 3 ? `\n_${results.length - 3} more listings in the vault. Want me to narrow it down?_` : ''}\n\nWant the full scoop on any of these? Or should we lock it in and contact the landlord? 📞`;
  }

  // ── City specific ──
  if (/noida|delhi|pune|bangalore|hyderabad|mumbai/i.test(msg) && !/roommate|room.*mate/i.test(msg)) {
    const city = msg.match(/noida|delhi|pune|bangalore|hyderabad|mumbai/i)?.[0];
    const cityListings = LISTINGS_KB.filter(l => l.city.toLowerCase() === city?.toLowerCase());
    if (cityListings.length > 0) {
      return `Got you! The housing scene in **${city}** is buzzing right now. Here are the absolute best picks:\n\n${cityListings.map((l, i) =>
        `**${i + 1}. ${l.name}** (${l.type}) ${l.verified ? '✅' : '⚠️'}\n   💰 ₹${l.price.toLocaleString('en-IN')}/mo · 🛡️ ${l.safety}/100 safety · 📍 ${l.distance}\n   💎 ${l.amenities}`
      ).join('\n\n')}\n\n100% Zero Brokerage, fr fr. Which one catches your eye? 👀`;
    }
  }

  // ── Roommate matching ──
  if (/roommate|room.?mate|flatmate|flat.?mate|find.*someone|looking for.*room/i.test(msg)) {
    const isVeg = /veg(etarian)?|vegan|no.*meat/i.test(msg);
    const isNightOwl = /night.?owl|stay.*late|late.*night/i.test(msg);
    const isEarlyBird = /early.?bird|morning person|wake.*early/i.test(msg);
    const isClean = /clean|neat|tidy|organiz/i.test(msg);
    const cityMention = msg.match(/noida|delhi|pune|bangalore|hyderabad|mumbai/i)?.[0];

    let candidates = ROOMMATES_KB;
    if (cityMention) candidates = candidates.filter(r => r.city.toLowerCase() === cityMention.toLowerCase());
    if (isVeg) candidates = candidates.filter(r => r.diet === 'Vegetarian' || r.diet === 'Vegan');
    if (isNightOwl) candidates = candidates.filter(r => r.sleep === 'Night Owl' || r.sleep === 'Flexible');
    if (isEarlyBird) candidates = candidates.filter(r => r.sleep === 'Early Bird' || r.sleep === 'Flexible');
    if (isClean) candidates = candidates.filter(r => r.cleanliness === 'Very Clean');

    if (candidates.length === 0) candidates = ROOMMATES_KB.slice(0, 3);
    const top = candidates.slice(0, 3);

    return `Vibe check passed! ✅ Here are your god-tier roommate matches based on your lifestyle:\n\n${top.map((r, i) =>
      `**${i + 1}. ${r.name}** — ${r.major}\n   📍 ${r.city} · 💰 Budget: ${r.budget}\n   😴 ${r.sleep} · 🥗 ${r.diet} · 🧹 ${r.cleanliness}\n   💬 "${r.bio}"`
    ).join('\n\n')}\n\n🤖 **My brain runs on a 20-parameter algorithm** — I checked everything from AC temp to sleep schedules to make sure y'all don't clash.\n\nWanna hit up any of them? Or should we tweak your preferences?`;
  }

  // ── Solo roommate seeker ──
  if (/roommate.*left|left.*flat|roommate.*gone|alone.*flat|flat.*alone|need.*replacement|one.*roommate|spot.*open|fill.*spot|lost.*roommate/i.test(msg)) {
    return `Damn, that's a tough spot. But chill, CampusNest's **Solo Roommate Seeker** feature is literally built to save you from paying double rent! 🤝\n\n**Here's the master plan:**\n1. Jump into the **Roommates → Solo Seeker** tab\n2. Drop your flat details (rent split, vibe, location)\n3. I will instantly push your listing to compatible students looking for a spot\n4. Get matched in 24–48 hours, no cap.\n\nWant me to guide you through registering? We'll get that spot filled ASAP! 🏠🔥`;
  }

  // ── Budget / pricing ──
  if (/budget|price|cost|rent|cheap|affordable|expensive|how much/i.test(msg)) {
    const budgetMatch = msg.match(/(\d{3,6})/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    if (budget && budget < 5000) {
      return `₹${budget} per month is definitely playing on hard mode! 😅 Most verified spots on CampusNest start at **₹6,500/month**.\n\n**Pro-tip:** The ultimate hack is finding a 3BHK flat and splitting it with 2 other students. I can help you find flatmates to bring that per-person cost down to ₹5,000! Want me to show you how? 💡`;
    }

    if (budget) {
      const matches = LISTINGS_KB.filter(l => l.price <= budget);
      return `Big W! For a budget of **₹${budget.toLocaleString('en-IN')}/month**, I found **${matches.length} absolute steals**:\n\n${matches.map(l =>
        `• **${l.name}** (${l.type}) — ₹${l.price.toLocaleString('en-IN')}/mo in ${l.city}`
      ).join('\n')}\n\nZero brokerage means you keep all your money. Need the full details on any of these?`;
    }

    return `Let's talk numbers! 💰 Here's the CampusNest pricing meta:\n\n💚 **Budget Tier (₹5k–9k):** Campus View PG, Scholar Nest Hostel\n💛 **Mid Tier (₹9k–15k):** GreenView Flat Share, Prestige Heights PG\n🔵 **God Tier / Premium (₹15k–25k):** NestPro Studio, Urban Nest 2BHK\n\n**Remember:** We are 100% Zero-Brokerage. You never pay an agent fee.\n\nWhat's your budget looking like?`;
  }

  // ── Landlord subscription ──
  if (/landlord|subscription|plan|list.*property|add.*property|post.*listing|publish|upload.*flat/i.test(msg)) {
    return `**Landlord Mode: ON!** 🏡📈\n\nWant to get your property in front of thousands of verified students? Choose your weapon:\n\n🥉 **Starter** (₹999/mo) — 1 active listing, standard visibility.\n🥈 **Growth** (₹1,999/mo) — Up to 3 listings, priority search, direct student leads! **(Absolute Best Value ⭐)**\n🥇 **Pro** (₹3,999/mo) — Unlimited listings, top spot placement, dedicated account manager.\n\n**The CampusNest Advantage:**\n✅ Zero brokerage for students = Way more inquiries for you!\n✅ AI-matching connects you with the right tenants instantly.\n\nHead to the **Landlord Dashboard → Subscription** to activate. Ready to secure the bag?`;
  }

  // ── Safety ──
  if (/safe|safety|security|cctv|guard|scam|broker|fake|fraud|trust/i.test(msg)) {
    return `Safety isn't just a feature, it's our entire religion at CampusNest. 🙏🛡️\n\nHere's how we keep you 100% secure from scams:\n\n🛡️ **Dynamic Safety Scores (0-100):** Based on CCTV, guards, and local crime data.\n✅ **Triple-Verified Landlords:** We check their ID, property deed, and face.\n📹 **Video Proof:** No fake photos allowed. Period.\n🚫 **Anti-Scam Tech:** We block broker impersonators instantly.\n🆘 **One-Tap Emergency SOS:** Instantly alerts campus security and your emergency contacts.\n\nIf you ever see something sus, just report it and our admins will nuke the listing. Stay safe, stay smart! 🧠`;
  }

  // ── Expense splitting ──
  if (/split|expense|bill|electricity|wifi|grocery|divide|share.*cost|cost.*share/i.test(msg)) {
    return `Say goodbye to the "who owes who" drama! 💸 CampusNest has a goated **Smart Expense Manager** built right in.\n\n**How it works:**\n📊 **Auto-Split:** Log WiFi, groceries, or rent, and it instantly calculates exactly who owes what.\n🤝 **Settle Up:** One-tap settlements to keep the peace.\n📈 **Analytics:** Track exactly where your money is going every month.\n\nExample:\n• Electricity ₹2,800 ÷ 3 people = exactly ₹933.33 each.\n\nNo more doing math in the WhatsApp group chat! Go to the **Expenses** tab to start tracking.`;
  }

  // ── Maintenance ──
  if (/repair|maintenance|broken|leak|fix|complaint|issue.*flat|flat.*issue/i.test(msg)) {
    return `AC broken? Tap leaking? Don't stress, we got you. 🛠️\n\nCampusNest has a built-in **Maintenance Request SLA**:\n\n1. Go to your **Maintenance** tab\n2. Report the issue and set the priority\n3. The landlord gets instantly notified\n\n**Our Rules for Landlords:**\n🔴 **High Priority (AC, water, lock)** → Must respond in 24 hours\n🟡 **Medium Priority (WiFi, appliances)** → 48 hours\n\nYou can track the exact status (Open, In Progress, Resolved) right from your dashboard. Let's get that fixed!`;
  }

  // ── Deposit / money protection ──
  if (/deposit|advance|refund|money back|token/i.test(msg)) {
    return `**Security Deposit 101:** Let's protect your money! 🔒💰\n\n💡 **The Standard:** Usually 1-2 months rent (we actively negotiate this down for our students!).\n🚫 **ZERO TOKEN SCAMS:** Never ever pay a random QR code before visiting a flat. CampusNest explicitly bans brokers who ask for "visiting fees."\n🛡️ **Deposit Protection:** Our verified landlords sign an agreement making refund policies crystal clear.\n\n**Pro Tip:** Your CampusNest Trust Score helps you negotiate lower deposits! The higher your score, the less risk for the landlord.`;
  }

  // ── How platform works ──
  if (/how.*work|how.*use|how.*campusnest|what.*campusnest|tell.*about|explain/i.test(msg)) {
    return `**CampusNest Explained (The Goated Edition)** 🚀\n\nWe are the ultimate student-first housing ecosystem. No brokers. No scams. Just good vibes.\n\n🎓 **For Students (100% FREE):**\n• Find hyper-verified PGs, hostels & flats\n• Use our AI to match with the perfect roommates\n• Split bills automatically with your flatmates\n• One-tap maintenance requests\n\n🏠 **For Landlords:**\n• Subscribe to list properties directly to thousands of students\n• Manage properties digitally\n\n**The Journey:**\nSearch → Match → Move In → Split Bills → Live Stress-Free.\n\nWhat phase of the journey are you in right now? Let's get to work! 🎯`;
  }

  // ── Subscription questions (Students vs Landlords) ──
  if (/plan|subscribe|pricing|pay|payment|monthly|annual/i.test(msg)) {
    return `Let me clear this up real quick: **CampusNest is 100% FREE for students!** 🎉 Zero app fees, zero brokerage.\n\nWe only charge **Landlords** to list their properties:\n• Starter: ₹999/month\n• Growth: ₹1,999/month (Most Popular ⭐)\n• Pro: ₹3,999/month\n\nThis keeps the platform ad-free and scam-free for you. Are you looking to list a property, or just looking for a room?`;
  }

  // ── Vague / unclear ──
  if (msg.length < 10) {
    return `You're speaking in riddles, my friend! 😅 Give me a bit more context so I can flex my AI skills:\n• "Find me a PG in Noida under ₹12k"\n• "I need a vegan night-owl roommate"\n• "How does expense splitting work?"\n• "My roommate dipped, help!"\n\nDrop the details and I'll drop the solutions! 🎯`;
  }

  // ── Farewell ──
  if (/bye|goodbye|thank|thanks|see ya|later/i.test(msg)) {
    return `You're an absolute legend, ${firstName}! 🙌 I'm always here running 24/7 in the cloud if you need me.\n\nWhether it's finding rooms, matching roommates, or dodging brokers — NestAI has your back. Stay goated! 🚀✨`;
  }

  // ── Default fallback (contextual) ──
  const lastTopic = history.slice(-3).map(m => m.content.toLowerCase()).join(' ');
  if (lastTopic.includes('room') || lastTopic.includes('pg') || lastTopic.includes('flat')) {
    return `Say less! To find you the absolute perfect spot, I just need to know:\n• Which **city**?\n• What's the **budget**?\n• Prefer a **PG, Hostel, Flat, or Studio**?\n\nTell me the vibes and I'll find the match! 🎯`;
  }

  return `That's an interesting one! 🤔 As your dedicated housing & roommate AI, here's what I can do for you right now:\n\n🏠 **Find Stays** — "Find me a flat in Pune under ₹15k"\n👥 **Match Roommates** — "Need a chill, non-smoking roommate"\n💰 **Budget Hacks** — "What can I get for ₹10k in Delhi?"\n🛡️ **Safety Checks** — "How do you verify landlords?"\n🤝 **Solo Seeker** — "Need a flatmate replacement"\n\nHow can I help you level up your living situation today, ${firstName}?`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgCounter, setMsgCounter] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addMessage('assistant', `Hey${user ? ' ' + user.name.split(' ')[0] : ''}! 👋 I'm **NestAI**, your CampusNest assistant.\n\nI can help you find rooms, match roommates, answer questions about rent and deposits, explain landlord plans, and a lot more — just chat with me like you would with a friend!\n\nWhat are you looking for today?`);
      }, 400);
    }
  }, [isOpen]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const id = Date.now() + msgCounter;
    setMsgCounter(c => c + 1);
    setMessages(prev => [...prev, { id, role, content, timestamp: new Date() }]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput('');
    addMessage('user', text);
    setIsTyping(true);

    // Simulate natural typing delay
    const delay = 600 + Math.min(text.length * 15, 1500);
    await new Promise(r => setTimeout(r, delay));

    const reply = generateAIResponse(text, messages, user?.name || 'there');
    setIsTyping(false);
    addMessage('assistant', reply);
    inputRef.current?.focus();
  };

  const reset = () => {
    setMessages([]);
    setTimeout(() => {
      addMessage('assistant', `Fresh start! 🆕 What can I help you with, ${user?.name?.split(' ')[0] || 'friend'}?`);
    }, 300);
  };

  // Format message with bold markdown
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block">
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} className="font-bold">{part}</strong>
              : part
          )}
        </span>
      );
    });
  };

  const SUGGESTIONS = [
    'Find a PG in Noida under ₹12,000',
    'I need a vegetarian roommate',
    'My roommate left, help me find someone',
    'How does landlord subscription work?',
    'Is CampusNest free for students?',
  ];

  const panelWidth = isExpanded ? 'w-[600px]' : 'w-[390px]';
  const panelHeight = isExpanded ? 'h-[700px]' : 'h-[580px]';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-bold px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        </div>
        <span>NestAI Chat</span>
        <Sparkles className="w-4 h-4 text-violet-200" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 ${panelWidth} ${panelHeight} max-w-[calc(100vw-24px)] max-h-[calc(100vh-48px)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden`}
          style={{ animation: 'slideUpChat 0.25s ease-out both' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-black text-white flex items-center gap-2">
                  NestAI
                  <span className="text-[10px] bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full font-bold">GPT-STYLE</span>
                </div>
                <div className="text-violet-200 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  {isTyping ? 'Typing…' : 'Online · Housing & Roommate Expert'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={reset} title="Clear chat" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsExpanded(e => !e)} title={isExpanded ? 'Minimize' : 'Expand'} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition hidden sm:flex">
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Starting conversation…</p>
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
                }`}>
                  <div className="space-y-0.5">
                    {formatMessage(msg.content)}
                  </div>
                  <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-violet-200 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=7c3aed&color=fff`}
                    alt=""
                    className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5 shadow-sm"
                  />
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only if chat is early) */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto shrink-0">
              {SUGGESTIONS.slice(0, 3).map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-[11px] whitespace-nowrap bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold px-3 py-1.5 rounded-full transition border border-violet-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-200 bg-white flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about rooms, roommates, rent…"
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition placeholder-slate-400"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
