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
  const fallbackSummary = `${companyName} is currently spending $${result.totalCurrentSpend.toLocaleString()}/mo on AI tools. Our deterministic audit identifies a path to reduce this to $${result.totalOptimizedSpend.toLocaleString()}/mo, recovering $${result.annualSavings.toLocaleString()} annually. We recommend consolidating overlapping capabilities and considering the Credex.rocks marketplace to liquidate any unused enterprise credits.`;

  if (!process.env.GEMINI_API_KEY) {
    console.warn("Soft-fail: GEMINI_API_KEY missing. Using fallback summary.");
    return fallbackSummary;
  }

  try {
    const prompt = `
      You are an expert AI SaaS financial auditor for Credex.rocks.
      Analyze this audit data for ${companyName}:
      - Current Spend: $${result.totalCurrentSpend}/mo
      - Optimized Spend: $${result.totalOptimizedSpend}/mo
      - Monthly Savings: $${result.monthlySavings}/mo
      - Recommendations: ${result.recommendations.map(r => r.action + " " + r.originalTool).join(", ")}
      
      Write a highly professional, 2-paragraph executive summary (80-120 words).
      Paragraph 1: Summarize the wastage and the 'Aha!' moment.
      Paragraph 2: Mention that they can resell unused credits on Credex.rocks to turn costs back into cash.
      Tone: Professional, direct, and slightly urgent.
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
