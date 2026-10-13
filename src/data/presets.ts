import { PresetScamCase, ScamCategory } from '../types';

export const CATEGORY_INFO: Record<ScamCategory, { label: string; icon: string; description: string; placeholder: string }> = {
  job_offer: {
    label: 'Job Offers',
    icon: 'Briefcase',
    description: 'Remote task jobs, equipment check advances, Telegram interviews, recruitment recruiters.',
    placeholder: 'Paste the recruitment message, interview email, job specs, or salary offer here...',
  },
  whatsapp_sms: {
    label: 'WhatsApp & SMS',
    icon: 'MessageSquare',
    description: '"Hi Mom / Broken Phone", missed delivery re-routing, 2FA code grabs, bank security SMS.',
    placeholder: 'Paste the WhatsApp, Telegram, or SMS chat text, along with the sender number...',
  },
  investment: {
    label: 'Investment & Crypto',
    icon: 'TrendingUp',
    description: 'Guaranteed ROI, crypto trading bots, binary forex, liquidity pools, VIP signals.',
    placeholder: 'Paste the investment brochure, trading pitch, crypto contract link, or advisor message...',
  },
  website_url: {
    label: 'Websites & URLs',
    icon: 'Globe',
    description: 'Phishing login pages, lookalike domains, fake escrow portals, suspicious payment gateways.',
    placeholder: 'Paste the suspicious URL (e.g. https://...) or copy the website source/text...',
  },
  marketplace: {
    label: 'Marketplace Listings',
    icon: 'ShoppingBag',
    description: 'Facebook Marketplace, eBay, Craigslist, fake courier payment links, buyer overpayments.',
    placeholder: 'Paste the buyer/seller message, listing link, or courier pickup instructions...',
  },
  freelancer: {
    label: 'Freelance Clients',
    icon: 'Laptop',
    description: 'Unpaid test projects, off-platform redirects, client software install demands, check fraud.',
    placeholder: 'Paste the freelance client inquiry, contract terms, or work assignment request...',
  },
  general: {
    label: 'Any Suspicious Text',
    icon: 'ShieldAlert',
    description: 'Unrecognized letters, lottery prizes, IRS/court threats, tech support popups.',
    placeholder: 'Paste any text, email, letter, or suspicious communication for instant AI analysis...',
  },
};

