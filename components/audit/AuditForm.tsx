"use client"

/**
 * AuditForm.tsx
 * The high-conversion, single-page audit form.
 * Built with react-hook-form and zod for that crisp validation.
 */

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

import { AuditFormSchema, AuditFormInput, AuditToolInput } from "@/schemas/audit";
import { KNOWN_TOOLS } from "@/core/audit-engine/knowledge";
import { useRouter, useSearchParams } from "next/navigation";
import { processAuditAction } from "@/app/actions/audit";

// We store the draft in localStorage so founders don't lose their 
// progress if they accidentally close the tab while looking up pricing.
const FORM_STORAGE_KEY = "ai_spend_audit_draft";

export default function AuditForm() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  // Standard form setup with Zod validation
  const form = useForm<AuditFormInput>({
    resolver: zodResolver(AuditFormSchema),
    defaultValues: {
      companyName: "",
      companySize: 10,
      industry: "",
      fundingStage: "SEED",
      tools: [{ toolName: "", currentPlan: "", seats: 1, tokens: 0, monthlySpend: 0, type: "SEAT", useCases: [] }],
    },
  } as any);

  // Extracting unique tool names for the dropdown
  const uniqueTools = Array.from(new Set(KNOWN_TOOLS.map(t => t.name)));

  // Field arrays handle the dynamic tool list (Add/Remove)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Load from localStorage on mount. 
  // We use isClient to avoid hydration mismatch in Next.js.
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        // If it's corrupted, just let it be.
        console.error("Soft-fail: Failed to parse saved form draft", e);
      }
    }
  }, [form]);

  // Save to localStorage every time the user types. 
  // Safety first!
  useEffect(() => {
    if (!isClient) return;
    const subscription = form.watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, isClient]);

  // Anti-spam honeypot. Keep it simple and effective.
  const [honeypot, setHoneypot] = useState("");

  const onSubmit = async (data: AuditFormInput) => {
    if (honeypot) { 
      // Silently redirect bots to the dashboard without hitting the engine
      router.push('/dashboard');
      return; 
    }

    setIsSubmitting(true);
    try {
      if (referralCode) {
        sessionStorage.setItem("referral_code", referralCode);
      }
      // Hit our server action to process the audit
      const results = await processAuditAction({
        ...data,
        referralCode: referralCode || undefined
      });
      
      // We store the result in sessionStorage for immediate dashboard viewing
      sessionStorage.setItem("latest_audit_result", JSON.stringify(results));
      
      // Cleanup the draft once it's submitted
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      // Off to the dashboard!
      router.push('/dashboard');
    } catch (e: unknown) {
      console.error("Audit submission failed:", e);
      const message = e instanceof Error ? e.message : "Something went wrong analyzing your stack. Please try again.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border shadow-lg rounded-xl p-6 md:p-10">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        
        {/* Honeypot for bot protection — hidden from humans */}
        <input 
          type="text" 
          name="b_name" 
          style={{display: 'none'}} 
          value={honeypot} 
          onChange={e => setHoneypot(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off" 
        />

        {/* ── Section 1: Company Profile ── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-stylish font-black tracking-tight text-foreground">1. Company Profile</h2>
            <p className="text-muted-foreground text-sm">Basic details for accurate benchmarking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="companyName" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Company Name</label>
              <input
                id="companyName"
                type="text"
                required
                {...form.register("companyName")}
                placeholder="e.g. Acme Corp"
                className="w-full p-4 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:bg-background transition-all"
              />
            </div>

            <div>
              <label htmlFor="companySize" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Employees</label>
              <input
                id="companySize"
                type="number"
                required
                {...form.register("companySize", { valueAsNumber: true })}
                className="w-full p-4 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:bg-background transition-all"
              />
            </div>

            <div>
              <label htmlFor="fundingStage" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Funding Stage</label>
              <select
                id="fundingStage"
                required
                {...form.register("fundingStage")}
                className="w-full p-4 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
              >
                <option value="PRE_SEED">Pre-Seed</option>
                <option value="SEED">Seed</option>
                <option value="SERIES_A">Series A</option>
                <option value="SERIES_B">Series B</option>
                <option value="LATE_STAGE">Late Stage / Public</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── Section 2: AI Stack ── */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-stylish font-black tracking-tight text-foreground">2. AI & SaaS Stack</h2>
              <p className="text-muted-foreground text-sm">Add your tools. Distinguish between per-seat subs and API usage.</p>
            </div>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-2 border-border rounded-2xl relative bg-card shadow-sm hover:border-accent/30 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black bg-foreground text-background px-2 py-0.5 rounded uppercase tracking-widest">Tool #{index + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-destructive hover:opacity-80 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Tool Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => form.setValue(`tools.${index}.type`, "SEAT")}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border-2 transition-all ${form.watch(`tools.${index}.type`) === "SEAT" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
                      >
                        Per-Seat Sub
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue(`tools.${index}.type`, "API")}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border-2 transition-all ${form.watch(`tools.${index}.type`) === "API" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
                      >
                        API / Usage
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`toolName-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Select Tool</label>
                    <select
                      id={`toolName-${index}`}
                      required
                      {...form.register(`tools.${index}.toolName`, {
                        onChange: (e) => {
                          const val = e.target.value;
                          if (val.toLowerCase().includes("api")) {
                            form.setValue(`tools.${index}.type`, "API");
                          } else {
                            form.setValue(`tools.${index}.type`, "SEAT");
                          }
                        }
                      })}
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="">Select tool...</option>
                      {uniqueTools.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`currentPlan-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Plan</label>
                    <input
                      id={`currentPlan-${index}`}
                      type="text"
                      {...form.register(`tools.${index}.currentPlan`)}
                      placeholder="e.g. Pro, Team, Enterprise"
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`seats-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Seats</label>
                      <input
                        id={`seats-${index}`}
                        type="number"
                        disabled={form.watch(`tools.${index}.type`) === "API"}
                        {...form.register(`tools.${index}.seats`, { valueAsNumber: true })}
                        className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label htmlFor={`tokens-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Est. Tokens/Mo (k)</label>
                      <input
                        id={`tokens-${index}`}
                        type="number"
                        disabled={form.watch(`tools.${index}.type`) !== "API"}
                        {...form.register(`tools.${index}.tokens`, { valueAsNumber: true })}
                        placeholder="e.g. 500"
                        className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`monthlySpend-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Monthly Bill ($)</label>
                    <input
                      id={`monthlySpend-${index}`}
                      type="number"
                      {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor={`useCases-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Primary Use Case</label>
                    <input
                      id={`useCases-${index}`}
                      required
                      placeholder="e.g. Coding, Content, API"
                      onChange={(e) => {
                        const val = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        form.setValue(`tools.${index}.useCases`, val);
                      }}
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>


          <button
            type="button"
            onClick={() => append({ toolName: "", currentPlan: "", seats: 1, tokens: 0, monthlySpend: 0, type: "SEAT", useCases: [] } as AuditToolInput)}
            className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-secondary transition-all text-sm font-bold uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Tool to Stack
          </button>
        </section>

        {/* ── Footer / Submit ── */}
        <section className="pt-8 border-t border-border flex flex-col items-center gap-6">
          <div className="text-center">
             <p className="text-muted-foreground text-sm mb-1">Results are deterministic and based on real 2026 pricing.</p>
             <p className="text-muted-foreground/60 text-[10px] uppercase font-bold tracking-widest">Instant Analysis • No Signup Required</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex items-center justify-center w-full max-w-[400px] px-8 py-4 md:px-10 md:py-5 bg-accent text-accent-foreground rounded-2xl font-black text-lg hover:opacity-90 active:scale-95 transition-all shadow-2xl shadow-accent/20 disabled:opacity-50 overflow-hidden"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3 text-sm md:text-lg">
                {/* Loading spinner for that premium feel */}
                <svg className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8z"/>
                </svg>
                Analyzing Stack...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm md:text-lg">
                Generate Full Audit <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              </span>
            )}
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </section>
      </form>
    </div>
  );
}
