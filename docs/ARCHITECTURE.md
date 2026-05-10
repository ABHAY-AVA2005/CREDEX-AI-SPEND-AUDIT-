# Why I Built This (Architecture)

I built Credex AI Audit to be the fastest way for a founder to see if they are wasting money. I kept the tech simple so it's reliable and easy to explain.

## How it Works
1. **The Form**: Users put in their tools. I use `localStorage` so they don't lose their data if they refresh.
2. **The Logic**: I don't use AI for the math. I use "Deterministic Rules." This means I wrote simple code that says "If tool A and tool B both do coding, recommend keeping only one." This is 100% accurate.
3. **The AI Summary**: I use the **Gemini API** only to write a friendly human summary of the results. If the API fails, it falls back to a simple template.
4. **The Database**: I use **Prisma + Postgres**. It's solid and lets me create those "Public URLs" that users can share.

## The Stack
- **Next.js 15**: Because it's the fastest framework for React right now.
- **Tailwind CSS**: For a clean, custom design without heavy templates.
- **Resend**: For sending the audit reports to the user's inbox.
- **Framer Motion**: To make the form transitions feel smooth and premium.

## If we had 10k users/day?
- I would add **Caching** (Redis) so the database doesn't get hit every time someone views a shared link.
- I would move the **AI Summary** to a background job so the results page loads even faster.
- I'd add **Read Replicas** for the database to handle heavy traffic.
