import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color: 'emerald' | 'violet' | 'amber' | 'rose' | 'blue' | 'teal';
  trend?: string;
}

const colorMap = {
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600', border: 'border-emerald-100' },
  violet:  { bg: 'bg-violet-50',  icon: 'bg-violet-100 text-violet-600',   text: 'text-violet-600',  border: 'border-violet-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-100 text-amber-600',     text: 'text-amber-600',   border: 'border-amber-100' },
  rose:    { bg: 'bg-rose-50',    icon: 'bg-rose-100 text-rose-600',       text: 'text-rose-600',    border: 'border-rose-100' },
  blue:    { bg: 'bg-blue-50',    icon: 'bg-blue-100 text-blue-600',       text: 'text-blue-600',    border: 'border-blue-100' },
  teal:    { bg: 'bg-teal-50',    icon: 'bg-teal-100 text-teal-600',       text: 'text-teal-600',    border: 'border-teal-100' },
};

export default function StatCard({ title, value, subtitle, icon, color, trend }: Props) {
  const c = colorMap[color];
  return (
    <div className={`bg-white rounded-2xl p-5 border ${c.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
      <div className={`text-2xl font-black ${c.text} mb-0.5`}>{value}</div>
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}
