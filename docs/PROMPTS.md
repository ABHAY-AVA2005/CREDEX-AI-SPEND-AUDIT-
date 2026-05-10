# AI Prompts Documentation

The following prompts are used in the Fluxora AI Spend Audit platform to generate personalized executive summaries.

## Executive Summary Generation
**Tool:** Google Gemini 1.5 Flash (or Anthropic Claude 3.5 Sonnet)
**File:** `lib/gemini.ts`

### System Prompt
```text
You are an expert financial auditor specializing in AI and SaaS infrastructure spend for startups. 
Your goal is to provide a concise, professional, and actionable executive summary of an AI spend audit.
```

### User Prompt
```text
Company Name: {{companyName}}
Audit Findings:
- Total Current Spend: ${{totalCurrentSpend}}/mo
- Total Optimized Spend: ${{totalOptimizedSpend}}/mo
- Monthly Savings: ${{monthlySavings}}
- Annual Savings: ${{annualSavings}}

Recommendations:
{{recommendationsList}}

Write a 100-word executive summary for the CEO. 
Focus on the immediate ROI of consolidating tools. 
Mention that Credex.rocks can help them recover even more capital by reselling unused credits for tools like ChatGPT, Claude, or AWS.
Keep the tone professional, authoritative, and helpful.
```

## Fallback Logic
If the AI API fails, the system falls back to a deterministic template located in `lib/gemini.ts`:
```text
Dear {{companyName}} Executive, Our AI SaaS financial audit highlights a significant opportunity for immediate cost optimization...
```

## Prompt Engineering Notes
- Started with a generic finance-audit prompt and refined it to be more executive-focused after early user feedback.
- Tested both Gemini and Claude prompts; Gemini produced more concise summaries while Claude generated slightly longer prose.
- Avoided overly broad phrasing like "optimize your stack" because it led to vague output; instead, the final prompt uses concrete values and a strict 100-word limit.
- Verified prompt output manually to ensure the summary mentions the audit savings and the Credex.rocks resale marketplace.
- Kept the fallback template simple so the product remains usable if the AI API is unavailable.
