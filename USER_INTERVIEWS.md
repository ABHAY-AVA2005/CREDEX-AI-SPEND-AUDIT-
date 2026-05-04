# User Interviews (Real-World Insights)

> [!IMPORTANT]
> **To the Candidate:** The following notes are structured based on real-world friction observed in early-stage startups. However, per the assignment constraints, you **MUST** replace these with notes from three real 10-15 minute conversations you personally have this week. Fabricated interviews are an instant reject.

## Interview 1: J.K., CTO of a Series A FinTech Startup (25 people)
**Stage:** Scaling team, focused on efficiency.

### Direct Quotes:
- *"I have no idea who is using Cursor versus just the Copilot extension. We're paying for both for about half the team."*
- *"The finance team flags anything over $500, but 12 different $20 subscriptions fly under the radar every month."*
- *"If you can tell me exactly which engineer hasn't logged into their ChatGPT Team account in 30 days, I'd cancel it tomorrow."*

### The Most Surprising Thing:
They aren't actually looking for "cheaper tools." They are looking for **permission to consolidate**. The CTO felt guilty "taking away" a tool from a dev, but when shown the total overlap cost, the guilt turned into a "financial necessity" argument.

### Design Change:
Added the **"Consolidate" action** to the audit engine. It’s not just about "Replace" (switching tools), but about "Removing the duplicate" while keeping the primary tool.

---

## Interview 2: Sarah L., Founder of a Seed AI SaaS (8 people)
**Stage:** Early product-market fit, high API spend.

### Direct Quotes:
- *"We got $100k in AWS credits, but we're paying out of pocket for OpenAI and Anthropic. It feels like I'm wasting real cash while sitting on fake gold."*
- *"I'd love to 'sell' my extra AWS credits to someone who actually needs them, but I thought that was illegal or impossible."*
- *"Our 'mixed' use case is the problem. Some guys use Gemini for the window, others use Claude for the logic. We're paying for 3 'Pro' plans per person."*

### The Most Surprising Thing:
She was more excited about the **Secondary Marketplace (Credex.rocks)** link than the audit results themselves. The audit was just the "proof" she needed to feel okay about listing her unused credits.

### Design Change:
Moved the **"Marketplace" CTA** to be a persistent card on the dashboard rather than just a footer link. It’s a core part of the "Capital Recovery" story.

---

## Interview 3: Mike T., Eng Manager at a Growth Stage Agency (45 people)
**Stage:** Project-based, fluctuating team size.

### Direct Quotes:
- *"We ramp up contractors for 3 months and then forget to de-provision their seats. It’s a $1,000/mo leak that I only catch once a quarter."*
- *"The biggest waste isn't the price; it's the 'Retail' price. We're paying full price for everything."*
- *"I don't want another dashboard. I want a report I can Slack to the CEO to show I'm saving money."*

### The Most Surprising Thing:
He didn't care about "AI Summaries" for himself—he wanted them for **his boss**. He needed "Executive-ready" language to justify a change in the team's workflow.

### Design Change:
Implemented the **"Executive Summary"** card prominently at the top left of the dashboard, styled as a "Report for the CEO" with professional, authoritative language.
