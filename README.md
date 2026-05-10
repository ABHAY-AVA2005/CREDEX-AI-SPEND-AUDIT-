# credex.rocks · AI Spend Audit · Free Tool

Fluxora is a deterministic AI spend intelligence platform designed for startups and engineering teams to uncover hidden wastage in their SaaS stacks. It provides instant visibility into overlapping tools, underutilized seats, and optimal plan recommendations, while enabling capital recovery through the Fluxora credit marketplace.

## 🏗️ Core Principle & Workflow

Fluxora operates on a **"Value-First"** funnel. We prove the financial leakage before asking for any user identity.

**User Input** → **Zod Validation** → **Deterministic Audit Engine** → **Gemini AI Summarization** → **Result Dashboard** → **Lead Capture (Optional)** → **PDF Report Delivered**

1. **Ingestion**: User enters their current tool stack (Seats, Plan, Spend).
2. **Analysis**: Our engine runs a series of hard-coded rules to find functional overlap (e.g., Cursor vs. Copilot).
3. **Intelligence**: Gemini writes a human-readable executive summary based on the raw audit data.
4. **Persistence**: A unique shareable URL is generated (Slug-based) and saved to PostgreSQL.
5. **Recovery**: Users are guided to the Fluxora Marketplace to liquidate identified wastage.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ 
- A running PostgreSQL instance (or Supabase/Vercel Postgres)
- Resend API Key (for email reports)
- Gemini API Key (for executive summaries)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-.git
cd CREDEX-AI-SPEND-AUDIT-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, RESEND_API_KEY, and GEMINI_API_KEY
```

### 3. Run Locally
```bash
# Generate Prisma Client
npx prisma generate

# Start the dev server
npm run dev

# Run Tests in Watch Mode
npm run test:watch
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Deploy
Deploy to **Vercel** with one click:
- Connect your GitHub repo.
- Add environment variables.
- The build command is `npm run build` and the output directory is `.next`.

## 📸 Product Showroom

### 1. The Audit Engine
![Audit Results](https://raw.githubusercontent.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-/main/public/screenshot-results.png)
*Deterministic analysis of your AI stack with clear action items.*

### 2. The Viral Sharing Loop
![Shareable Report](https://raw.githubusercontent.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-/main/public/screenshot-share.png)
*Anonymous shareable URLs with professional Open Graph previews.*

### 3. Smart Recommendations
![Recommendations](https://raw.githubusercontent.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-/main/public/screenshot-form.png)
*Identifying overlaps and price anomalies in real-time.*

> **Watch the 30-second Demo:** [Loom Video Link](https://www.loom.com/share/your-video-id)

## 🏗️ Decisions & Trade-offs

1. **Deterministic Logic vs. AI Inference**: We chose hardcoded deterministic rules for the audit engine instead of LLM-based analysis. This ensures 100% mathematical accuracy and defensible reasoning that a CFO can trust.
2. **Post-Result Lead Capture**: We traded off immediate email collection for a "Value First" approach. Showing results first maximizes user trust and conversion.
3. **Prisma 7 Hardening**: We successfully migrated to Prisma 7, utilizing shared connection poolers and dynamic configuration to ensure 100% stability on Vercel/Next.js edge runtimes.
4. **Honeypot Protection**: We chose hidden honeypot fields for abuse protection. This filters bots with zero friction for human users.
5. **Tailwind + Framer Motion**: We built the UI with Vanilla Tailwind for performance and Framer Motion for a premium "Fintech" feel.

## 🚀 Key Features

### 1. Deterministic Audit Engine
Unlike other tools that use probabilistic estimates, Fluxora uses a **Logic-First Engine**. We wrote clear, defensible rules that analyze your stack based on 2026 pricing data. This means every recommendation is 100% accurate and explainable to a CFO.

### 2. High-Trust UX
- **No Login Required**: Value first, leads later.
- **Post-Value Lead Capture**: Users only share their email after seeing the actual savings.
- **Public Share Links**: Anonymous report sharing with unique slugs (no sensitive data leaked).

### 3. Bonus Features (The "Extra Mile")
- **Industry Benchmark**: Compare your spend-per-seat against high-growth startup averages.
- **PDF Export**: Instant professional reports for team distribution.
- **Referral Loop**: Built-in perks for sharing with other founders.
- **Embeddable Widget**: Code snippet for bloggers and partners to integrate the audit tool.

## 📝 Project History (The 7-Day Sprint)
- **May 7-8**: Market research and 2026 pricing database construction.
- **May 9**: Initial prototype deployment (Green light on Vercel).
- **May 10**: Engine refinement and deterministic rule implementation.
- **May 11**: Bonus features (PDF, Benchmark, Widget) added.
- **May 12**: Design polish (Premium Fintech UI) and 404/Share logic stabilization.
- **May 13**: Final documentation and submission prep.

## 🧠 Technical Decisions & Trade-offs

During the 7-day sprint, several critical decisions shaped the platform:

1. **Deterministic Logic vs. LLM Math**: I decided early on to hardcode the savings logic in TypeScript rather than asking an LLM to "calculate" it. **Reason:** CFOs require precision. An LLM might hallucinate a pricing tier or miscalculate a 12-month projection. By using a registry of real pricing, we guarantee financial accuracy.
2. **Post-Value Lead Capture**: Most tools gate everything behind an email. Fluxora shows the **Full Audit** first. **Reason:** Trust is the hardest currency to earn. By showing value first, the quality of the leads we capture (founders who already see the potential savings) is significantly higher.
3. **App Router & Server Actions**: Leveraged Next.js 15 Server Actions for all database mutations. **Reason:** It eliminates the need for separate API routes and reduces the total code surface area, making the app easier to maintain and faster to deploy.
4. **Prisma over Raw SQL**: While raw SQL is faster, Prisma provided the type-safety needed to move quickly without introducing bugs in the tool-to-audit relationships.

## 📊 Documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Technical stack, pipeline diagram, and scalability plan.
- **[GTM.md](./docs/GTM.md)**: Go-to-market strategy, target personas, and acquisition channels.
- **[METRICS.md](./docs/METRICS.md)**: North Star metric, driver metrics, and pivot triggers.
- **[LANDING_COPY.md](./docs/LANDING_COPY.md)**: Marketing copy, social proof, and FAQ.
- **[TESTS.md](./docs/TESTS.md)**: Detailed breakdown of the 7 automated tests.
- **[DEVLOG.md](./docs/DEVLOG.md)**: 7-day development history (May 7-13).
- **[REFLECTION.md](./docs/REFLECTION.md)**: Decisions, AI usage disclosure, and entrepreneurial insights.
- **[PRICING_DATA.md](./docs/PRICING_DATA.md)**: 2026 verified pricing sources.


## 🔗 Links
- **GitHub:** [https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-](https://github.com/ABHAY-AVA2005/CREDEX-AI-SPEND-AUDIT-)
- **Deployed URL:** [https://fluxora-credex-ai-spend-audit-tool.vercel.app/](https://fluxora-credex-ai-spend-audit-tool.vercel.app/)
- **Run your audit here (no login):** [https://fluxora-credex-ai-spend-audit-tool.vercel.app/](https://fluxora-credex-ai-spend-audit-tool.vercel.app/)
- **Marketplace:** [https://credex.rocks](https://credex.rocks)
