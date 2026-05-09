"use client"

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

import { AuditFormSchema, AuditFormInput } from "@/schemas/audit";
import { KNOWN_TOOLS } from "@/core/audit-engine/knowledge";
import { useRouter } from "next/navigation";
import { processAuditAction } from "@/app/actions/audit";

const FORM_STORAGE_KEY = "ai_spend_audit_draft";

export default function AuditForm() {
  const [step, setStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<AuditFormInput>({
    resolver: zodResolver(AuditFormSchema),
    defaultValues: {
      companyName: "",
      companySize: 10,
      industry: "",
      tools: [{ toolName: "", currentPlan: "", seats: 1, monthlySpend: 0, useCases: [] }],
    },
  });

  const uniqueTools = Array.from(new Set(KNOWN_TOOLS.map(t => t.name)));

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to parse saved form draft", e);
      }
    }
  }, [form]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isClient) return;
    const subscription = form.watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, isClient]);

  const [honeypot, setHoneypot] = useState("");

  const onSubmit = async (data: AuditFormInput) => {
    if (honeypot) { 
      // Silently mock success for bots
      router.push('/dashboard');
      return; 
    }
    setIsSubmitting(true);
    try {
      const results = await processAuditAction(data);
      sessionStorage.setItem("latest_audit_result", JSON.stringify(results));
      
      // Clear the saved form draft after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      alert("Something went wrong analyzing your stack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-6 md:p-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Honeypot for bot protection */}
        <input type="text" name="b_name" style={{display: 'none'}} value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= i
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
              </div>
              {i < 3 && (
                <div className={`h-0.5 w-16 sm:w-28 mx-2 transition-colors ${step > i ? 'bg-slate-900' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Company Info (NO email) ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-bold mb-1 text-slate-900">Company Details</h2>
                <p className="text-slate-500 text-sm mb-6">No account needed. We'll show your results instantly.</p>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    {...form.register("companyName")}
                    placeholder="e.g. Acme Corp"
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Team Size (People)</label>
                  <input
                    type="number"
                    {...form.register("companySize", { valueAsNumber: true })}
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.formState.errors.companySize && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.companySize.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Industry <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    {...form.register("industry")}
                    placeholder="e.g. SaaS, E-commerce, Fintech"
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next: Add Tools <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: AI Stack ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-1 text-slate-900">Your AI Stack</h2>
                <p className="text-slate-500 text-sm mb-6">Add every AI tool your team pays for. Be as accurate as possible.</p>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="p-5 border border-slate-200 rounded-xl relative bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tool #{index + 1}</span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Tool Name</label>
                      <select
                        {...form.register(`tools.${index}.toolName`)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a tool...</option>
                        {uniqueTools.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {form.formState.errors.tools?.[index]?.toolName && (
                        <p className="text-red-500 text-xs mt-1">{form.formState.errors.tools[index]?.toolName?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Current Plan</label>
                      <select
                        {...form.register(`tools.${index}.currentPlan`)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a plan...</option>
                        {KNOWN_TOOLS
                          .filter(t => t.name === form.watch(`tools.${index}.toolName`))
                          .map(t => (
                            <option key={t.plan} value={t.plan}>{t.plan} — ${t.costPerSeat}/seat</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Seats / Licenses</label>
                      <input
                        type="number"
                        {...form.register(`tools.${index}.seats`, { valueAsNumber: true })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Total Monthly Spend ($)</label>
                      <input
                        type="number"
                        {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Use Cases <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                      <input
                        onChange={(e) => {
                          const val = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          form.setValue(`tools.${index}.useCases`, val);
                        }}
                        defaultValue={form.getValues(`tools.${index}.useCases`).join(", ")}
                        placeholder="e.g. Coding, Copywriting, General Chat"
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ toolName: "", currentPlan: "", seats: 1, monthlySpend: 0, useCases: [] })}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-500 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Another Tool
              </button>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Review & Analyze <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Confirm & Run ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="space-y-6 text-center py-8"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Ready to Analyze!</h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg">
                We'll audit your <strong className="text-slate-900">${form.watch("tools").reduce((acc, t) => acc + (t.monthlySpend || 0), 0).toLocaleString()}/mo</strong> AI stack and surface every cost-saving opportunity instantly.
              </p>
              <p className="text-slate-400 text-sm">No account required. Results shown immediately.</p>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Edit Stack
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Analyzing...
                    </span>
                  ) : "Generate Free Audit Report"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>
    </div>
  );
}
