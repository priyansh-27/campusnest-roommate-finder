import { useEffect, useState } from 'react';
import { healthAPI } from '../services/api';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export default function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      const result = await healthAPI.check();
      setStatus(result.online ? 'online' : 'offline');
      setDetails(result);
    };
    check();
    const interval = setInterval(check, 30000); // re-check every 30s
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Checking backend...</span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-1.5 text-[10px] bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-bold" title={details?.message}>
        <WifiOff className="w-3 h-3" />
        <span>Backend Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold" title="Spring Boot + Neon DB connected">
      <Wifi className="w-3 h-3" />
      <span>Live · Neon DB</span>
    </div>
  );
}
