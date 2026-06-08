import { useState, useEffect } from 'react';
import { accommodationsAPI, usersAPI, maintenanceAPI } from '../services/api';
import { Accommodation, User, MaintenanceRequest } from '../types';
import StatCard from '../components/StatCard';
import {
  Home, Users, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle,
  Search, Trash2, Loader2, RefreshCw,
  Building2, DollarSign
} from 'lucide-react';

export default function AdminDashboard({ activeTab }: { activeTab: string }) {
  const [listings, setListings] = useState<Accommodation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [ls, us, ms, st] = await Promise.all([
        accommodationsAPI.getAll(),
        usersAPI.getAll(),
        maintenanceAPI.getAll(),
        usersAPI.getStats(),
      ]);
      setListings(ls);
      setUsers(us);
      setMaintenance(ms);
      setStats(st);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleVerify = async (id: number) => {
    await accommodationsAPI.verify(id);
    setListings(prev => prev.map(l => l.id === id ? { ...l, verified: true } : l));
    showToast('Listing verified successfully!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this listing?')) return;
    await accommodationsAPI.delete(id);
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Listing deleted.');
  };

  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    open:        'bg-rose-100 text-rose-700',
    in_progress: 'bg-amber-100 text-amber-700',
    resolved:    'bg-emerald-100 text-emerald-700',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* ── Overview ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Listings"        value={stats?.totalListings || 0}        icon={<Home className="w-5 h-5" />}       color="emerald" trend="+12%" />
            <StatCard title="Registered Students"   value={stats?.totalStudents || 0}        icon={<Users className="w-5 h-5" />}      color="blue"    trend="+8%"  />
            <StatCard title="Landlords"             value={stats?.totalLandlords || 0}       icon={<Building2 className="w-5 h-5" />}  color="amber"               />
            <StatCard title="Pending Verification"  value={stats?.pendingVerifications || 0} icon={<AlertTriangle className="w-5 h-5" />} color="rose"             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatCard title="Monthly Revenue"   value={`₹${(284500).toLocaleString('en-IN')}`} subtitle="Across all bookings"      icon={<DollarSign className="w-5 h-5" />}  color="teal"   trend="+23%" />
            <StatCard title="Active Bookings"   value={3}                                       subtitle="Students currently housed" icon={<CheckCircle className="w-5 h-5" />} color="emerald"            />
            <StatCard title="Open Maintenance"  value={maintenance.filter(m=>m.status!=='resolved').length} subtitle="Needs attention" icon={<TrendingUp className="w-5 h-5" />} color="violet" />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Listings */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-600" /> Recent Listings
              </h3>
              <div className="space-y-3">
                {listings.slice(0, 4).map(l => (
                  <div key={l.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <img src={l.images[0]} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{l.title}</div>
                      <div className="text-xs text-slate-500">{l.city} · ₹{l.price.toLocaleString('en-IN')}/mo</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {l.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Requests */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Maintenance Requests
              </h3>
              <div className="space-y-3">
                {maintenance.map(m => (
                  <div key={m.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">{m.issue}</div>
                      <div className="text-xs text-slate-500">{m.tenant_name} · {m.property_title}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[m.status]}`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Listings Management ── */}
      {activeTab === 'housing' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or city..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
              <RefreshCw className="w-4 h-4 text-slate-500" /> Refresh
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Property</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Type</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">City</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Price/mo</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Safety</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Status</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredListings.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={l.images[0]} alt="" className="w-10 h-8 object-cover rounded-lg shrink-0" />
                          <div className="font-medium text-slate-900 text-xs">{l.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded">{l.type}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{l.city}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 text-xs">₹{l.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.safety_score >= 95 ? 'bg-emerald-100 text-emerald-700' : l.safety_score >= 90 ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                          {l.safety_score}/100
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {l.verified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {!l.verified && (
                            <button
                              onClick={() => handleVerify(l.id)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                              title="Verify"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredListings.length === 0 && (
                <div className="text-center py-12 text-slate-400">No listings found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Users Management ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Registered Users ({users.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">User</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Email</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Phone</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Role</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=10b981&color=fff`} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{u.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                          u.role === 'admin' ? 'bg-violet-100 text-violet-700' :
                          u.role === 'student' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{u.created_at?.split('T')[0] || '2026-01-01'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Revenue"      value={`₹2.84L`}   icon={<DollarSign className="w-5 h-5" />}    color="emerald" trend="+23%" />
            <StatCard title="New Registrations"  value={47}          icon={<Users className="w-5 h-5" />}         color="blue"    trend="+12%" />
            <StatCard title="Verified Listings"  value={`${listings.filter(l=>l.verified).length}/${listings.length}`} icon={<ShieldCheck className="w-5 h-5" />} color="violet" />
            <StatCard title="SOS Incidents"      value={0}           icon={<AlertTriangle className="w-5 h-5" />} color="rose"                />
          </div>

          {/* Simple bar chart visualization */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-5">Monthly Booking Revenue (₹)</h3>
            <div className="flex items-end gap-3 h-40">
              {[38000, 52000, 47000, 61000, 74000, 68000, 84500, 91200, 76300, 88500, 102000, 93000].map((v, i) => {
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                const pct = Math.round((v / 102000) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] text-slate-400 font-mono">₹{Math.round(v/1000)}k</div>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-violet-400 transition-all"
                      style={{ height: `${pct}%` }}
                    />
                    <div className="text-[9px] text-slate-500 font-medium">{months[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Listings by Type</h3>
              <div className="space-y-3">
                {[['PG', listings.filter(l=>l.type==='PG').length, 'bg-emerald-500'],
                  ['Hostel', listings.filter(l=>l.type==='Hostel').length, 'bg-blue-500'],
                  ['Flat', listings.filter(l=>l.type==='Flat').length, 'bg-violet-500'],
                  ['Studio', listings.filter(l=>l.type==='Studio').length, 'bg-amber-500']].map(([type, count, color]) => (
                  <div key={String(type)} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm text-slate-700 w-16">{type}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.round((Number(count)/listings.length)*100)}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">User Distribution</h3>
              <div className="space-y-3">
                {[['Students', users.filter(u=>u.role==='student').length, 'bg-emerald-500'],
                  ['Landlords', users.filter(u=>u.role==='landlord').length, 'bg-amber-500'],
                  ['Admins', users.filter(u=>u.role==='admin').length, 'bg-violet-500']].map(([role, count, color]) => (
                  <div key={String(role)} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm text-slate-700 w-20">{role}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.round((Number(count)/users.length)*100)}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Maintenance (Admin) ── */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">All Maintenance Requests</h3>
            <span className="text-xs text-slate-500">{maintenance.length} total</span>
          </div>
          <div className="divide-y divide-slate-100">
            {maintenance.map(m => (
              <div key={m.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition">
                <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${m.priority === 'high' ? 'bg-rose-500' : m.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{m.issue}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.tenant_name} · {m.property_title} · {m.created_at}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[m.status]}`}>
                  {m.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
