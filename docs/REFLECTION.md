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
I used **Cursor** and **Claude** to help write the boilerplate code and CSS. 
**When AI was wrong:** Claude once suggested a really complex "Machine Learning" way to recommend tools. I caught it and said "No, math is better than ML for audits." I stuck to my simple, defensible rules because a CFO needs to see logic, not a black box.

## 5. Self-Rating
- **Discipline (8/10)**: I logged my work every day and stayed focused.
- **Code Quality (8/10)**: The code is clean and uses TypeScript for safety.
- **Design Sense (8/10)**: It looks like a premium fintech tool, not a side project.
- **Problem Solving (9/10)**: I fixed the Vercel build and the multi-tool save bugs quickly.
- **Entrepreneurial Thinking (9/10)**: I focused on the "Consultation" and "Referral" hooks to make it a real business.
