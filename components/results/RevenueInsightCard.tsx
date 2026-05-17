"use client";

/**
 * components/results/RevenueInsightCard.tsx
 * Displays the revenue-enriched ROI metrics on the results page.
 *
 * Only rendered when revenueEnrichment is present on the result.
 * Designed to slot in above the recommendation cards in ResultsClient.tsx.
 *
 * Wire into ResultsClient.tsx:
 *   {result.revenueEnrichment && (
 *     <RevenueInsightCard enrichment={result.revenueEnrichment} />
 *   )}
 */

import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";
import type { AuditResultV2 } from "@/schemas/audit-v2";

interface Props {
  enrichment: NonNullable<AuditResultV2["revenueEnrichment"]>;
}

export default function RevenueInsightCard({ enrichment }: Props) {
  const {
    aiSpendAsMrrPercent,
    optimisedSpendAsMrrPercent,
    savingsAsMrrPercent,
    annualSavingsAsArrPercent,
    burnEfficiencyScore,
  } = enrichment;

  const efficiencyLabel =
    burnEfficiencyScore < 0.8
      ? { label: "Efficient", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" }
      : burnEfficiencyScore < 1.2
      ? { label: "At median", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" }
      : { label: "Overspending", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };

  const metrics = [
    {
      icon: TrendingUp,
      label: "Current AI / MRR",
      value: `${aiSpendAsMrrPercent}%`,
      sub: "of monthly revenue",
      accent: burnEfficiencyScore > 1.2 ? "text-red-400" : "text-foreground",
    },
    {
      icon: TrendingDown,
      label: "After optimisation",
      value: `${optimisedSpendAsMrrPercent}%`,
      sub: "of monthly revenue",
      accent: "text-primary",
    },
    {
      icon: Activity,
      label: "Savings / MRR",
      value: `${savingsAsMrrPercent}%`,
      sub: `${annualSavingsAsArrPercent}% of ARR/yr`,
      accent: "text-primary",
    },
  ];

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.05 }}
      className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Revenue Impact
          </p>
          <h3 className="text-lg font-black text-foreground">
            AI Spend as % of Revenue
          </h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${efficiencyLabel.bg} ${efficiencyLabel.color}`}
        >
          {efficiencyLabel.label}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map(({ icon: Icon, label, value, sub, accent }) => (
          <div
            key={label}
            className="bg-secondary/40 rounded-xl p-4 space-y-1"
          >
            <Icon className="w-4 h-4 text-muted-foreground" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className={`text-2xl font-black ${accent}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground">
          Burn efficiency score vs industry median:{" "}
          <span className={`font-black ${efficiencyLabel.color}`}>
            {burnEfficiencyScore}×
          </span>{" "}
          · 1.0 = exactly at median
        </p>
      </div>
    </motion.div>
  );
}
