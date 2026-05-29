/**
 * audit-engine/index.ts
 * The "Brain" of the operation.
 * 
 * I've structured this as a series of deterministic rules. 
 * Why? Because when you're telling a founder they're wasting $10k/year, 
 * "the AI said so" isn't a good enough answer. They need to see the logic.
 */

import { AuditFormInput, AuditResult, AuditRecommendation } from "@/schemas/audit";
import { KNOWN_TOOLS, ALL_KNOWN_TOOLS } from "./knowledge";
import { resolveFuzzyToolName } from "../../lib/fuzzy-matching";

interface EvaluationResult {
  action: AuditRecommendation["action"];
  newCost: number;
  suggestedTool?: string;
  suggestedPlan?: string;
  suggestedCostPerSeat?: number;
  suggestedTotalCost?: number;
  reasoning: string;
}

/**
 * Checks deterministic rules sequentially and returns the optimized configuration.
 * Using helper functions and guard clauses avoids nested if-else structures.
 */
function evaluateTool(
  tool: AuditFormInput["tools"][0],
  allTools: AuditFormInput["tools"],
  currentRecommendations: AuditRecommendation[]
): EvaluationResult {
  const toolNameLower = tool.toolName.toLowerCase();
  const useCasesLower = tool.useCases.map(u => u.toLowerCase());
  const currentCost = tool.monthlySpend;

  // Rule 1: Redundancy / Consolidation (Jasper / Copy.ai)
  if (toolNameLower.includes("jasper") || toolNameLower.includes("copy.ai")) {
    const hasClaude = allTools.some(t => t.toolName.toLowerCase().includes("claude"));
    if (hasClaude) {
      return {
        action: "CONSOLIDATE",
        newCost: 0,
        suggestedTotalCost: 0,
        reasoning: `You already have Claude. Paying for ${tool.toolName} is basically lighting money on fire.`
      };
    }
    const rec = KNOWN_TOOLS.find(t => t.name === "Claude" && t.plan === "Pro");
    const costPerSeat = rec?.costPerSeat ?? 17;
    return {
      action: "REPLACE",
      suggestedTool: "Claude",
      suggestedPlan: "Pro",
      suggestedCostPerSeat: costPerSeat,
      newCost: costPerSeat * tool.seats,
      suggestedTotalCost: costPerSeat * tool.seats,
      reasoning: `Claude 3.5 Sonnet is just better and cheaper than legacy writing wrappers.`
    };
  }

  // Rule 2: Cursor vs. Copilot (Coding tool consolidation)
  if (toolNameLower.includes("copilot") || (toolNameLower.includes("chatgpt") && useCasesLower.includes("coding"))) {
    const hasCursor = allTools.some(t => t.toolName.toLowerCase().includes("cursor"));
    const alreadyRecommendedCursor = currentRecommendations.some(r => r.suggestedTool === "Cursor");
    if (hasCursor || alreadyRecommendedCursor) {
      return {
        action: "CONSOLIDATE",
        newCost: 0,
        suggestedTotalCost: 0,
        reasoning: `Cursor natively includes Claude 3.5 and specialized coding models. Keeping ${tool.toolName} is redundant.`
      };
    }
    const rec = KNOWN_TOOLS.find(t => t.name === "Cursor" && t.plan === "Pro");
    const costPerSeat = rec?.costPerSeat ?? 20;
    return {
      action: "REPLACE",
      suggestedTool: "Cursor",
      suggestedPlan: "Pro",
      suggestedCostPerSeat: costPerSeat,
      newCost: costPerSeat * tool.seats,
      suggestedTotalCost: costPerSeat * tool.seats,
      reasoning: `Cursor is the gold standard right now. It replaces Copilot and separate ChatGPT coding subs.`
    };
  }

  // Rule 3: Enterprise SSO & Privacy Consolidation vs. Scattered Consumer Seats (Hardened Security)
  if (tool.seats >= 10 && (toolNameLower.includes("chatgpt") || toolNameLower.includes("claude"))) {
    const planLower = tool.currentPlan.toLowerCase();
    if (planLower.includes("plus") || planLower.includes("pro") || planLower.includes("team")) {
      return {
        action: "REPLACE",
        suggestedTool: `${tool.toolName} Enterprise / Azure OpenAI (SSO Enforced)`,
        suggestedPlan: "Enterprise Plan / BAA Contract",
        newCost: currentCost * 0.7, // 30% savings + full SOC 2 security compliance
        suggestedTotalCost: currentCost * 0.7,
        reasoning: `For teams of ${tool.seats}+, running scattered consumer Plus/Pro seats is a compliance leak. We recommend consolidating to an Enterprise tier or Azure OpenAI. This enforces SAML SSO, secures SOC 2 Type II compliance, signs a HIPAA BAA, and guarantees zero-data retention (ZDR) on corporate inputs while capturing a ~30% volume discount.`
      };
    }
  }

  // Extra Check: Consolidate standalone Claude if they have Cursor
  if (toolNameLower.includes("claude")) {
    const hasCursor = allTools.some(t => t.toolName.toLowerCase().includes("cursor")) ||
                      currentRecommendations.some(r => r.suggestedTool === "Cursor");
    if (hasCursor) {
      return {
        action: "CONSOLIDATE",
        newCost: 0,
        suggestedTotalCost: 0,
        reasoning: "You are using Cursor, which already provides access to Claude 3.5 Sonnet. This standalone subscription is redundant."
      };
    }
  }

  // Rule 4: The Enterprise Commitment Plan
  if (toolNameLower.includes("openai") || toolNameLower.includes("aws") || toolNameLower.includes("anthropic")) {
    const discountFactor = 0.20;
    return {
      action: "REPLACE",
      suggestedTool: `${tool.toolName} (via Commitment Optimization)`,
      suggestedPlan: "Annual Commitment",
      newCost: currentCost * (1 - discountFactor),
      suggestedTotalCost: currentCost * (1 - discountFactor),
      reasoning: `We can negotiate a 20% discount on your ${tool.toolName} contract by switching to enterprise commitment tiers.`
    };
  }

  // Fallback
  return {
    action: "KEEP",
    newCost: currentCost,
    reasoning: "Tool is well-priced and necessary for your current workflow."
  };
}

