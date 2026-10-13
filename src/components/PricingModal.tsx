import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Zap, 
  Users, 
  Briefcase, 
  Crown, 
  Globe2, 
  CreditCard, 
  Lock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CURRENCIES } from '../data/currencies';
import { UserSubscription } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpdateSubscription: (sub: UserSubscription) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(subscription.currency || 'USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(subscription.billingCycle || 'monthly');
  const [selectedPlan, setSelectedPlan] = useState<'individual' | 'family' | 'freelancer'>('individual');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'checkout'>('plans');

  if (!isOpen) return null;

  const currency = CURRENCIES[selectedCurrency] || CURRENCIES.USD;
  const isAnnual = billingCycle === 'annual';

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'SAFETY2026' || clean === 'FREESCAM' || clean === 'SCAMGUARD') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "SAFETY2026" for full complimentary access.');
    }
  };

  const handleStartCheckout = (planKey: 'individual' | 'family' | 'freelancer') => {
    setSelectedPlan(planKey);
    setActiveTab('checkout');
  };

  const handleCompleteSubscription = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpdateSubscription({
        plan: selectedPlan,
        currency: selectedCurrency,
        billingCycle,
        remainingFreeScans: 9999,
        maxFreeScans: 9999,
        activeUntil: '2027-10-12',
      });
      onClose();
    }, 1200);
  };

  const handleResetToFree = () => {
    onUpdateSubscription({
      plan: 'free',
      currency: selectedCurrency,
      billingCycle: 'monthly',
      remainingFreeScans: 3,
      maxFreeScans: 3,
    });
    onClose();
  };

  // Pricing calculations
  const getPlanPrice = (plan: 'individual' | 'family' | 'freelancer') => {
    if (promoApplied) return 0;
    if (plan === 'individual') {
      return isAnnual ? currency.individualAnnual : currency.individualMonthly;
    } else if (plan === 'family') {
      return isAnnual ? currency.familyAnnual : currency.familyMonthly;
    } else {
      return isAnnual ? currency.freelancerAnnual : currency.freelancerMonthly;
    }
  };

  const currentPrice = getPlanPrice(selectedPlan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                International Fraud Protection Pricing
                <span className="text-xs font-normal text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  PPP Adjusted
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Cancel anytime. Transparent pricing in your local currency.
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

        {activeTab === 'plans' ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Currency & Billing Cycle Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              {/* Currency Selector */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Globe2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">Your Currency:</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly vs Annual Toggle */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    !isAnnual ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isAnnual ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Plan 1: Free Explorer */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Free Explorer
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                      Standard
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-white">Free</span>
                    <span className="text-xs text-slate-500 ml-1">/ forever</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Essential spot-checking for casual messages and unknown phone numbers.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>3 AI scans per day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Basic red flag detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Psychological tactics breakdown</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500">
                      <span className="w-3.5 h-3.5 text-slate-600 shrink-0 text-center">✕</span>
                      <span>No exportable bank reports</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleResetToFree}
                  disabled={subscription.plan === 'free'}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  {subscription.plan === 'free' ? 'Current Active Plan' : 'Downgrade to Free'}
                </button>
              </div>

              {/* Plan 2: Pro Shield (Individual) - Popular */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-rose-950/30 to-slate-950 border-2 border-rose-500/50 flex flex-col justify-between relative shadow-xl shadow-rose-950/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md">
                  Most Popular for Individuals
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Pro Shield
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Solo
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-white">
                      {currency.symbol}{isAnnual ? currency.individualAnnual : currency.individualMonthly}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      {isAnnual ? '/ year' : '/ month'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Full personal protection against job offer checks, investment traps, and phishing links.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <strong className="text-white">Unlimited daily AI scans</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Deep URL phishing & spoofing engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Safe neutral reply script generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Printable bank & police incident dossier</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartCheckout('individual')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:from-rose-400 hover:to-amber-400 shadow-md shadow-rose-950/50 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Select Pro Shield</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Plan 3: Family & Freelancer Guardian */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Family & Freelance
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Multi-Seat
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-white">
                      {currency.symbol}{isAnnual ? currency.familyAnnual : currency.familyMonthly}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      {isAnnual ? '/ year' : '/ month'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Protect up to 5 family members (grandparents, parents, kids) or audit freelance client invoices.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <strong className="text-white">Up to 5 protected devices/seats</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Elder scam alerts & WhatsApp scripts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Freelance client & contract safety audit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Priority emergency fraud helpline triage</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartCheckout('family')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Select Guardian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Promo Code & Money Back Guarantee */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <form onSubmit={handleApplyPromo} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (try SAFETY2026)"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 uppercase focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Apply
                </button>
                {promoApplied && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> 100% Off Applied
                  </span>
                )}
              </form>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>30-Day Money-Back Guarantee • 256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Simulation View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Plans
              </button>
              <span className="text-xs font-semibold text-rose-400">
                Step 2 of 2: Secure Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Order Summary */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white">Order Summary</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="capitalize">{selectedPlan} Protection Plan</span>
                    <span>{currency.flag} {currency.symbol}{currentPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Billing Frequency</span>
                    <span className="capitalize">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Applicable Taxes (VAT/GST)</span>
                    <span>Included</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Safety2026 Promotional Discount</span>
                      <span>-100% Free</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Due Today:</span>
                  <span className="text-lg text-rose-400">
                    {currency.symbol}{promoApplied ? '0.00' : currentPrice} {currency.code}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  🔒 Billed in {currency.name} ({currency.code}). Automatic renewal. Cancel with one click anytime in your dashboard settings.
                </div>
              </div>

              {/* Right Payment Form */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  Select Payment Method
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs font-bold text-rose-300 flex flex-col items-center justify-center gap-1"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1"
                  >
                    <span>Apple / Google</span>
                    <span className="text-[10px] text-slate-500">Instant</span>
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1"
                  >
                    <span>{selectedCurrency === 'INR' ? 'UPI' : selectedCurrency === 'BRL' ? 'Pix' : 'PayPal'}</span>
                    <span className="text-[10px] text-slate-500">Local Pay</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="12 / 28"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="•••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteSubscription}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:from-rose-400 hover:to-amber-400 shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                      <span>Activating Security License...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Activate Unlimited Protection ({currency.symbol}{promoApplied ? '0.00' : currentPrice})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
