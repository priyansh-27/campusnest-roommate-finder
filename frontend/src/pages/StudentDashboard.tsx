import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accommodationsAPI, roommatesAPI, expensesAPI, maintenanceAPI } from '../services/api';
import { Accommodation, RoommateProfile, Expense, MaintenanceRequest } from '../types';
import StatCard from '../components/StatCard';
import {
  Home, Users, DollarSign, Star, MapPin, ShieldCheck,
  CheckCircle, Clock, PlusCircle, Send, Loader2, Heart, X,
  Wrench, Search, MessageCircle, AlertCircle
} from 'lucide-react';

const AMENITY_ICONS: Record<string, string> = {
  'AC': '❄️', 'WiFi': '📶', '3 Meals': '🍽️', '2 Meals': '🍽️', 'Gym': '🏋️',
  'CCTV': '📷', 'Parking': '🚗', 'Kitchen': '🍳', 'Kitchenette': '🍳',
  'Balcony': '🌿', 'Power Backup': '⚡', 'Security': '🛡️', 'Washing Machine': '🫧',
};

export default function StudentDashboard({ activeTab }: { activeTab: string }) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Accommodation[]>([]);
  const [roommates, setRoomates] = useState<RoommateProfile[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [searchQ, setSearchQ] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Expense form
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Groceries');
  const [expLoading, setExpLoading] = useState(false);

  // Maintenance form
  const [issueText, setIssueText] = useState('');
  const [issuePriority, setIssuePriority] = useState<'low'|'medium'|'high'>('medium');
  const [maintLoading, setMaintLoading] = useState(false);

  // Contact modal
  const [contactAcc, setContactAcc] = useState<Accommodation | null>(null);
  // Liked listings
  const [liked, setLiked] = useState<number[]>([]);
  // Toast
  const [toast, setToast] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [ls, rm, ex, mt] = await Promise.all([
        accommodationsAPI.getAll(),
        roommatesAPI.getMatch(user?.id || 0),
        expensesAPI.getAll(),
        maintenanceAPI.getAll(),
      ]);
      setListings(ls);
      setRoomates(rm);
      setExpenses(ex);
      setMaintenance(mt);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;
    setExpLoading(true);
    try {
      const newExp = await expensesAPI.create({
        title: expTitle,
        amount: parseFloat(expAmount),
        category: expCategory,
        paid_by_id: user?.id || 0,
        paid_by_name: user?.name,
        participants: [user?.name || '', 'Priya Mehta', 'Karan Mehta'],
      });
      setExpenses(prev => [newExp, ...prev]);
      setExpTitle('');
      setExpAmount('');
      showToast('Expense logged and split calculated!');
    } finally {
      setExpLoading(false);
    }
  };

  const handleSettle = async (id: number) => {
    await expensesAPI.settle(id);
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'settled' } : e));
    showToast('Expense marked as settled.');
  };

  const handleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;
    setMaintLoading(true);
    try {
      const newReq = await maintenanceAPI.create({
        tenant_id: user?.id || 0,
        tenant_name: user?.name,
        property_id: 1,
        property_title: 'Prestige Heights PG',
        issue: issueText,
        priority: issuePriority,
      });
      setMaintenance(prev => [newReq, ...prev]);
      setIssueText('');
      showToast('Maintenance request submitted!');
    } finally {
      setMaintLoading(false);
    }
  };

  const filteredListings = listings.filter(l => {
    const matchType = typeFilter === 'ALL' || l.type === typeFilter;
    const matchPrice = l.price <= maxPrice;
    const matchSearch = l.title.toLowerCase().includes(searchQ.toLowerCase()) || l.city.toLowerCase().includes(searchQ.toLowerCase());
    const matchVerified = !verifiedOnly || l.verified;
    return matchType && matchPrice && matchSearch && matchVerified;
  });

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const myShare = expenses.reduce((s, e) => s + (e.split_amount || 0), 0);
  const pendingCount = expenses.filter(e => e.status === 'pending').length;

  const statusColor: Record<string, string> = {
    open: 'bg-rose-100 text-rose-700',
    in_progress: 'bg-amber-100 text-amber-700',
    resolved: 'bg-emerald-100 text-emerald-700',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* ── Dashboard Overview ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Available Listings"  value={listings.filter(l=>l.available).length} icon={<Home className="w-5 h-5" />}        color="emerald" />
            <StatCard title="Roommate Matches"    value={roommates.length}                        icon={<Users className="w-5 h-5" />}       color="blue"    />
            <StatCard title="My Expense Share"    value={`₹${Math.round(myShare).toLocaleString('en-IN')}`} icon={<DollarSign className="w-5 h-5" />} color="amber" />
            <StatCard title="Pending Splits"      value={pendingCount}                            icon={<Clock className="w-5 h-5" />}       color="rose"    />
          </div>

          {/* Featured Listing */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <img
              src="https://images.pexels.com/photos/36195702/pexels-photo-36195702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=1200"
              alt=""
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">⭐ Top Pick</span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">PG</span>
                </div>
                <h3 className="font-black text-slate-900 text-lg">Prestige Heights Premium PG</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> Plot 42, Knowledge Park, Gate 2 · 0.4 km from campus
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">₹12,500<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <button
                  onClick={() => setContactAcc(listings[0])}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-xl transition"
                >
                  Contact Landlord
                </button>
              </div>
            </div>
          </div>

          {/* Top Roommate Matches */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Top Roommate Matches
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roommates.slice(0, 2).map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=3b82f6&color=fff`} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.major} · {r.year}</div>
                    <div className="text-xs text-blue-600 font-bold mt-0.5">Budget: ₹{r.budget_min.toLocaleString('en-IN')}–{r.budget_max.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="text-lg font-black text-blue-600">{r.compatibility_score}%</div>
                    <div className="text-[10px] text-slate-400">match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Housing Search ── */}
      {activeTab === 'housing' && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search listings…"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Types</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Flat</option>
                <option value="Studio">Studio</option>
              </select>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Max Rent</span><span className="font-bold text-emerald-600">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min={5000} max={30000} step={500} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full accent-emerald-600" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="accent-emerald-600 w-4 h-4 rounded" />
                Verified Only
              </label>
            </div>
            <div className="text-xs text-slate-500">Showing <strong className="text-slate-900">{filteredListings.length}</strong> listings · Zero brokerage guaranteed</div>
          </div>

          {/* Listing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredListings.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-slate-900/80 text-white text-xs font-bold px-2 py-1 rounded-lg">{l.type}</span>
                    {l.verified && <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">✓ Verified</span>}
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/95 px-2.5 py-1.5 rounded-xl shadow text-center">
                      <div className="text-[9px] font-bold text-slate-500 uppercase">Safety</div>
                      <div className="text-sm font-black text-emerald-600">🛡️{l.safety_score}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setLiked(p => p.includes(l.id) ? p.filter(x => x !== l.id) : [...p, l.id])}
                    className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow"
                  >
                    <Heart className={`w-4 h-4 ${liked.includes(l.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight flex-1 mr-2">{l.title}</h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{l.rating}</span>
                      <span className="text-xs text-slate-400">({l.reviews_count})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3" /> {l.address} · {l.distance_km}km
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {l.amenities.slice(0, 5).map(a => (
                      <span key={a} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md">
                        {AMENITY_ICONS[a] || '✓'} {a}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹{l.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-500">/month</span>
                      <div className="text-xs text-slate-400">Deposit: ₹{l.deposit.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => setContactAcc(l)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      📞 Contact Free
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
              <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No listings match your filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Roommates ── */}
      {activeTab === 'roommates' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-black mb-1">AI-Powered Roommate Matching</h2>
            <p className="text-blue-100 text-sm">Matched on 20+ lifestyle parameters — sleep schedule, diet, cleanliness, study habits & more.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roommates.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <img
                    src={r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=3b82f6&color=fff`}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-slate-900">{r.name}</h4>
                        <p className="text-xs text-slate-500">{r.major} · {r.year}</p>
                      </div>
                      <div className="bg-blue-600 text-white text-center px-3 py-1.5 rounded-xl">
                        <div className="text-lg font-black leading-none">{r.compatibility_score}%</div>
                        <div className="text-[9px] font-medium">match</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 italic">"{r.bio}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  {[
                    ['😴', 'Sleep', r.sleep_schedule],
                    ['🧹', 'Clean', r.cleanliness],
                    ['🥗', 'Diet', r.diet],
                    ['🤫', 'Study', r.study_habits],
                    ['🚬', 'Smoking', r.smoking === 'No' ? 'Non-smoker' : r.smoking],
                    ['🐾', 'Pets', r.pets],
                  ].map(([icon, label, val]) => (
                    <div key={String(label)} className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">{icon} {label}</div>
                      <div className="font-semibold text-slate-800 text-[11px] truncate">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex-1 text-xs text-slate-600">
                    Budget: <strong className="text-slate-900">₹{r.budget_min.toLocaleString('en-IN')}–{r.budget_max.toLocaleString('en-IN')}</strong>
                  </div>
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                    <MessageCircle className="w-3.5 h-3.5" /> Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Expenses ── */}
      {activeTab === 'expenses' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Group Spend"  value={`₹${totalExpenses.toLocaleString('en-IN')}`} icon={<DollarSign className="w-5 h-5" />} color="emerald" />
            <StatCard title="Your Share"         value={`₹${Math.round(myShare).toLocaleString('en-IN')}`} icon={<DollarSign className="w-5 h-5" />} color="amber" />
            <StatCard title="Pending Splits"     value={pendingCount} icon={<AlertCircle className="w-5 h-5" />} color="rose" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Add expense form */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" /> Log Shared Expense
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-3">
                <input
                  required value={expTitle} onChange={e => setExpTitle(e.target.value)}
                  placeholder="Expense title…"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number" required min={1} value={expAmount} onChange={e => setExpAmount(e.target.value)}
                  placeholder="₹ Amount"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <select
                  value={expCategory} onChange={e => setExpCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {['Groceries','Utilities','Rent','Food','Transport','Study Material','Maintenance'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="submit" disabled={expLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  {expLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Split & Log
                </button>
              </form>
            </div>

            {/* Expense list */}
            <div className="lg:col-span-2 space-y-3">
              {expenses.map(exp => (
                <div key={exp.id} className={`bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4 ${exp.status === 'settled' ? 'opacity-60' : 'border-slate-200'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{exp.title}</span>
                      <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{exp.category}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Paid by <strong className="text-slate-700">{exp.paid_by_name}</strong> · {exp.date} · Split: {exp.participants?.join(', ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-emerald-700 font-semibold">Your share: ₹{Math.round(exp.split_amount || 0)}</div>
                    {exp.status === 'pending' ? (
                      <button
                        onClick={() => handleSettle(exp.id)}
                        className="mt-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-lg transition"
                      >
                        Mark Settled
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold">✓ Settled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Maintenance ── */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" /> New Request
            </h3>
            <form onSubmit={handleMaintenance} className="space-y-3">
              <textarea
                required rows={4} value={issueText} onChange={e => setIssueText(e.target.value)}
                placeholder="Describe the issue (e.g., AC not working, tap leaking)…"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
              <select
                value={issuePriority} onChange={e => setIssuePriority(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <button
                type="submit" disabled={maintLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {maintLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Request
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {maintenance.map(m => (
              <div key={m.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-3">
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${m.priority === 'high' ? 'bg-rose-500' : m.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{m.issue}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.property_title} · {m.created_at}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[m.status]}`}>
                  {m.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Safety ── */}
      {activeTab === 'safety' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-rose-600 to-red-700 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-black mb-1">Safety & Emergency Tools</h2>
            <p className="text-rose-100 text-sm">One-click SOS dispatches your location to campus security, landlord, and emergency contacts.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatCard title="Safety Score – Your PG"   value="98/100" icon={<ShieldCheck className="w-5 h-5" />} color="emerald" />
            <StatCard title="Verified Landlord"        value="Yes"    icon={<CheckCircle className="w-5 h-5" />} color="blue"    />
            <StatCard title="SOS Response Time"        value="<3 sec" icon={<AlertCircle className="w-5 h-5" />} color="amber"   />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {[
                ['Campus Security', '+91 88000 11111', '🛡️'],
                ['Women\'s Safety Helpline', '1091', '👮'],
                ['Ambulance', '102', '🚑'],
                ['Your Landlord – Rajesh Sharma', '+91 98000 00003', '🏠'],
              ].map(([name, num, icon]) => (
                <div key={String(name)} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{name}</div>
                      <div className="font-mono text-xs text-slate-500">{num}</div>
                    </div>
                  </div>
                  <a href={`tel:${num}`} className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Call</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactAcc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <span className="font-bold">Direct Landlord Contact</span>
              <button onClick={() => setContactAcc(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Zero Brokerage • Verified</div>
                <h3 className="font-black text-slate-900">{contactAcc.title}</h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Landlord: {contactAcc.landlord_name}</div>
                <div className="text-2xl font-black font-mono text-emerald-600 tracking-wider">{contactAcc.landlord_phone}</div>
              </div>
              <a
                href={`tel:${contactAcc.landlord_phone}`}
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-3 rounded-xl transition"
              >
                📞 Call Now – Free, No Broker
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
