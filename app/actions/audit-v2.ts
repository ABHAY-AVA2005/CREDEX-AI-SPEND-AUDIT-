/**
 * app/actions/audit-v2.ts
 * Extended server action for Fluxora v2.
 *
 * Replaces processAuditAction for new forms.
 * Existing processAuditAction in audit.ts is unchanged — this is additive.
 *
 * Pipeline:
 *   1. Validate (Zod V2 schema — backward-compatible)
 *   2. Run deterministic audit engine (unchanged)
 *   3. Apply revenue enrichment (if MRR/ARR provided)
 *   4. Apply recommendation weights + re-rank (if weights provided)
 *   5. Generate Gemini summary (now revenue-aware if data is present)
 *   6. Persist (same Prisma schema — no migration required)
 */

"use server";

import { AuditFormSchemaV2, AuditFormInputV2, AuditResultV2 } from "@/schemas/audit-v2";
import { runAuditEngine } from "@/core/audit-engine";
import { enrichWithRevenueContext, RevenueContext } from "@/core/revenue-context";
import { applyWeightsAndRank, DEFAULT_WEIGHTS } from "@/core/recommendation-weights";
import { generateAuditSummaryV2 } from "@/lib/gemini-v2";
import { nanoid } from "nanoid";

export interface ProcessedAuditResultV2 extends AuditResultV2 {
  aiSummary: string;
  publicSlug: string;
  companyName: string;
  companySize?: number;
  industry?: string;
  isPersisted?: boolean;
  dbError?: string;
}

export async function processAuditActionV2(
  data: AuditFormInputV2
): Promise<ProcessedAuditResultV2> {
  // 1. Server-side validation
  const parsed = AuditFormSchemaV2.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.format())}`
    );
  }

  const input = parsed.data;

  // 2. Deterministic audit engine (unchanged — no hallucination)
  const baseResult = runAuditEngine(input);

  // 2b. Dynamic database cohort benchmarking
  const spendPerEmp = baseResult.totalCurrentSpend / (input.companySize || 1);
  const { calculateRealCohortPercentile } = await import("@/lib/benchmarks");
  const groundedBenchmark = await calculateRealCohortPercentile(input.companySize, spendPerEmp);
  baseResult.benchmarkComparison = groundedBenchmark;

  // 3. Revenue enrichment (optional)
  let revenueEnrichment: AuditResultV2["revenueEnrichment"] | undefined;
  if (
    input.revenueContext &&
    typeof input.revenueContext.mrr === "number" &&
    input.revenueContext.mrr > 0
  ) {
    const enriched = enrichWithRevenueContext(
      baseResult.totalCurrentSpend,
      baseResult.totalOptimizedSpend,
      baseResult.recommendations,
      input.revenueContext as RevenueContext,
      input.fundingStage ?? "SEED"
    );
    revenueEnrichment = {
      aiSpendAsMrrPercent: enriched.aiSpendAsMrrPercent,
      optimisedSpendAsMrrPercent: enriched.optimisedSpendAsMrrPercent,
      savingsAsMrrPercent: enriched.savingsAsMrrPercent,
      annualSavingsAsArrPercent: enriched.annualSavingsAsArrPercent,
      burnEfficiencyScore: enriched.burnEfficiencyScore,
      recommendations: enriched.recommendations,
    };
  }

  // 4. Recommendation weighting + re-ranking (optional)
  const weights = input.recommendationWeights ?? DEFAULT_WEIGHTS;
  const maxSavings = Math.max(...baseResult.recommendations.map((r) => r.savings), 0);
  const weightedRecommendations = applyWeightsAndRank(
    baseResult.recommendations,
    weights,
    maxSavings
  );

  // 5. AI summary — pass revenue data if available so Gemini can reference it
  const aiSummary = await generateAuditSummaryV2(
    input.companyName,
    baseResult,
    revenueEnrichment
  );

  // 6. Persist
  const publicSlug = nanoid(10);
  let isPersisted = false;
  let dbError: string | undefined;

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not configured.");
    }
    const { getPrismaClient } = await import("@/lib/prisma");
    const prisma = getPrismaClient();

    await prisma.audit.create({
      data: {
        companyName: input.companyName,
        companySize: input.companySize,
        industry: input.industry,
        totalSpend: baseResult.totalCurrentSpend,
        optimizedSpend: baseResult.totalOptimizedSpend,
        savings: baseResult.monthlySavings,
        aiSummary,
        isPublic: true,
        publicSlug,
        referralCode: input.referralCode,
        tools: {
          create: baseResult.recommendations.map((rec, i) => ({
            toolName: rec.originalTool,
            currentPlan: rec.originalPlan ?? "",
            seats: rec.originalSeats ?? 1,
            monthlySpend: rec.originalMonthlyCost ?? 0,
            type: input.tools[i]?.type || "SEAT",
            useCases: input.tools[i]?.useCases || [],
            suggestedTool: rec.suggestedTool,
            suggestedPlan: rec.suggestedPlan,
            suggestedSpend: rec.suggestedTotalCost,
            reasoning: rec.reasoning,
          })),
        },
      },
    });

    isPersisted = true;
  } catch (err) {
    console.error("[AuditActionV2] DB error:", err);
    dbError = err instanceof Error ? err.message : "Unknown DB error";
  }

  return {
    ...baseResult,
    revenueEnrichment,
    weightedRecommendations,
    aiSummary,
    publicSlug,
    companyName: input.companyName,
    companySize: input.companySize,
    industry: input.industry,
    isPersisted,
    dbError,
  };
}
