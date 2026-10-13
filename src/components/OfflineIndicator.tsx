import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-between gap-3 rounded-xl bg-amber-500/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-400 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-slate-950" />
        <span>Offline Mode Active — Cached scam signatures and safety guides available.</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping shrink-0" />
    </div>
  );
};
