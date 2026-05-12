# Metrics: What I’m actually tracking

## 🌟 The North Star: "Identified Annual Recovery" (IAR)
I don’t care about "Daily Active Users." Nobody uses an audit tool every day (unless they’re obsessed). The real number is **how much money we find**. If we can tell the world "Fluxora found $10M in waste this month," then the leads we send to Credex are gold.

## 📈 The 3 numbers that drive the North Star
1. **Audit Completion Rate:** If people drop off half-way through the form, we’re failing. I want to see at least 40% of people who start actually finish the audit.
2. **Tools per Audit:** If someone only enters "ChatGPT," we can’t find any overlap. We need them to enter at least 3 tools to get that "Aha!" moment where we find a redundancy.
3. **The Share Ratio:** How many people generate a public link? This is my "Confidence Metric." If they share it with their boss, it means the data was actually useful.

## 🛠️ How I’m measuring it (The Plan)
I’m going to use **PostHog** because it’s easy to setup.
- Track `audit_started` on the first tool add.
- Track `results_viewed` when the math finishes.
- Track `lead_captured` when they finally give their email. 
The main thing is the funnel from Landing Page -> Results. If there's a big drop at the "Tools" step, I’ll need to make the tool search even faster.

## 🚦 When to Pivot?
If I run 500 audits and the average savings is like $50/month, then this business is dead. It means people are already optimized or AI is just too cheap to care about.
**The Pivot:** If that happens, I’ll change the tool to focus on **Data Security**. Instead of "How much are you spending?", it becomes "Which of these 10 tools is leaking your company secrets?" Same intake, different "Brain."
