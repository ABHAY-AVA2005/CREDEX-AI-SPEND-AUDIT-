/**
 * revenue-context/index.ts
 * Feature: Revenue-Aware ROI Scoring
 *
 * The AI strategist asked: "Have you considered adding integration with
 * revenue data?" This module handles exactly that.
 *
 * Strategy: We NEVER make revenue mandatory. It's an optional enrichment
 * layer. If the user provides it, every recommendation gets a hard ROI %.
 * If they don't, it gracefully degrades to the existing savings-only view.
 *
 * This is a pure computation module — no DB calls, no API calls.
 * Drop it into core/revenue-context/ and import where needed.
 */

export interface RevenueContext {
  /** Monthly Recurring Revenue in USD */
  mrr: number;
  /** Annual Recurring Revenue in USD */
  arr: number;
  /** Revenue growth rate (e.g. 0.15 = 15% MoM) */
  growthRateMoM?: number;
  /** Runway in months */
  runwayMonths?: number;
}

export interface ROIEnrichedRecommendation {
  originalTool: string;
  action: string;
  monthlySavings: number;
  /** Savings as % of MRR — the number that makes CFOs lean forward */
  savingsAsMrrPercent: number;
  /** How many months to break even on migration effort (estimated) */
  paybackMonths: number;
  /** Annualised ROI on the switch, assuming 2h migration effort at $150/h */
  annualisedRoi: number;
}

export interface RevenueAuditEnrichment {
  aiSpendAsMrrPercent: number;
  optimisedSpendAsMrrPercent: number;
  savingsAsMrrPercent: number;
  annualSavingsAsArrPercent: number;
  /**
   * Burn efficiency score: lower AI spend per $1 of ARR = more efficient.
   * Score of 1.0 = industry median for the company's stage.
   */
  burnEfficiencyScore: number;
  recommendations: ROIEnrichedRecommendation[];
  revenueContext: RevenueContext;
}

/**
 * Industry median AI spend as % of MRR by stage (May 2026 estimates).
 * These inform the burnEfficiencyScore.
 */
const STAGE_MEDIAN_AI_SPEND_AS_MRR_PERCENT: Record<string, number> = {
  PRE_SEED: 12.0,
  SEED: 7.5,
  SERIES_A: 4.5,
  SERIES_B: 3.0,
  LATE_STAGE: 1.8,
};

const MIGRATION_COST_PER_TOOL_USD = 300; // 2h engineer time @ $150/h

export function enrichWithRevenueContext(
  totalCurrentSpend: number,
  totalOptimizedSpend: number,
  recommendations: Array<{ originalTool: string; action: string; savings: number }>,
  revenue: RevenueContext,
  stage: string = "SEED"
): RevenueAuditEnrichment {
  const monthlySavings = totalCurrentSpend - totalOptimizedSpend;
  const annualSavings = monthlySavings * 12;

  const aiSpendAsMrrPercent = safePct(totalCurrentSpend, revenue.mrr);
  const optimisedSpendAsMrrPercent = safePct(totalOptimizedSpend, revenue.mrr);
  const savingsAsMrrPercent = safePct(monthlySavings, revenue.mrr);
  const annualSavingsAsArrPercent = safePct(annualSavings, revenue.arr);

  const median = STAGE_MEDIAN_AI_SPEND_AS_MRR_PERCENT[stage] ?? 5.0;
  // Score: 1.0 means exactly at median. <1.0 means more efficient, >1.0 worse.
  const burnEfficiencyScore = parseFloat(
    (aiSpendAsMrrPercent / median).toFixed(2)
  );

  const enrichedRecs: ROIEnrichedRecommendation[] = recommendations.map((rec) => {
    const savingsAsMrrPercent = safePct(rec.savings, revenue.mrr);
    const annualSavings = rec.savings * 12;
    const paybackMonths =
      rec.savings > 0
        ? parseFloat((MIGRATION_COST_PER_TOOL_USD / rec.savings).toFixed(1))
        : 0;
    const annualisedRoi =
      MIGRATION_COST_PER_TOOL_USD > 0
        ? parseFloat(
            (((annualSavings - MIGRATION_COST_PER_TOOL_USD) / MIGRATION_COST_PER_TOOL_USD) * 100).toFixed(1)
          )
        : 0;

    return {
      originalTool: rec.originalTool,
      action: rec.action,
      monthlySavings: rec.savings,
      savingsAsMrrPercent,
      paybackMonths,
      annualisedRoi,
    };
  });

  return {
    aiSpendAsMrrPercent,
    optimisedSpendAsMrrPercent,
    savingsAsMrrPercent,
    annualSavingsAsArrPercent,
    burnEfficiencyScore,
    recommendations: enrichedRecs,
    revenueContext: revenue,
  };
}

function safePct(numerator: number, denominator: number): number {
  if (!denominator || denominator === 0) return 0;
  return parseFloat(((numerator / denominator) * 100).toFixed(2));
}
