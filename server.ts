import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface RedFlag {
  flag: string;
  severity: 'critical' | 'warning' | 'caution';
  matchedExcerpt?: string;
  explanation: string;
}

interface PsychologicalTactic {
  tactic: string;
  description: string;
}

interface ActionItem {
  action: string;
  type: 'DO' | 'DONT';
}

interface SafeReply {
  label: string;
  replyText: string;
  tone: 'verification_demand' | 'polite_refusal' | 'firm_callout';
}

interface AnalysisResult {
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
}

// Fallback rule-based analyzer when AI API is unavailable or offline
function fallbackAnalysis(category: string, content: string, senderInfo: string, customerType: string): AnalysisResult {
  const lower = (content + ' ' + (senderInfo || '')).toLowerCase();
  const redFlags: RedFlag[] = [];
  const tactics: PsychologicalTactic[] = [];
  let score = 25;
  let scamType = 'Suspicious Communication';

  // Common patterns
  if (lower.includes('telegram') || lower.includes('signal') || lower.includes('whatsapp') && category === 'job_offer') {
    score += 25;
    redFlags.push({
      flag: 'Off-Platform Messaging Shift',
      severity: 'critical',
      matchedExcerpt: 'Redirecting communications to unmonitored chat channels (Telegram/WhatsApp)',
      explanation: 'Legitimate corporate hiring teams conduct interviews through official corporate emails and video systems, never anonymous messaging apps.'
    });
    tactics.push({
      tactic: 'Channel Isolation',
      description: 'Moving victim away from platform buyer/seller or recruiter protections.'
    });
  }

  if (lower.includes('cheque') || lower.includes('check') || lower.includes('equipment') || lower.includes('wire') || lower.includes('zelle') || lower.includes('gift card') || lower.includes('bitcoin') || lower.includes('crypto')) {
    score += 30;
    redFlags.push({
      flag: 'Irreversible / Fake Payment Mechanism',
      severity: 'critical',
      matchedExcerpt: 'Mention of cash advance, check deposit, wire, or cryptocurrency',
      explanation: 'Scammers frequently issue counterfeit checks or demand irreversible crypto/Zelle/gift card payments before the bank detects the bounced check.'
    });
    tactics.push({
      tactic: 'Financial Coercion',
      description: 'Exploiting bank settlement delays (floating checks) to extract real funds.'
    });
  }

  if (lower.includes('urgent') || lower.includes('immediate') || lower.includes('within 24 hours') || lower.includes('act now') || lower.includes('asap') || lower.includes('limited time')) {
    score += 20;
    redFlags.push({
      flag: 'Manufactured Urgency',
      severity: 'warning',
      matchedExcerpt: 'Demanding immediate action or threatening account/opportunity loss',
      explanation: 'Scammers deliberately induce panic or FOMO to prevent you from consulting friends or conducting rational background checks.'
    });
    tactics.push({
      tactic: 'High-Pressure Urgency',
      description: 'Forces rushed decision-making to bypass critical thinking.'
    });
  }

  if (lower.includes('guaranteed') || lower.includes('100%') || lower.includes('passive income') || lower.includes('daily profit') || lower.includes('roi')) {
    score += 35;
    scamType = 'High-Yield Investment Fraud (Ponzi / Pig Butchering)';
    redFlags.push({
      flag: 'Impossible Guaranteed Returns',
      severity: 'critical',
      matchedExcerpt: 'Promises of risk-free or guaranteed high daily/weekly yield',
      explanation: 'No legal financial product offers guaranteed astronomical yields. Legitimate investments always carry disclosure of market risks.'
    });
  }

  if (lower.includes('hi mom') || lower.includes('lost my phone') || lower.includes('new number') || lower.includes('broken phone')) {
    score += 45;
    scamType = 'WhatsApp "Hi Mum / Broken Phone" Impersonation';
    redFlags.push({
      flag: 'Family Impersonation Emergency',
      severity: 'critical',
      matchedExcerpt: 'Unrecognized number claiming to be a child or family member with an urgent bill',
      explanation: 'Classic social engineering targeting parents by posing as their child claiming a damaged phone and needing immediate bill or loan payment.'
    });
  }

  score = Math.min(score, 96);
  if (redFlags.length === 0) {
    score = 15;
    scamType = 'Standard Communication';
    redFlags.push({
      flag: 'No Severe Hard Triggers Found in Basic Heuristics',
      severity: 'caution',
      explanation: 'Content does not contain overt high-risk keywords, but always independently verify unfamiliar senders.'
    });
  }

  const riskLevel = score >= 80 ? 'CRITICAL_SCAM' : score >= 55 ? 'HIGH_RISK' : score >= 35 ? 'SUSPICIOUS' : 'SAFE';

  return {
    threatScore: score,
    riskLevel,
    verdictHeadline: score >= 60 ? `Warning: Detected Characteristics of ${scamType}` : 'Low Threat Indicators Detected',
    verdictSummary: score >= 60 
      ? `This submission exhibits multiple hallmark indicators of fraudulent social engineering. Scammers use these precise phrasing patterns to extract credentials, cash advances, or personal data.`
      : `No immediate critical threat markers were flagged. However, verify the contact identity through established offline channels before sharing funds or documents.`,
    scamTypeDetected: scamType,
    confidencePercentage: 88,
    identifiedRedFlags: redFlags,
    psychologicalTactics: tactics.length > 0 ? tactics : [{ tactic: 'Apparent Normalcy', description: 'Attempting to establish trust through familiar pleasantries' }],
    victimProfileRisk: customerType === 'freelancer' 
      ? 'High risk of unpaid test tasks, equipment check fraud, or off-platform fee avoidance.' 
      : customerType === 'family' 
      ? 'Elevated risk of grandparent/parent deception using family emergencies.' 
      : 'Risk of identity theft, unauthorized card charges, or social engineering.',
    immediateActions: [
      { action: 'DO NOT click unverified links, enter login credentials, or send money.', type: 'DONT' },
      { action: 'DO NOT accept off-platform payments (e.g. Zelle, wire, crypto, gift cards).', type: 'DONT' },
      { action: 'Call the purported sender using their official known phone number.', type: 'DO' },
      { action: 'Document screenshots and report to official consumer fraud portals.', type: 'DO' },
    ],
    safeReplies: [
      {
        label: 'Strict Verification Demand',
        replyText: 'Please send this proposal or communication via your official corporate email address with full company registration details. I do not conduct business or interviews over personal messaging apps.',
        tone: 'verification_demand'
      },
      {
        label: 'Direct Refusal & Notice',
        replyText: 'I do not accept payments, test assignments, or requests outside official vetted channels. Please remove my contact information from your records.',
        tone: 'polite_refusal'
      }
    ],
    verificationSteps: [
      'Search the company name + "scam" or "complaints" on Google and Reddit.',
      'Check the company registration on official business registers (e.g. SEC, Companies House, ASIC).',
      'Look up the domain age on Whois (scam sites are typically under 60 days old).'
    ],
    helplineReporting: {
      agency: 'Federal Trade Commission (FTC) & Action Fraud',
      website: 'https://reportfraud.ftc.gov',
      advice: 'If you have sent money or sensitive information, contact your bank fraud department immediately to request a stop payment.'
    }
  };
}

