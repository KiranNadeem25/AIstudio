# ScamGuard AI - Universal Scam & Fraud Detector

An AI-powered cybersecurity and scam prevention application with Progressive Web App (PWA) support, real-time regional push notification alerts, and international multi-currency subscription monetization.

Designed for **individuals**, **families (elder protection)**, and **freelancers**.

---

## 🚀 Key Features

### 1. Multi-Vector Fraud Forensics
- **Suspicious Job Offers**: Detects fake remote data entry, advance-fee checks for equipment, and off-platform Telegram/WhatsApp recruitment.
- **WhatsApp & SMS Alerts**: Catches "Hi Mum / Broken Phone" impersonations, fake toll fees (SunPass / Linkt / E-ZPass), and 2FA credential grabs.
- **Investment & Crypto Pitches**: Identifies impossible guaranteed yield schemes, flash-loan arbitrage bots, and pig butchering fraud.
- **Websites & URLs**: Detects phishing login portals, typosquatting domains, and fraudulent payment gates.
- **Marketplace Listings**: Flags courier escrow phishing (fake DPD / Royal Mail / FedEx links) and buyer overpayment check traps.
- **Freelance Inquiries**: Identifies unpaid speculative test assignments, platform fee bypass, and malicious screen recorders.

### 2. Forensic Dossier & Actionable Tools
- **Threat Meter (0–100)**: Animated risk severity gauge (Safe, Suspicious, High Risk, Critical Scam).
- **Red Flags with Quoted Evidence**: Pinpoints exact excerpts from messages with forensic explanations.
- **Psychological Coercion Analysis**: Details urgency, authority impersonation, false intimacy, and isolation tactics.
- **Interactive Action Checklist**: Interactive DOs and DON'Ts containment list.
- **Safe Reply Generator**: 1-click copy pre-crafted neutral and pushback response scripts.
- **Exportable Incident Dossier**: Formatted for bank chargeback inquiries and police reports.
- **Family Alert Generator**: 1-click warning message to share with elderly family members on WhatsApp.

### 3. Real-Time Regional Push Notifications
- Browser Notification API integration with synthesized Web Audio alert chimes.
- Filter and alert for verified outbreaks across:
  - 🇺🇸 United States (FTC / IC3)
  - 🇬🇧 United Kingdom (Action Fraud / NCSC)
  - 🇮🇳 India (I4C / Cyber Crime Portal)
  - 🇦🇺 Australia (Scamwatch)
  - 🇨🇦 Canada (CAFC)
  - 🇪🇺 European Union (Europol)
  - 🌐 Global Threats

### 4. Progressive Web App (PWA) & Mobile Ready
- Installable on Android, iOS Safari ("Add to Home Screen"), and Chromium desktops.
- Standalone mode, offline caching, and responsive mobile bottom navigation.

### 5. International Monetization
- 3 free daily checks with live quota tracking.
- PPP-adjusted pricing across 10 currencies: USD, EUR, GBP, INR, CAD, AUD, BRL, NGN, PHP, JPY.
- Interactive checkout simulation with monthly/annual billing and promo code support.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons, Motion
- **Mobile & Offline**: `vite-plugin-pwa`, Service Workers, Web App Manifest
- **Backend**: Node.js, Express, `tsx`
- **AI Engine**: `@google/genai` (Gemini 3.8 Flash) with resilient heuristic fallback

---

## 📦 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or bun

### Installation
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/scamguard-ai.git
cd scamguard-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Add your GEMINI_API_KEY (optional, fallback heuristic engine included)

# 4. Start local development server (runs full-stack Express + Vite on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm start
```
