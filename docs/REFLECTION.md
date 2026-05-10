# My Reflection on Building Fluxora

## 1. The Hardest Bug
The hardest thing was getting the **Prisma 7** database to work on Vercel. My local code worked fine, but the production build kept failing. 
**How I fixed it:** I realized that Prisma 7 handles connection URLs differently. I moved the URLs into a separate `prisma.config.ts` file and added a "postinstall" script to generate the client. After that, it was smooth.

## 2. A Decision I Reversed
I originally thought about forcing users to give their email **before** seeing results.
**Why I changed it:** I talked to a few friends (potential users) and they all said they'd close the tab. I decided to show the **Value First**. Now, users get the audit for free, and they *choose* to give their email to get the PDF or more details. Conversion is actually better this way.

## 3. Engineering Decisions

### Zod vs. SQL Validation
I chose to use **Zod** as the primary validation layer instead of relying solely on SQL constraints.
**Reasoning:** Zod allows for "Fail-Fast" behavior. By validating at the API boundary (Next.js Server Actions), we prevent invalid data from ever reaching our math engine. This eliminates `NaN` errors and server-side crashes that could happen if we relied on the database as the only line of defense. It also provides automatic TypeScript type-safety across the app.

### Deterministic Rules vs. LLM Math
I decided early on to hardcode the savings logic in TypeScript rather than asking an LLM (like Gemini) to "calculate" it.
**Reasoning:** CFOs require precision. An LLM might hallucinate a pricing tier or miscalculate a 12-month projection. By using a registry of real pricing data, we guarantee financial accuracy. We use AI only for the **Executive Summary**, where it excels at synthesizing complex data into human language.

## 4. What I'd build in Week 2
- **Direct Integration**: I'd let users link their bank account (via Plaid) to automatically find AI spend.
- **Slack Bot**: A bot that pings the team when someone signs up for a duplicate tool.
- **Team Dashboard**: A view for managers to see all team members' AI subscriptions in one place.

## 5. How I used AI

I used a combination of two primary AI-integrated environments:
- **Antigravity App (90%)**: This was the primary engine for the project's development. It handled the complex agentic tasks, multi-file rebranding, and the deep synchronization of the deterministic audit engine with the front-end components. Its ability to maintain context across the entire 7-day sprint was critical.
- **VS Code (10%)**: Used for the **initial repository setup**, initializing the Git environment, and pushing the foundational files. It also served as a lightweight environment for manual UI tweaks and quick CSS adjustments.

### Gemini API Integration
I integrated **Google Gemini 1.5 Flash** as the "Intelligence Layer" of the platform.
- **The Role**: Gemini acts as a Financial Analyst. It takes the raw, deterministic JSON output from our math engine and synthesizes it into a professional, human-readable executive summary.
- **The Boundary**: I intentionally restricted Gemini to *textual synthesis* only. By never allowing the LLM to perform the financial calculations (which are handled by our TypeScript rules), we eliminated the risk of "AI hallucinations" in the final audit numbers.

## 6. Entrepreneurial Insights
If I were to pitch this to a VC today (Venture Capitalist), I would focus on the **"Secondary Credit Market"** data. By giving away the audit for free, Fluxora identifies exactly who is overpaying for OpenAI or AWS. We then offer them a 1-click liquidation path to sell those unused credits on our marketplace. This turns a "cost-reduction tool" into a "revenue-generation engine."

## 7. Self-Rating
- **Discipline (8/10)**: I logged my work every day and stayed focused.
- **Code Quality (8/10)**: The code is clean and uses TypeScript for safety.
- **Design Sense (9/10)**: Upgraded to a premium fintech aesthetic with Serif typography.
- **Problem Solving (9/10)**: Fixed the Vercel build and the 404 share logic bugs quickly.
- **Entrepreneurial Thinking (10/10)**: Focused on the "Value First" funnel and the secondary marketplace connection.
