import { useState } from 'react';
import {
  Search, MapPin, Home, Users, Star,
  ChevronRight, Lock, ArrowRight, Sparkles
} from 'lucide-react';

const LISTINGS = [
  {
    id: 1, title: 'Prestige Heights Premium PG', type: 'PG', city: 'Noida',
    price: 12500, rating: 4.8, reviews: 48, safety: 98, verified: true,
    distance: '0.4 km', img: 'https://images.pexels.com/photos/36195702/pexels-photo-36195702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500',
    amenities: ['AC', 'WiFi', '3 Meals', 'CCTV'],
  },
  {
    id: 2, title: 'Scholar Nest Co-ed Hostel', type: 'Hostel', city: 'Delhi',
    price: 8500, rating: 4.5, reviews: 32, safety: 94, verified: true,
    distance: '1.2 km', img: 'https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500',
    amenities: ['WiFi', '2 Meals', 'Gym', 'Study Room'],
  },
  {
    id: 3, title: 'GreenView 3BHK Flat Share', type: 'Flat', city: 'Pune',
    price: 16000, rating: 4.7, reviews: 19, safety: 91, verified: true,
    distance: '2.0 km', img: 'https://images.pexels.com/photos/8089161/pexels-photo-8089161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500',
    amenities: ['AC', 'Kitchen', 'Parking', 'Balcony'],
  },
  {
    id: 4, title: 'NestPro Executive Studio', type: 'Studio', city: 'Bangalore',
    price: 21000, rating: 4.9, reviews: 65, safety: 99, verified: true,
    distance: '0.8 km', img: 'https://images.pexels.com/photos/6782578/pexels-photo-6782578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500',
    amenities: ['AC', 'Kitchenette', 'Housekeeping', 'Gigabit WiFi'],
  },
  {
    id: 5, title: 'Campus View Budget PG', type: 'PG', city: 'Hyderabad',
    price: 6500, rating: 4.1, reviews: 22, safety: 88, verified: false,
    distance: '0.2 km', img: 'https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500',
    amenities: ['WiFi', 'Mess', 'Security'],
  },
  {
    id: 6, title: 'Urban Nest Shared 2BHK', type: 'Flat', city: 'Mumbai',
    price: 18000, rating: 4.6, reviews: 41, safety: 93, verified: true,
    distance: '1.5 km', img: 'https://images.pexels.com/photos/36195703/pexels-photo-36195703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500',
    amenities: ['AC', 'Kitchen', 'Power Backup', 'Security'],
  },
];

