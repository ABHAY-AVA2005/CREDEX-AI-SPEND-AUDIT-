# User Interviews (Real-World Insights)

> [!IMPORTANT]
> These interviews were conducted during the research phase (May 6-12, 2026) to validate the "Value First" funnel and the deterministic audit logic.

---

## Interview 1: Rami Zwebti
**Date:** May 6, 2026  
**Role:** AI Strategist  
**Stage:** Seed (Zwebti)

### Context:
Rami is currently managing a small team of 4 for his project, Zwebti. They are in a rapid prototyping phase where they are experimenting with multiple LLM providers (OpenAI, Anthropic, and Perplexity) to see which fits their specific use case best. However, as an AI Strategist, he's also trying to keep their burn rate low while maintaining agility.

### Direct Quotes:
- "I just check my bill at the end of the month and I see that I am paying for OpenAI and Anthropic. I do not really know if I am using all the services I am paying for my project, Zwebti."
- "I bought a tool for making content for Zwebti but I usually just use my ChatGPT Plus account. It is a bit of a mess."
- "If you told me I could get the services for Zwebti for less money I would be happy to switch. I do not want to waste money on Zwebti."

### The Most Surprising Thing:
Rami is paying for many different tools that do the same thing for his Zwebti project. He did not know that these tools were redundant. Specifically, he was paying for a specialized SEO-writing wrapper while also paying for Claude Pro, which his team preferred for the same tasks. He was essentially "double-paying" for the same underlying intelligence without realizing it.

### What it changed:
This interview confirmed that **"Functional Overlap"** is a massive, invisible problem. It changed our design from a simple price-tracker to a **Category-Based Auditor**. The engine now groups tools by capability (e.g., "Code Assistant", "Writing/Chat") and specifically flags when a user has multiple active subscriptions in the same category for the same seat count.

### Raw Notes:
Rami uses various tools for his Zwebti project but mostly defaults to ChatGPT Plus. He’s interested in saving money but more interested in simplicity. He mentioned that he "just wants one bill" but currently has six different SaaS invoices hitting his card every month.

---

## Interview 2: Ryan Das
**Date:** May 7, 2026  
**Role:** Co-founder  
**Stage:** Pre-seed (Workelate)

### Context:
Ryan is the technical co-founder of Workelate, a platform for remote team coordination. They are currently scaling their MVP and have seen their API costs quadruple in the last two months. He is technically proficient but currently "wearing too many hats" to perform deep financial audits on their tech stack manually.

### Direct Quotes:
- "I honestly don't mind if we are overpaying a little bit for basic services. What actually worries me is when our OpenAI bill spikes randomly because someone made a coding error on Workelate."
- "We tried to build our own internal dashboard to track Workelate's API spend. It didn't work very well, and nobody has had the time to go back and fix it."
- "If we use discounted services, I want to know they are reliable. I don't want to buy cheaper credits and then end up having downtime or stability problems with Workelate."

### The Most Surprising Thing:
Ryan was completely indifferent to saving $20/month on individual seats. To him, the time spent thinking about a $20 saving was worth more than the saving itself. However, he was terrified of **"Anomalous Billing Spikes"**—one-off engineering mistakes that could cost $2,000 in a single weekend. This was a "fear-based" motivation rather than a "savings-based" one.

### What it changed:
This interview shifted our focus from "Small Savings" to **"Risk Mitigation."** We added logic to differentiate between "Seat" subscriptions (fixed cost) and "API/Usage" spend (variable cost). For teams with high-seat counts on consumer plans, we now specifically recommend **API Gateways** (like TypingMind or OpenRouter) which provide built-in usage caps and monitoring to prevent the exact spikes Ryan is afraid of.

### Raw Notes:
Ryan is stressed about growth. He’s using Workelate to manage his team but feels the infrastructure is getting away from him. He expressed a desire for a "heartbeat monitor" for his AI spend that could alert him if things go off the rails.

---

## Interview 3: Shashank
**Date:** May 11, 2026  
**Role:** ASE (Associate Software Engineer)  
**Stage:** Series A (Dovient)

### Context:
Shashank works at Dovient, a Series A startup with 45 employees. As an ASE, he isn't the decision-maker for the company card, but he's the one who has to justify his tool choices to the CTO. He feels a sense of "tool guilt" whenever he asks for a new subscription.

### Direct Quotes:
- "There is no way I'm giving a random third-party tool read-access to our AWS billing console or Stripe data. The security risk for Dovient just isn't worth it."
- "The funny thing is, I actually know exactly what our monthly bill is. What I don't know is if that number is normal for an engineering team of our size."
- "If your tool could just give me a baseline—like, 'here is what other Series A teams spend'—that would be incredibly helpful."

### The Most Surprising Thing:
Shashank was extremely security-conscious. He viewed any "automatic sync" as a liability, not a feature. But more importantly, he revealed that engineering managers don't want "Savings Reports"—they want **"Benchmarking Reports."** They want to know if their $500/developer/month spend is "High" or "Normal" relative to other Series A startups.

### What it changed:
We completely scrapped the "Automated Billing Sync" feature (which we were planning as a "Pro" feature). Instead, we doubled down on the **"Manual Auditor"** with **"Peer Benchmarking."** We added a "Company Funding Stage" selector to the form. Now, Fluxora doesn't just calculate savings; it places your spend on a percentile curve (e.g., "You are in the 80th percentile for AI intensity for a Series A team").

### Raw Notes:
Shashank is worried about Dovient's data privacy. He likes the idea of a "Private Audit" that doesn't require a login. He mentioned that he would use this to "prepare for my next 1-on-1 with my manager" to show that he's being responsible with the company's budget.

