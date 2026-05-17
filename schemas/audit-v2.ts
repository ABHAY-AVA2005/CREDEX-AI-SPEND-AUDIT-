/**
 * schemas/audit-v2.ts
 * Extended Zod schemas for Fluxora v2 features.
 *
 * BACKWARD COMPATIBLE — all new fields are optional.
 * Your existing AuditFormSchema still works; this extends it.
 * Import AuditFormSchemaV2 for new forms that support revenue data.
 */

import { z } from "zod";
import { AuditFormSchema, AuditResult } from "./audit"; // your existing schema

// ─── Revenue Context Schema ────────────────────────────────────────────────────
export const RevenueContextSchema = z.object({
  mrr: z
    .preprocess((val) => (val === "" || val === null || val === undefined || isNaN(Number(val)) ? undefined : Number(val)), z.number().min(0).optional())
    .describe("Monthly Recurring Revenue in USD"),
  arr: z
    .preprocess((val) => (val === "" || val === null || val === undefined || isNaN(Number(val)) ? undefined : Number(val)), z.number().min(0).optional())
    .describe("Annual Recurring Revenue in USD"),
  growthRateMoM: z
    .preprocess((val) => (val === "" || val === null || val === undefined || isNaN(Number(val)) ? undefined : Number(val)), z.number().min(-1).max(10).optional())
    .describe("Month-over-month growth rate, e.g. 0.15 = 15%"),
  runwayMonths: z
    .preprocess((val) => (val === "" || val === null || val === undefined || isNaN(Number(val)) ? undefined : Number(val)), z.number().min(0).max(120).optional())
    .describe("Remaining runway in months"),
}).transform((data) => {
  // If arr is missing but mrr is present, calculate it
  if (data.mrr && !data.arr) {
    data.arr = data.mrr * 12;
  }
  // If mrr is missing but arr is present, calculate it
  if (data.arr && !data.mrr) {
    data.mrr = data.arr / 12;
  }
  return data;
});

export type RevenueContextInput = z.infer<typeof RevenueContextSchema>;

// ─── Recommendation Weights Schema ────────────────────────────────────────────
export const RecommendationWeightsSchema = z.object({
  costSavings: z.number().min(0).max(10).default(6),
  lowMigrationRisk: z.number().min(0).max(10).default(4),
  capabilityGain: z.number().min(0).max(10).default(3),
  teamVelocityImpact: z.number().min(0).max(10).default(5),
});

export type RecommendationWeightsInput = z.infer<typeof RecommendationWeightsSchema>;

// ─── Extended Audit Form Schema ────────────────────────────────────────────────
export const AuditFormSchemaV2 = AuditFormSchema.extend({
  /** Optional: unlocks ROI scoring if provided */
  revenueContext: RevenueContextSchema.optional(),
  /** Optional: custom weights for recommendation ranking */
  recommendationWeights: RecommendationWeightsSchema.optional(),
  /** Optional: company funding stage for peer benchmarking */
  fundingStage: z
    .enum(["PRE_SEED", "SEED", "SERIES_A", "SERIES_B", "LATE_STAGE"])
    .optional(),
});

export type AuditFormInputV2 = z.infer<typeof AuditFormSchemaV2>;

// ─── Extended Result Type ──────────────────────────────────────────────────────
export interface AuditResultV2 extends AuditResult {
  /** Present only when revenue context was provided */
  revenueEnrichment?: {
    aiSpendAsMrrPercent: number;
    optimisedSpendAsMrrPercent: number;
    savingsAsMrrPercent: number;
    annualSavingsAsArrPercent: number;
    burnEfficiencyScore: number;
    recommendations: Array<{
      originalTool: string;
      action: string;
      monthlySavings: number;
      savingsAsMrrPercent: number;
      paybackMonths: number;
      annualisedRoi: number;
    }>;
  };
  /** Recommendations re-ordered by composite weight score */
  weightedRecommendations?: Array<{
    recommendation: AuditResult["recommendations"][0];
    compositeScore: number;
    scoreBreakdown: {
      costSavingsScore: number;
      migrationRiskScore: number;
      capabilityGainScore: number;
      velocityScore: number;
    };
  }>;
}
