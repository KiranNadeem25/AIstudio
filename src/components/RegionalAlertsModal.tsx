import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  BellOff, 
  Radio, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { RegionalScamAlert, RegionCode } from '../types/notifications';
import { REGIONS } from '../data/regionalTrends';
import { notificationService } from '../services/notificationService';

interface RegionalAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScamForScan: (snippet: string, title: string) => void;
}

export const RegionalAlertsModal: React.FC<RegionalAlertsModalProps> = ({
  isOpen,
  onClose,
  onSelectScamForScan,
}) => {
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [alerts, setAlerts] = useState<RegionalScamAlert[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(settings.selectedRegion || 'US');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const unsub = notificationService.subscribe((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setSettings(notificationService.getSettings());
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRegion = REGIONS[selectedRegion] || REGIONS.US;
  const filteredAlerts = notificationService.getAlertsForRegion(selectedRegion);
  const unreadCount = notificationService.getUnreadCount(selectedRegion);

  const handleRequestPermission = async () => {
    const perm = await notificationService.requestPermission();
    setSettings(notificationService.getSettings());
  };

  const handleToggleSound = () => {
    const newSound = !settings.sound;
    notificationService.updateSettings({ sound: newSound });
    setSettings(notificationService.getSettings());
  };

  const handleSendTestPush = () => {
    const sentAlert = notificationService.sendTestAlert(selectedRegion);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleCopyAlertWarning = (alert: RegionalScamAlert) => {
    const text = `⚠️ REGIONAL SCAM WARNING [${alert.regionName}]:\nNew trend reported by ${alert.reportedByAgency}: "${alert.title}".\n\nExample trick: "${alert.exampleSnippet}"\n\nDefense: ${alert.preventionAdvice}\n\nStay alert and verify with ScamGuard AI before clicking links!`;
    navigator.clipboard.writeText(text);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(selectedRegion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md">
              <BellRing className="w-5 h-5 animate-pulse" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Real-Time Regional Scam Trends
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Live Stream
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verified intelligence reported by national consumer fraud agencies and user forensics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Permission & Settings Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${settings.permission === 'granted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {settings.permission === 'granted' ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    Browser Push Notifications:
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full uppercase ${
                    settings.permission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {settings.permission === 'granted' ? 'Active' : settings.permission === 'denied' ? 'Blocked' : 'Not Enabled'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {settings.permission === 'granted'
                    ? `Alerting you instantly when new high-threat scams break in ${currentRegion.name}.`
                    : `Receive instant alerts on your mobile phone or browser when regional scams are confirmed.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={handleToggleSound}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={settings.sound ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
              >
                {settings.sound ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>

              {/* Action Button: Enable or Test */}
              {settings.permission !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md hover:from-rose-400 hover:to-amber-400 transition-all flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable Push Alerts</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendTestPush}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {testSent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Push Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-rose-400" />
                      <span>Test Push Notification</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Region Selector Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-950 border-b border-slate-800/80 overflow-x-auto flex items-center justify-between gap-3 shrink-0 scrollbar-thin">
          <div className="flex items-center gap-1.5">
            {(Object.keys(REGIONS) as RegionCode[]).map((rCode) => {
              const reg = REGIONS[rCode];
              const isSelected = selectedRegion === rCode;
              const count = notificationService.getAlertsForRegion(rCode).length;

              return (
                <button
                  key={rCode}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(rCode);
                    notificationService.updateSettings({ selectedRegion: rCode });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span>{reg.flag}</span>
                  <span>{reg.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-rose-500/30 text-rose-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] text-slate-400 hover:text-white shrink-0 font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Scrollable Alerts Feed */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>
              Showing {filteredAlerts.length} verified threats for <strong>{currentRegion.flag} {currentRegion.name}</strong>
            </span>
            <span className="text-[11px] text-slate-500">
              Agency: {currentRegion.primaryAgency}
            </span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-bold text-white">No active major outbreaks in this region.</p>
              <p className="text-xs text-slate-500 mt-1">Our AI monitors law enforcement feeds 24/7.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.threatLevel === 'CRITICAL';
              const isHigh = alert.threatLevel === 'HIGH';

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCrit
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                      : isHigh
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar of Alert Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase ${
                        isCrit
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {alert.threatLevel} THREAT
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <span>{alert.flag}</span>
                        <span>{alert.regionName}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{alert.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <span>{alert.victimsReportedCount.toLocaleString()}+ victims reported</span>
                    </div>
                  </div>

                  {/* Title & Target */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1 leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-medium mb-2.5">
                    Primary Target Demographics: {alert.targetAudience}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {alert.description}
                  </p>

                  {/* Sample Excerpt */}
                  {alert.exampleSnippet && (
                    <div className="my-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-200/90">
                      <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Intercepted Phrasing Signature:</span>
                      "{alert.exampleSnippet}"
                    </div>
                  )}

                  {/* Defense Tip */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 mb-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300">Defense Directive: </strong>
                      <span>{alert.preventionAdvice}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                    <span className="text-[11px] text-slate-500">
                      Verified by: {alert.reportedByAgency}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyAlertWarning(alert)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        {copiedId === alert.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied Warning</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Share Warning</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectScamForScan(alert.exampleSnippet, alert.title);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
                      >
                        <span>Audit Similar Text</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Regional telemetry syncs with FTC, Action Fraud, and Scamwatch.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
