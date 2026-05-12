# Fluxora · AI Spend Audit Intelligence

Fluxora is a "CFO-grade" deterministic audit platform designed for high-growth startups to uncover hidden AI tool sprawl and recover liquid capital. It transforms complex SaaS subscription data into an actionable recovery roadmap in under 60 seconds—no login required.

## 🌟 Key Features
- **Category-Based Redundancy Detection:** Automatically flags overlapping tool subscriptions (e.g., Cursor + Copilot) to eliminate wastage.
- **Stage-Based Peer Benchmarking:** Compare your AI spend-per-employee against industry averages for Pre-Seed, Seed, and Series A teams.
- **Seat vs. API Tracking:** Distinct monitoring for per-seat licenses and usage-based API spend to catch unexpected cost spikes.
- **Deterministic Audit Engine:** Hardcoded math based on verified 2026 pricing registry data.
- **CFO-Ready PDF Reports:** Generate professional financial memos with shareable, anonymous URLs.

## 🏗️ The "Value-First" Workflow

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

### 1. High-Precision Audit Dashboard
![Dashboard](https://raw.githubusercontent.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-/main/public/screenshot-results.png)
*Deterministic analysis of your AI stack with clear action items and financial justifications.*

### 2. Viral Sharing & Open Graph
![Sharing](https://raw.githubusercontent.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-/main/public/screenshot-share.png)
*Unique, anonymous shareable URLs with professional Open Graph previews for Twitter/LinkedIn.*

### 3. Embeddable Partner Widget
![Widget](https://raw.githubusercontent.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-/main/public/screenshot-form.png)
*A lightweight interactive widget for partners to drive audits from their own sites.*

> **Watch the 30-second Demo:** [Loom Video Link Placeholder](https://www.loom.com/share/your-video-id)

## 🏗️ Strategic Decisions & Trade-offs

1. **Deterministic Logic vs. LLM Math**: We chose hardcoded rules in TypeScript over LLM-based calculations. **Reasoning:** CFOs require absolute precision; an LLM hallucination in a financial audit destroys trust instantly.
2. **Post-Value Lead Capture**: We moved the email gate to the *end* of the experience. **Reasoning:** Proving value first earns the trust needed to capture high-intent leads rather than bounce-prone emails.
3. **Prisma 6 Stability**: We intentionally avoided Prisma 7 (Beta) to ensure connection stability on Vercel. **Reasoning:** Production uptime for shareable links is more valuable than experimental ORM features.
4. **Honeypot Abuse Protection**: We used hidden form fields over CAPTCHA. **Reasoning:** Maintain a friction-less "1-click" feel while still filtering out 99% of automated spam.
5. **Aesthetic Minimalism (Midnight Slate)**: We avoided standard white dashboards for a high-contrast dark theme with 0.5px grid lines. **Reasoning:** Create a "Systems Engineering" vibe that feels authoritative and premium.

## 📊 Comprehensive Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical pipeline and scalability plan.
*   **[DEVLOG.md](./DEVLOG.md)**: 7-day development history and arc.
*   **[REFLECTION.md](./REFLECTION.md)**: Deep dive into the hardest bugs and strategic pivots.
*   **[TESTS.md](./TESTS.md)**: Breakdown of the 7 automated audit engine tests.
*   **[PRICING_DATA.md](./PRICING_DATA.md)**: Verified May 2026 pricing sources.
*   **[GTM.md](./GTM.md)**: Go-to-market and user acquisition strategy.
*   **[ECONOMICS.md](./ECONOMICS.md)**: Business model and LTV projections.
*   **[USER_INTERVIEWS.md](./USER_INTERVIEWS.md)**: Direct feedback from early user tests.

## 🔗 Links
- **GitHub:** [https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-](https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-)
- **Deployed URL:** [https://fluxora-credex-ai-spend-audit-tool.vercel.app/](https://fluxora-credex-ai-spend-audit-tool.vercel.app/)
- **Marketplace:** [https://credex.rocks](https://credex.rocks)
