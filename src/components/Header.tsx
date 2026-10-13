import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  UserCheck, 
  Briefcase, 
  Zap, 
  Radio, 
  Globe2,
  Crown,
  BellRing
} from 'lucide-react';
import { CustomerType, UserSubscription } from '../types';
import { CURRENCIES } from '../data/currencies';
import { PWAInstallButton } from './PWAInstallButton';
import { RegionCode } from '../types/notifications';
import { REGIONS } from '../data/regionalTrends';

interface HeaderProps {
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  subscription: UserSubscription;
  onOpenPricing: () => void;
  onOpenRadar: () => void;
  onOpenHelplines: () => void;
  onOpenRegionalAlerts: () => void;
  unreadAlertCount: number;
  currentRegion: RegionCode;
}

export const Header: React.FC<HeaderProps> = ({
  customerType,
  setCustomerType,
  subscription,
  onOpenPricing,
  onOpenRadar,
  onOpenHelplines,
  onOpenRegionalAlerts,
  unreadAlertCount,
  currentRegion,
}) => {
  const currentCurrency = CURRENCIES[subscription.currency] || CURRENCIES.USD;
  const isPaid = subscription.plan !== 'free';
  const regionInfo = REGIONS[currentRegion] || REGIONS.US;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 shadow-lg shadow-rose-950/50 border border-rose-400/20">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  ScamGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  Live Defense
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400">
                Job Offers • WhatsApp • Crypto • Marketplace • URLs
              </p>
            </div>
          </div>

          {/* Persona Mode Switcher */}
          <div className="hidden lg:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setCustomerType('individual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                customerType === 'individual'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Optimized for personal emails, messages, and calls"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Individual
            </button>
            <button
              onClick={() => setCustomerType('family')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                customerType === 'family'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Elder and family emergency impersonation protection"
            >
              <Users className="w-3.5 h-3.5" />
              Family Guard
            </button>
            <button
              onClick={() => setCustomerType('freelancer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                customerType === 'freelancer'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Freelancer contract, payment link & client vetting"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Freelancer
            </button>
          </div>

          {/* Right Navigation & Monetization Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Regional Push Alerts Bell Button */}
            <button
              type="button"
              onClick={onOpenRegionalAlerts}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              title={`View verified scam trends in ${regionInfo.name}`}
            >
              <BellRing className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{regionInfo.flag} {regionInfo.name} Alerts</span>
              <span className="sm:hidden">{regionInfo.flag}</span>
              {unreadAlertCount > 0 && (
                <span className="w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* PWA Mobile App Install Button */}
            <PWAInstallButton variant="header" />

            {/* Trending Radar Link (Desktop) */}
            <button
              onClick={onOpenRadar}
              className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>2026 Trends</span>
            </button>

            {/* Free Scans Counter or Active Badge */}
            {isPaid ? (
              <div 
                onClick={onOpenPricing}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{subscription.plan} Pro</span>
              </div>
            ) : (
              <div
                onClick={onOpenPricing}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-colors group"
                title="Free daily checks remaining. Click to upgrade."
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 group-hover:text-white">
                  <strong className="text-white font-semibold">{subscription.remainingFreeScans}</strong>
                  <span className="text-slate-500">/{subscription.maxFreeScans}</span>
                </span>
              </div>
            )}

            {/* Upgrade CTA */}
            <button
              onClick={onOpenPricing}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
                isPaid 
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:from-rose-400 hover:to-amber-400 shadow-rose-950/50'
              }`}
            >
              {isPaid ? (
                <span>Manage Plan ({currentCurrency.flag} {currentCurrency.code})</span>
              ) : (
                <>
                  <span>Pricing</span>
                  <span className="text-xs opacity-90 font-normal hidden sm:inline">({currentCurrency.flag} {currentCurrency.symbol}{currentCurrency.individualMonthly}/mo)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Persona Switcher */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold shrink-0">Persona:</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCustomerType('individual')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                customerType === 'individual'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400'
              }`}
            >
              👤 Individual
            </button>
            <button
              onClick={() => setCustomerType('family')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                customerType === 'family'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400'
              }`}
            >
              👨‍👩‍👧 Family
            </button>
            <button
              onClick={() => setCustomerType('freelancer')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                customerType === 'freelancer'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400'
              }`}
            >
              ⚡ Freelancer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
