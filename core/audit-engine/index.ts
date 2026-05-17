/**
 * audit-engine/index.ts
 * The "Brain" of the operation.
 * 
 * I've structured this as a series of deterministic rules. 
 * Why? Because when you're telling a founder they're wasting $10k/year, 
 * "the AI said so" isn't a good enough answer. They need to see the logic.
 */

import { AuditFormInput, AuditResult, AuditRecommendation } from "@/schemas/audit";
import { KNOWN_TOOLS } from "./knowledge";

export function runAuditEngine(input: AuditFormInput): AuditResult {
  let totalCurrentSpend = 0;
  let totalOptimizedSpend = 0;
  const recommendations: AuditRecommendation[] = [];
  const redundancyWarnings: string[] = [];

  const toolCategories: Record<string, string[]> = {};

  // Pre-pass: Identify tool categories and basic redundancies
  input.tools.forEach(tool => {
    const name = tool.toolName.toLowerCase();
    const categories = [];
    if (name.includes("cursor") || name.includes("copilot")) categories.push("CODE");
    if (name.includes("claude") || name.includes("chatgpt") || name.includes("jasper")) categories.push("CHAT_AND_WRITING");
    if (name.includes("openai") || name.includes("anthropic") || name.includes("gemini")) categories.push("API_PROVIDERS");

    categories.forEach(cat => {
      if (!toolCategories[cat]) toolCategories[cat] = [];
      toolCategories[cat].push(tool.toolName);
    });
  });

  // Generate redundancy warnings
  Object.entries(toolCategories).forEach(([cat, tools]) => {
    if (tools.length > 1) {
      redundancyWarnings.push(`Redundant tools found in ${cat} category: ${tools.join(", ")}. You are paying for multiple services that do the same thing.`);
    }
  });

  input.tools.forEach((tool) => {
    const currentCost = tool.monthlySpend;
    totalCurrentSpend += currentCost;

    let action: AuditRecommendation["action"] = "KEEP";
    let newCost = currentCost;
    let suggestedTool: string | undefined = undefined;
    let suggestedPlan: string | undefined = undefined;
    let suggestedCostPerSeat: number | undefined = undefined;
    let suggestedTotalCost: number | undefined = undefined;
    let reasoning = "Tool is well-priced and necessary for your current workflow.";

    const toolNameLower = tool.toolName.toLowerCase();
    const useCasesLower = tool.useCases.map(u => u.toLowerCase());

    // Rule 1: Redundancy / Consolidation (Rami Insight)
    if (toolNameLower.includes("jasper") || toolNameLower.includes("copy.ai")) {
      const hasClaude = input.tools.some(t => t.toolName.toLowerCase().includes("claude"));
      if (hasClaude) {
        action = "CONSOLIDATE";
        newCost = 0;
        suggestedTotalCost = 0;
        reasoning = `You already have Claude. Paying for ${tool.toolName} is basically lighting money on fire.`;
      } else {
        const rec = KNOWN_TOOLS.find(t => t.name === "Claude" && t.plan === "Pro");
        action = "REPLACE";
        suggestedTool = "Claude";
        suggestedPlan = "Pro";
        suggestedCostPerSeat = rec?.costPerSeat ?? 17;
        newCost = suggestedCostPerSeat * tool.seats;
        suggestedTotalCost = newCost;
        reasoning = `Claude 3.5 Sonnet is just better and cheaper than legacy writing wrappers.`;
      }
    }

    // Rule 2: Cursor vs. Copilot (Coding tool consolidation)
    else if (toolNameLower.includes("copilot") || (toolNameLower.includes("chatgpt") && useCasesLower.includes("coding"))) {
      const hasCursor = input.tools.some(t => t.toolName.toLowerCase().includes("cursor"));
      // Also check if we already recommended Cursor in this run
      const alreadyRecommendedCursor = recommendations.some(r => r.suggestedTool === "Cursor");

      if (hasCursor || alreadyRecommendedCursor) {
        action = "CONSOLIDATE";
        newCost = 0;
        suggestedTotalCost = 0;
        reasoning = `Cursor natively includes Claude 3.5 and specialized coding models. Keeping ${tool.toolName} is redundant.`;
      } else {
        const rec = KNOWN_TOOLS.find(t => t.name === "Cursor" && t.plan === "Pro");
        action = "REPLACE";
        suggestedTool = "Cursor";
        suggestedPlan = "Pro";
        suggestedCostPerSeat = rec?.costPerSeat ?? 20;
        newCost = suggestedCostPerSeat * tool.seats;
        suggestedTotalCost = newCost;
        reasoning = `Cursor is the gold standard right now. It replaces Copilot and separate ChatGPT coding subs.`;
      }
    }

    // Rule 3: API Gateway vs. Seats (Ryan Das Insight)
    else if (tool.seats >= 10 && (toolNameLower.includes("chatgpt") || toolNameLower.includes("claude"))) {
      // Check if they are on a Pro/Plus plan (consumer)
      if (tool.currentPlan.toLowerCase().includes("plus") || tool.currentPlan.toLowerCase().includes("pro") || tool.currentPlan.toLowerCase().includes("team")) {
        action = "REPLACE";
        suggestedTool = "API Gateway (TypingMind)";
        suggestedPlan = "Team / API based (BYOK)";
        newCost = currentCost * 0.4; // 60% savings
        suggestedTotalCost = newCost;
        reasoning = `For teams of ${tool.seats}+, paying per-seat for consumer-grade AI is inefficient. An API Gateway with BYOK saves ~60% and provides better management.`;
      }
    }
    
    // Extra Check: Consolidate standalone Claude if they have Cursor
    else if (toolNameLower.includes("claude")) {
      const hasCursor = input.tools.some(t => t.toolName.toLowerCase().includes("cursor")) || 
                        recommendations.some(r => r.suggestedTool === "Cursor");
      if (hasCursor) {
        action = "CONSOLIDATE";
        newCost = 0;
        suggestedTotalCost = 0;
        reasoning = "You are using Cursor, which already provides access to Claude 3.5 Sonnet. This standalone subscription is redundant.";
      }
    }

    // Rule 4: The Secondary Market Loop (The Credex play)
    else if (toolNameLower.includes("openai") || toolNameLower.includes("aws") || toolNameLower.includes("anthropic")) {
      const discountFactor = 0.20;
      action = "REPLACE";
      suggestedTool = `${tool.toolName} (via Marketplace Credits)`;
      suggestedPlan = "Secondary Market";
      newCost = currentCost * (1 - discountFactor);
      suggestedTotalCost = newCost;
      reasoning = `We can get you the exact same ${tool.toolName} service for 20% less via our credit marketplace.`;
    }

    const savings = currentCost - newCost;
    totalOptimizedSpend += newCost;

    recommendations.push({
      originalTool: tool.toolName,
      originalPlan: tool.currentPlan,
      originalSeats: tool.seats,
      originalTokens: tool.tokens,
      originalMonthlyCost: currentCost,
      action,
      suggestedTool,
      suggestedPlan,
      suggestedCostPerSeat,
      suggestedTotalCost,
      savings,
      newCost,
      reasoning
    });
  });

  // Benchmarking (Shashank Insight)
  const spendPerEmp = totalCurrentSpend / (input.companySize || 1);
  const stageBenchmark = 150; // Standardized benchmark for 2026 AI Intensity
  
  let status: "EXCELLENT" | "GOOD" | "OVERSPENDING" | "CRITICAL" = "GOOD";
  if (spendPerEmp > stageBenchmark * 1.5) status = "CRITICAL";
  else if (spendPerEmp > stageBenchmark) status = "OVERSPENDING";
  else if (spendPerEmp < stageBenchmark * 0.5) status = "EXCELLENT";

  const percentile = Math.min(99, Math.max(1, Math.round((1 - (spendPerEmp / (stageBenchmark * 2))) * 100)));

  return {
    totalCurrentSpend,
    totalOptimizedSpend,
    monthlySavings: totalCurrentSpend - totalOptimizedSpend,
    annualSavings: (totalCurrentSpend - totalOptimizedSpend) * 12,
    recommendations,
    redundancyWarnings,
    benchmarkComparison: {
      percentile,
      averageForStage: stageBenchmark,
      status
    }
  };
}
