export type ScamCategory = 
  | 'job_offer'
  | 'whatsapp_sms'
  | 'investment'
  | 'website_url'
  | 'marketplace'
  | 'freelancer'
  | 'general';

export type CustomerType = 'individual' | 'family' | 'freelancer';

export interface RedFlag {
  flag: string;
  severity: 'critical' | 'warning' | 'caution';
  matchedExcerpt?: string;
  explanation: string;
}

export interface PsychologicalTactic {
  tactic: string;
  description: string;
}

export interface ActionItem {
  action: string;
  type: 'DO' | 'DONT';
}

export interface SafeReply {
  label: string;
  replyText: string;
  tone: 'verification_demand' | 'polite_refusal' | 'firm_callout';
}

export interface AnalysisResult {
  threatScore: number; // 0 - 100
  riskLevel: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL_SCAM';
  verdictHeadline: string;
  verdictSummary: string;
  scamTypeDetected: string;
  confidencePercentage: number;
  identifiedRedFlags: RedFlag[];
  psychologicalTactics: PsychologicalTactic[];
  victimProfileRisk: string;
  immediateActions: ActionItem[];
  safeReplies: SafeReply[];
  verificationSteps: string[];
  helplineReporting: {
    agency: string;
    website: string;
    advice: string;
  };
  analyzedAt?: string;
  queryCategory?: ScamCategory;
  submittedSnippet?: string;
  submittedSender?: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  individualMonthly: number;
  individualAnnual: number;
  familyMonthly: number;
  familyAnnual: number;
  freelancerMonthly: number;
  freelancerAnnual: number;
}

export interface PresetScamCase {
  id: string;
  title: string;
  category: ScamCategory;
  recommendedPersona: CustomerType;
  sender: string;
  context: string;
  snippet: string;
  tag: string;
  riskExpectation: 'CRITICAL_SCAM' | 'HIGH_RISK' | 'SUSPICIOUS' | 'SAFE';
}

export interface UserSubscription {
  plan: 'free' | 'individual' | 'family' | 'freelancer';
  currency: string;
  billingCycle: 'monthly' | 'annual';
  remainingFreeScans: number;
  maxFreeScans: number;
  activeUntil?: string;
}
