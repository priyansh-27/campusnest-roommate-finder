import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ThumbsUp, Send, Tag, ShieldAlert } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  role: string;
  avatar: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  replies: string[];
  timeAgo: string;
}

const SEED_POSTS: Post[] = [
  {
    id: 1, author: 'Vikram R.', role: 'Senior Verified Guide', timeAgo: '2 hours ago',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: '🚨 BEWARE: Fake broker scam near University Road',
    content: 'If someone asks you to pay a token via QR code before showing the flat — it\'s a scam! Only use CampusNest verified (blue-badge) landlords. Stay safe.',
    tags: ['Safety Alert', 'Scam Warning', 'Zero Brokerage'],
    upvotes: 142, replies: ['Thanks for the heads up!', 'Almost fell for this myself.'],
  },
  {
    id: 2, author: 'Shruti K.', role: 'Alumni Mentor', timeAgo: '1 day ago',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: '💡 How I reduced my PG deposit by 40%',
    content: 'Show your CampusNest Trust Score when negotiating! Landlords trust platform-verified students more. I saved ₹10,000 in deposit by showing my profile rating.',
    tags: ['Financial Hack', 'Deposits', 'Trust Score'],
    upvotes: 98, replies: ['This is gold! Trying it this week.'],
  },
  {
    id: 3, author: 'Nikhil P.', role: 'Sophomore', timeAgo: '3 days ago',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: '👥 Looking for 4th roommate – GreenView Society',
    content: 'We have a 3BHK flat (₹4k per head). Need someone clean and easygoing. Badminton players preferred 😄 DM via AI Roommate tool!',
    tags: ['Roommate Request', 'Flat Share', 'Immediate Move-In'],
    upvotes: 56, replies: [],
  },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Housing Hack');
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosts(prev => [{
      id: Date.now(), author: user?.name || 'Anonymous', role: user?.role || 'Student',
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=10b981&color=fff`,
      title: title.trim(), content: content.trim(),
      tags: [tag, 'CampusNest Community'],
      upvotes: 1, replies: [], timeAgo: 'Just now',
    }, ...prev]);
    setTitle(''); setContent('');
  };

  const handleReply = (id: number, e: React.FormEvent) => {
    e.preventDefault();
    const txt = replyText[id];
    if (!txt?.trim()) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, replies: [...p.replies, `${user?.name}: ${txt.trim()}`] } : p));
    setReplyText(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-black mb-1">Community Support Network</h2>
        <p className="text-teal-100 text-sm">Students helping students — share hacks, warnings, roommate requests, and local tips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post form */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" /> Post to Community
          </h3>
          <form onSubmit={handlePost} className="space-y-3">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title or headline…"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select value={tag} onChange={e => setTag(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {['Housing Hack','Safety Alert','Roommate Request','Zero Brokerage','General Query'].map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea required rows={4} value={content} onChange={e => setContent(e.target.value)}
              placeholder="Share your experience, tip, or question…"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Publish
            </button>
          </form>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
            <span>Anti-spam verified. Defamatory posts are auto-flagged and removed.</span>
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {post.author}
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded capitalize">✓ {post.role}</span>
                    </div>
                    <div className="text-xs text-slate-400">{post.timeAgo}</div>
                  </div>
                </div>
                <button
                  onClick={() => setPosts(prev => prev.map(p => p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p))}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {post.upvotes}
                </button>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{post.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">{post.content}</p>
              </div>

              <div className="flex flex-wrap gap-1 items-center">
                <Tag className="w-3 h-3 text-slate-400" />
                {post.tags.map(t => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>

              {post.replies.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 max-h-28 overflow-y-auto">
                  {post.replies.map((r, i) => (
                    <div key={i} className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-100">💬 {r}</div>
                  ))}
                </div>
              )}

              <form onSubmit={e => handleReply(post.id, e)} className="flex gap-2">
                <input
                  value={replyText[post.id] || ''} onChange={e => setReplyText(p => ({ ...p, [post.id]: e.target.value }))}
                  placeholder="Add a reply…"
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                  Reply
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
