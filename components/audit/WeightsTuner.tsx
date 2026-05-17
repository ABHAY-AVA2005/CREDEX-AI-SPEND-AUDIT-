"use client";

/**
 * components/audit/WeightsTuner.tsx
 * Feature: User-configurable recommendation weights.
 *
 * Surfaces as a card in the results view (not the form).
 * User adjusts 4 sliders → recommendations re-rank live in the UI.
 * No server round-trip needed — all math runs client-side via
 * the applyWeightsAndRank function imported from core.
 *
 * Wire into ResultsClient.tsx:
 *   1. Import <WeightsTuner> and render it above the recommendations list
 *   2. Pass onWeightsChange callback to re-sort the displayed recs
 */

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  RecommendationWeights,
  WEIGHT_PRESETS,
  DEFAULT_WEIGHTS,
} from "@/core/recommendation-weights";

interface Props {
  onWeightsChange: (weights: RecommendationWeights) => void;
}

const SLIDER_CONFIG: Array<{
  key: keyof RecommendationWeights;
  label: string;
  description: string;
}> = [
  {
    key: "costSavings",
    label: "Cost savings",
    description: "Prioritise the biggest dollar recoveries",
  },
  {
    key: "lowMigrationRisk",
    label: "Migration safety",
    description: "Avoid disrupting existing workflows",
  },
  {
    key: "capabilityGain",
    label: "Capability upgrade",
    description: "Prefer switches that improve your stack",
  },
  {
    key: "teamVelocityImpact",
    label: "Team velocity",
    description: "Protect engineering throughput",
  },
];

export default function WeightsTuner({ onWeightsChange }: Props) {
  const [weights, setWeights] = useState<RecommendationWeights>(DEFAULT_WEIGHTS);
  const [activePreset, setActivePreset] = useState<string>("DEFAULT");

  const handleSlider = (key: keyof RecommendationWeights, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    setActivePreset("CUSTOM");
    onWeightsChange(updated);
  };

  const applyPreset = (presetKey: string) => {
    const preset = WEIGHT_PRESETS[presetKey];
    if (!preset) return;
    const w: RecommendationWeights = {
      costSavings: preset.costSavings,
      lowMigrationRisk: preset.lowMigrationRisk,
      capabilityGain: preset.capabilityGain,
      teamVelocityImpact: preset.teamVelocityImpact,
    };
    setWeights(w);
    setActivePreset(presetKey);
    onWeightsChange(w);
  };

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Tune recommendations</p>
          <p className="text-xs text-muted-foreground">
            Drag sliders to re-rank by what matters to you
          </p>
        </div>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(WEIGHT_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => applyPreset(key)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
              activePreset === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/40"
            }`}
          >
            {preset.label}
          </button>
        ))}
        {activePreset === "CUSTOM" && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/30">
            Custom
          </span>
        )}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {SLIDER_CONFIG.map(({ key, label, description }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground">{label}</span>
                <span className="ml-2 text-[10px] text-muted-foreground">{description}</span>
              </div>
              <span className="text-xs font-black text-primary tabular-nums w-6 text-right">
                {weights[key]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={weights[key]}
              onChange={(e) => handleSlider(key, parseInt(e.target.value, 10))}
              className="w-full accent-primary h-1 rounded-full"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground/50">
              <span>Off</span>
              <span>Max</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