export const PRESET_CASES: PresetScamCase[] = [
  {
    id: 'job-check-scam',
    title: 'Remote Data Entry + Equipment Check Scam',
    category: 'job_offer',
    recommendedPersona: 'freelancer',
    sender: 'recruitment@apex-global-logistics-careers.net (Telegram: @ApexHR_Jessica)',
    context: 'Applied on job board, got an immediate response without interview',
    snippet: `Hello! Congratulations! After reviewing your resume, you have been selected for the position of Remote Administrative / Data Entry Specialist at Apex Global. The pay rate is $52.50/hour with 25-35 flexible hours weekly.

To commence onboarding, our finance department will issue an electronic check of $3,850 payable directly to you. You are instructed to deposit this check via your mobile banking app, retain $500 as your sign-on bonus, and immediately wire the remaining $3,350 via Zelle or Bitcoin to our authorized office equipment vendor to ship your Apple MacBook Pro, encrypted workstation, and time-tracking software.

Please connect with Jessica on Telegram (@ApexHR_Jessica) to complete your setup within 24 hours.`,
    tag: 'Advance-Fee / Check Fraud',
    riskExpectation: 'CRITICAL_SCAM',
  },
  {
    id: 'whatsapp-hi-mum',
    title: 'WhatsApp "Hi Mum, My Phone Broke" Scam',
    category: 'whatsapp_sms',
    recommendedPersona: 'family',
    sender: '+44 7911 204918 (WhatsApp message)',
    context: 'Received unexpectedly on a Saturday afternoon from unknown number',
    snippet: `Hi mum, my phone fell in the sink this morning and broke completely 😭 I had to buy this cheap temporary burner phone so this is my temporary number for now until my insurance arrives. Can you save this number please?

Also mum, I have a big problem. My online banking app is locked to my old phone and I have an urgent rent invoice of £680 due before 5pm today otherwise the landlord will cancel my lease. Could you please send £680 to my landlord's account right now? I will transfer it straight back to you tomorrow morning as soon as my new phone is activated.

Sort code: 20-04-15
Account: 88492019
Ref: Room Rent

Love you lots xxx`,
    tag: 'Family Impersonation',
    riskExpectation: 'CRITICAL_SCAM',
  },
  {
    id: 'crypto-vip-bot',
    title: 'VIP Automated Crypto Arbitrage Bot',
    category: 'investment',
    recommendedPersona: 'individual',
    sender: 'ApexYield Protocol (Invited via Telegram direct message)',
    context: 'Direct message claiming to share an institutional yield loophole',
    snippet: `🚀 Guaranteed 5.2% Daily Compounding Passive Income with ApexYield AI Bot!

Our patented quantum algorithm executes flash loan arbitrage across Binance, Uniswap, and Bybit with ZERO downside risk. 
• Tier 1: Deposit $250 USDT -> Daily Return: $13.00 (Risk Free)
• Tier 2: Deposit $1,500 USDT -> Daily Return: $78.00 (Instant automated withdrawals)
• Tier 3: Deposit $5,000 USDT -> VIP Pool: 6.8% daily yield!

100% money-back guarantee licensed by Global Blockchain Financial Authority. Join 14,800+ happy investors. Send USDT (TRC-20) to our smart contract wallet address below and earnings start within 60 minutes. Limited slots available!`,
    tag: 'Ponzi / Pig Butchering',
    riskExpectation: 'CRITICAL_SCAM',
  },
  {
    id: 'phishing-courier-link',
    title: 'Marketplace Buyer + Fake DPD / Courier Link',
    category: 'marketplace',
    recommendedPersona: 'individual',
    sender: 'Buyer on Facebook Marketplace (@SarahMiller_92)',
    context: 'Selling a used PlayStation 5 for $380',
    snippet: `Hi! I really want to buy your PlayStation 5 right now for the full asking price of $380. I'm currently away visiting my sister in Newcastle so I cannot pick it up in person, but I have already booked and paid for DPD Express Courier to come to your door and collect it tomorrow.

I have transferred the $380 payment to the DPD secure holding escrow portal. All you need to do is click this link, enter your debit card number and CVV to verify your identity, and the $380 will be instantly released into your bank card:

👉 https://dpd-express-security-payment-uk.cc/track/escrow-receive?id=9928174

Please do it quickly so the courier can get dispatched!`,
    tag: 'Fake Escrow / Phishing',
    riskExpectation: 'CRITICAL_SCAM',
  },
  {
    id: 'freelance-test-trap',
    title: 'Unpaid Massive Test Project + Platform Bypass',
    category: 'freelancer',
    recommendedPersona: 'freelancer',
    sender: 'Upwork prospect inviting to direct Skype / email communication',
    context: 'Client sent direct message asking to leave platform immediately',
    snippet: `Hey, love your portfolio. We have an ongoing contract worth $12,000 for a complete web design system. We dislike Upwork's 10% fee and escrow holds, so let's chat directly on Telegram (@TechCorp_Lead) and pay you directly via PayPal or check.

Before we award the contract, our CEO requires you to complete a "brief skill qualification test": design 5 responsive high-fidelity homepage variations, the entire checkout funnel, and provide Figma editable source assets by tomorrow 9 AM. If approved, we will pay you $1,000 extra on your first invoice! Also, please install this proprietary screen recorder tracker zip file from our Google Drive to log your test hours.`,
    tag: 'Spec Work / Malware / Off-Platform',
    riskExpectation: 'HIGH_RISK',
  },
  {
    id: 'legitimate-interview',
    title: 'Verified Legitimate Recruiter Outreach',
    category: 'job_offer',
    recommendedPersona: 'freelancer',
    sender: 'marcus.vance@shopify.com (Official domain authenticated via SPF/DKIM)',
    context: 'Outreach on LinkedIn connecting to official company hiring careers site',
    snippet: `Hi Priya,

I hope you are having a great week! I came across your GitHub open-source contributions and portfolio, and our engineering team at Shopify is currently looking for a Senior React Engineer for our merchant dashboard team.

The role is fully remote within North America or UK, with an annual compensation band of $145,000 - $175,000 USD plus equity and benefits. 

If this sounds like something you might be open to exploring, you can review the full job description and schedule an introductory 25-minute chat directly through our verified careers page: https://www.shopify.com/careers/senior-frontend-engineer-48291

No rush at all, and thank you for your time!

Best regards,
Marcus Vance
Senior Technical Recruiter | Shopify`,
    tag: 'Legitimate Corporate Outreach',
    riskExpectation: 'SAFE',
  },
];

