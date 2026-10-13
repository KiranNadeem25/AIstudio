import React from 'react';
import { 
  ScanLine, 
  BellRing, 
  Radio, 
  ShieldCheck, 
  Crown,
  Users
} from 'lucide-react';
import { CustomerType } from '../types';

interface MobileBottomNavProps {
  activeTab: 'scan' | 'alerts' | 'radar' | 'guard' | 'pro';
  setActiveTab: (tab: 'scan' | 'alerts' | 'radar' | 'guard' | 'pro') => void;
  unreadCount: number;
  customerType: CustomerType;
  onOpenPricing: () => void;
  onOpenRadar: () => void;
  onOpenAlerts: () => void;
  onCycleCustomerType: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  customerType,
  onOpenPricing,
  onOpenRadar,
  onOpenAlerts,
  onCycleCustomerType,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 pb-safe">
      <div className="grid grid-cols-5 gap-1 items-center">
        {/* Tab 1: Scanner */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('scan');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            activeTab === 'scan' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'scan' ? 'bg-rose-500/15' : ''}`}>
            <ScanLine className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Scan</span>
        </button>

        {/* Tab 2: Regional Push Alerts */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('alerts');
            onOpenAlerts();
          }}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            activeTab === 'alerts' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`relative p-1 rounded-lg ${activeTab === 'alerts' ? 'bg-rose-500/15' : ''}`}>
            <BellRing className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border border-slate-950 flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Alerts</span>
        </button>

        {/* Tab 3: Persona Guard Mode */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('guard');
            onCycleCustomerType();
          }}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            activeTab === 'guard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'guard' ? 'bg-amber-500/15' : ''}`}>
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 capitalize truncate max-w-[54px]">
            {customerType === 'individual' ? 'Solo' : customerType === 'family' ? 'Family' : 'Freelance'}
          </span>
        </button>

        {/* Tab 4: 2026 Radar */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('radar');
            onOpenRadar();
          }}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            activeTab === 'radar' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'radar' ? 'bg-rose-500/15' : ''}`}>
            <Radio className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Radar</span>
        </button>

        {/* Tab 5: Pro Plans */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('pro');
            onOpenPricing();
          }}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            activeTab === 'pro' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'pro' ? 'bg-amber-500/15' : ''}`}>
            <Crown className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Pro</span>
        </button>
      </div>
    </nav>
  );
};
