# Dev Log: My 7-Day Sprint building Fluxora

## Day 1 — 2026-05-06
**Hours worked:** 4
**What I did:**
- Spent the morning looking at tools like Ramp and Cledara. Most are too "general," nothing really focuses on just the AI mess founders are in.
- Drafted the GTM and decided on the "Value First" idea.
- Wrote down the first 5 "Audit Rules" for the math engine.
**What I learned:**
- AI pricing changes basically every week. I need a central place to store this so I don't have to hunt for it every time I update the code.
**Blockers:**
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
**Blockers:**
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
**Blockers:**
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
- "Friction" is the enemy. Every click you remove increases the chance of someone actually finishing the audit.
**Blockers:**
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
**Blockers:**
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
**Blockers:**
- Tracking referrals without using cookies is tricky for privacy.
**Plan for tomorrow:**
- Polish the UI and submit.

## Day 7 — 2026-05-12
**Hours worked:** 8
**What I did:**
- **Midnight UI Overhaul**: Changed the whole theme to a high-contrast dark "Blueprint" look. Looks 10x more professional now.
- **Hardening**: Finalized the rules for the marketplace liquidation.
- **Resend**: Hooked up the email templates for the leads.
- **Showroom**: Took a bunch of screenshots and finished the README.
**What I learned:**
- A dark theme with thin lines and grids makes everything feel "expensive" and authoritative.
**Blockers:**
- Trying to get the Mermaid diagram to look right in GitHub.
**Status:** I'm done. 7 days, zero sleep, but it's live.
