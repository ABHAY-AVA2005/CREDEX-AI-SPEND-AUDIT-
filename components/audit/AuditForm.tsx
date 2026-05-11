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

import { AuditFormSchema, AuditFormInput } from "@/schemas/audit";
import { KNOWN_TOOLS } from "@/core/audit-engine/knowledge";
import { useRouter } from "next/navigation";
import { processAuditAction } from "@/app/actions/audit";

// We store the draft in localStorage so founders don't lose their 
// progress if they accidentally close the tab while looking up pricing.
const FORM_STORAGE_KEY = "ai_spend_audit_draft";

export default function AuditForm() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Standard form setup with Zod validation
  const form = useForm<AuditFormInput>({
    resolver: zodResolver(AuditFormSchema),
    defaultValues: {
      companyName: "",
      companySize: 10,
      industry: "",
      tools: [{ toolName: "", currentPlan: "", seats: 1, monthlySpend: 0, useCases: [] }],
    },
  });

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
      // Hit our server action to process the audit
      const results = await processAuditAction(data);
      
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
    <div className="bg-card border border-border shadow-lg rounded-xl p-6 md:p-10">
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
            <h2 className="text-2xl font-serif font-black tracking-tight text-foreground">1. Company Profile</h2>
            <p className="text-muted-foreground text-sm">Basic details about your organization.</p>
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
              {form.formState.errors.companyName && (
                <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="companySize" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Team Size</label>
              <input
                id="companySize"
                type="number"
                required
                {...form.register("companySize", { valueAsNumber: true })}
                className="w-full p-4 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:bg-background transition-all"
              />
              {form.formState.errors.companySize && (
                <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.companySize.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="industry" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Industry (Optional)</label>
              <input
                id="industry"
                type="text"
                {...form.register("industry")}
                placeholder="e.g. SaaS, Fintech"
                className="w-full p-4 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:bg-background transition-all"
              />
            </div>
          </div>
        </section>

        {/* ── Section 2: AI Stack ── */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-black tracking-tight text-foreground">2. AI & SaaS Stack</h2>
              <p className="text-muted-foreground text-sm">Add the tools your team uses daily.</p>
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
                {/* Individual Tool Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black bg-foreground text-background px-2 py-0.5 rounded uppercase tracking-widest">Tool #{index + 1}</span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-destructive hover:opacity-80 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`toolName-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Select Tool</label>
                    <select
                      id={`toolName-${index}`}
                      required
                      {...form.register(`tools.${index}.toolName`)}
                      className="w-full p-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="">Select a tool...</option>
                      {uniqueTools.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {form.formState.errors.tools?.[index]?.toolName && (
                      <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.tools[index]?.toolName?.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`currentPlan-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Plan</label>
                    <select
                      id={`currentPlan-${index}`}
                      required
                      {...form.register(`tools.${index}.currentPlan`)}
                      className="w-full p-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="">Select a plan...</option>
                      {KNOWN_TOOLS
                        .filter(t => t.name === form.watch(`tools.${index}.toolName`))
                        .map(t => (
                          <option key={t.plan} value={t.plan}>{t.plan} — ${t.costPerSeat}/seat</option>
                        ))}
                    </select>
                    {form.formState.errors.tools?.[index]?.currentPlan && (
                      <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.tools[index]?.currentPlan?.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`seats-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Seats / Users</label>
                    <input
                      id={`seats-${index}`}
                      type="number"
                      required
                      {...form.register(`tools.${index}.seats`, { valueAsNumber: true })}
                      className="w-full p-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {form.formState.errors.tools?.[index]?.seats && (
                      <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.tools[index]?.seats?.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`monthlySpend-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Monthly Bill ($)</label>
                    <input
                      id={`monthlySpend-${index}`}
                      type="number"
                      required
                      {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      className="w-full p-3.5 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {form.formState.errors.tools?.[index]?.monthlySpend && (
                      <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.tools[index]?.monthlySpend?.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor={`useCases-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Use Cases</label>
                    <input
                      id={`useCases-${index}`}
                      required
                      onChange={(e) => {
                        // Turning the comma-separated string back into an array for the schema
                        const val = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        form.setValue(`tools.${index}.useCases`, val);
                      }}
                      defaultValue={form.getValues(`tools.${index}.useCases`).join(", ")}
                      placeholder="e.g. Coding, Chat, Design"
                      className="w-full p-3.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {form.formState.errors.tools?.[index]?.useCases && (
                      <p className="text-red-500 text-xs mt-2 font-medium">{form.formState.errors.tools[index]?.useCases?.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ toolName: "", currentPlan: "", seats: 1, monthlySpend: 0, useCases: [] })}
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
            className="group relative flex items-center justify-center min-w-[320px] px-10 py-5 bg-accent text-accent-foreground rounded-2xl font-black text-lg hover:opacity-90 active:scale-95 transition-all shadow-2xl shadow-accent/20 disabled:opacity-50 overflow-hidden"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                {/* Loading spinner for that premium feel */}
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8z"/>
                </svg>
                Analyzing Stack...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Generate Full Audit <CheckCircle2 className="w-6 h-6" />
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
