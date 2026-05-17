/**
 * lib/gemini-v2.ts
 * Revenue-aware executive summary generator.
 *
 * Drop-in replacement for gemini.ts.
 * When revenue data is present, Gemini references ROI and MRR impact.
 * When absent, it falls back to the same format as v1.
 *
 * We still NEVER let Gemini do the math — we pass proven numbers
 * from our deterministic engine and ask it to explain them.
 */

import { GoogleGenAI } from "@google/genai";
import { AuditResult } from "@/schemas/audit";
import { AuditResultV2 } from "@/schemas/audit-v2";

const ai = new GoogleGenAI({});

export async function generateAuditSummaryV2(
  companyName: string,
  result: AuditResult,
  revenueEnrichment?: AuditResultV2["revenueEnrichment"]
): Promise<string> {
  const fallback = buildFallback(companyName, result, revenueEnrichment);

  if (!process.env.GEMINI_API_KEY) {
    console.warn("[Gemini V2] No API key — using fallback summary.");
    return fallback;
  }

  const revenueSection = revenueEnrichment
    ? `
    Revenue Context (VERIFIED — use these numbers exactly):
    - AI spend as % of MRR: ${revenueEnrichment.aiSpendAsMrrPercent}%
    - After optimisation: ${revenueEnrichment.optimisedSpendAsMrrPercent}% of MRR
    - Monthly savings as % of MRR: ${revenueEnrichment.savingsAsMrrPercent}%
    - Annual savings as % of ARR: ${revenueEnrichment.annualSavingsAsArrPercent}%
    - Burn efficiency score vs industry median: ${revenueEnrichment.burnEfficiencyScore} (1.0 = median; >1.0 = overspending)
    `
    : "No revenue context provided.";

  const prompt = `
    You are an expert AI SaaS financial auditor for Fluxora. Write in a direct, founder-to-founder tone.
    RULE: Use the numbers below verbatim. Do NOT invent, round, or approximate any figure.
    
    Company: ${companyName}
    
    Spend Data (VERIFIED):
    - Current AI spend: $${result.totalCurrentSpend}/mo
    - Optimised spend: $${result.totalOptimizedSpend}/mo
    - Monthly savings: $${result.monthlySavings}/mo
    - Annual savings: $${result.annualSavings}/yr
    
    ${revenueSection}
    
    Redundancy alerts: ${result.redundancyWarnings.join("; ") || "None"}
    Peer benchmark: ${result.benchmarkComparison?.percentile}th percentile (${result.benchmarkComparison?.status})
    Key actions: ${result.recommendations.map((r) => `${r.action} ${r.originalTool}`).join(", ")}
    
    Write 2 tight paragraphs (100–150 words total):
    Paragraph 1: Summarise the waste precisely. Reference exact dollar amounts and ${revenueEnrichment ? "MRR/ARR percentages" : "peer benchmark"}.
    Paragraph 2: Concrete next steps — consolidation, direct contract renegotiation, and vendor cost optimization.
    
    Tone: Technical, transparent, no fluff. Start sentences with "Our data shows…" or "The engine identified…".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text || fallback;
  } catch (err) {
    console.error("[Gemini V2] API error:", err);
    return fallback;
  }
}

function buildFallback(
  companyName: string,
  result: AuditResult,
  rev?: AuditResultV2["revenueEnrichment"]
): string {
  const revLine = rev
    ? ` This equates to ${rev.savingsAsMrrPercent}% of MRR and ${rev.annualSavingsAsArrPercent}% of ARR on an annualised basis.`
    : "";

  return (
    `${companyName}'s AI stack currently costs $${result.totalCurrentSpend.toLocaleString()}/mo. ` +
    `Our deterministic engine has identified a path to $${result.totalOptimizedSpend.toLocaleString()}/mo, ` +
    `recovering $${result.monthlySavings.toLocaleString()}/mo ($${result.annualSavings.toLocaleString()}/yr).${revLine}\n\n` +
    `The primary driver is functional overlap across the tool stack. ` +
    `We recommend consolidating redundant licences and renegotiating custom contract volume discounts ` +
    `to capture immediate savings.`
  );
}
