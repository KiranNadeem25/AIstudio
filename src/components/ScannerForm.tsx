import React, { useState } from 'react';
import { 
  Briefcase, 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  ShoppingBag, 
  Laptop, 
  ShieldAlert, 
  Sparkles, 
  ClipboardPaste, 
  Trash2, 
  Upload, 
  HelpCircle,
  PlayCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ScamCategory, CustomerType, PresetScamCase } from '../types';
import { CATEGORY_INFO, PRESET_CASES } from '../data/presets';

interface ScannerFormProps {
  category: ScamCategory;
  setCategory: (cat: ScamCategory) => void;
  customerType: CustomerType;
  content: string;
  setContent: (val: string) => void;
  senderInfo: string;
  setSenderInfo: (val: string) => void;
  context: string;
  setContext: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  remainingScans: number;
  isPaid: boolean;
  onOpenPricing: () => void;
}

export const ScannerForm: React.FC<ScannerFormProps> = ({
  category,
  setCategory,
  customerType,
  content,
  setContent,
  senderInfo,
  setSenderInfo,
  context,
  setContext,
  onAnalyze,
  isAnalyzing,
  remainingScans,
  isPaid,
  onOpenPricing,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
      }
    } catch {
      // Fallback if browser permission is blocked
      const input = prompt('Paste your suspicious message or link:');
      if (input) setContent(input);
    }
  };

  const handleLoadPreset = (preset: PresetScamCase) => {
    setCategory(preset.category);
    setContent(preset.snippet);
    setSenderInfo(preset.sender);
    setContext(preset.context);
  };

  // Simulated screenshot drop or upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In browser preview, we read the filename and populate a realistic OCR simulated extract
      const isReceipt = file.name.toLowerCase().includes('receipt') || file.name.toLowerCase().includes('invoice');
      const isChat = file.name.toLowerCase().includes('chat') || file.name.toLowerCase().includes('wa') || file.name.toLowerCase().includes('screen');

      if (isChat) {
        setCategory('whatsapp_sms');
        setContent(`[OCR Scan from ${file.name}]\nUnknown Contact: "Hey! Your payment for order #88492 is pending due to an address mismatch. Please verify your debit card details on http://usps-post-redelivery-urgent.com within 12 hours or item will be returned."`);
        setSenderInfo('SMS from unlisted shortcode');
      } else if (isReceipt) {
        setCategory('job_offer');
        setContent(`[OCR Scan from ${file.name}]\nAPEX EQUIPMENT VENDOR INVOICE\nAmount Due: $3,250.00\nPayment Method: Wire transfer / Zelle to account #90218319\nNotice: This equipment deposit is mandatory prior to commencing remote orientation.`);
        setSenderInfo('Invoice attachment from HR Jessica');
      } else {
        setContent(`[OCR Extracted from ${file.name}]\n"Urgent notice regarding your account security. Unusual login detected from Moscow, Russia. If this was not you, confirm your 6-digit verification code immediately."`);
      }
    }
  };

  const categoryIcons: Record<ScamCategory, React.ReactNode> = {
    job_offer: <Briefcase className="w-4 h-4" />,
    whatsapp_sms: <MessageSquare className="w-4 h-4" />,
    investment: <TrendingUp className="w-4 h-4" />,
    website_url: <Globe className="w-4 h-4" />,
    marketplace: <ShoppingBag className="w-4 h-4" />,
    freelancer: <Laptop className="w-4 h-4" />,
    general: <ShieldAlert className="w-4 h-4" />,
  };

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl shadow-slate-950/40 backdrop-blur-md">
      {/* Category Tabs */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Select What You Are Checking:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {(Object.keys(CATEGORY_INFO) as ScamCategory[]).map((catKey) => {
            const isSelected = category === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setCategory(catKey)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/50 text-white shadow-md shadow-rose-950/20 ring-1 ring-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1.5 ${isSelected ? 'text-rose-400 bg-rose-500/20' : 'text-slate-400'}`}>
                  {categoryIcons[catKey]}
                </div>
                <span className="text-xs font-medium leading-tight">
                  {CATEGORY_INFO[catKey].label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {CATEGORY_INFO[category].description}
        </p>
      </div>

      {/* Preset Test Cases Bar */}
      <div className="mb-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
            Quick Test Cases (1-Click Sample Scams):
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any sample to autofill and test immediately
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {PRESET_CASES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                content === preset.snippet
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                  : preset.riskExpectation === 'SAFE'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{preset.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                preset.riskExpectation === 'SAFE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {preset.riskExpectation === 'SAFE' ? 'Legit' : 'Scam'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Content Input */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Suspicious Message, Job Spec, Link, or Offer Text:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Paste
            </button>
            {content && (
              <button
                type="button"
                onClick={() => setContent('')}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={CATEGORY_INFO[category].placeholder}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-sans leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
          <span>
            {customerType === 'family' 
              ? '👨‍👩‍👧 Family Elder Protection Mode Active' 
              : customerType === 'freelancer' 
              ? '⚡ Freelancer Contract & Client Protection Active' 
              : '👤 Individual Consumer Protection Active'}
          </span>
          <span>{content.length} characters</span>
        </div>
      </div>

      {/* Advanced Metadata Inputs (Sender, Context, Screenshot) */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium transition-colors"
        >
          <span>{showAdvanced ? '▼ Hide' : '▶ Add'} Sender info, context, or screenshot upload</span>
          <span className="text-slate-500 font-normal">(improves detection accuracy)</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Sender Details (Phone number, email address, or handle):
                </label>
                <input
                  type="text"
                  value={senderInfo}
                  onChange={(e) => setSenderInfo(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2831 or hr@apex-careers.com or @TelegramUser"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Where Did You Encounter This? (Context):
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Inquired on LinkedIn, met on Instagram, buyer on FB Marketplace"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                />
              </div>
            </div>

            {/* Simulated Screenshot / Invoice Ingestion */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-800/60">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer text-xs font-medium text-slate-300 transition-colors">
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                <span>Upload Screenshot / PDF Invoice</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-500">
                AI extracts text from chat screenshots, check receipts, or PDF contracts.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quota Limit Banner if depleted */}
      {!isPaid && remainingScans <= 0 && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-200">
                You have used your 3 free scans for today.
              </p>
              <p className="text-[11px] text-rose-300/80">
                Upgrade for unlimited forensic audits, URL deep scans, and exportable police/bank reports.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPricing}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Submit Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Real-time Forensic AI Engine</span>
          <span className="text-slate-600">•</span>
          <span>Zero Logging of Private Contacts</span>
        </div>

        <button
          type="button"
          disabled={!content.trim() || isAnalyzing || (!isPaid && remainingScans <= 0)}
          onClick={onAnalyze}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            !content.trim() || (!isPaid && remainingScans <= 0)
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : isAnalyzing
              ? 'bg-slate-800 text-slate-300 border border-slate-700 cursor-wait'
              : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500 shadow-rose-950/60 hover:shadow-rose-900/40 active:scale-[0.99]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              <span>Running Deep Forensic Analysis...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze for Fraud & Red Flags</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
