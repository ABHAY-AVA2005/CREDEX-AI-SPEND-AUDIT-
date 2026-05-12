# My Personal Reflection: Building Fluxora in a Week

## 1. The Hardest Bug: Fighting the Prisma/Vercel Wall
To be honest, the hardest part of this whole week wasn't actually the "AI" or the audit math. It was the **persistence layer**. I tried to be clever and use the brand new **Prisma 7.0 (Beta)** because I wanted the latest features, but that totally backfired as soon as I tried to deploy to Vercel.

Basically, Prisma 7 changed how it handles connection strings—it deprecated the old inline `url` thing in `schema.prisma`. This broke everything on Vercel's edge runtime. I kept getting these annoying "404: Audit Not Found" errors because the DB just wouldn't connect.

**How I fixed it:** I spent like four hours digging through GitHub issues at 2 AM. I realized that the Beta version just wasn't ready for Vercel's specific caching setup. I made the call to **downgrade to Prisma 6.4**. As soon as I did that, the standard pattern worked and the links actually loaded. It taught me that sometimes "stable" is way better than "latest" when you have a deadline.

## 2. The Big Pivot: Killing the Email Gate
Mid-week, I had this "brilliant" idea to put a hard **Email Gate** at the very beginning. I thought, "if they want the savings, they gotta pay with an email first." I was thinking like a marketer, not a user.

**Why I reversed it:** I showed it to a few friends, and they all said the same thing—they'd bounce immediately. AI spend is personal and slightly embarrassing if you're overspending, so asking for an email before showing *any* value felt like a scam.

**The Fix:** I moved the email capture to the very end of the results page. Now we show you the charts and the "big number" first. It turns out that once people see they can save $5,000, they are actually *happy* to give their email to get the PDF report. Value-first actually wins.

## 3. Real Insights: The Rami/Ryan/Shashank Pivot
After talking to a few real founders and devs, the tool changed a lot:

- **Redundancy (Rami):** Rami pointed out he pays for ChatGPT *and* a bunch of writing wrappers. So I built the category detector to flag those overlaps.
- **API Monitoring (Ryan):** Ryan didn't care about $20 seats, he was scared of $2,000 API "spikes" from a bad loop. So I added the Seat vs API distinction.
- **Benchmarking (Shashank):** Shashank hated the idea of "syncing" his bank account (security risk). He just wanted to know: "Is my spend normal for a Series A team?" So I added the stage-based benchmarking.

## 4. How I used AI (Antigravity & Gemini)
I used AI as a "Senior Partner" more than just a code generator. 

- **Antigravity:** Used it for like 90% of the heavy lifting. It handled the rebranding from Credex to Fluxora across 50 files in like 2 minutes, which would have taken me all day manually.
- **What I didn't trust:** I never let the AI do the final math. I wrote the deterministic engine in pure TypeScript. If I tell someone to fire a tool, I need to be 100% sure the math is right, not just "LLM-confident."
- **The AI Fail:** One time the AI tried to map colors in my Recharts graph using a simple array, but it forgot that Recharts needs specific `<Cell>` tags for vertical bars. The graph just turned invisible. I had to manually fix the JSX structure to get the colors back.

## 5. My Self-Rating (Honest Edition)
- **Discipline (10/10):** Didn't miss a single day of the 7-day sprint. Logged every hour, even when the Prisma bug was making me want to quit.
- **Code Quality (8/10):** It’s pretty clean, used Zod for everything so it won't crash on bad input, but I could probably optimize the Tailwind a bit more.
- **Design Sense (9/10):** I'm really proud of the "Midnight Blueprint" look. It feels like a tool for engineers, not a generic SaaS template.
- **Entrepreneurial Thinking (10/10):** Focused purely on the "Value-First" loop. Every feature is designed to lead the user toward the marketplace.