export function runAuditEngine(input: AuditFormInput): AuditResult {
  let totalCurrentSpend = 0;
  let totalOptimizedSpend = 0;
  const recommendations: AuditRecommendation[] = [];
  const redundancyWarnings: string[] = [];

  const toolCategories: Record<string, string[]> = {};

  const knownToolNames = Array.from(new Set(ALL_KNOWN_TOOLS.map(t => t.name)));
  const cleanedTools = input.tools.map(tool => {
    const fuzzyName = resolveFuzzyToolName(tool.toolName, knownToolNames);
    return {
      ...tool,
      toolName: fuzzyName
    };
  });

  // Pre-pass: Identify tool categories and basic redundancies
  cleanedTools.forEach(tool => {
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

  cleanedTools.forEach((tool) => {
    const currentCost = tool.monthlySpend;
    totalCurrentSpend += currentCost;

    const evaluation = evaluateTool(tool, cleanedTools, recommendations);
    totalOptimizedSpend += evaluation.newCost;

    recommendations.push({
      originalTool: tool.toolName,
      originalPlan: tool.currentPlan,
      originalSeats: tool.seats,
      originalTokens: tool.tokens,
      originalMonthlyCost: currentCost,
      action: evaluation.action,
      suggestedTool: evaluation.suggestedTool,
      suggestedPlan: evaluation.suggestedPlan,
      suggestedCostPerSeat: evaluation.suggestedCostPerSeat,
      suggestedTotalCost: evaluation.suggestedTotalCost,
      savings: currentCost - evaluation.newCost,
      newCost: evaluation.newCost,
      reasoning: evaluation.reasoning
    });
  });

  // Benchmarking (Shashank Insight)
  const spendPerEmp = totalCurrentSpend / (input.companySize || 1);
  const stageBenchmark = 150; // Standardized benchmark for 2026 AI Intensity
  
  const status: "EXCELLENT" | "GOOD" | "OVERSPENDING" | "CRITICAL" =
    spendPerEmp > stageBenchmark * 1.5
      ? "CRITICAL"
      : spendPerEmp > stageBenchmark
        ? "OVERSPENDING"
        : spendPerEmp < stageBenchmark * 0.5
          ? "EXCELLENT"
          : "GOOD";

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
