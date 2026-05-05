import { AuditFormInput, AuditResult, AuditRecommendation } from "@/schemas/audit";
import { KNOWN_TOOLS } from "./knowledge";

export function runAuditEngine(input: AuditFormInput): AuditResult {
  let totalCurrentSpend = 0;
  let totalOptimizedSpend = 0;
  const recommendations: AuditRecommendation[] = [];

  const coveredCapabilities = new Set<string>();

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

    // Rule 1: Replace expensive pure copywriting tools with Claude
    if ((toolNameLower.includes("jasper") || toolNameLower.includes("copy.ai")) && currentCost > 20) {
      const rec = KNOWN_TOOLS.find(t => t.name === "Claude" && t.plan === "Pro");
      action = "REPLACE";
      suggestedTool = "Claude";
      suggestedPlan = "Pro";
      suggestedCostPerSeat = rec?.costPerSeat ?? 17;
      newCost = suggestedCostPerSeat * tool.seats;
      suggestedTotalCost = newCost;
      reasoning = `Claude 3.5 Sonnet offers equivalent or better copywriting capabilities for a fraction of the cost of ${tool.toolName}.`;
      coveredCapabilities.add("COPYWRITING");
    }
    // Rule 2: Consolidate Copilot + ChatGPT for Coding into Cursor
    else if (toolNameLower.includes("copilot") || (toolNameLower.includes("chatgpt") && useCasesLower.includes("coding"))) {
       if (!coveredCapabilities.has("CODE")) {
         const rec = KNOWN_TOOLS.find(t => t.name === "Cursor" && t.plan === "Pro");
         action = "REPLACE";
         suggestedTool = "Cursor";
         suggestedPlan = "Pro";
         suggestedCostPerSeat = rec?.costPerSeat ?? 20;
         newCost = suggestedCostPerSeat * tool.seats;
         suggestedTotalCost = newCost;
         reasoning = `Cursor includes Claude 3.5 Sonnet and GPT-4o natively in the IDE, replacing the need for separate Github Copilot and ChatGPT Plus subscriptions for your engineering team.`;
         coveredCapabilities.add("CODE");
       } else {
         action = "CONSOLIDATE";
         newCost = 0;
         suggestedTotalCost = 0;
         reasoning = `This capability (Coding) is already covered by the recommended alternative (Cursor).`;
       }
    }
    // Rule 3: High seat counts on consumer plans
    else if (tool.seats >= 10 && !tool.currentPlan.toLowerCase().includes("team") && !tool.currentPlan.toLowerCase().includes("enterprise")) {
      action = "REPLACE";
      suggestedTool = tool.toolName;
      suggestedPlan = "Team / API";
      newCost = (currentCost * 0.4);
      suggestedCostPerSeat = Math.round(newCost / tool.seats);
      suggestedTotalCost = newCost;
      reasoning = `With ${tool.seats} seats, moving to a shared team API gateway (like TypingMind or LibreChat) could save ~60% compared to individual per-seat consumer subscriptions.`;
    }

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
