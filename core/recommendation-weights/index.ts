/**
 * recommendation-weights/index.ts
 * Feature: User-Configurable Recommendation Weights
 *
 * The AI strategist asked: "letting users tweak how the recommendations
 * are weighted." This is the engine for that.
 *
 * Instead of always sorting by raw dollar savings, we let the user
 * dial in what they care about most. The weights are applied to a
 * composite score per recommendation.
 *
 * Weights sum to 1.0 via normalisation — the user can't break the math.
 */

export interface RecommendationWeights {
  /**
   * How much raw dollar savings matters (0–10).
   * High = "I want the biggest cut first."
   */
  costSavings: number;
  /**
   * How much migration risk matters — lower risk = higher score (0–10).
   * High = "Don't suggest anything that will break my team's workflow."
   */
  lowMigrationRisk: number;
  /**
   * How much capability gain matters (0–10).
   * High = "I want tools that do MORE, not just cost less."
   */
  capabilityGain: number;
  /**
   * How much team velocity impact matters (0–10).
   * High = "Anything that slows engineers down is not worth it."
   */
  teamVelocityImpact: number;
}

/**
 * Default weights — balanced, sensible for most early-stage startups.
 */
export const DEFAULT_WEIGHTS: RecommendationWeights = {
  costSavings: 6,
  lowMigrationRisk: 4,
  capabilityGain: 3,
  teamVelocityImpact: 5,
};

/**
 * Preset weight profiles — surfaces as quick-select chips in the UI.
 */
export const WEIGHT_PRESETS: Record<string, RecommendationWeights & { label: string; description: string }> = {
  DEFAULT: {
    label: "Balanced",
    description: "Savings + stability. Best for most teams.",
    costSavings: 6,
    lowMigrationRisk: 4,
    capabilityGain: 3,
    teamVelocityImpact: 5,
  },
  CASH_TIGHT: {
    label: "Maximise savings",
    description: "Pure cost recovery. Runway is critical.",
    costSavings: 10,
    lowMigrationRisk: 2,
    capabilityGain: 1,
    teamVelocityImpact: 3,
  },
  GROWTH_FIRST: {
    label: "Capability first",
    description: "Upgrade the stack without hurting velocity.",
    costSavings: 2,
    lowMigrationRisk: 5,
    capabilityGain: 10,
    teamVelocityImpact: 8,
  },
  STABLE_TEAM: {
    label: "Protect team flow",
    description: "Zero disruption. Migrate gradually.",
    costSavings: 4,
    lowMigrationRisk: 9,
    capabilityGain: 2,
    teamVelocityImpact: 10,
  },
};

export interface ScoredRecommendation<T extends { action: string; savings: number; reasoning: string }> {
  recommendation: T;
  compositeScore: number;
  scoreBreakdown: {
    costSavingsScore: number;
    migrationRiskScore: number;
    capabilityGainScore: number;
    velocityScore: number;
  };
}

/**
 * Applies user-defined weights to a set of recommendations and returns
 * them sorted by composite score (highest first).
 *
 * Each dimension is scored 0–10 heuristically from the recommendation data.
 * The composite = weighted sum, normalised to 0–10.
 */
export function applyWeightsAndRank<
  T extends { action: string; savings: number; reasoning: string }
>(
  recommendations: T[],
  weights: RecommendationWeights,
  maxSavings: number
): ScoredRecommendation<T>[] {
  const totalWeight =
    weights.costSavings +
    weights.lowMigrationRisk +
    weights.capabilityGain +
    weights.teamVelocityImpact;

  if (totalWeight === 0) return recommendations.map(r => ({
    recommendation: r,
    compositeScore: 0,
    scoreBreakdown: { costSavingsScore: 0, migrationRiskScore: 0, capabilityGainScore: 0, velocityScore: 0 }
  }));

  const scored = recommendations.map((rec) => {
    // 1. Cost savings score: linear scale against the highest saver in the batch
    const costSavingsScore = maxSavings > 0 ? (rec.savings / maxSavings) * 10 : 0;

    // 2. Migration risk score: CONSOLIDATE < DOWNGRADE < REPLACE < KEEP
    const migrationRiskScore = deriveMigrationRisk(rec.action);

    // 3. Capability gain score: REPLACE to something better = high, CONSOLIDATE = medium
    const capabilityGainScore = deriveCapabilityGain(rec.action, rec.reasoning);

    // 4. Velocity score: KEEP = no disruption = max score; REPLACE = more risk
    const velocityScore = deriveVelocityScore(rec.action);

    const composite =
      (costSavingsScore * weights.costSavings +
        migrationRiskScore * weights.lowMigrationRisk +
        capabilityGainScore * weights.capabilityGain +
        velocityScore * weights.teamVelocityImpact) /
      totalWeight;

    return {
      recommendation: rec,
      compositeScore: parseFloat(composite.toFixed(2)),
      scoreBreakdown: {
        costSavingsScore: parseFloat(costSavingsScore.toFixed(2)),
        migrationRiskScore: parseFloat(migrationRiskScore.toFixed(2)),
        capabilityGainScore: parseFloat(capabilityGainScore.toFixed(2)),
        velocityScore: parseFloat(velocityScore.toFixed(2)),
      },
    };
  });

  return scored.sort((a, b) => b.compositeScore - a.compositeScore);
}

function deriveMigrationRisk(action: string): number {
  switch (action) {
    case "KEEP": return 10;
    case "DOWNGRADE": return 8;
    case "CONSOLIDATE": return 5;
    case "REPLACE": return 3;
    default: return 5;
  }
}

function deriveCapabilityGain(action: string, reasoning: string): number {
  if (action === "REPLACE") {
    // If the reasoning mentions capability gains, score higher
    const reasoningLower = reasoning.toLowerCase();
    if (
      reasoningLower.includes("better") ||
      reasoningLower.includes("gold standard") ||
      reasoningLower.includes("native") ||
      reasoningLower.includes("includes")
    ) {
      return 8;
    }
    return 5;
  }
  if (action === "CONSOLIDATE") return 4;
  if (action === "DOWNGRADE") return 2;
  return 1; // KEEP = no gain
}

function deriveVelocityScore(action: string): number {
  switch (action) {
    case "KEEP": return 10;
    case "DOWNGRADE": return 7;
    case "CONSOLIDATE": return 5;
    case "REPLACE": return 3;
    default: return 5;
  }
}
