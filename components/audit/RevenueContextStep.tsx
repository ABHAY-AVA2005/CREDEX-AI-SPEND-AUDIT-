"use client";

/**
 * components/audit/RevenueContextStep.tsx
 * Feature: Optional revenue data entry step in the audit form.
 *
 * Design decision: this is a COLLAPSIBLE section with a clear "optional" label.
 * We surface the value prop ("unlock ROI scoring") before asking for data.
 * Users who skip it get the same savings-only view as before.
 *
 * Wire into AuditForm.tsx:
 *   1. Add RevenueContextSchema fields to your form defaultValues
 *   2. Render <RevenueContextStep form={form} /> below the tools section
 *   3. Pass revenueContext to processAuditActionV2 in onSubmit
 */

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ChevronDown, TrendingUp, Info } from "lucide-react";
import { AuditFormInputV2 } from "@/schemas/audit-v2";

interface Props {
  form: UseFormReturn<AuditFormInputV2>;
}

export default function RevenueContextStep({ form }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const mrr = watch("revenueContext.mrr");

  return (
    <div className="border border-border/40 rounded-2xl overflow-hidden">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">
              Revenue Context{" "}
              <span className="text-[10px] font-normal text-muted-foreground ml-1 uppercase tracking-widest">
                Optional
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Unlock ROI scoring — see savings as % of MRR/ARR
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-5 pb-6 space-y-4 border-t border-border/30">
          <div className="flex items-start gap-2 mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Providing MRR and ARR lets us show your AI spend as a percentage
              of revenue — the metric CFOs actually care about. We never store
              or share your revenue data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MRR */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Monthly Recurring Revenue (MRR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 50000"
                  {...register("revenueContext.mrr", { valueAsNumber: true })}
                  className="w-full pl-7 pr-3 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
              {errors.revenueContext?.mrr && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.revenueContext.mrr.message}
                </p>
              )}
            </div>

            {/* ARR — auto-populated if MRR is entered */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Annual Recurring Revenue (ARR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder={
                    mrr && mrr > 0
                      ? `Auto: $${(mrr * 12).toLocaleString()}`
                      : "e.g. 600000"
                  }
                  {...register("revenueContext.arr", { valueAsNumber: true })}
                  className="w-full pl-7 pr-3 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
              {errors.revenueContext?.arr && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.revenueContext.arr.message}
                </p>
              )}
            </div>

            {/* Growth rate */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                MoM Growth Rate (%)
              </label>
              <input
                type="number"
                min={-100}
                max={1000}
                step={0.1}
                placeholder="e.g. 15"
                {...register("revenueContext.growthRateMoM", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : v / 100),
                })}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Runway */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Runway (months)
              </label>
              <input
                type="number"
                min={0}
                max={120}
                placeholder="e.g. 18"
                {...register("revenueContext.runwayMonths", {
                  valueAsNumber: true,
                })}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
