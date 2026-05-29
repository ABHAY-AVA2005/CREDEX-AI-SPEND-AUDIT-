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

  const prompt = result.monthlySavings <= 0
    ? `
    System Prompt:
    You are an elite B2B SaaS CFO and financial auditor. Your writing is highly authoritative, analytical, and direct.
    Your task is to write an executive summary based ONLY on the verified JSON data below.
    
    STRICT CONSTRAINTS:
    1. Write EXACTLY THREE (3) sentences. No more, no less.
    2. Actively avoid run-on sentences. Keep each sentence punchy and high-impact.
    3. Do NOT invent, extrapolate, round, or alter any numbers. Use the verified values verbatim.
    4. Focus entirely on capital efficiency, operational ROI, and benchmark excellence.
    
    Verified Financial JSON Ingestion:
    {
      "companyName": "${companyName}",
      "totalCurrentSpend": ${result.totalCurrentSpend},
      "totalOptimizedSpend": ${result.totalOptimizedSpend},
      "monthlySavings": ${result.monthlySavings},
      "annualSavings": ${result.annualSavings},
      "aiSpendAsMrrPercent": ${revenueEnrichment ? revenueEnrichment.aiSpendAsMrrPercent : null},
      "burnEfficiencyScore": ${revenueEnrichment ? revenueEnrichment.burnEfficiencyScore : null},
      "percentileRank": ${result.benchmarkComparison?.percentile ?? null},
      "benchmarkStatus": "${result.benchmarkComparison?.status ?? "EXCELLENT"}",
      "redundancies": ${JSON.stringify(result.redundancyWarnings)},
      "recommendedActions": ${JSON.stringify(result.recommendations.map(r => `${r.action} ${r.originalTool}`))}
    }

    Instruction for sentences:
    Sentence 1: Commend the company's exceptional AI spend discipline, confirming that their monthly AI expenditure is fully optimized at $${result.totalCurrentSpend}/mo with $0/mo in wasteful redundancy.
    Sentence 2: Highlight their highly efficient benchmark ranking in the ${result.benchmarkComparison?.percentile ?? "top"}th percentile (${result.benchmarkComparison?.status ?? "EXCELLENT"})${revenueEnrichment ? `, indicating stellar burn efficiency (score: ${revenueEnrichment.burnEfficiencyScore}) with AI spend accounting for just ${revenueEnrichment.aiSpendAsMrrPercent}% of MRR` : ""}.
    Sentence 3: Issue a CFO directive to maintain this lean allocation model and establish regular usage checks to sustain this high operational baseline as operations scale.
  `
  : `
    System Prompt:
    You are an elite B2B SaaS CFO and financial auditor. Your writing is highly authoritative, analytical, and direct.
    Your task is to write an executive summary based ONLY on the verified JSON data below.
    
    STRICT CONSTRAINTS:
    1. Write EXACTLY THREE (3) sentences. No more, no less.
    2. Actively avoid run-on sentences. Keep each sentence punchy and high-impact.
    3. Do NOT invent, extrapolate, round, or alter any numbers. Use the verified values verbatim.
    4. Focus entirely on capital efficiency, operational ROI, and runway recovery.
    
    Verified Financial JSON Ingestion:
    {
      "companyName": "${companyName}",
      "totalCurrentSpend": ${result.totalCurrentSpend},
      "totalOptimizedSpend": ${result.totalOptimizedSpend},
      "monthlySavings": ${result.monthlySavings},
      "annualSavings": ${result.annualSavings},
      "savingsAsMrrPercent": ${revenueEnrichment ? revenueEnrichment.savingsAsMrrPercent : null},
      "annualSavingsAsArrPercent": ${revenueEnrichment ? revenueEnrichment.annualSavingsAsArrPercent : null},
      "burnEfficiencyScore": ${revenueEnrichment ? revenueEnrichment.burnEfficiencyScore : null},
      "percentileRank": ${result.benchmarkComparison?.percentile ?? null},
      "benchmarkStatus": "${result.benchmarkComparison?.status ?? "GOOD"}",
      "redundancies": ${JSON.stringify(result.redundancyWarnings)},
      "recommendedActions": ${JSON.stringify(result.recommendations.map(r => `${r.action} ${r.originalTool}`))}
    }

    Instruction for sentences:
    Sentence 1: State the current monthly waste of $${result.totalCurrentSpend}/mo and the path to $${result.totalOptimizedSpend}/mo, referencing the exact monthly recovery of $${result.monthlySavings}/mo ($${result.annualSavings}/yr)${revenueEnrichment ? ` representing ${revenueEnrichment.savingsAsMrrPercent}% of MRR` : ""}.
    Sentence 2: Critique the burn efficiency${revenueEnrichment ? ` (your score is ${revenueEnrichment.burnEfficiencyScore} vs the stage median, representing ${revenueEnrichment.annualSavingsAsArrPercent}% ARR recovery)` : ` (ranking in the ${result.benchmarkComparison?.percentile}th percentile)`} caused by redundancies in: ${result.recommendations.slice(0, 3).map(r => r.originalTool).join(", ")}.
    Sentence 3: Issue a direct, B2B CFO directive to capture these savings by right-sizing enterprise seat allotments and consolidating workflows immediately.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        // Enforce tight token limit to prevent long responses violating the constraint
        maxOutputTokens: 150,
        temperature: 0.1,
      }
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
  if (result.monthlySavings <= 0) {
    const revLine = rev
      ? `, representing a highly efficient ${rev.aiSpendAsMrrPercent}% of MRR`
      : "";
    return (
      `Our deterministic engine has audited ${companyName}'s SaaS stack and confirmed that your AI spend is fully optimized at $${result.totalCurrentSpend.toLocaleString()}/mo, leaving $0/mo in wasteful redundancy${revLine}. ` +
      `No overlapping seat licenses or duplicate subscriptions were identified. ` +
      `We recommend maintaining your current lean software allocation to preserve this excellent operational efficiency.`
    );
  }

  const revLine = rev
    ? `, reclaiming ${rev.savingsAsMrrPercent}% of MRR and ${rev.annualSavingsAsArrPercent}% of ARR`
    : "";

  return (
    `Our deterministic engine has audited ${companyName}'s SaaS stack and identified a path to reduce AI spend from $${result.totalCurrentSpend.toLocaleString()}/mo to $${result.totalOptimizedSpend.toLocaleString()}/mo. ` +
    `This optimization recovers $${result.monthlySavings.toLocaleString()}/mo ($${result.annualSavings.toLocaleString()}/yr)${revLine}. ` +
    `We recommend consolidating redundant seat licenses and optimizing active enterprise contracts to capture this bottom-line recovery immediately.`
  );
}
