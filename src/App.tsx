import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScannerForm } from './components/ScannerForm';
import { AnalysisResultView } from './components/AnalysisResultView';
import { PricingModal } from './components/PricingModal';
import { ScamRadarModal } from './components/ScamRadarModal';
import { ReportExportModal } from './components/ReportExportModal';
import { RegionalAlertsModal } from './components/RegionalAlertsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  ScamCategory, 
  CustomerType, 
  AnalysisResult, 
  UserSubscription 
} from './types';
import { RegionCode, RegionalScamAlert } from './types/notifications';
import { notificationService } from './services/notificationService';
import { REGIONS } from './data/regionalTrends';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Briefcase, 
  UserCheck, 
  Sparkles, 
  History, 
  ChevronRight, 
  Lock, 
  Radio, 
  BellRing,
  Smartphone,
  Info
} from 'lucide-react';

const STORAGE_KEY_SUB = 'scamguard_subscription_v1';
const STORAGE_KEY_HISTORY = 'scamguard_history_v1';

export default function App() {
  const [category, setCategory] = useState<ScamCategory>('job_offer');
  const [customerType, setCustomerType] = useState<CustomerType>('individual');
  const [content, setContent] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [context, setContext] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [radarInitialTab, setRadarInitialTab] = useState<'radar' | 'helplines'>('radar');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRegionalAlertsOpen, setIsRegionalAlertsOpen] = useState(false);

  // Mobile navigation active tab
  const [mobileTab, setMobileTab] = useState<'scan' | 'alerts' | 'radar' | 'guard' | 'pro'>('scan');

  // Regional alerts & notifications state
  const notifSettings = notificationService.getSettings();
  const [currentRegion, setCurrentRegion] = useState<RegionCode>(notifSettings.selectedRegion || 'US');
  const [unreadAlertCount, setUnreadAlertCount] = useState<number>(() => notificationService.getUnreadCount(notifSettings.selectedRegion || 'US'));

  // Subscription state
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUB);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      plan: 'free',
      currency: 'USD',
      billingCycle: 'monthly',
      remainingFreeScans: 3,
      maxFreeScans: 3,
    };
  });

  // History state
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Sync regional notification updates
  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      const count = notificationService.getUnreadCount(currentRegion);
      setUnreadAlertCount(count);
    });
    return () => unsub();
  }, [currentRegion]);

  // Background regional trends simulation watcher
  useEffect(() => {
    // When the user has granted notifications, send an initial alert after 8 seconds if none sent yet
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const alerts = notificationService.getAlertsForRegion(currentRegion);
        const unread = alerts.find((a) => !a.isRead);
        if (unread) {
          notificationService.deliverNotification(unread);
        }
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentRegion]);

  // Save subscription updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(subscription));
    } catch {}
  }, [subscription]);

  // Save history updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 10)));
    } catch {}
  }, [history]);

  // Handle analysis submission
  const handleAnalyze = async () => {
    if (!content.trim()) return;

    // Check quota
    if (subscription.plan === 'free' && subscription.remainingFreeScans <= 0) {
      setIsPricingOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          content,
          senderInfo,
          context,
          customerType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis server returned status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      data.analyzedAt = new Date().toISOString();
      data.queryCategory = category;
      data.submittedSnippet = content.slice(0, 180);
      data.submittedSender = senderInfo;

      setResult(data);
      setHistory((prev) => [data, ...prev.filter((item) => item.verdictHeadline !== data.verdictHeadline)].slice(0, 8));

      // Decrement quota if free plan
      if (subscription.plan === 'free') {
        setSubscription((prev) => ({
          ...prev,
          remainingFreeScans: Math.max(0, prev.remainingFreeScans - 1),
        }));
      }

      // Smooth scroll to result
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Scan error:', err);
      setError('Unable to reach analyzer engine. Please check connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenRadar = () => {
    setRadarInitialTab('radar');
    setIsRadarOpen(true);
  };

  const handleOpenHelplines = () => {
    setRadarInitialTab('helplines');
    setIsRadarOpen(true);
  };

  const handleSelectHistoryItem = (item: AnalysisResult) => {
    setResult(item);
    if (item.queryCategory) setCategory(item.queryCategory);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectScamForScan = (snippet: string, title: string) => {
    setContent(snippet);
    setContext(`Investigating verified outbreak signature: ${title}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCycleCustomerType = () => {
    if (customerType === 'individual') setCustomerType('family');
    else if (customerType === 'family') setCustomerType('freelancer');
    else setCustomerType('individual');
  };

  const isPaid = subscription.plan !== 'free';
  const regionInfo = REGIONS[currentRegion] || REGIONS.US;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Offline Status PWA Banner */}
      <OfflineIndicator />

      {/* Header */}
      <Header
        customerType={customerType}
        setCustomerType={setCustomerType}
        subscription={subscription}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenRadar={handleOpenRadar}
        onOpenHelplines={handleOpenHelplines}
        onOpenRegionalAlerts={() => setIsRegionalAlertsOpen(true)}
        unreadAlertCount={unreadAlertCount}
        currentRegion={currentRegion}
      />

      {/* Main Container - Extra bottom padding for mobile app bottom bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-28 sm:pb-14">
        {/* Mobile PWA Install Banner */}
        <div className="sm:hidden">
          <PWAInstallButton variant="banner" />
        </div>

        {/* Real-time Regional Threat Alert Pill */}
        <div className="max-w-4xl mx-auto">
          <div 
            onClick={() => setIsRegionalAlertsOpen(true)}
            className="cursor-pointer p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-between gap-3 shadow-md group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                <BellRing className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>{regionInfo.flag} Verified Outbreak in {regionInfo.name}:</span>
                  <span className="text-rose-300 font-medium truncate">
                    Surge in impersonation & toll texts reported today
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Tap to view regional trends or enable instant push alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-rose-400 group-hover:text-rose-300">
              <span>View Alerts</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>2026 AI Anti-Fraud Forensics Active</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Smartphone className="w-3 h-3" /> Mobile Ready PWA
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Spot Scams Before They Take Your Money.
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Detect fraudulent job offers, WhatsApp "Hi Mom" impostors, crypto doubling pitches, deceptive website logins, and marketplace courier scams in seconds.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Layer Forensic Reasoning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Zero User Data Kept</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Instant Safe Reply Scripts</span>
            </div>
          </div>
        </div>

        {/* Customer Persona Highlight Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-5xl mx-auto">
          <div 
            onClick={() => setCustomerType('individual')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              customerType === 'individual'
                ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/30 shadow-md'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <UserCheck className={`w-4 h-4 ${customerType === 'individual' ? 'text-rose-400' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold text-white">Individual Protection</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scan suspicious SMS alerts, fake parcel fees, bank texts, and investment pitches.
            </p>
          </div>

          <div 
            onClick={() => setCustomerType('family')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              customerType === 'family'
                ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30 shadow-md'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Users className={`w-4 h-4 ${customerType === 'family' ? 'text-amber-400' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold text-white">Family & Elder Guard</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Detect "Hi Mum" broken phone messages, voice clone bail scams, and 1-click warning scripts.
            </p>
          </div>

          <div 
            onClick={() => setCustomerType('freelancer')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              customerType === 'freelancer'
                ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30 shadow-md'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Briefcase className={`w-4 h-4 ${customerType === 'freelancer' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <h3 className="text-xs font-bold text-white">Freelancer & Solopreneur</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Vet remote jobs, equipment check advance traps, unpaid test spec tasks, and off-platform links.
            </p>
          </div>
        </div>

        {/* Scanner Form */}
        <div className="max-w-4xl mx-auto">
          <ScannerForm
            category={category}
            setCategory={setCategory}
            customerType={customerType}
            content={content}
            setContent={setContent}
            senderInfo={senderInfo}
            setSenderInfo={setSenderInfo}
            context={context}
            setContext={setContext}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            remainingScans={subscription.remainingFreeScans}
            isPaid={isPaid}
            onOpenPricing={() => setIsPricingOpen(true)}
          />

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* Analysis Results View */}
        {result && (
          <div className="max-w-4xl mx-auto pt-4">
            <AnalysisResultView
              result={result}
              customerType={customerType}
              onExportReport={() => setIsExportOpen(true)}
              onOpenHelplines={handleOpenHelplines}
            />
          </div>
        )}

        {/* Recent Checks History Bar */}
        {history.length > 0 && (
          <div className="max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Recent Checks ({history.length})
              </span>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectHistoryItem(item)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        item.threatScore >= 60 ? 'bg-rose-500' : item.threatScore >= 35 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {item.verdictHeadline}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.scamTypeDetected} • Score: {item.threatScore}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 shrink-0 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Trust Section */}
        <div className="max-w-4xl mx-auto pt-6 border-t border-slate-800/60">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                Stay Ahead of Active 2026 Scams in {regionInfo.name}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Browse real-time reports on AI voice clones, QR code quishing, task jobs, and global emergency helplines.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsRegionalAlertsOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Regional Stream</span>
              </button>
              <button
                type="button"
                onClick={handleOpenRadar}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                2026 Radar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop/Tablet Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2 mb-14 sm:mb-0">
        <p>
          ScamGuard AI Universal Fraud Intelligence • Installable PWA for iOS & Android.
        </p>
        <p className="text-[11px] text-slate-600 max-w-xl mx-auto px-4">
          Disclaimer: This system provides algorithmic forensic risk assessment and educational defensive advice. If you suspect active banking theft, immediately freeze accounts directly with your financial institution.
        </p>
      </footer>

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
        unreadCount={unreadAlertCount}
        customerType={customerType}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenRadar={handleOpenRadar}
        onOpenAlerts={() => setIsRegionalAlertsOpen(true)}
        onCycleCustomerType={handleCycleCustomerType}
      />

      {/* Modals */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        subscription={subscription}
        onUpdateSubscription={setSubscription}
      />

      <ScamRadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        initialTab={radarInitialTab}
      />

      <RegionalAlertsModal
        isOpen={isRegionalAlertsOpen}
        onClose={() => setIsRegionalAlertsOpen(false)}
        onSelectScamForScan={handleSelectScamForScan}
      />

      {result && (
        <ReportExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          result={result}
          customerType={customerType}
        />
      )}
    </div>
  );
}
