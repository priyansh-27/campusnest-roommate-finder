import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users, PlusCircle, MapPin, Home, CheckCircle,
  Send, Loader2, MessageCircle, Clock, AlertCircle
} from 'lucide-react';

interface SoloPost {
  id: number;
  name: string;
  avatar: string;
  flatName: string;
  city: string;
  area: string;
  rentPerHead: number;
  roomsAvailable: number;
  moveInDate: string;
  stayingSince: string;
  reason: string;
  preferences: string[];
  contact: string;
  posted: string;
  verified: boolean;
}

const SEED_POSTS: SoloPost[] = [
  {
    id: 1, name: 'Rahul K.', flatName: 'GreenView 3BHK (Gate 2 side)',
    city: 'Noida', area: 'Knowledge Park', rentPerHead: 5200,
    roomsAvailable: 1, moveInDate: '1st April 2026', stayingSince: 'Aug 2025',
    reason: 'My roommate Kabir got a job in Hyderabad and left suddenly. Looking for one person to fill the room ASAP.',
    preferences: ['Non-smoker', 'Vegetarian preferred', 'Night Owl ok', 'Clean'],
    contact: 'Connect via CampusNest', posted: '2 hours ago', verified: true,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 2, name: 'Ananya S.', flatName: 'Urban Nest 2BHK, Sector 62',
    city: 'Noida', area: 'Sector 62', rentPerHead: 7500,
    roomsAvailable: 1, moveInDate: 'Immediate', stayingSince: 'Jan 2026',
    reason: 'My flatmate had a family emergency and moved back home. Need a replacement urgently. Everything is set up — just need to fill the room.',
    preferences: ['Female only', 'Non-smoker', 'Early Bird ok', 'Vegetarian'],
    contact: 'Connect via CampusNest', posted: '1 day ago', verified: true,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 3, name: 'Dev S.', flatName: 'Sunrise Residency 3BHK',
    city: 'Hyderabad', area: 'Near IIIT campus', rentPerHead: 4800,
    roomsAvailable: 2, moveInDate: '15th April 2026', stayingSince: 'Jun 2025',
    reason: 'Both my flatmates graduated and left. I\'m continuing my Master\'s. Need 2 students to share the flat — preferably from IIIT or BITS.',
    preferences: ['Non-smoker', 'Anything diet ok', 'Flexible schedule', 'Gym enthusiast preferred'],
    contact: 'Connect via CampusNest', posted: '3 days ago', verified: false,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function SoloSeekerPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SoloPost[]>(SEED_POSTS);
  const [showForm, setShowForm] = useState(false);
  const [requested, setRequested] = useState<number[]>([]);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    flatName: '',
    city: '',
    area: '',
    rentPerHead: '',
    roomsAvailable: '1',
    moveInDate: '',
    stayingSince: '',
    reason: '',
    preferences: '',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const newPost: SoloPost = {
      id: Date.now(),
      name: user?.name?.split(' ')[0] + ' ' + (user?.name?.split(' ')[1]?.[0] || '') + '.',
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10b981&color=fff`,
      flatName: form.flatName,
      city: form.city,
      area: form.area,
      rentPerHead: parseInt(form.rentPerHead) || 5000,
      roomsAvailable: parseInt(form.roomsAvailable) || 1,
      moveInDate: form.moveInDate,
      stayingSince: form.stayingSince,
      reason: form.reason,
      preferences: form.preferences.split(',').map(p => p.trim()).filter(Boolean),
      contact: 'Connect via CampusNest',
      posted: 'Just now',
      verified: true,
    };

    setPosts(prev => [newPost, ...prev]);
    setLoading(false);
    setShowForm(false);
    setForm({ flatName: '', city: '', area: '', rentPerHead: '', roomsAvailable: '1', moveInDate: '', stayingSince: '', reason: '', preferences: '' });
    showToast('Your Solo Seeker post is live! We\'ll notify matched students within 24 hours. 🎉');
  };

  const handleConnect = (id: number, name: string) => {
    setRequested(prev => [...prev, id]);
    showToast(`Connection request sent to ${name}! They'll be notified on CampusNest.`);
  };

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-pulse max-w-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🤝</span>
              <h2 className="text-xl font-black">Solo Roommate Seeker</h2>
            </div>
            <p className="text-amber-100 text-sm max-w-xl leading-relaxed">
              Already in a flat but your roommate moved out? Don't struggle alone — post your open spot and we'll match you with compatible students instantly. Or browse existing posts and fill someone's empty room!
            </p>
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            className="shrink-0 bg-white text-amber-700 font-black px-5 py-2.5 rounded-xl hover:bg-amber-50 transition flex items-center gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            {showForm ? 'Close Form' : 'Post My Open Spot'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-amber-400/40">
          {[['12', 'Active Seekers'], ['48hr', 'Avg Match Time'], ['94%', 'Match Success Rate']].map(([v, l]) => (
            <div key={l}>
              <div className="text-xl font-black text-white">{v}</div>
              <div className="text-xs text-amber-200">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 space-y-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-500" /> Post Your Open Room Spot
          </h3>
          <p className="text-sm text-slate-500">Tell us about your current flat and what kind of roommate you're looking for. We'll notify matched students from our database.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Flat / Building Name</label>
              <input required value={form.flatName} onChange={f('flatName')} placeholder="e.g. GreenView 3BHK, Tower B"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">City</label>
              <input required value={form.city} onChange={f('city')} placeholder="e.g. Noida, Delhi, Pune"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Area / Locality</label>
              <input required value={form.area} onChange={f('area')} placeholder="e.g. Knowledge Park, Sector 62"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Rent Per Head (₹/mo)</label>
              <input required type="number" min={1000} value={form.rentPerHead} onChange={f('rentPerHead')} placeholder="e.g. 6500"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Rooms Available</label>
              <select value={form.roomsAvailable} onChange={f('roomsAvailable')}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {['1', '2', '3'].map(n => <option key={n} value={n}>{n} room{n !== '1' ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Available From</label>
              <input required value={form.moveInDate} onChange={f('moveInDate')} placeholder="e.g. 1st April 2026 / Immediate"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">You've Been Staying Since</label>
              <input required value={form.stayingSince} onChange={f('stayingSince')} placeholder="e.g. August 2025"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Preferences (comma-separated)</label>
              <input value={form.preferences} onChange={f('preferences')} placeholder="e.g. Non-smoker, Vegetarian, Early Bird"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Why Did Your Roommate Leave? (Helps students understand the situation)</label>
              <textarea required rows={3} value={form.reason} onChange={f('reason')}
                placeholder="e.g. My flatmate got a job in another city and had to move out suddenly. Looking for a replacement ASAP…"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-3">
                📣 Once posted, we'll send instant notifications to all registered students in your city who match your preferences. Average response time: 24–48 hours.
              </div>
              <button type="submit" disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black py-3 px-8 rounded-xl text-sm transition flex items-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</> : <><Send className="w-4 h-4" /> Post Open Spot</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '📢', title: 'Post Your Open Spot', desc: 'Tell us about your empty room — we notify matched students instantly.' },
          { icon: '🤖', title: 'AI Compatibility Match', desc: 'Our AI scores every interested student on 20+ lifestyle parameters.' },
          { icon: '✅', title: 'Connect & Move In', desc: 'Accept the best match and they move in — zero brokerage, zero hassle.' },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-bold text-slate-900 text-sm mb-1">{item.title}</div>
            <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Active Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Active Open Spots ({posts.length})
          </h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Updated in real-time</span>
        </div>

        <div className="space-y-4">
          {posts.map(post => {
            const isRequested = requested.includes(post.id);
            const isOwnPost = post.name.split(' ')[0] === user?.name?.split(' ')[0];

            return (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {post.name}
                          {post.verified && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">✓ Verified</span>}
                          {isOwnPost && <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">Your Post</span>}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Posted {post.posted}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-slate-900">₹{post.rentPerHead.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-slate-400">per head/mo</div>
                    </div>
                  </div>

                  {/* Flat Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-0.5"><Home className="w-3 h-3" /> Flat</div>
                      <div className="text-xs font-bold text-slate-800 truncate">{post.flatName}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-0.5"><MapPin className="w-3 h-3" /> Location</div>
                      <div className="text-xs font-bold text-slate-800">{post.area}, {post.city}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">🛏️ Rooms Open</div>
                      <div className="text-xs font-bold text-slate-800">{post.roomsAvailable} room{post.roomsAvailable > 1 ? 's' : ''}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">📅 Available</div>
                      <div className="text-xs font-bold text-slate-800">{post.moveInDate}</div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <div className="text-[10px] font-bold text-amber-700 uppercase mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Why Roommate Left
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">{post.reason}</p>
                  </div>

                  {/* Preferences & Staying since */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] font-bold text-slate-500 mr-1">Looking for:</span>
                    {post.preferences.map(p => (
                      <span key={p} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">✓ {p}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Currently staying since <strong className="text-slate-800">{post.stayingSince}</strong>
                    </div>

                    {!isOwnPost && (
                      <button
                        onClick={() => handleConnect(post.id, post.name)}
                        disabled={isRequested}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition ${
                          isRequested
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                        }`}
                      >
                        {isRequested
                          ? <><CheckCircle className="w-3.5 h-3.5" /> Request Sent</>
                          : <><MessageCircle className="w-3.5 h-3.5" /> I'm Interested</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
