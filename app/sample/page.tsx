"use client";

import React from "react";
import ResultsClient from "@/app/results/[slug]/ResultsClient";
import { ProcessedAuditResult } from "@/app/actions/audit";

export default function SampleAuditPage() {
  const sampleResult: ProcessedAuditResult = {
    companyName: "Stealth AI (Sample)",
    totalCurrentSpend: 1240,
    totalOptimizedSpend: 420,
    monthlySavings: 820,
    annualSavings: 9840,
    publicSlug: "sample-demo",
    aiSummary: "Your audit identified 100% functional overlap between individual Claude Pro and ChatGPT Plus subscriptions and your team's Cursor Pro environment. By consolidating to Cursor and liquidating redundant licenses, you can recover $820/mo immediately.",
    recommendations: [
      {
        originalTool: "ChatGPT Plus",
        originalPlan: "Individual Pro",
        originalSeats: 20,
        originalMonthlyCost: 400,
        action: "REPLACE",
        suggestedTool: "Cursor (Included)",
        suggestedPlan: "Pro",
        suggestedTotalCost: 0,
        savings: 400,
        newCost: 0,
        reasoning: "Redundant. Cursor Pro includes Claude 3.5 Sonnet and GPT-4o access. Individual Plus seats are wasted capital."
      },
      {
        originalTool: "Claude Pro",
        originalPlan: "Professional",
        originalSeats: 15,
        originalMonthlyCost: 300,
        action: "REPLACE",
        suggestedTool: "Cursor (Included)",
        suggestedPlan: "Pro",
        suggestedTotalCost: 0,
        savings: 300,
        newCost: 0,
        reasoning: "100% Functional Overlap. Your team is already paying for Claude 3.5 access via the Cursor environment."
      },
      {
        originalTool: "Github Copilot",
        originalPlan: "Business",
        originalSeats: 12,
        originalMonthlyCost: 540,
        action: "REPLACE",
        suggestedTool: "Cursor",
        suggestedPlan: "Pro",
        suggestedTotalCost: 420,
        savings: 120,
        newCost: 420,
        reasoning: "Consolidate coding environments. Cursor provides superior context and eliminates the need for separate Copilot licenses."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Demo Banner */}
      <div className="bg-amber-400/80 backdrop-blur-md text-amber-950 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] sticky top-0 z-[100] border-b border-amber-500/20">
        ⚠️ You are viewing a Sample Report with fictional data.
      </div>
      <ResultsClient result={sampleResult} isShared={true} />
    </div>
  );
}
