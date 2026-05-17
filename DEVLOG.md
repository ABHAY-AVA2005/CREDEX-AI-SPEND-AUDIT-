# Dev Log: My 7-Day Sprint building Fluxora

## Day 1 — 2026-05-06
**Hours worked:** 4
**What I did:**
- Spent the morning looking at tools like Ramp and Cledara. Most are too "general," nothing really focuses on just the AI mess founders are in.
- Drafted the GTM and decided on the "Value First" idea.
- Wrote down the first 5 "Audit Rules" for the math engine.
**What I learned:**
- AI pricing changes basically every week. I need a central place to store this so I don't have to hunt for it every time I update the code.
**Blockers / what I'm stuck on:**
- Trying to figure out how to make the "Marketplace" feel like a real benefit, not just an ad.
**Plan for tomorrow:**
- Wireframes. Keep it simple.

## Day 2 — 2026-05-07
**Hours worked:** 5
**What I did:**
- Sketched out the 3-step form on a notebook.
- Picked the tech: Next.js 15 (want to try the new Server Actions) and Prisma.
- Did some "back of the napkin" math for the Economics doc. 
**What I learned:**
- A long form is a conversion killer. I need to make it feel fast, like a "60-second audit."
**Blockers / what I'm stuck on:**
- Thinking about which AI to use for the summary. Gemini seems the easiest to get running fast.
**Plan for tomorrow:**
- Start coding the repo.

## Day 3 — 2026-05-08
**Hours worked:** 8
**What I did:**
- Set up the GitHub and did the first few commits.
- Wrote the Prisma schema.
- Built the "Deterministic Engine." It's just pure TypeScript math because I don't trust an LLM with someone's budget.
- Got the Gemini API working for the summary.
**What I learned:**
- Server Actions are actually really cool. No more `pages/api` boilerplate everywhere.
**Blockers / what I'm stuck on:**
- Prisma 7 (Beta) is giving me some weird errors on Vercel. Might have to rethink the version.
**Plan for tomorrow:**
- Build the actual form.

## Day 4 — 2026-05-09
**Hours worked:** 10
**What I did:**
- Huge day. Built the whole 3-step form into a single-page flow.
- Pinned a "Back to Home" button because I kept getting lost in the sub-pages.
- Fixed a ton of Vercel build errors. Mostly TypeScript being annoying about types.
- Wrote the Social Proof and FAQ sections.
**What I learned:**
- Friction is the enemy. Every click you remove increases the chance of someone actually finishing the audit.
**Blockers / what I'm stuck on:**
- Had a missing `</div>` that broke the whole layout for like an hour. CSS is hard.
**Plan for tomorrow:**
- Finalize the GTM and check the pricing data again.

## Day 5 — 2026-05-10
**Hours worked:** 7
**What I did:**
- Renamed the whole thing from 'Credex' to **Fluxora**. Had to find-and-replace across like 50 files.
- Wrote the `ARCHITECTURE.md` using the "Bouncer" analogy for Zod.
- Added some basic Vitest tests for the math engine.
**What I learned:**
- Rebranding is a pain, but 'Fluxora' sounds way cooler and more like a real fintech tool.
**Blockers / what I'm stuck on:**
- Some database migration issues on my local machine.
**Plan for tomorrow:**
- Referral system.

## Day 6 — 2026-05-11
**Hours worked:** 6
**What I did:**
- Added the "Benchmark" mode. This compares your spend to other startups.
- Built a simple Referral system so people can share their links.
- Made a little "Widget" code snippet so people can embed the form on their own sites.
**What I learned:**
- Founders love to know how they compare to their peers. "Benchmarking" is actually a better hook than "Savings."
**Blockers / what I'm stuck on:**
- Tracking referrals without using cookies is tricky for privacy.
**Plan for tomorrow:**
- Polish the UI and submit.

## Day 7 — 2026-05-12
**Hours worked:** 8
**What I did:**
- **Midnight UI Overhaul**: Changed the whole theme to a high-contrast dark "Blueprint" look. Looks 10x more professional now.
- **Hardening**: Finalized the rules for enterprise license optimization.
- **Resend**: Hooked up the email templates for the leads.
- **Showroom**: Took a bunch of screenshots and finished the README.
**What I learned:**
- A dark theme with thin lines and grids makes everything feel "expensive" and authoritative.
**Blockers / what I'm stuck on:**
- Trying to get the Mermaid diagram to look right in GitHub.
**Plan for tomorrow:**
- (Submitting) Monitor the live URL for any edge-case errors.

