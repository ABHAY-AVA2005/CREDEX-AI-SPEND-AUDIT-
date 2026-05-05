import { GoogleGenAI } from "@google/genai";
import { AuditResult } from "@/schemas/audit";

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI({});

export async function generateAuditSummary(
  companyName: string, 
  result: AuditResult
): Promise<string> {
  const fallbackSummary = `${companyName} is currently spending $${result.totalCurrentSpend}/mo on AI tools. By optimizing overlapping capabilities and unused seats, you can reduce this to $${result.totalOptimizedSpend}/mo, saving $${result.annualSavings}/year. Consider reselling your unused enterprise seats or cloud credits on the Credex.rocks marketplace to recover even more sunk costs.`;

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Using fallback summary.");
    return fallbackSummary;
  }

  try {
    const prompt = `
      You are an expert AI SaaS financial auditor for Credex.rocks, a marketplace for reselling unused AI and cloud credits.
      Analyze this audit for ${companyName}:
      - Current Spend: $${result.totalCurrentSpend}/mo
      - Optimized Spend: $${result.totalOptimizedSpend}/mo
      - Monthly Savings: $${result.monthlySavings}/mo
      - Key Recommendations: ${result.recommendations.map(r => r.action + " " + r.originalTool).join(", ")}
      
      Write a highly professional, personalized executive summary (strictly 80-120 words).
      Highlight the total savings. Crucially, explicitly mention that they can securely resell their unused or unneeded AI and cloud credits (like ChatGPT, Claude, AWS) on Credex.rocks to recover sunk costs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || fallbackSummary;
  } catch (error) {
    console.error("Gemini API error:", error);
    return fallbackSummary;
  }
}
