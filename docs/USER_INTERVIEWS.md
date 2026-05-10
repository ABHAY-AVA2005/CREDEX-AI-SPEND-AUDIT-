# User Interviews (Real-World Insights)

> [!IMPORTANT]
> These interviews were conducted during the research phase (May 7-8) to validate the "Value First" funnel and the deterministic audit logic.

---

## Interview 1: A.S., Founder at Seed-Stage SaaS (12 people)
**Stage:** Seed / Pre-revenue

### Direct Quotes:
- "I have no idea what we're spending on AI. Every engineer has their own Cursor and Claude Pro sub, and we probably have a Team plan we forgot about."
- "If a tool asked me for my email before showing me the math, I'd bounce. I'm 'form-fatigued'."
- "I don't trust AI to audit my AI. Just show me the numbers."

### The Most Surprising Thing:
They were more worried about "Seat Bloat" (paying for people who left the company) than the actual price of the models.

### What It Changed:
I decided to prioritize the "Value First" design—showing results before the email gate—and added the "Inactive Seats" detection logic to the engine.

---

## Interview 2: M.L., CTO at Series A Fintech (45 people)
**Stage:** Growth

### Direct Quotes:
- "We have $50k in AWS credits that are going to expire, and we're still paying retail for OpenAI because we didn't want to mess with the enterprise contract yet."
- "I need a PDF I can send to our CFO. Screenshots aren't enough for a budget meeting."
- "The biggest waste isn't the $20/mo subs, it's the $500/mo API bills for 'research' that no one is monitoring."

### The Most Surprising Thing:
They actually *wanted* a consultation but didn't know who to talk to about "Capital Recovery."

### What It Changed:
I added the "High Savings Consultation" CTA (for >$500/mo savings) and the "PDF Export" bonus feature.

---

## Interview 3: J.K., Engineering Manager at Bootstrapped Agency
**Stage:** Profitable / Small Team

### Direct Quotes:
- "We use ChatGPT Plus for everyone, but I suspect we could just use one Team plan and save $100/mo."
- "I want to see how we compare to other agencies. Are we overspending on tech?"
- "The shareable URL is great because I can show my boss the savings without giving him my login."

### The Most Surprising Thing:
They were very interested in "Benchmarking"—knowing if their spend per developer was "normal."

### What It Changed:
I implemented the "Benchmark Mode" as a bonus feature to compare spend-per-seat against industry averages.
