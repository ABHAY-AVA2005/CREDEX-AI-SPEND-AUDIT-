# My Reflection on Building Credex

## 1. The Hardest Bug
The hardest thing was getting the **Prisma 7** database to work on Vercel. My local code worked fine, but the production build kept failing. 
**How I fixed it:** I realized that Prisma 7 handles connection URLs differently. I moved the URLs into a separate `prisma.config.ts` file and added a "postinstall" script to generate the client. After that, it was smooth.

## 2. A Decision I Reversed
I originally thought about forcing users to give their email **before** seeing results.
**Why I changed it:** I talked to a few friends (potential users) and they all said they'd close the tab. I decided to show the **Value First**. Now, users get the audit for free, and they *choose* to give their email to get the PDF or more details. Conversion is actually better this way.

## 3. What I'd build in Week 2
- **Direct Integration**: I'd let users link their bank account (via Plaid) to automatically find AI spend.
- **Slack Bot**: A bot that pings the team when someone signs up for a duplicate tool.
- **Team Dashboard**: A view for managers to see all team members' AI subscriptions in one place.

## 4. How I used AI
I used **Antigravity** (for complex agentic tasks) and **Windsurf** (for context-aware coding) within **VS Code** as my primary tools.
- **Where they excelled**: Antigravity was exceptional at managing the 7-day sprint lifecycle—handling multi-file refactors like the form unification and documentation sync. Windsurf helped with rapid UI iteration on the Tailwind components.
- **Where I took the wheel**: I manually designed the deterministic audit logic and the specific "Finance Reasoning" behind the tool replacements. The agents often suggested generic "efficiency" tips; I overrode these with hard-math rules (e.g., "Consolidate GitHub vs Cursor" which requires specific IDE knowledge).
- **Critical Oversight**: An early agent suggestion tried to use `Math.random()` for the public slugs; I manually switched to `nanoid` to ensure URL safety and professionality.

## 5. Entrepreneurial Insights
If I were to pitch this to a VC today (Venture Capitalist — a professional investor who funds high-growth startups), I would focus on the **"Secondary Credit Market"** data. By giving away the audit for free, Credex identifies exactly who is overpaying for OpenAI or AWS. We then offer them a 1-click liquidation path to sell those unused credits on our marketplace. This turns a "cost-reduction tool" into a "revenue-generation engine."

## 6. Self-Rating
- **Discipline (8/10)**: I logged my work every day and stayed focused.
- **Code Quality (8/10)**: The code is clean and uses TypeScript for safety.
- **Design Sense (9/10)**: Upgraded to a premium fintech aesthetic with Serif typography.
- **Problem Solving (9/10)**: Fixed the Vercel build and the 404 share logic bugs quickly.
- **Entrepreneurial Thinking (10/10)**: Focused on the "Value First" funnel and the secondary marketplace connection.