const ROOMMATES = [
  { id: 1, name: 'Priya M.', major: 'Economics', city: 'Noida', budget: '₹8k–15k', sleep: 'Early Bird', img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 2, name: 'Rahul K.', major: 'Computer Science', city: 'Noida', budget: '₹7k–14k', sleep: 'Night Owl', img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: 3, name: 'Ananya S.', major: 'Architecture', city: 'Delhi', budget: '₹9k–16k', sleep: 'Night Owl', img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

interface Props {
  onLoginClick: (tab?: 'login' | 'register') => void;
}

export default function LandingPage({ onLoginClick }: Props) {
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('ALL');
  const [maxBudget, setMaxBudget] = useState(25000);
  const [activeSection, setActiveSection] = useState<'rooms' | 'roommates'>('rooms');

  const filtered = LISTINGS.filter(l => {
    const matchCity = !searchCity || l.city.toLowerCase().includes(searchCity.toLowerCase()) || l.title.toLowerCase().includes(searchCity.toLowerCase());
    const matchType = searchType === 'ALL' || l.type === searchType;
    const matchBudget = l.price <= maxBudget;
    return matchCity && matchType && matchBudget;
  });

  const gateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLoginClick('register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-lg">🪺</div>
            <span className="font-black text-slate-900 text-xl">CampusNest</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">BETA</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onLoginClick('login')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-2">
              Login
            </button>
            <button onClick={() => onLoginClick('register')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm">
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=1400" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Student-First Living Platform
            </div>
            <h1 className="text-5xl font-black leading-tight mb-4">
              Find Your Perfect<br />
              <span className="text-emerald-400">Student Home.</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Verified PGs, hostels & flats. Zero brokerage. AI-powered roommate matching. Smart expense splitting.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  placeholder="City, college or area…"
                  className="w-full pl-9 pr-3 py-3 text-slate-800 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="px-3 py-3 text-slate-700 text-sm bg-slate-50 rounded-xl focus:outline-none border border-slate-200"
              >
                <option value="ALL">All Types</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Flat</option>
                <option value="Studio">Studio</option>
              </select>
              <button onClick={() => setActiveSection('rooms')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 whitespace-nowrap">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {['Noida', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Mumbai'].map(city => (
                <button key={city} onClick={() => setSearchCity(city)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition border border-white/20">
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-8 overflow-x-auto">
            {[['500+', 'Verified Listings'], ['₹0', 'Brokerage Fee'], ['2,400+', 'Happy Students'], ['20+', 'AI Match Params'], ['15 days', 'Avg Time Saved']].map(([v, l]) => (
              <div key={l} className="text-center whitespace-nowrap">
                <div className="text-2xl font-black text-emerald-400">{v}</div>
                <div className="text-xs text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section Toggle ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveSection('rooms')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeSection === 'rooms' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'}`}
          >
            <Home className="w-4 h-4" /> Browse Rooms
          </button>
          <button
            onClick={() => setActiveSection('roommates')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeSection === 'roommates' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
          >
            <Users className="w-4 h-4" /> Find Roommates
          </button>
        </div>

        {/* ── ROOMS ── */}
        {activeSection === 'rooms' && (
          <>
            {/* Budget Filter */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-48">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Max Budget</span>
                  <span className="font-bold text-emerald-600">₹{maxBudget.toLocaleString('en-IN')}/mo</span>
                </div>
                <input type="range" min={5000} max={30000} step={500} value={maxBudget} onChange={e => setMaxBudget(+e.target.value)} className="w-full accent-emerald-600" />
              </div>
              <div className="text-xs text-slate-500">
                Showing <strong className="text-slate-900">{filtered.length}</strong> listings · Zero brokerage guaranteed
              </div>
            </div>

            {/* Listing Grid — blurred cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((listing, idx) => {
                const isBlurred = idx >= 3; // first 3 fully visible, rest blurred
                return (
                  <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    {/* Image */}
                    <div className="relative h-44">
                      <img src={listing.img} alt={listing.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">{listing.type}</span>
                        {listing.verified && <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Verified</span>}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-lg shadow text-center">
                        <div className="text-[9px] font-bold text-slate-500 uppercase">Safety</div>
                        <div className="text-xs font-black text-emerald-600">🛡️{listing.safety}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight flex-1 mr-2">{listing.title}</h3>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-700">{listing.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" /> {listing.city} · {listing.distance} from campus
                      </p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {listing.amenities.map(a => (
                          <span key={a} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md">✓ {a}</span>
                        ))}
                      </div>

                      {/* Price row — blurred if not first 3 */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-xl font-black text-slate-900">₹{listing.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-slate-400">/mo</span>
                        </div>

                        {isBlurred ? (
                          /* Blurred details + lock gate */
                          <div className="relative">
                            <div className="blur-sm pointer-events-none bg-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 select-none">
                              View Details
                            </div>
                            <button
                              onClick={gateClick}
                              className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl text-white text-xs font-bold gap-1 hover:bg-slate-800 transition"
                            >
                              <Lock className="w-3 h-3" /> Login
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={gateClick}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
                          >
                            View Details <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Landlord name blurred for non-logged in */}
                      {!isBlurred && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Landlord: </span>
                          <span className="blur-sm bg-slate-100 rounded px-2 text-slate-400 select-none cursor-pointer" onClick={gateClick}>
                            Raj**** Sha**** +91 98●●●
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sign up gate banner */}
            <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg mb-1">See full details, contact landlords & more</h3>
                <p className="text-emerald-100 text-sm">Create a free account to unlock all listings, direct landlord contact, AI roommate matching & expense splitting.</p>
              </div>
              <button
                onClick={() => onLoginClick('register')}
                className="shrink-0 bg-white text-emerald-700 font-black px-6 py-3 rounded-xl hover:bg-emerald-50 transition flex items-center gap-2"
              >
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ── ROOMMATES ── */}
        {activeSection === 'roommates' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-black mb-1">AI-Powered Roommate Matching</h2>
              <p className="text-blue-100 text-sm">Matched on 20+ lifestyle parameters. Login to see your full compatibility scores.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ROOMMATES.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={r.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">{r.major}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs mb-4">
                    <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-400">📍 City</span><br /><strong>{r.city}</strong></div>
                    <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-400">💰 Budget</span><br /><strong>{r.budget}</strong></div>
                    <div className="bg-slate-50 p-2 rounded-lg col-span-2"><span className="text-slate-400">😴 Sleep</span><br /><strong>{r.sleep}</strong></div>
                  </div>
                  {/* Blurred compatibility + gate */}
                  <div className="relative pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Compatibility Score:</span>
                      <span className="blur-sm bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-xl text-lg select-none">96%</span>
                    </div>
                    <button
                      onClick={gateClick}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Login to Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Solo Roommate Seeker preview */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🤝</div>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Lost a Roommate? Need to Fill a Spot?</h3>
                <p className="text-amber-800 text-sm">Already in a flat but a roommate left? Register as a Solo Seeker and we'll match you with compatible students instantly.</p>
                <button onClick={gateClick} className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                  Register as Solo Seeker →
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg mb-1">Get your full AI compatibility match</h3>
                <p className="text-blue-100 text-sm">Login to see scores, chat with potential roommates and connect instantly.</p>
              </div>
              <button onClick={() => onLoginClick('register')} className="shrink-0 bg-white text-blue-700 font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Features ── */}
      <div className="bg-slate-900 text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-center mb-10">What CampusNest does</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏠', title: 'Verified Housing', desc: 'Photo/video proof. Zero broker fees. Direct landlord contact.' },
              { icon: '🤖', title: 'AI Roommate Match', desc: 'ChatGPT-style AI bot matches you on 20+ lifestyle parameters.' },
              { icon: '💰', title: 'Smart Expenses', desc: 'Auto-split rent, groceries and utilities among flatmates.' },
              { icon: '🛡️', title: 'Safety First', desc: 'Safety scores, emergency SOS, verified landlords.' },
            ].map(f => (
              <div key={f.title} className="text-center p-5 bg-slate-800 rounded-2xl">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-black text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onLoginClick('register')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl text-lg transition shadow-xl inline-flex items-center gap-2"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-slate-500 text-sm mt-2">No credit card required. Zero brokerage always.</p>
          </div>
        </div>
      </div>

      <footer className="bg-slate-950 text-slate-500 text-xs text-center py-6">
        © 2026 CampusNest Corp. Student-First Living Platform. Zero Brokerage Guaranteed.
      </footer>
    </div>
  );
}
