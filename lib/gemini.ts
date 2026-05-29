import { GoogleGenAI } from "@google/genai";
import { AuditResult } from "@/schemas/audit";

/**
 * gemini.ts
 * Using the Gemini API to turn raw JSON data into a "Founder-to-Founder" 
 * executive summary. 
 * 
 * NOTE: We never let the AI do the math. It only generates the 
 * human-readable summary based on the results from our deterministic engine.
 */

// Simple SDK init. 
const ai = new GoogleGenAI({});

export async function generateAuditSummary(
  companyName: string, 
  result: AuditResult
): Promise<string> {
  
  // High-quality fallback for when the API is down or the key is missing.
  // Never show the user a blank summary.
  const fallbackSummary = result.monthlySavings <= 0
    ? `${companyName}'s AI stack is currently operating at peak operational and financial efficiency, incurring $${result.totalCurrentSpend.toLocaleString()}/mo in SaaS expenditure. Our deterministic audit engine has evaluated your active subscriptions and identified zero functional redundancies or license seat waste ($0/mo in potential savings). We commend your team for maintaining a highly disciplined software allocation and recommend periodic utilization reviews as your organization scales.`
    : `${companyName}'s AI stack is currently incurring $${result.totalCurrentSpend.toLocaleString()}/mo in operational expenditure. Our deterministic audit engine identifies a high-probability path to reduce this to $${result.totalOptimizedSpend.toLocaleString()}/mo, recovering approximately $${result.monthlySavings.toLocaleString()} in monthly liquidity. \n\nThis recovery is primarily driven by resolving functional overlap across your stack and right-sizing enterprise license tiers. To capture this recovery potential, we recommend consolidating overlapping workflows into unified developer environments and right-sizing active user counts.`;

  if (!process.env.GEMINI_API_KEY) {
    console.warn("Soft-fail: GEMINI_API_KEY missing. Using fallback summary.");
    return fallbackSummary;
  }

  try {
    const prompt = result.monthlySavings <= 0
      ? `
      You are an expert AI SaaS financial auditor for Fluxora.
      Analyze this deterministic audit data for ${companyName}:
      - Current Spend: $${result.totalCurrentSpend}/mo
      - Optimized Spend: $${result.totalOptimizedSpend}/mo
      - Monthly Savings: $${result.monthlySavings}/mo (Zero savings)
      - Redundancy Alerts: None (Fully optimized)
      - Peer Benchmark: ${result.benchmarkComparison?.percentile ?? "top"}th percentile (${result.benchmarkComparison?.status ?? "EXCELLENT"})
      
      Write a highly transparent, 2-paragraph executive summary (100-140 words).
      Paragraph 1: Commend the company for operating an exceptionally optimized AI stack with zero wasteful redundancies. Reference the current spend of $${result.totalCurrentSpend}/mo and note that our audit found no overlapping subscriptions or seat redundancies, placing them in the ${result.benchmarkComparison?.percentile ?? "top"}th percentile (${result.benchmarkComparison?.status ?? "EXCELLENT"}).
      Paragraph 2: Recommend keeping their current lean software allocation model, and suggest setting up regular checks to monitor team seat utilization as they continue to scale.
      Tone: Technical, transparent, and authoritative.
      `
      : `
      You are an expert AI SaaS financial auditor for Fluxora.
      Analyze this deterministic audit data for ${companyName}:
      - Current Spend: $${result.totalCurrentSpend}/mo
      - Optimized Spend: $${result.totalOptimizedSpend}/mo
      - Monthly Savings: $${result.monthlySavings}/mo
      - Redundancy Alerts: ${result.redundancyWarnings.join("; ")}
      - Peer Benchmark: ${result.benchmarkComparison?.percentile}th percentile (${result.benchmarkComparison?.status})
      - Recommendations: ${result.recommendations.map(r => `${r.action} ${r.originalTool} (Logic: ${r.reasoning})`).join(", ")}
      
      Write a highly transparent, 2-paragraph executive summary (100-140 words).
      Paragraph 1: Be specific about the math. Mention the redundancy alerts and how they impact the ${result.benchmarkComparison?.percentile}th percentile ranking. Explain exactly HOW the $${result.monthlySavings} in monthly savings was calculated.
      Paragraph 2: Provide a clear path forward. Focus on workflow consolidation, seat right-sizing, and contract optimization to recover capital.
      Tone: Technical, transparent, and authoritative. Build trust by 'showing the work'.
      `;

    // Using gemini-2.0-flash for the fastest possible response time.
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || fallbackSummary;
  } catch (error) {
    // If the LLM hallucinates or hits a rate limit, the fallback keeps us safe.
    console.error("Gemini API error (Audit Summary):", error);
    return fallbackSummary;
  }
}
