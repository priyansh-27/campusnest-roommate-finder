import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Crown, Zap, Star, Shield, Loader2 } from 'lucide-react';

interface Plan {
  id: 'starter' | 'growth' | 'pro';
  name: string;
  price: number;
  listings: string;
  color: string;
  badge?: string;
  icon: React.ReactNode;
  features: string[];
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter', name: 'Starter', price: 999, listings: '1 active listing',
    color: 'slate', badge: undefined, icon: <Shield className="w-6 h-6" />,
    highlight: false,
    features: [
      '1 active property listing',
      'Basic landlord profile',
      'Standard search visibility',
      'Student enquiry inbox',
      'Email support',
    ],
  },
  {
    id: 'growth', name: 'Growth', price: 1999, listings: 'Up to 3 listings',
    color: 'emerald', badge: '⭐ Most Popular', icon: <Star className="w-6 h-6" />,
    highlight: true,
    features: [
      'Up to 3 active listings',
      'Priority search placement',
      '✓ Verified Landlord badge',
      'Direct student contact unmasked',
      'AI-matched student leads',
      'Maintenance request dashboard',
      'Priority email & chat support',
    ],
  },
  {
    id: 'pro', name: 'Pro', price: 3999, listings: 'Unlimited listings',
    color: 'violet', badge: '👑 Best Value', icon: <Crown className="w-6 h-6" />,
    highlight: false,
    features: [
      'Unlimited active listings',
      'Top search placement (Featured)',
      '✓ Verified + Featured badge',
      'Full analytics dashboard',
      'Dedicated account manager',
      'Priority listing review (24hr)',
      'Custom landlord landing page',
      'Bulk property upload',
      '24/7 phone support',
    ],
  },
];

interface Props {
  currentPlan?: 'starter' | 'growth' | 'pro' | null;
  onSubscribe: (plan: Plan) => void;
}

