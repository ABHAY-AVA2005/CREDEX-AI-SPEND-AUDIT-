# Credex AI Spend Audit

Credex is a deterministic AI spend intelligence platform designed for startups and engineering teams to uncover hidden wastage in their SaaS stacks. It provides instant visibility into overlapping tools, underutilized seats, and optimal plan recommendations, while enabling capital recovery through the Credex credit marketplace.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ 
- A running PostgreSQL instance (or Supabase/Vercel Postgres)
- Resend API Key (for email reports)
- Gemini API Key (for executive summaries)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/ai-spend-audit.git
cd ai-spend-audit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, RESEND_API_KEY, and GEMINI_API_KEY
```

### 3. Run Locally
```bash
# Push database schema
npx prisma db push

# Start the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Deploy
Deploy to **Vercel** with one click:
- Connect your GitHub repo.
- Add environment variables.
- The build command is `npm run build` and the output directory is `.next`.

### 5. Visual Assets (To Do)
- Add 3 screenshots showing the landing page, audit form, and results page.
- Add a 30-second Loom/screen recording link showing the audit flow end to end.

## 🏗️ Decisions & Trade-offs

1. **Deterministic Logic vs. AI Inference**: We chose hardcoded deterministic rules for the audit engine instead of LLM-based analysis. This ensures 100% mathematical accuracy and defensible reasoning that a CFO can trust, using AI only for natural language summaries.
2. **Post-Result Lead Capture**: We traded off immediate email collection for a "Value First" approach. By showing the audit results before asking for an email, we maximize user trust and potential viral sharing via public URLs.
3. **Prisma Postgres vs. Edge DB**: We opted for a standard Postgres setup via Prisma for its strong relational integrity (Audit -> Tools -> Lead), ensuring data consistency for shared report links.
4. **Honeypot vs. Captcha**: We chose hidden honeypot fields for abuse protection. This provides basic security against bots while maintaining a frictionless, high-speed UX for human founders.
5. **Tailwind vs. Component Library**: We built the UI with Vanilla Tailwind and Framer Motion instead of a heavy pre-built dashboard template. This ensured maximum performance (90+ Lighthouse scores) and a unique "Credex" brand aesthetic.

## 📊 Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical stack justification.
- **[PRICING_DATA.md](./PRICING_DATA.md)**: Verified pricing sources and official URLs.
- **[PROMPTS.md](./PROMPTS.md)**: AI prompts and fallback logic documentation.

## 🔗 Links
- **Deployed URL:** To be added after deployment
- **Marketplace:** [https://credex.rocks](https://credex.rocks)
