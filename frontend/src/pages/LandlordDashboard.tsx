import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accommodationsAPI, maintenanceAPI, proofsAPI } from '../services/api';
import { Accommodation, MaintenanceRequest } from '../types';
import StatCard from '../components/StatCard';
import {
  Home, DollarSign, Star, MapPin, PlusCircle, CheckCircle, Loader2,
  Wrench, MessageSquare, AlertCircle, Camera, X, Crown, ShieldCheck, FileCheck
} from 'lucide-react';
import SubscriptionPage from './SubscriptionPage';
import ProofVerificationPage from './ProofVerificationPage';

const AMENITY_OPTIONS = ['AC', 'WiFi', 'Meals', 'Gym', 'CCTV', 'Parking', 'Kitchen', 'Balcony', 'Power Backup', 'Security', 'Washing Machine'];

export default function LandlordDashboard({ activeTab, setActiveTab }: { activeTab: string; setActiveTab?: (t: string) => void }) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Accommodation[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Subscription state — in production, fetched from Neon DB via Spring Boot
  const [activePlan, setActivePlan] = useState<'starter' | 'growth' | 'pro' | null>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  // Proof verification status (from backend)
  const [hasApprovedProof, setHasApprovedProof] = useState(false);
  const [pendingProofCount, setPendingProofCount] = useState(0);

  // Add listing form
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'PG' as Accommodation['type'], city: '', address: '',
    price: '', deposit: '', distance_km: '', description: '',
    amenities: [] as string[],
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [ls, mt, proofStatus] = await Promise.all([
        accommodationsAPI.getByLandlord(user?.id || 0),
        maintenanceAPI.getByLandlord(user?.id || 0),
        proofsAPI.getStatus(user?.id || 0).catch(() => ({ approved: 0, pending: 0, canListProperty: false })),
      ]);
      setListings(ls);
      setMaintenance(mt);
      setHasApprovedProof(proofStatus.canListProperty);
      setPendingProofCount(proofStatus.pending || 0);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const newListing = await accommodationsAPI.create({
        ...form,
        price: parseFloat(form.price),
        deposit: parseFloat(form.deposit),
        distance_km: parseFloat(form.distance_km),
        landlord_id: user?.id || 0,
        landlord_name: user?.name,
        landlord_phone: user?.phone,
      });
      setListings(prev => [newListing, ...prev]);
      setFormOpen(false);
      setForm({ title:'', type:'PG', city:'', address:'', price:'', deposit:'', distance_km:'', description:'', amenities:[] });
      showToast('Property listed successfully! Pending admin verification.');
    } finally {
      setFormLoading(false);
    }
  };

  const toggleAmenity = (a: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  const handleResolve = async (id: number) => {
    await maintenanceAPI.updateStatus(id, 'resolved');
    setMaintenance(prev => prev.map(m => m.id === id ? { ...m, status: 'resolved' } : m));
    showToast('Maintenance request resolved!');
  };

  const totalRevenue = listings.reduce((s, l) => s + l.price, 0);
  const avgRating = listings.length ? (listings.reduce((s, l) => s + l.rating, 0) / listings.length).toFixed(1) : '—';
  const openRequests = maintenance.filter(m => m.status !== 'resolved').length;

  const statusColor: Record<string, string> = {
    open:        'bg-rose-100 text-rose-700',
    in_progress: 'bg-amber-100 text-amber-700',
    resolved:    'bg-emerald-100 text-emerald-700',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
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
            <StatCard title="My Properties"     value={listings.length}                               icon={<Home className="w-5 h-5" />}        color="amber"   />
            <StatCard title="Monthly Revenue"   value={`₹${totalRevenue.toLocaleString('en-IN')}`}   icon={<DollarSign className="w-5 h-5" />}  color="emerald" trend="+8%" />
            <StatCard title="Avg Rating"        value={avgRating}                                      icon={<Star className="w-5 h-5" />}        color="blue"    />
            <StatCard title="Open Requests"     value={openRequests}                                   icon={<AlertCircle className="w-5 h-5" />} color="rose"    />
          </div>

          {/* My Properties */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">My Properties</h3>
              <button
                onClick={() => setFormOpen(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
              >
                <PlusCircle className="w-4 h-4" /> Add Listing
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {listings.map(l => (
                <div key={l.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition">
                  <img src={l.images[0]} alt="" className="w-16 h-12 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">{l.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {l.city} · ₹{l.price.toLocaleString('en-IN')}/mo
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {l.verified ? '✓ Verified' : '⏳ Pending'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{l.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Home className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No properties listed yet. Add your first listing!</p>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" /> Recent Maintenance Requests
            </h3>
            <div className="space-y-3">
              {maintenance.slice(0, 3).map(m => (
                <div key={m.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${m.priority === 'high' ? 'bg-rose-500' : m.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm">{m.issue}</div>
                    <div className="text-xs text-slate-500">{m.tenant_name} · {m.created_at}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[m.status]}`}>
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
              {maintenance.length === 0 && <p className="text-sm text-slate-400">No maintenance requests.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Housing (My Listings detail) ── */}
      {activeTab === 'housing' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-black text-slate-900 text-lg">My Property Listings</h2>
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" /> Add New Listing
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {listings.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="relative h-44">
                  <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.verified ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                        {l.verified ? '✓ Verified' : '⏳ Pending Verification'}
                      </span>
                    </div>
                    <div className="bg-white/95 px-2 py-1 rounded-lg text-center">
                      <div className="text-[9px] text-slate-500">Safety</div>
                      <div className="text-xs font-black text-emerald-600">🛡️{l.safety_score}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-black text-slate-900 mb-1">{l.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3" /> {l.address}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="font-black text-slate-900">₹{l.price.toLocaleString('en-IN')}</div>
                      <div className="text-slate-400">per month</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="font-black text-slate-900">{l.rating}</div>
                      <div className="text-slate-400">rating</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="font-black text-slate-900">{l.reviews_count}</div>
                      <div className="text-slate-400">reviews</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {l.amenities.slice(0, 4).map(a => (
                      <span key={a} className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded">✓ {a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Maintenance ── */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Open Requests"    value={maintenance.filter(m=>m.status==='open').length}        icon={<AlertCircle className="w-5 h-5" />} color="rose"    />
            <StatCard title="In Progress"      value={maintenance.filter(m=>m.status==='in_progress').length} icon={<Wrench className="w-5 h-5" />}      color="amber"   />
            <StatCard title="Resolved"         value={maintenance.filter(m=>m.status==='resolved').length}    icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Tenant Maintenance Requests</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {maintenance.map(m => (
                <div key={m.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition">
                  <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${m.priority === 'high' ? 'bg-rose-500' : m.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm">{m.issue}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {m.tenant_name} · {m.property_title} · {m.created_at} · Priority: <strong className="capitalize">{m.priority}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[m.status]}`}>
                      {m.status.replace('_', ' ')}
                    </span>
                    {m.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolve(m.id)}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-lg transition"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {maintenance.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">No maintenance requests for your properties.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Subscription Tab ── */}
      {activeTab === 'subscription' && (
        <div className="space-y-4">
          {pendingPlan && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
              <div>
                <span className="font-bold text-amber-900">Verification Pending: </span>
                <span className="text-amber-800 text-sm">Your payment for the <strong className="capitalize">{pendingPlan}</strong> plan is currently under review by our admin. Please allow up to 4 hours for activation.</span>
              </div>
            </div>
          )}
          <SubscriptionPage
            currentPlan={activePlan}
            onSubscribe={(plan: { id: string; name: string }) => {
              setPendingPlan(plan.id);
              showToast(`✅ Payment details submitted for ${plan.name} plan! An admin will verify and activate your subscription shortly.`);
            }}
          />
        </div>
      )}

      {/* ── Proof Verification Tab ── */}
      {activeTab === 'proofs' && (
        <ProofVerificationPage setActiveTab={setActiveTab} />
      )}

      {/* ── Add Listing — STEP 1: Need Proof ── */}
      {activeTab === 'add-listing' && !hasApprovedProof && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="font-black text-slate-900 text-xl mb-2">Property Proof Required</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              {pendingProofCount > 0
                ? `You have ${pendingProofCount} document${pendingProofCount > 1 ? 's' : ''} under admin review. Please wait for approval (typically 4–24 hours).`
                : 'Before listing properties, you must upload at least one verified document (electricity bill, property deed, etc.) to confirm you\'re the legitimate owner. This protects students from fraud.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs text-slate-600">
              {[['⚡', 'Electricity Bill'], ['📜', 'Property Deed'], ['🧾', 'Tax Receipt'], ['🆔', 'Aadhaar']].map(([icon, name]) => (
                <div key={String(name)} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-bold text-slate-900 text-[11px]">{name}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab?.('proofs')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-3 rounded-xl transition shadow-md flex items-center gap-2 mx-auto"
            >
              <FileCheck className="w-4 h-4" /> {pendingProofCount > 0 ? 'View My Submissions' : 'Upload Proof Now'}
            </button>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>This 2-step verification (Proof + Subscription) is what makes CampusNest the most trusted student platform — students know every landlord is real and verified.</span>
          </div>
        </div>
      )}

      {/* ── Add Listing — STEP 2: Need Subscription ── */}
      {activeTab === 'add-listing' && hasApprovedProof && !activePlan && (
        <div className="max-w-2xl">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Step 1 complete ✓ Property proof verified by admin.</span>
          </div>
          
          {pendingPlan ? (
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="font-black text-slate-900 text-xl mb-2">Step 2: Subscription Pending</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Your payment for the <strong className="capitalize">{pendingPlan}</strong> plan is currently being verified by our admin. You will be able to list your properties as soon as it is approved.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div>
              <h2 className="font-black text-slate-900 text-xl mb-2">Step 2: Subscription Required</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Now choose a plan to start publishing your verified properties to thousands of students.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs text-slate-600">
                {[['🥉', 'Starter', '₹999/mo', '1 listing'], ['🥈', 'Growth', '₹1,999/mo', '3 listings'], ['🥇', 'Pro', '₹3,999/mo', 'Unlimited']].map(([icon, name, price, count]) => (
                  <div key={String(name)} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="font-bold text-slate-900">{name}</div>
                    <div className="text-emerald-600 font-bold">{price}</div>
                    <div className="text-slate-400">{count}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab?.('subscription')}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-3 rounded-xl transition shadow-md flex items-center gap-2 mx-auto"
              >
                <Crown className="w-4 h-4" /> View Subscription Plans
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Add Listing — Both verified! Show form ── */}
      {activeTab === 'add-listing' && hasApprovedProof && activePlan && (
        <div className="max-w-2xl">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✓ Verified ({activePlan} plan) — You can add {activePlan === 'starter' ? '1' : activePlan === 'growth' ? 'up to 3' : 'unlimited'} listings.</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-500" /> Add New Property Listing
            </h2>
            <form onSubmit={handleAddListing} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Property Title</label>
                  <input required value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
                    placeholder="e.g. Prestige Heights PG"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value as any}))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {['PG','Hostel','Flat','Studio'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">City</label>
                  <input required value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))}
                    placeholder="e.g. Noida"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Address</label>
                  <input required value={form.address} onChange={e => setForm(f=>({...f,address:e.target.value}))}
                    placeholder="Plot/House no., Area, Landmark"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Monthly Rent (₹)</label>
                  <input required type="number" min={1} value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))}
                    placeholder="e.g. 12500"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Security Deposit (₹)</label>
                  <input required type="number" min={0} value={form.deposit} onChange={e => setForm(f=>({...f,deposit:e.target.value}))}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Distance from Campus (km)</label>
                  <input required type="number" step="0.1" min={0} value={form.distance_km} onChange={e => setForm(f=>({...f,distance_km:e.target.value}))}
                    placeholder="e.g. 0.4"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                  placeholder="Describe your property, facilities, rules…"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map(a => (
                    <button
                      type="button" key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
                        form.amenities.includes(a)
                          ? 'bg-amber-100 border-amber-400 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <Camera className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Photos will be collected by our on-ground verification team within 48 hours. Your listing will go live after admin approval.</span>
              </div>

              <button type="submit" disabled={formLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Community tab (simple) ── */}
      {activeTab === 'community' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-16">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-lg">Tenant Community Feed</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">See tenant reviews and discussions about your properties. Coming soon.</p>
        </div>
      )}

      {/* Add Listing Modal (if opened from dashboard) */}
      {formOpen && activeTab !== 'add-listing' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl my-4">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900">Add New Listing</h3>
              <button onClick={() => setFormOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">Switch to the <strong>"Add Listing"</strong> tab to fill in the full property form.</p>
              <button onClick={() => setFormOpen(false)} className="w-full bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
