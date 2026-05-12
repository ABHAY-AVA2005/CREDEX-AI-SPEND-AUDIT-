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

  // Track capabilities to find redundancies
  const coveredCapabilities = new Set<string>();
  const toolCategories: Record<string, string[]> = {};

  // Benchmarking Data (Heuristic for 2026)
  const benchmarks: Record<string, number> = {
    "PRE_SEED": 50, // $/employee/mo for AI
    "SEED": 120,
    "SERIES_A": 250,
    "SERIES_B": 400,
    "LATE_STAGE": 600
  };

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

    // Rule 2: Cursor vs. Copilot
    else if (toolNameLower.includes("copilot") || (toolNameLower.includes("chatgpt") && useCasesLower.includes("coding"))) {
      const hasCursor = input.tools.some(t => t.toolName.toLowerCase().includes("cursor"));
      if (hasCursor) {
        action = "CONSOLIDATE";
        newCost = 0;
        suggestedTotalCost = 0;
        reasoning = `Cursor natively includes Claude 3.5. Keeping Github Copilot is redundant.`;
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
    else if (tool.type === "SEAT" && tool.seats >= 5 && (toolNameLower.includes("chatgpt") || toolNameLower.includes("claude"))) {
      action = "REPLACE";
      suggestedTool = "API Gateway (TypingMind)";
      suggestedPlan = "Usage-based (BYOK)";
      newCost = currentCost * 0.4;
      suggestedTotalCost = newCost;
      reasoning = `For teams of ${tool.seats}+, paying per-seat is a waste. An API Gateway saves like 60% and stops billing spikes.`;
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