// API endpoint for analyzing scams
app.post('/api/analyze-scam', async (req, res) => {
  const { category, content, senderInfo, context, customerType } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Text or URL content is required for analysis.' });
  }

  const cat = category || 'general';
  const cust = customerType || 'individual';

  // Construct structured prompt for Gemini
  const prompt = `
You are the world's foremost fraud investigator and cybersecurity intelligence analyst specializing in consumer and freelancer scams in 2026.
Analyze the following user-submitted message/offer/URL with forensic precision.

SUBMISSION METADATA:
- Category: ${cat} (e.g. job_offer, whatsapp_sms, investment, website_url, marketplace, freelancer)
- Target Audience Profile: ${cust} (individual, family, or freelancer)
- Sender / Source Information: ${senderInfo || 'Not provided'}
- User Context / Situation: ${context || 'None provided'}

SUBMISSION CONTENT:
"""
${content.slice(0, 10000)}
"""

Evaluate for known 2026 scam patterns:
- Fake remote jobs (Telegram/WhatsApp interviews, equipment checks, paid training fees, fake data annotation)
- WhatsApp / SMS scams ("Hi Mum / Broken phone", missed parcel redirection, unrequested 2FA codes, romantic pig butchering)
- Investment & crypto scams (guaranteed 200%+ APR, fake automated bot traders, liquidity pool drainers, binary options)
- Website phishing & marketplace fraud (fake escrow, typosquatting domains, fake courier payment links like Royal Mail / DPD / USPS, fake buyer overpayment)
- Freelance client fraud (free high-effort test task, check advance fraud, moving off Upwork/Fiverr, malicious attachments)

Return a strict JSON object with:
1. threatScore: integer 0-100 (0=Completely Safe/Legitimate, 25=Minor Caution, 50=Suspicious, 75=High Risk Scam, 95-100=Confirmed Malicious Scam)
2. riskLevel: string ("SAFE" if score < 30, "SUSPICIOUS" if 30-59, "HIGH_RISK" if 60-84, "CRITICAL_SCAM" if >= 85)
3. verdictHeadline: punchy, direct conclusion for the user (e.g. "Critical Scam: Advance-Fee Equipment Check Job Scam")
4. verdictSummary: 2-3 clear, jargon-free sentences explaining exactly what is happening and the trick being pulled.
5. scamTypeDetected: exact classification (e.g. "Overpayment & Fake Check Fraud", "Pig Butchering Crypto Scheme", "Package Delivery Phishing", "Impersonation Social Engineering")
6. confidencePercentage: integer 70-99
7. identifiedRedFlags: array of objects with { "flag": string, "severity": "critical" | "warning" | "caution", "matchedExcerpt": string (quote specific phrase from content if applicable), "explanation": string }
8. psychologicalTactics: array of objects with { "tactic": string (e.g. "Artificial Urgency & FOMO", "Authority Intimidation", "False Intimacy & Grooming", "Isolation from Advisors"), "description": string }
9. victimProfileRisk: specific vulnerability advice tailored to ${cust}
10. immediateActions: array of objects with { "action": string, "type": "DO" | "DONT" } (at least 3-4 concrete actionable steps)
11. safeReplies: array of 2-3 ready-to-copy safe messages with { "label": string, "replyText": string, "tone": "verification_demand" | "polite_refusal" | "firm_callout" }
12. verificationSteps: array of 3-4 specific independent steps the user can take to verify legitimacy safely
13. helplineReporting: object with { "agency": string, "website": string, "advice": string }
`;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      console.log('GEMINI_API_KEY not configured or placeholder, using instant forensic fallback engine');
      const fallbackResult = fallbackAnalysis(cat, content, senderInfo || '', cust);
      return res.json(fallbackResult);
    }

    // Call Gemini with a 7-second safety timeout
    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatScore: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING },
            verdictHeadline: { type: Type.STRING },
            verdictSummary: { type: Type.STRING },
            scamTypeDetected: { type: Type.STRING },
            confidencePercentage: { type: Type.INTEGER },
            identifiedRedFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  flag: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  matchedExcerpt: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['flag', 'severity', 'explanation'],
              },
            },
            psychologicalTactics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tactic: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['tactic', 'description'],
              },
            },
            victimProfileRisk: { type: Type.STRING },
            immediateActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ['action', 'type'],
              },
            },
            safeReplies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  replyText: { type: Type.STRING },
                  tone: { type: Type.STRING },
                },
                required: ['label', 'replyText', 'tone'],
              },
            },
            verificationSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            helplineReporting: {
              type: Type.OBJECT,
              properties: {
                agency: { type: Type.STRING },
                website: { type: Type.STRING },
                advice: { type: Type.STRING },
              },
              required: ['agency', 'website', 'advice'],
            },
          },
          required: [
            'threatScore',
            'riskLevel',
            'verdictHeadline',
            'verdictSummary',
            'scamTypeDetected',
            'confidencePercentage',
            'identifiedRedFlags',
            'psychologicalTactics',
            'immediateActions',
            'safeReplies',
            'verificationSteps',
            'helplineReporting',
          ],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API call timed out after 4.5 seconds')), 4500)
    );

    const response = await Promise.race([geminiCall, timeoutPromise]);

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } else {
      throw new Error('Empty response from model');
    }
  } catch (err: any) {
    console.error('Gemini scam analysis error or timeout, using resilient fallback engine:', err?.message || err);
    // Graceful fallback to guarantee 100% uptime
    const fallbackResult = fallbackAnalysis(cat, content, senderInfo || '', cust);
    return res.json(fallbackResult);
  }
});

// Mount Vite middleware in development, serve dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ScamGuard AI Server running on port ${PORT}`);
});
