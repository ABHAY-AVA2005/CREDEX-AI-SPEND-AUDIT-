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

  // Track capabilities we've already covered so we can find redundancies.
  const coveredCapabilities = new Set<string>();

  // Pre-pass: Identify if the user already has our "Target" tools
  input.tools.forEach(tool => {
    const name = tool.toolName.toLowerCase();
    if (name.includes("cursor")) coveredCapabilities.add("CODE");
    if (name.includes("claude")) coveredCapabilities.add("WRITING");
  });

  input.tools.forEach((tool) => {
    const currentCost = tool.monthlySpend;
    totalCurrentSpend += currentCost;

    // Default state: Keep the tool as is.
    let action: AuditRecommendation["action"] = "KEEP";
    let newCost = currentCost;
    let suggestedTool: string | undefined = undefined;
    let suggestedPlan: string | undefined = undefined;
    let suggestedCostPerSeat: number | undefined = undefined;
    let suggestedTotalCost: number | undefined = undefined;
    let reasoning = "Tool is well-priced and necessary for your current workflow.";

    const toolNameLower = tool.toolName.toLowerCase();
    const useCasesLower = tool.useCases.map(u => u.toLowerCase());

    /**
     * RULE 1: Replace expensive pure copywriting tools with Claude.
     * Jasper and Copy.ai were great in 2023, but Claude 3.5 is now the king
     * of creative writing at a much lower price point.
     */
    if ((toolNameLower.includes("jasper") || toolNameLower.includes("copy.ai")) && currentCost > 20) {
      if (!coveredCapabilities.has("WRITING")) {
        const rec = KNOWN_TOOLS.find(t => t.name === "Claude" && t.plan === "Pro");
        action = "REPLACE";
        suggestedTool = "Claude";
        suggestedPlan = "Pro";
        suggestedCostPerSeat = rec?.costPerSeat ?? 17;
        newCost = suggestedCostPerSeat * tool.seats;
        suggestedTotalCost = newCost;
        reasoning = `Claude 3.5 Sonnet offers equivalent or better copywriting capabilities for a fraction of the cost of ${tool.toolName}.`;
        coveredCapabilities.add("WRITING");
      } else {
        action = "CONSOLIDATE";
        newCost = 0;
        suggestedTotalCost = 0;
        reasoning = `This capability (Writing) is already covered by your existing stack.`;
      }
    }
    // Also consolidate separate Claude if user has Cursor
    else if (toolNameLower.includes("claude") && coveredCapabilities.has("CODE") && currentCost > 0) {
       action = "CONSOLIDATE";
       newCost = 0;
       suggestedTotalCost = 0;
       reasoning = `Your Cursor subscription already includes Claude 3.5 Sonnet natively. A separate subscription is likely redundant.`;
    }

    /**
     * RULE 2: Consolidate Copilot + ChatGPT for Coding into Cursor.
     * Cursor is the new standard. If they have it, they don't need Copilot.
     */
    else if (toolNameLower.includes("copilot") || (toolNameLower.includes("chatgpt") && useCasesLower.includes("coding"))) {
       if (!coveredCapabilities.has("CODE")) {
         const rec = KNOWN_TOOLS.find(t => t.name === "Cursor" && t.plan === "Pro");
         action = "REPLACE";
         suggestedTool = "Cursor";
         suggestedPlan = "Pro";
         suggestedCostPerSeat = rec?.costPerSeat ?? 20;
         newCost = suggestedCostPerSeat * tool.seats;
         suggestedTotalCost = newCost;
         reasoning = `Cursor includes Claude 3.5 Sonnet and GPT-4o natively in the IDE, replacing the need for separate Github Copilot and ChatGPT Plus subscriptions.`;
         coveredCapabilities.add("CODE");
       } else {
         // If we already handled the coding capability, this tool is redundant.
         action = "CONSOLIDATE";
         newCost = 0;
         suggestedTotalCost = 0;
         reasoning = `This capability (Coding) is already covered by the recommended alternative (Cursor).`;
       }
    }

    /**
     * RULE 3: High seat counts on consumer plans.
     * If you have 10+ seats, you're getting ripped off on consumer pricing. 
     * Switch to a Team plan or a direct API gateway.
     */
    else if (tool.seats >= 10 && !tool.currentPlan.toLowerCase().includes("team") && !tool.currentPlan.toLowerCase().includes("enterprise")) {
      action = "REPLACE";
      suggestedTool = tool.toolName;
      suggestedPlan = "Team / API";
      // Industry heuristic: API gateways save ~60%
      newCost = (currentCost * 0.4);
      suggestedCostPerSeat = Math.round(newCost / tool.seats);
      suggestedTotalCost = newCost;
      reasoning = `With ${tool.seats} seats, you are paying a significant premium for consumer UI. Switching to an API-based gateway (like TypingMind) using your own API keys can reduce your cost to ~$8/seat while maintaining full capability.`;
    }

    /**
     * RULE 4: Price Anomaly Detection.
     * If you're paying >$50/seat, you're likely on a legacy contract or 
     * a massive markup plan.
     */
    else if (tool.seats > 0 && (currentCost / tool.seats) > 50) {
      const avgMarketRate = 30; // Industry standard for premium SaaS
      action = "DOWNGRADE";
      suggestedTool = tool.toolName;
      suggestedPlan = "Standard / Direct";
      suggestedCostPerSeat = avgMarketRate;
      newCost = avgMarketRate * tool.seats;
      suggestedTotalCost = newCost;
      reasoning = `Your current cost of $${Math.round(currentCost / tool.seats)}/seat is significantly above the market average. Switching to a standard direct plan could save substantial costs.`;
    }

    // Wrap up the math for this tool
    const savings = currentCost - newCost;
    totalOptimizedSpend += newCost;

    recommendations.push({
      originalTool: tool.toolName,
      originalPlan: tool.currentPlan,
      originalSeats: tool.seats,
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

  return {
    totalCurrentSpend,
    totalOptimizedSpend,
    monthlySavings: totalCurrentSpend - totalOptimizedSpend,
    annualSavings: (totalCurrentSpend - totalOptimizedSpend) * 12,
    recommendations,
  };
}
