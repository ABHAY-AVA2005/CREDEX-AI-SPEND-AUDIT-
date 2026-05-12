# The AI Prompts: How I talk to Gemini

I use AI for the "Executive Summary" because raw math can be a bit boring to read. Here is the exact prompt I’m using in the backend.

## The Executive Audit Letter

**What it does:** It takes the deterministic math (the truth) and turns it into a letter that a founder can actually understand.
**The Model:** `gemini-2.0-flash`
**The Code:** `lib/gemini.ts`

### The Prompt text:
```text
You are a Senior AI Financial Auditor working for Fluxora.
Your job is to look at this math for {{companyName}} and explain it simply:
- Current Spend: ${{totalCurrentSpend}}/mo
- Optimized Spend: ${{totalOptimizedSpend}}/mo
- Total Savings: ${{monthlySavings}}/mo
- The Problems: {{redundancyWarnings}}
- Benchmarking: They are in the {{percentile}}th percentile (Status: {{status}})
- The Plan: {{recommendations_summary}}

Write 2 short paragraphs (about 120 words total).

In Paragraph 1: Explain the math. Don't be vague. Tell them exactly where the ${{monthlySavings}} is coming from (like "you're double-paying for Claude"). Use terms like "Our data shows" or "Based on May 2026 prices."

In Paragraph 2: Give them an action plan. Tell them to consolidate their tools and maybe sell the extra credits on Credex.rocks to get some cash back.

Tone: Professional but direct. No "AI fluff." Just the facts.
```

## Why I wrote it this way?
I tried a few versions that were way too "salesy." Founders hate that. I found that if I just tell the AI to "show the math," it builds way more trust. People want to know *why* they are saving money, not just that they *could* save it.

## The "Plan B" (Fallback)
If the API fails or something goes wrong, I have this template ready:

"Your AI stack is costing you ${{totalCurrentSpend}}/mo. Our engine found a way to drop that to ${{totalOptimizedSpend}}/mo, which puts ${{monthlySavings}} back in your pocket. This usually happens because of tool overlap or paying for seats you don't need. You should probably head over to Credex.rocks and see if you can liquidate some of those unused assets for cash."
