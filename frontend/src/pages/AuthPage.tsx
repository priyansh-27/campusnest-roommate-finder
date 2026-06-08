import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { UserRole } from '../types';
import { Eye, EyeOff, GraduationCap, Home, Shield, Loader2, CheckCircle } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.pexels.com/photos/36195702/pexels-photo-36195702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=750',
  'https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=750',
  'https://images.pexels.com/photos/8089161/pexels-photo-8089161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=750',
];

const DEMO_CREDENTIALS = {
  admin:    { email: 'admin@campusnest.in',    password: 'admin123' },
  student:  { email: 'student@campusnest.in',  password: 'student123' },
  landlord: { email: 'landlord@campusnest.in', password: 'landlord123' },
};

interface AuthPageProps {
  initialTab?: 'login' | 'register';
  onBack?: () => void;
}

export default function AuthPage({ initialTab = 'login', onBack }: AuthPageProps) {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [role, setRole] = useState<UserRole>('student');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [heroIdx] = useState(() => Math.floor(Math.random() * HERO_IMAGES.length));

  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError('');
  };

  const autofill = (r: 'admin' | 'student' | 'landlord') => {
    const creds = DEMO_CREDENTIALS[r];
    setForm(f => ({ ...f, email: creds.email, password: creds.password }));
    setRole(r as UserRole);
    setTab('login');
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (tab === 'login') {
        const { user, token } = await authAPI.login(form.email, form.password);
        login(user, token);
      } else {
        const { user, token } = await authAPI.register({ ...form, role });
        setSuccess('Account created! Logging you in…');
        setTimeout(() => login(user, token), 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'student',  label: 'Student',  icon: <GraduationCap className="w-5 h-5" /> },
    { value: 'landlord', label: 'Landlord', icon: <Home className="w-5 h-5" /> },
    { value: 'admin',    label: 'Admin',    icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Left Hero Panel ── */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden flex-col justify-between">
        <img
          src={HERO_IMAGES[heroIdx]}
          alt="Student home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-emerald-900/50" />

        {/* Logo */}
        <div className="relative z-10 p-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-black text-white shadow-lg">
              🪺
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tight">CampusNest</div>
              <div className="text-emerald-300 text-sm font-medium">Student-First Living Platform</div>
            </div>
          </div>
          {onBack && (
            <button onClick={onBack} className="text-white/70 hover:text-white text-sm font-semibold flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl transition">
              ← Browse Listings
            </button>
          )}
        </div>

        {/* Hero text */}
        <div className="relative z-10 px-10 pb-4">
          <h1 className="text-5xl font-black text-white leading-tight mb-3">
            Find Your Perfect<br />
            <span className="text-emerald-400">Student Home.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Verified PGs, hostels & flats. Zero brokerage. AI-powered roommate matching. Smart expense splitting.
          </p>

          {/* 3 mini property images */}
          <div className="flex gap-3 mt-6">
            {HERO_IMAGES.map((img, i) => (
              <img key={i} src={img} alt="" className="w-28 h-20 object-cover rounded-xl border-2 border-white/20 shadow-lg" />
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 mb-10">
            {[['500+', 'Verified Listings'], ['₹0', 'Brokerage Fee'], ['2K+', 'Happy Students']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="text-2xl font-black text-emerald-400">{val}</div>
                <div className="text-xs text-slate-400">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-6 text-xs text-slate-500">
          © 2026 CampusNest. All rights reserved.
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="flex-1 bg-white flex flex-col justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl text-white">🪺</div>
          <span className="font-black text-xl text-slate-900">CampusNest</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-8">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Role selector (always shown) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map(({ value, label, icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRole(value)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      role === value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name (register only) */}
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text" required value={form.name} onChange={handle('name')}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email" required value={form.email} onChange={handle('email')}
                placeholder="you@campusnest.in"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Phone (register only) */}
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                <input
                  type="tel" required value={form.phone} onChange={handle('phone')}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required value={form.password} onChange={handle('password')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                {error} Try a demo account below.
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'student', 'landlord'] as const).map(r => {
                const colors = {
                  admin:    'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
                  student:  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                  landlord: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                };
                const icons = { admin: '🛡️', student: '🎓', landlord: '🏠' };
                return (
                  <button
                    key={r}
                    onClick={() => autofill(r)}
                    className={`border text-xs font-semibold py-2 px-3 rounded-xl transition capitalize flex items-center justify-center gap-1.5 ${colors[r]}`}
                  >
                    <span>{icons[r]}</span>
                    <span>{r}</span>
                    <span className="text-slate-400">›</span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Click to auto-fill credentials, then Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
}