export const TRENDING_SCAMS_2026 = [
  {
    title: 'AI Voice Cloning "Emergency" Calls',
    target: 'Families & Elders',
    trend: 'Rising 140%',
    description: 'Scammers clone 3-second audio clips from TikTok/Instagram reels and phone parents pretending their child was arrested or injured in a car crash demanding bail via crypto or Bitcoin ATMs.',
    prevention: 'Establish a secret family "safeword" that only your real family members know.'
  },
  {
    title: 'Fake Task & App Store Rating "Jobs"',
    target: 'Freelancers & Students',
    trend: 'Global Epidemic',
    description: 'Recruiters on WhatsApp pay $30 for liking 5 YouTube videos, then move victims to a "VIP workbench" requiring depositing their own funds to "unlock tasks with higher commission".',
    prevention: 'Never pay money or buy cryptocurrency to unlock your own salary or commissions.'
  },
  {
    title: 'Parking Meter & Invoice "Quishing" (QR Phishing)',
    target: 'Individuals & Drivers',
    trend: 'High Infiltration',
    description: 'Physical stickers placed over genuine parking meter QR codes or included in utility email PDFs, redirecting to fraudulent card payment clones.',
    prevention: 'Always verify the browser URL after scanning any QR code; prefer official app stores.'
  },
  {
    title: 'Marketplace "Courier Escrow" Links',
    target: 'Secondhand Sellers',
    trend: 'High Frequency',
    description: 'Buyers insist on using fake courier links (Royal Mail, FedEx, DPD, Australia Post) that look identical to genuine sites but steal card credentials.',
    prevention: 'Never enter your card number to receive money. Receiving funds requires only an IBAN or handle.'
  }
];

export const GLOBAL_HELPLINES = [
  {
    country: 'United States',
    flag: '🇺🇸',
    agency: 'Federal Trade Commission (FTC)',
    website: 'https://reportfraud.ftc.gov',
    phone: '1-877-FTC-HELP',
    note: 'Primary reporting for consumer fraud, impersonation, and identity theft.'
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    agency: 'Action Fraud & National Cyber Security Centre',
    website: 'https://www.actionfraud.police.uk',
    phone: '0300 123 2040',
    note: 'Forward scam SMS to 7726 and phishing emails to report@phishing.gov.uk.'
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    agency: 'Canadian Anti-Fraud Centre (CAFC)',
    website: 'https://www.antifraudcentre-centreantifraude.ca',
    phone: '1-888-495-8501',
    note: 'Central agency for tracking cyber scams and fraud.'
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    agency: 'National Anti-Scam Centre (Scamwatch)',
    website: 'https://www.scamwatch.gov.au',
    phone: '1300 795 995',
    note: 'Operated by the Australian Competition and Consumer Commission.'
  },
  {
    country: 'India',
    flag: '🇮🇳',
    agency: 'National Cyber Crime Reporting Portal',
    website: 'https://cybercrime.gov.in',
    phone: '1930 (Helpline)',
    note: 'Immediate financial freeze helpline for digital banking fraud within golden hour.'
  },
  {
    country: 'European Union',
    flag: '🇪🇺',
    agency: 'Europol EC3 (European Cybercrime Centre)',
    website: 'https://www.europol.europa.eu/report-a-crime',
    phone: 'Local Police (112)',
    note: 'Coordinates cross-border European cybersecurity fraud investigations.'
  }
];
