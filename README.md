# Fluxora · AI Spend Audit Intelligence

### 🔗 Active Deployment & Source Links
* **🚀 Live Vercel App Link:** [https://fluxora-credex-ai-spend-audit-tool.vercel.app/](https://fluxora-credex-ai-spend-audit-tool.vercel.app/)
* **💻 GitHub Repository:** [https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-](https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-)

---

Fluxora is a premium, "CFO-grade" deterministic audit platform designed for high-growth startups to uncover hidden AI tool sprawl, eliminate redundant licenses, and recover liquid capital. It transforms complex SaaS subscription data into an actionable financial and technical recovery roadmap in under 60 seconds—no signup or login required.

---

## 🌟 Key Production Features

### 📊 1. Snappy Multi-Step Intake Form
* **Auto-Saved Drafts:** User progress is continually backed up in the browser's local storage so that looking up billing details doesn't cause frustrating data loss.
* **Bouncer Validation (Zod):** A strict schema validates inputs server-side, protecting the calculations from bad formatting, empty numbers, or injection attacks before calculation begins. See [schemas/audit-v2.ts](./schemas/audit-v2.ts).

### 🧠 2. The Deterministic Rule Engine
The engine loops through the user's SaaS stack to find optimization paths based on predefined rules:
* **Consolidation Rule:** If a team is paying for **Cursor** (which natively includes Claude 3.5 Sonnet), the engine flags separate **Claude Pro** or **GitHub Copilot** licenses for the same seats as 100% redundant.
* **Legacy Replacement Rule:** Flags costly legacy copywriting wrappers (e.g. Jasper or Copy.ai) and highlights direct Claude Pro subscriptions, recovering up to 60% of the cost.
* **API Gateway Alert:** Identifies teams with 10+ consumer seats and suggests deploying a unified gateway (e.g. TypingMind) to cap usage bills. See [core/audit-engine](./core/audit-engine).

### 📈 3. CFO Revenue ROI Mapping (v2 Layer)
An optional collapsible step where users enter MRR/ARR and funding stages to unlock premium finance indicators:
* **Peer Benchmarking:** Compares spend per employee against SaaS medians tailored to the company's stage (**Pre-Seed through Late Stage**).
* **Burn Efficiency Score:** A normalized score showing how efficient the startup's AI spend is relative to its funding peer group.
* **Payback/Friction Calculations:** Factors in a standard $300 migration/retraining cost per tool (2 hours of engineering time at $150/h) to display break-even periods and annualized ROIs for each recommendation. See [core/revenue-context](./core/revenue-context).

### 🎛️ 4. Dynamic Live Weights Tuner (v2 Layer)
Surfaces directly on the results page, allowing founders to dynamically slide and tune recommendation cards with 0 latency (entirely client-side):
* **Four-Vector Sliders:** Adjust priorities for **Cost Savings**, **Migration Safety**, **Capability Upgrades**, and **Team Velocity**. See [components/audit/WeightsTuner.tsx](./components/audit/WeightsTuner.tsx).
* **Pre-Set Chips:** Instantly apply predefined filters:
  * *Balanced:* General-purpose optimization.
  * *Maximise Savings (Cash Tight):* Pure runway preservation, favors major cost cuts.
  * *Capability First (Growth First):* Prioritizes tool upgrades and features with minimal friction.
  * *Protect Team Flow (Stable Team):* Emphasizes safety, avoiding workflow disruptions.

### 📄 5. Multi-Format Downloads & Exports
* **CFO Print Stylesheet:** Custom `@media print` CSS rules format the complex dark dashboard into a clean, black-and-white, formal, single-page printed Executive Memo when hitting "Download PDF".
* **CSV Export:** Downloads a perfectly parsed spreadsheet mapping out tool lines, current costs, action tags, optimized costs, net savings, and specific reasoning text.

### 🔗 6. Viral Growth Referral Engine
* **Slug Referral Codes:** Generates short custom codes matching the user's public URL slug. If another team completes an audit with the code and saves over $500, both organizations unlock **3 months of Fluxora Pro** free.

---

## 🏗️ The "Value-First" Workflow

![Fluxora Workflow](./public/FLUXORA%20PIPELINE%20flow%20diagram.png)

**User Input** → **Zod Validation** → **Deterministic Audit Engine** → **Gemini AI Summarization** → **Result Dashboard** → **Lead Capture (Optional)** → **PDF Report Delivered**

---

## 📋 Comprehensive Intake Form Fields

### Step 1: Company Profile (Required)
* **Company Name** (Text Input · `companyName` · Required): The name of the organization (e.g., *Acme Corp*).
* **Total Employees** (Number Input · `companySize` · Required): Total workforce count, used to scale benchmarking.
* **Industry** (Text Input · `industry` · Optional): The commercial sector (e.g., *SaaS, Fintech*).

### Step 2: Revenue Context (Optional - Collapsible Section)
* **Monthly Recurring Revenue (MRR)** (Currency Input · `revenueContext.mrr` · Optional): Current monthly recurring revenue. Auto-calculates ARR if provided alone.
* **Annual Recurring Revenue (ARR)** (Currency Input · `revenueContext.arr` · Optional): Current ARR. Auto-populates MRR (ARR / 12) if provided alone.
* **MoM Growth Rate (%)** (Percentage Input · `revenueContext.growthRateMoM` · Optional): Month-over-month growth (e.g., entering *15* maps to *0.15*).
* **Runway (months)** (Number Input · `revenueContext.runwayMonths` · Optional): Months of remaining cash runway (clamped 0 to 120).
* **Funding Stage** (Select Dropdown · `fundingStage` · Optional): Options: `PRE_SEED`, `SEED`, `SERIES_A`, `SERIES_B`, `LATE_STAGE`. Used to determine peer medians.

### Step 3: AI & SaaS Stack (Required - Dynamic Sub-Form Lines)
For each tool in the workspace list:
* **Billing Model** (Select Dropdown · `tools.[index].type` · Required): Billing type: `Per-Seat Subscription` (`SEAT`) or `API / Usage Based` (`API`).
* **Select Tool** (Select Dropdown · `tools.[index].toolName` · Required): Select from 90+ registry tools (Cursor, Claude, OpenAI, Gemini, GitHub, etc.).
* **Current Plan** (Select Dropdown · `tools.[index].currentPlan` · Required): The plan name. Populated dynamically from registry (with standard cost-per-seat labels).
* **Seats** (Number Input · `tools.[index].seats` · Required for SEAT): Number of active seats. Disabled if Billing Model = `API`.
* **Est. Tokens/Mo (k)** (Number Input · `tools.[index].tokens` · Optional for API): Thousand tokens used monthly. Disabled if Billing Model = `SEAT`.
* **Monthly Bill ($)** (Currency Input · `tools.[index].monthlySpend` · Required): The current raw monthly bill in USD.
* **Primary Use Case** (Text Input · `tools.[index].useCases` · Required): Comma-separated categories (e.g. *Coding, Copywriting*), parsed to array.

---

## 📊 Detailed Output Metrics & Results (What the App Gives)

### 📈 1. Primary Financial KPI Cards
* **Current Spend:** Sum total of all entered monthly tool costs ($/mo).
* **Monthly Savings:** Net monthly recovery potential achieved by implementing recommendations ($/mo).
* **Optimized Spend:** Project monthly cost once tool switches and rightsizing are applied ($/mo).
* **Annual Savings:** Aggregated yearly savings metric (Monthly Savings $\times 12$).

### 🤵 2. Executive Audit Summary Memo
* **The Narrative:** A 3-sentence executive memorandum compiled live by Gemini. It establishes cash recovery goals, operational rationale, and identifies tool overlaps in institutional language.
* **Audit Compliance Badge:** Visual seal indicating **"CFO-GRADE-COMPLIANT"** backed by [Deterministic Audit Engine v4.2](./core/audit-engine).

### 📊 3. Interactive Spend Ratios (CFO Revenue Enrichment Card)
Only populated if optional revenue data was provided:
* **AI Spend as % of MRR:** Current spend relative to monthly recurring cash inflow.
* **Optimised Spend as % of MRR:** The reduced, right-sized ratio.
* **Savings as % of MRR:** Recurrent budget percentage freed up for allocation.
* **Annual Savings as % of ARR:** Strategic yearly capital recovery as an ARR percentile.
* **Burn Efficiency Score:** A stage-weighted comparison metric. A score of `1.0` matches the peer startup median. Scores `<1.0` indicate highly efficient operations, whereas `>1.0` flags over-spending teams.

### 🗺️ 4. Dynamic Peer Benchmarking Block
* **Percentile Grade:** Graph scoring the company size percentile (e.g., *74th percentile*).
* **Status Badge:** High-contrast health state indicator: `EXCELLENT` (Green), `GOOD` (Blue), `OVERSPENDING` (Amber), `CRITICAL` (Red).
* **Spend Per Developer:** Current AI spend per dev vs. average stage spend per dev.
* **Real-Time Peer Cohort:** Sidebar table listing actual venture startups matching the company's size within a $\pm 5$ employee window (e.g. *Dub.co, Basedash, Cal.com, PostHog*).

### 🛠️ 5. Step-by-Step Recommendation Cards
An ordered list of actionable tool cards (re-sorted live by the Sliders Weight Tuner):
* **Original Tool Profile:** Displays name, plan tier, seats, or token usage, alongside current spend.
* **Action Tag:** Clear visual flags: `KEEP`, `DOWNGRADE`, `REPLACE`, or `CONSOLIDATE`.
* **Alternative Proposal:** Highlights suggested alternative tool/plan, optimized cost, and net monthly recovery.
* **CFO-Grade ROI Metrics:**
  * *Payback Period:* Months required to recover initial transition friction and engineering setup costs.
  * *Annualized ROI:* Estimated yearly returns on workflow migration.
* **Transparent Math Trace:** Renders the exact equation proving the math (`Current - Optimized = Net Savings`).
* **Step-by-Step Logic Trace:** A 3-step timeline tracing exactly *why* the rules engine flagged the tool (e.g. *Step 1: Analyzed seats... Step 2: Detected overlap with tool Y... Step 3: Verified 2026 registry prices...*).

### ⚠️ 6. High-Contrast Redundancy Alerts
* Populates warnings if overlapping tools are detected (e.g. *Warning: Cursor and Claude Pro detected on the same developer seats. Consolidate to Cursor to save $20/seat.*).

---

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

---

## 🏗️ Strategic Decisions & Trade-offs

1. **Deterministic Logic vs. LLM Math**: We chose hardcoded rules in TypeScript over LLM-based calculations. **Reasoning:** CFOs require absolute precision; an LLM hallucination in a financial audit destroys trust instantly.
2. **Post-Value Lead Capture**: We moved the email gate to the *end* of the experience. **Reasoning:** Proving value first earns the trust needed to capture high-intent leads rather than bounce-prone emails.
3. **Prisma 6 Stability**: We intentionally avoided Prisma 7 (Beta) to ensure connection stability on Vercel. **Reasoning:** Production uptime for shareable links is more valuable than experimental ORM features.
4. **Honeypot Abuse Protection**: We used hidden form fields over CAPTCHA. **Reasoning:** Maintain a friction-less "1-click" feel while still filtering out 99% of automated spam.
5. **Aesthetic Minimalism (Midnight Slate)**: We avoided standard white dashboards for a high-contrast dark theme with 0.5px grid lines. **Reasoning:** Create a "Systems Engineering" vibe that feels authoritative and premium.

---

## 🛠️ The Comprehensive Tech Stack Breakdown

Every single technology inside Fluxora is selected to enforce B2B CFO-grade security, mathematical determinism, and ultra-high-fidelity premium user interfaces:

| Technology | Layer | Exact Purpose in Fluxora |
| :--- | :--- | :--- |
| **Next.js 15 (React 19)** | App Meta-Framework | Coordinates both the highly reactive React frontend and the secure Node.js backend. We rely heavily on **Next.js Server Actions** to securely process all database queries, Resend transactional emails, and Gemini AI API communications without exposing credentials or logic to the browser. |
| **React 19** | Component UI Engine | Handles stateful, dynamic client rendering. Drives the multi-step audit questionnaire state, dynamic local storage autosaves, dynamic benchmarking charts, and dynamic sliders. |
| **TypeScript** | Language Standard | Enforces strong compile-time type-safety. Crucial for financial math, ensuring tool calculations, pricing schemas, and Zod objects never result in NaN, undefined, or run-time crashes. |
| **Tailwind CSS (v4)** | Styling & Design System | Implements our premium, desaturated "Midnight Blueprint" theme, featuring 0.5px layout grids, radial background masks, customized brand color scales, and responsive container blocks (60% width standard desktop constraint). |
| **Framer Motion** | Animation Library | Powers subtle, elegant client-side visual transitions, staggered checklist entry animations, card hover-glows, and step slider visual transitions. |
| **Recharts** | Visual Data Engine | Renders our primary benchmarking chart (Current vs. Optimized spend comparison) using high-performance SVG bars with desaturated visual gradient fills. |
| **Prisma ORM (v6)** | Database Client | A type-safe Node.js Database Client that maps PostgreSQL schemas into clean TypeScript types, facilitating safe write/read transactions with Supabase. |
| **Supabase (PostgreSQL)** | Managed Database | Houses saved audit reports, company sizes, tool listings, captured sales leads, and unique anonymized nanoid slug indexes. |
| **Google Gemini API (`gemini-2.0-flash`)** | AI Summarization Layer | Acts strictly as an executive memo generator. We NEVER let it perform the math; it takes structured, isolated JSON calculations from our deterministic TypeScript engine and turns them into a highly concise, authoritative 3-sentence CFO board summary. |
| **Resend API** | Transactional Mail Infrastructure | Delivers generated PDF reports and CSV spreadsheet exports directly to the user's inbox on lead form submission. |
| **Zod** | Runtime Input Validation | Serves as our front-line security bouncer. Enforces strict types on incoming company data, stacks, email configurations, and stops prompt injection payloads from ever reaching the Gemini API. |
| **Vitest** | Automated Testing Core | Runs our automated vitest grounding suites, sentence count validators, edge-case financial variance ($0 and $100k+ savings) runs, and simulated empty revenue environments. |
| **Lucide React** | Visual Asset Toolkit | Provides desaturated fintech iconography (DollarSign, Shield, Zap, TrendingDown, Layers, etc.) matching our Midnight Blueprint aesthetics. |
| **Nanoid** | Cryptographic URL Generator | Generates lightweight, secure 10-character slugs (e.g. `/results/3x7f9j2k8m`) for anonymous public result sharing. |

---

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

---

## 📊 Comprehensive Documentation
* **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical pipeline and scalability plan.
* **[DEVLOG.md](./DEVLOG.md)**: 8-day development history, including the V2 upgrades sprint.
* **[RECOVERY_GUIDE.md](./RECOVERY_GUIDE.md)**: Standard operating recovery guidelines and Git rollback states.
* **[PRICING_DATA.md](./PRICING_DATA.md)**: Extended pricing database verified for all 90+ tools.
* **[REFLECTION.md](./REFLECTION.md)**: Deep dive into the hardest bugs and strategic pivots.
* **[TESTS.md](./TESTS.md)**: Breakdown of the automated audit engine tests.
* **[GTM.md](./GTM.md)**: Go-to-market and user acquisition strategy.
* **[ECONOMICS.md](./ECONOMICS.md)**: Business model and LTV projections.
* **[USER_INTERVIEWS.md](./USER_INTERVIEWS.md)**: Direct feedback from early user tests.
