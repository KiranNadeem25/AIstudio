import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  FileText, 
  Brain, 
  ArrowRight,
  ExternalLink,
  MessageSquareWarning,
  Eye,
  Shield,
  PhoneCall
} from 'lucide-react';
import { AnalysisResult, CustomerType } from '../types';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  customerType: CustomerType;
  onExportReport: () => void;
  onOpenHelplines: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  customerType,
  onExportReport,
  onOpenHelplines,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [familyAlertCopied, setFamilyAlertCopied] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const toggleAction = (idx: number) => {
    setCompletedActions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyReply = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const familyWarningText = `⚠️ CAUTION: I just analyzed this message through an AI scam detector and it flagged a THREAT SCORE OF ${result.threatScore}/100 (${result.scamTypeDetected}).\n\nVerdict: ${result.verdictSummary}\n\nDo NOT send money, gift cards, or click any links! Call me directly if you have any questions.`;

  const handleCopyFamilyAlert = () => {
    navigator.clipboard.writeText(familyWarningText);
    setFamilyAlertCopied(true);
    setTimeout(() => setFamilyAlertCopied(false), 2000);
  };

  // Threat score styling and color map
  const getRiskTheme = () => {
    if (result.threatScore >= 80) {
      return {
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        cardBorder: 'border-rose-500/40 shadow-rose-950/40',
        scoreColor: 'text-rose-400',
        gaugeBg: 'stroke-rose-500',
        icon: <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />,
        levelName: 'CRITICAL SCAM DETECTED',
        bannerGradient: 'from-rose-950/60 via-slate-900 to-slate-950',
      };
    } else if (result.threatScore >= 55) {
      return {
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        cardBorder: 'border-orange-500/40 shadow-orange-950/30',
        scoreColor: 'text-orange-400',
        gaugeBg: 'stroke-orange-500',
        icon: <AlertTriangle className="w-8 h-8 text-orange-400" />,
        levelName: 'HIGH THREAT SUSPICION',
        bannerGradient: 'from-orange-950/50 via-slate-900 to-slate-950',
      };
    } else if (result.threatScore >= 35) {
      return {
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        cardBorder: 'border-amber-500/40 shadow-amber-950/30',
        scoreColor: 'text-amber-400',
        gaugeBg: 'stroke-amber-500',
        icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
        levelName: 'MODERATE SUSPICION',
        bannerGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
      };
    } else {
      return {
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        cardBorder: 'border-emerald-500/40 shadow-emerald-950/30',
        scoreColor: 'text-emerald-400',
        gaugeBg: 'stroke-emerald-500',
        icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
        levelName: 'LOW RISK / LIKELY SAFE',
        bannerGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
      };
    }
  };

  const theme = getRiskTheme();

  return (
    <div className="space-y-6">
      {/* Top Threat Dossier Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${theme.cardBorder} bg-gradient-to-br ${theme.bannerGradient} shadow-2xl backdrop-blur-md relative overflow-hidden`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner shrink-0">
              {theme.icon}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${theme.badgeBg}`}>
                  {theme.levelName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                  {result.scamTypeDetected}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                  Confidence: {result.confidencePercentage}%
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {result.verdictHeadline}
              </h2>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
                {result.verdictSummary}
              </p>
            </div>
          </div>

          {/* Circular Threat Score Meter */}
          <div className="shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner w-full md:w-36">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-800"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${theme.gaugeBg} transition-all duration-1000 ease-out`}
                  strokeDasharray={`${result.threatScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black font-mono tracking-tighter ${theme.scoreColor}`}>
                  {result.threatScore}
                </span>
                <span className="text-[9px] font-semibold uppercase text-slate-400">/ 100 Threat</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={onExportReport}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-3 h-3 text-rose-400" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Persona Specific Risk Advisory */}
        {result.victimProfileRisk && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 capitalize">{customerType} Vulnerability Note: </strong>
              <span>{result.victimProfileRisk}</span>
            </div>
          </div>
        )}
      </div>

      {/* Red Flags & Evidence Quotations */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Identified Red Flags & Forensic Evidence ({result.identifiedRedFlags.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Directly extracted from your submission</span>
        </div>

        <div className="space-y-3.5">
          {result.identifiedRedFlags.map((flag, idx) => {
            const isCrit = flag.severity === 'critical';
            const isWarn = flag.severity === 'warning';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCrit
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                    {isCrit ? (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    {flag.flag}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                      isCrit
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isWarn
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {flag.severity}
                  </span>
                </div>

                {flag.matchedExcerpt && (
                  <div className="my-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-rose-200/90 italic">
                    "{flag.matchedExcerpt}"
                  </div>
                )}

                <p className="text-xs text-slate-400 leading-relaxed">
                  {flag.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Psychological Tactics + Immediate Safety Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Psychological Manipulation Tactics */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Psychological Manipulation Tactics
            </h3>
          </div>

          <div className="space-y-3">
            {result.psychologicalTactics.map((tac, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-xs font-bold text-indigo-300 block mb-1">
                  • {tac.tactic}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tac.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate DO / DON'T Checklist */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Recommended Action Checklist
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Tap to mark complete</span>
          </div>

          <div className="space-y-2.5">
            {result.immediateActions.map((item, idx) => {
              const isChecked = !!completedActions[idx];
              const isDont = item.type === 'DONT';

              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : isDont
                      ? 'bg-rose-950/15 border-rose-500/25 hover:border-rose-500/40'
                      : 'bg-emerald-950/15 border-emerald-500/25 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                        isDont ? 'border-rose-400 text-rose-400' : 'border-emerald-400 text-emerald-400'
                      }`}>
                        {isDont ? '✕' : '✓'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`text-xs font-medium leading-relaxed ${
                      isChecked ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}>
                      {item.action}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safe Reply Generator & Independent Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safe Ready-to-Send Replies */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Safe Neutral Reply Scripts
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">1-click copy to clipboard</span>
          </div>

          <div className="space-y-3">
            {result.safeReplies.map((reply, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    {reply.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyReply(reply.replyText, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-sans leading-relaxed">
                  "{reply.replyText}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Independent Verification Steps */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                How to Safely Verify Independently
              </h3>
            </div>

            <ul className="space-y-2.5">
              {result.verificationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Agency Reporting Footer */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Official Reporting: {result.helplineReporting.agency}
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-xs">
                  {result.helplineReporting.advice}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenHelplines}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
              >
                <span>View Helplines</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share / Family Warning & Export Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              Share Warning or Export Dossier
            </h4>
            <p className="text-[11px] text-slate-400">
              Provide evidence to your bank fraud division or protect elderly relatives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyFamilyAlert}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors"
          >
            {familyAlertCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Alert</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Family Alert Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onExportReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