export default function SubscriptionPage({ currentPlan, onSubscribe }: Props) {
  useAuth();
  const [selected, setSelected] = useState<Plan | null>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handlePay = async () => {
    if (!selected || !transactionId.trim()) return;
    setPaying(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500));
    setPaying(false);
    setSuccess(true);
    onSubscribe(selected);
    setTransactionId('');
    setSelected(null);
    setTimeout(() => setSuccess(false), 5000);
  };

  const colorMap: Record<string, { border: string; bg: string; badge: string; btn: string; ring: string }> = {
    slate:   { border: 'border-slate-200',  bg: 'bg-slate-50',   badge: 'bg-slate-100 text-slate-700',   btn: 'bg-slate-800 hover:bg-slate-900 text-white',   ring: 'ring-slate-400' },
    emerald: { border: 'border-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-500 text-white',      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white', ring: 'ring-emerald-400' },
    violet:  { border: 'border-violet-400',  bg: 'bg-violet-50',  badge: 'bg-violet-600 text-white',       btn: 'bg-violet-600 hover:bg-violet-700 text-white',  ring: 'ring-violet-400' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-6 h-6 text-amber-200" />
          <h2 className="text-xl font-black">Landlord Subscription</h2>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed max-w-2xl">
          Choose a plan to list your properties on CampusNest and connect directly with thousands of verified students. Zero brokerage for students means they come straight to you!
        </p>
      </div>

      {/* Current plan banner */}
      {currentPlan && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-900">Active Plan: </span>
            <span className="font-bold text-emerald-700 capitalize">{currentPlan}</span>
            <span className="text-emerald-600 text-sm ml-2">— Your listings are live and receiving student enquiries!</span>
          </div>
        </div>
      )}

      {/* Success notification */}
      {success && (
        <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Payment details submitted! An admin will review your transaction ID and activate your plan shortly.</span>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map(plan => {
          const c = colorMap[plan.color];
          const isActive = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => !isActive && setSelected(plan)}
              className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                isActive ? 'border-emerald-500 ring-2 ring-emerald-300' :
                selected?.id === plan.id ? `border-2 ${c.border} ring-2 ${c.ring}` :
                plan.highlight ? c.border : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${c.badge} text-xs font-black px-3 py-1 rounded-full whitespace-nowrap shadow-sm`}>
                  {plan.badge}
                </div>
              )}
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  ✓ Current Plan
                </div>
              )}

              {/* Icon & Name */}
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4 ${plan.color === 'emerald' ? 'text-emerald-600' : plan.color === 'violet' ? 'text-violet-600' : 'text-slate-600'}`}>
                {plan.icon}
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
              <div className="text-3xl font-black text-slate-900 mb-1">
                ₹{plan.price.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-500">/month</span>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-4 pb-4 border-b border-slate-100">{plan.listings}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={e => { e.stopPropagation(); if (!isActive) { setSelected(plan); } }}
                disabled={isActive}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${
                  isActive ? 'bg-emerald-100 text-emerald-700 cursor-default' : c.btn
                }`}
              >
                {isActive ? '✓ Active' : selected?.id === plan.id ? 'Selected ✓' : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pay Button */}
      {selected && !currentPlan && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="font-black text-slate-900 text-lg">
                {selected.name} Plan — ₹{selected.price.toLocaleString('en-IN')}/month
              </div>
              <p className="text-sm text-slate-500">Secure UPI Payment. Scan the QR code or open your UPI app directly.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center">
             {/* QR Code */}
             <div className="shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-inner">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=admin@campusnest&pn=CampusNest&am=${selected.price}&cu=INR&tn=${selected.name} Plan`)}`} 
                 alt="UPI QR" 
                 className="w-32 h-32 rounded-lg" 
               />
               <p className="text-center text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Scan to Pay</p>
             </div>

             {/* UPI Deep Links & Form */}
             <div className="flex-1 w-full space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <a href={`upi://pay?pa=admin@campusnest&pn=CampusNest&am=${selected.price}&cu=INR&tn=${selected.name} Plan`} className="flex items-center justify-center gap-2 bg-[#5f259f] hover:bg-[#4a1c7c] text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
                     PhonePe
                  </a>
                  <a href={`upi://pay?pa=admin@campusnest&pn=CampusNest&am=${selected.price}&cu=INR&tn=${selected.name} Plan`} className="flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#155dbb] text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
                     GPay
                  </a>
                  <a href={`upi://pay?pa=admin@campusnest&pn=CampusNest&am=${selected.price}&cu=INR&tn=${selected.name} Plan`} className="flex items-center justify-center gap-2 bg-[#00baf2] hover:bg-[#0096c4] text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
                     Paytm
                  </a>
                  <a href={`upi://pay?pa=admin@campusnest&pn=CampusNest&am=${selected.price}&cu=INR&tn=${selected.name} Plan`} className="flex items-center justify-center gap-2 bg-[#00a859] hover:bg-[#008f4c] text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
                     WhatsApp
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-emerald-800 uppercase mb-1.5">Enter UPI Ref Number after paying</label>
                    <input
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="12-digit UTR..."
                      className="w-full px-3 py-2.5 border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={paying || !transactionId.trim()}
                    className="w-full sm:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm h-[42px]"
                  >
                    {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Payment'}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Upgrade prompt if already subscribed */}
      {currentPlan && currentPlan !== 'pro' && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-violet-900">Upgrade to Pro for unlimited listings</h4>
            <p className="text-sm text-violet-700">Get dedicated account manager, analytics and featured placement.</p>
          </div>
          <button
            onClick={() => { setSelected(PLANS[2]); }}
            className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
          >
            Upgrade to Pro →
          </button>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            ['Can I cancel anytime?', 'Yes. Cancel anytime from your dashboard. No lock-in, no penalty.'],
            ['When do listings go live?', 'After payment, your listing goes for admin verification (usually within 24 hours). Once approved, it goes live immediately.'],
            ['What if I need more listings mid-plan?', 'Upgrade to a higher plan anytime. The remaining days of your current plan are prorated.'],
            ['Is brokerage charged to students?', 'Never. CampusNest is 100% zero-brokerage for students. Your subscription is what funds the platform.'],
          ].map(([q, a]) => (
            <div key={q} className="border-b border-slate-200 last:border-0 pb-4 last:pb-0">
              <div className="font-semibold text-slate-900 text-sm mb-1">{q}</div>
              <div className="text-slate-500 text-sm">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
