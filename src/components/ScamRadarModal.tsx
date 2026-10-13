import React, { useState } from 'react';
import { X, Radio, Globe2, ShieldAlert, Phone, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TRENDING_SCAMS_2026, GLOBAL_HELPLINES } from '../data/presets';

interface ScamRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'radar' | 'helplines';
}

export const ScamRadarModal: React.FC<ScamRadarModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'radar',
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'helplines'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {activeTab === 'radar' ? (
                <Radio className="w-5 h-5 animate-pulse" />
              ) : (
                <Globe2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {activeTab === 'radar' ? '2026 Scam Threat Intelligence' : 'Official International Fraud Helplines'}
              </h2>
              <p className="text-xs text-slate-400">
                Verified consumer defense, active threat vectors, and reporting authorities.
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'radar'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Trending 2026 Threat Radar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('helplines')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'helplines'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Emergency Reporting Directory</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'radar' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">High-Velocity 2026 Vector Warning:</strong>
                  Criminal syndicates are increasingly coupling generative AI voice clones with WhatsApp emergency impersonations and fake job onboarding checks.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRENDING_SCAMS_2026.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.trend}
                      </span>
                    </div>

                    <div className="text-[11px] text-amber-300/90 font-medium">
                      Primary Target: {item.target}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 text-xs text-emerald-300 flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.prevention}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                If you have paid funds or revealed bank credentials, contact your financial institution's fraud unit immediately before filing a formal report with national cyber police.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GLOBAL_HELPLINES.map((hl, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="text-lg">{hl.flag}</span>
                        {hl.country}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{hl.phone}</span>
                    </div>

                    <div>
                      <h5 className="text-xs font-semibold text-rose-300">{hl.agency}</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{hl.note}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <a
                        href={hl.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                      >
                        <span>Official Reporting Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
