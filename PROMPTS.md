# Fluxora AI Audit Prompts

This document tracks the prompts used for AI-driven summarization within the Fluxora platform. 

> [!IMPORTANT]
> Fluxora uses deterministic math for all audit calculations. AI is strictly used for human-readable executive summaries and natural language transparency.

## Executive Audit Summary

**Purpose**: Generates a 100-word "Founder-to-Founder" summary based on deterministic audit results.
**Model**: `gemini-2.0-flash`
**Location**: `lib/gemini.ts`

### Prompt
```text
You are an expert AI SaaS financial auditor for Fluxora.
Analyze this deterministic audit data for {{companyName}}:
- Current Spend: ${{totalCurrentSpend}}/mo
- Optimized Spend: ${{totalOptimizedSpend}}/mo
- Monthly Savings: ${{monthlySavings}}/mo
- Redundancy Alerts: {{redundancyWarnings}}
- Peer Benchmark: {{percentile}}th percentile ({{status}})
- Recommendations: {{recommendations_summary}}

Write a highly transparent, 2-paragraph executive summary (100-140 words).

Paragraph 1: Be specific about the math. Mention the redundancy alerts and how they impact the {{percentile}}th percentile ranking. Explain exactly HOW the ${{monthlySavings}} in monthly savings was calculated.

Paragraph 2: Provide a clear path forward. Focus on consolidation and liquidating redundant assets via Credex.rocks.

Tone: Technical, transparent, and authoritative. Build trust by 'showing the work'.
```

## Fallback Logic
In the event of an API failure or missing API key, Fluxora falls back to a high-fidelity template:

```text
{{companyName}}'s AI stack is currently incurring ${{totalCurrentSpend}}/mo in operational expenditure. Our deterministic audit engine identifies a high-probability path to reduce this to ${{totalOptimizedSpend}}/mo, recovering approximately ${{monthlySavings}} in monthly liquidity. 

This recovery is primarily driven by resolving functional overlap across your stack and liquidating redundant enterprise licenses. To capture this recovery potential, we recommend listing unused seats on the Credex.rocks marketplace and consolidating workflows into unified environments.
```