## Day 8 — 2026-05-17 (Fluxora v2 Architecture Release)
**Hours worked:** 6
**What I did:**
- **Revenue Context Integration:** Extended Zod schemas additively to intake ARR/MRR data and funding stages (Pre-Seed through Late Stage). Developed the CFO-grade burn efficiency calculator.
- **Client-Side Live Ranking Tuner:** Created the dynamic draggable sliders interface (`components/audit/WeightsTuner.tsx`) allowing live re-ordering of recommendation cards on the client side with 0 latency.
- **Extended Niche Tool Knowledge:** Expanded the deterministic registry from base editors to 90+ niche AI tools including Sora, Midjourney, Groq, Synthesia, and Devin, with fuzzy string verification to catch typos.
- **Global Pricing Database Update:** Overwrote `PRICING_DATA.md` with fully verified URLs and plans for all 90+ tools.
- **Cleaned Database Persistence:** Synchronized prisma schema with Supabase using safe push mechanisms, dropping legacy tables (`Integration` and `UsageMetric`) to enforce clean, manual-deterministic financial math.
- **Rigorous QA & Refactoring:** Eliminated explicit `any` and subtype covariance errors during Next.js Turbopack compilation. Achieved **0 ESLint warnings** and **0 compilation errors** in the entire workspace.
**What I learned:**
- Exposing client-side weight presets dramatically improves user engagement by letting founders see immediately "what if" we optimize for velocity vs. runway.
- Strict type-safety verification via production bundle audits is the only way to avoid runtime errors on Serverless edge deployment.
**Blockers / what I'm stuck on:**
- Spent time debugging strict ESLint rule checks regarding type destructuring and empty variables, but successfully worked around it by explicitly building cleanly typed objects.
**Plan for tomorrow:**
- Monitor deployed analytical funnels and gather feedback from CFOs using the live sliders tuner.

## Day 8 (Part 2) — 2026-05-17 (Fluxora v2 Elite Polishing & Hardening)
**Hours worked:** 4
**What I did:**
- **Founder Social Proof:** Expanded the testimonial proofs grid to 3 balanced columns on desktop. Integrated a verified LinkedIn DM review from Rami Zwebti (founder: Zwebti, former Microsoft AI Strategist).
- **Weights Tuner Redesign:** Constrained the recommendation tuner and details cards to exactly **60% width (`lg:w-3/5`)** and centered it on desktop screens to align with premium Next.js fintech layouts.
- **±5 Employee Benchmark Cohorts:** Upgraded the real-time benchmarking block to dynamic peer startup listings (ScaleFlow, CognitiveLabs, etc.) with verified cohorts restricted within a tight $\pm 5$ employee difference.
- **Frictionless Optional Revenue:** Hardened `schemas/audit-v2.ts` to cleanly preprocess empty inputs into `undefined` and added auto-scaling transforms that auto-calculate ARR = MRR * 12 (and vice versa) if only one is filled.
- **Trackpad Swipe Protection:** Developed a passive event interceptor (`components/ScrollFix.tsx`) that blurs active focused number inputs when page scrolling begins to prevent accidental value alterations.
- **Clean Inbound Contact Form:** Rebuilt the consultation page with custom Name, Email, and dynamic visual radio cards for specific contact reasons (*General*, *Link Insertion*, *Want to Buy the Site*).
- **Living Ambient Grid Canvas:** Deployed z-index safe, radial-masked structural grids, top-pulsing layout lines, and 3 giant slow-drifting Framer Motion background neon wash blobs boosted to high contrast for deep dark-mode visual wow-factor.
- **Full Marketplace De-integration:** Completely removed all external links, redirects, and references pointing to `credex.rocks` or secondary resale markets. Refactored the core engine, generated AI emails, and Gemini prompts to focus entirely on self-contained license right-sizing and annual commitment plans.
- **Type Safety and Compilation:** Achieved 100% type safety and zero typescript compilation errors.
**What I learned:**
- Placing negative z-index elements on parent components with solid backgrounds clips them completely in standard webkit engines; setting them to `z-0` with `relative z-10` on foreground content solves it bulletproofly.
- Self-contained, value-first strategic advisory (Right-Sizing & Commitment Optimization) builds far higher trust with institutional CFOs than secondary credit liquidation links.

