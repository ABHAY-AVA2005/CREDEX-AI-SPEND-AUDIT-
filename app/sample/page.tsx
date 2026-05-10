"use client";

import React from "react";
import ResultsClient from "@/app/results/[slug]/ResultsClient";
import { ProcessedAuditResult } from "@/app/actions/audit";

export default function SampleAuditPage() {
  const sampleResult: ProcessedAuditResult = {
    companyName: "Acme Corp (Demo)",
    totalCurrentSpend: 18245,
    totalOptimizedSpend: 10237,
    monthlySavings: 8008,
    annualSavings: 96096,
    publicSlug: "sample-demo",
    aiSummary: "Your AI stack analysis shows significant overlap between ChatGPT Enterprise and Claude Team. By consolidating to a unified platform and reclaiming 72 inactive seats, you can recover over $8,000 monthly without impacting productivity. Additionally, your AWS reserved credits are nearing expiration—redeploying these immediately will prevent a $3,200 loss.",
    recommendations: [
      {
        originalTool: "ChatGPT Enterprise",
        originalPlan: "Enterprise",
        originalSeats: 120,
        originalMonthlyCost: 4320,
        action: "REPLACE",
        suggestedTool: "Credex Exchange / Team Plan",
        suggestedPlan: "Standard",
        suggestedTotalCost: 1728,
        savings: 2592,
        newCost: 1728,
        reasoning: "Reclaim 72 inactive ChatGPT Enterprise seats. Downsize or resell via Credex Exchange."
      },
      {
        originalTool: "AWS Credits",
        originalPlan: "Reserved Instances",
        originalMonthlyCost: 8400,
        action: "REPLACE",
        suggestedTool: "Optimized AWS",
        suggestedPlan: "On-Demand/Spot",
        suggestedTotalCost: 5200,
        savings: 3200,
        newCost: 5200,
        reasoning: "Redeploy $3,200 in expiring AWS reserved credits before 38-day deadline."
      },
      {
        originalTool: "Gemini API",
        originalPlan: "Pay-as-you-go",
        originalMonthlyCost: 620,
        action: "REPLACE",
        suggestedTool: "None",
        suggestedPlan: "Cancelled",
        suggestedTotalCost: 0,
        savings: 620,
        newCost: 0,
        reasoning: "Cancel Gemini API — zero usage in 30 days. No productivity impact."
      },
      {
        originalTool: "GitHub Copilot",
        originalPlan: "Business",
        originalSeats: 95,
        originalMonthlyCost: 1805,
        action: "REPLACE",
        suggestedTool: "Cursor",
        suggestedPlan: "Pro",
        suggestedTotalCost: 1159,
        savings: 646,
        newCost: 1159,
        reasoning: "Evaluate GitHub Copilot vs. Cursor overlap. Consolidate to one AI coding tool."
      },
      {
        originalTool: "Claude Team",
        originalPlan: "Team",
        originalSeats: 60,
        originalMonthlyCost: 1500,
        action: "DOWNGRADE",
        suggestedTool: "Claude",
        suggestedPlan: "Standard Team",
        suggestedTotalCost: 550,
        savings: 950,
        newCost: 550,
        reasoning: "Reduce Claude Team licenses from 60 to 22 active users."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      <div className="bg-amber-400 text-amber-950 py-2 text-center text-xs font-bold uppercase tracking-widest sticky top-0 z-[100] shadow-sm">
        ⚠️ You are viewing a Sample Report with fictional data.
      </div>
      <ResultsClient result={sampleResult} isShared={true} />
    </div>
  );
}
