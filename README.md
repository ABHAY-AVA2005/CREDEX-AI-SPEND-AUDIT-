# Fluxora · AI Spend Audit Intelligence

Fluxora is a "CFO-grade" deterministic audit platform designed for high-growth startups to uncover hidden AI tool sprawl and recover liquid capital. It transforms complex SaaS subscription data into an actionable recovery roadmap in under 60 seconds—no login required.

## 🌟 Key Features
- **📊 CFO Revenue Context & ROI Scorer (v2):** Map raw dollar savings directly to MRR and ARR percentages (the language investors and CFOs read).
- **🎛️ Live Sliders Weight-Tuning (v2):** Dynamically re-rank recommendations client-side based on Cost, Safety, Capability, and Team Velocity.
- **🔍 90+ AI Niche Tools Registry (v2):** Extended tool knowledge base (Tabnine, Devin, Midjourney, Groq, Mistral, Runway, etc.) with fuzzy name matching.
- **📉 Category-Based Redundancy Detection:** Automatically flags overlapping tool subscriptions (e.g., Cursor + Copilot) to eliminate wastage.
- **📊 Stage-Based Peer Benchmarking:** Compare your AI spend-per-employee against industry averages for Pre-Seed, Seed, Series A, Series B, and Late Stage teams.
- **🛡️ Seat vs. API Tracking:** Distinct monitoring for per-seat licenses and usage-based API spend to prevent surprise cost overruns.
- **Deterministic Audit Engine:** Hardcoded math based on verified 2026 pricing registry data.
- **CFO-Ready PDF Reports:** Generate professional financial memos with shareable, anonymous URLs.

## 🏗️ The "Value-First" Workflow

![Fluxora Workflow](./public/FLUXORA%20PIPELINE%20flow%20diagram.png)

**User Input** → **Zod Validation** → **Deterministic Audit Engine** → **Gemini AI Summarization** → **Result Dashboard** → **Lead Capture (Optional)** → **PDF Report Delivered**

## 🚀 Quick Start (Local Development)

### 1. Installation
```bash
git clone https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-.git
cd CREDEX-AI-SPEND-AUDIT-
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and provide:
- `DATABASE_URL`: PostgreSQL connection string.
- `RESEND_API_KEY`: For transactional email delivery.
- `GEMINI_API_KEY`: For executive summary generation.

### 3. Run
```bash
npx prisma generate
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 📸 Product Showroom

### 1. High-Performance Landing Page
![Home Page](./public/Home%20Page.png)
*A high-conversion, CFO-grade landing page designed for maximum trust and clarity.*

### 2. Multi-Step Intelligence Audit
![Audit Form](./public/audit%20screenshot%201.png)
*Interactive tool intake with dynamic Seat vs. API tracking (including monthly token estimates) and functional overlap detection.*

### 3. Executive Recovery Roadmap
![Audit Results](./public/audit%20screenshot%202.png)
*Detailed financial justifications for every recommendation, powered by our deterministic engine.*

### 4. Peer Benchmarking & KPIs
![Audit KPIs](./public/audit%20screenshot%203.png)
*Real-time comparison against industry spend-per-employee benchmarks for high-growth teams.*

### 5. Deterministic Logic Trace
![Audit Logic](./public/audit%20screenshot%204.png)
*Total transparency: Founders can see the exact math used to calculate their recovery potential.*

### 6. CFO-Ready Export & Lead Capture
![Audit Export](./public/audit%20screenshot%205.png)
*Finalized reports with integrated lead capture and professional PDF memo generation.*

## 🏗️ Strategic Decisions & Trade-offs

1. **Deterministic Logic vs. LLM Math**: We chose hardcoded rules in TypeScript over LLM-based calculations. **Reasoning:** CFOs require absolute precision; an LLM hallucination in a financial audit destroys trust instantly.
2. **Post-Value Lead Capture**: We moved the email gate to the *end* of the experience. **Reasoning:** Proving value first earns the trust needed to capture high-intent leads rather than bounce-prone emails.
3. **Prisma 6 Stability**: We intentionally avoided Prisma 7 (Beta) to ensure connection stability on Vercel. **Reasoning:** Production uptime for shareable links is more valuable than experimental ORM features.
4. **Honeypot Abuse Protection**: We used hidden form fields over CAPTCHA. **Reasoning:** Maintain a friction-less "1-click" feel while still filtering out 99% of automated spam.
5. **Aesthetic Minimalism (Midnight Slate)**: We avoided standard white dashboards for a high-contrast dark theme with 0.5px grid lines. **Reasoning:** Create a "Systems Engineering" vibe that feels authoritative and premium.

## 📊 Comprehensive Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical pipeline and scalability plan.
- **[DEVLOG.md](./DEVLOG.md)**: 8-day development history, including the V2 upgrades sprint.
- **[RECOVERY_GUIDE.md](./RECOVERY_GUIDE.md)**: Standard operating recovery guidelines and Git rollback states.
- **[PRICING_DATA.md](./PRICING_DATA.md)**: Extended pricing database verified for all 90+ tools.
- **[REFLECTION.md](./REFLECTION.md)**: Deep dive into the hardest bugs and strategic pivots.
- **[TESTS.md](./TESTS.md)**: Breakdown of the automated audit engine tests.
- **[GTM.md](./GTM.md)**: Go-to-market and user acquisition strategy.
- **[ECONOMICS.md](./ECONOMICS.md)**: Business model and LTV projections.
- **[USER_INTERVIEWS.md](./USER_INTERVIEWS.md)**: Direct feedback from early user tests.

## 🔗 Links
- **GitHub:** [https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-](https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-)
- **Deployed URL:** [https://fluxora-credex-ai-spend-audit-tool.vercel.app/](https://fluxora-credex-ai-spend-audit-tool.vercel.app/)
- **Marketplace:** [https://credex.rocks](https://credex.rocks)
