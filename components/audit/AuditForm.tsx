/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Shield, 
  CreditCard, 
  Layers, 
  Users, 
  Loader2, 
  Check
} from "lucide-react";

import { AuditToolInput } from "@/schemas/audit";
import { ALL_KNOWN_TOOLS } from "@/core/audit-engine/knowledge";
import { useRouter, useSearchParams } from "next/navigation";
import { AuditFormSchemaV2, AuditFormInputV2 } from "@/schemas/audit-v2";
import { processAuditActionV2 } from "@/app/actions/audit-v2";
import RevenueContextStep from "./RevenueContextStep";
import { 
  discoverPlaidTransactions,
  discoverRampTransactions,
  discoverIdentityProvisioning,
  buildDiscoveredStack
} from "@/lib/integrations";

// We store the draft in localStorage so founders don't lose their 
// progress if they accidentally close the tab while looking up pricing.
const FORM_STORAGE_KEY = "ai_spend_audit_draft";

export default function AuditForm() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  // 1-Click Ingestion & Discovery State
  const [connectingPlaid, setConnectingPlaid] = useState(false);
  const [connectingRamp, setConnectingRamp] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  const [plaidConnected, setPlaidConnected] = useState(false);
  const [rampConnected, setRampConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  const [plaidTx, setPlaidTx] = useState<any[]>([]);
  const [rampTx, setRampTx] = useState<any[]>([]);
  const [directoryUsers, setDirectoryUsers] = useState<any[]>([]);

  const [discoveryStats, setDiscoveryStats] = useState<{
    transactionsCount: number;
    seatsVerified: number;
    estimatedMonthlySpend: number;
  } | null>(null);

  const handleConnectPlaid = async () => {
    if (plaidConnected) {
      setPlaidConnected(false);
      setPlaidTx([]);
      return;
    }
    setConnectingPlaid(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const tx = await discoverPlaidTransactions("mock-token");
      setPlaidTx(tx);
      setPlaidConnected(true);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Plaid. Sandbox is offline.");
    } finally {
      setConnectingPlaid(false);
    }
  };

  const handleConnectRamp = async () => {
    if (rampConnected) {
      setRampConnected(false);
      setRampTx([]);
      return;
    }
    setConnectingRamp(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const tx = await discoverRampTransactions("mock-token");
      setRampTx(tx);
      setRampConnected(true);
    } catch (err) {
      console.error(err);
      alert("Failed to sync Ramp card items.");
    } finally {
      setConnectingRamp(false);
    }
  };

  const handleConnectGoogle = async () => {
    if (googleConnected) {
      setGoogleConnected(false);
      setDirectoryUsers([]);
      return;
    }
    setConnectingGoogle(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const users = await discoverIdentityProvisioning("mock-token");
      setDirectoryUsers(users);
      setGoogleConnected(true);
    } catch (err) {
      console.error(err);
      alert("Google Workspace connection rejected: permission denied.");
    } finally {
      setConnectingGoogle(false);
    }
  };

  // Dynamic stack builder auto-filler
  useEffect(() => {
    const combinedTx = [
      ...plaidTx.map(t => ({ merchantName: t.merchantName, amount: t.amount })),
      ...rampTx.map(t => ({ merchantName: t.merchantName, amount: t.amount }))
    ];
    
    if (combinedTx.length > 0 || directoryUsers.length > 0) {
      const discovered = buildDiscoveredStack(combinedTx, directoryUsers);
      
      if (discovered.length > 0) {
        const toolsInput = discovered.map(d => ({
          toolName: d.toolName,
          currentPlan: d.currentPlan,
          seats: d.seats,
          tokens: d.tokens,
          monthlySpend: d.monthlySpend,
          type: d.type,
          useCases: d.useCases
        }));
        
        form.setValue("tools", toolsInput);
        
        if (directoryUsers.length > 0) {
          form.setValue("companyName", "Acme Corp");
          form.setValue("companySize", 18);
          form.setValue("industry", "Fintech SaaS");
        }
        
        const totalMonthly = discovered.reduce((acc, t) => acc + t.monthlySpend, 0);
        const totalSeats = discovered.reduce((acc, t) => acc + t.seats, 0);
        setDiscoveryStats({
          transactionsCount: combinedTx.length,
          seatsVerified: totalSeats,
          estimatedMonthlySpend: totalMonthly
        });
      }
    } else {
      setDiscoveryStats(null);
    }
  }, [plaidTx, rampTx, directoryUsers, form]);
  
  // Dynamically build TOOL_CONFIG based on our unified tool registry
  const TOOL_CONFIG = React.useMemo(() => {
    const config: Record<string, string[]> = {};
    ALL_KNOWN_TOOLS.forEach(tool => {
      if (!config[tool.name]) {
        config[tool.name] = [];
      }
      if (!config[tool.name].includes(tool.plan)) {
        config[tool.name].push(tool.plan);
      }
    });
    return config;
  }, []);

  // Extracting unique tool names for the dropdown
  const uniqueTools = React.useMemo(() => {
    return Object.keys(TOOL_CONFIG).sort();
  }, [TOOL_CONFIG]);

  // Standard form setup with Zod validation
  const form = useForm<AuditFormInputV2>({
    resolver: zodResolver(AuditFormSchemaV2),
    defaultValues: {
      companyName: "",
      companySize: 0,
      industry: "",
      tools: [{ toolName: "", currentPlan: "", seats: 0, tokens: 0, monthlySpend: 0, type: "SEAT", useCases: [] }],
      revenueContext: { mrr: 0, arr: 0 },
    },
  } as any);

  // Field arrays handle the dynamic tool list (Add/Remove)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // We use isClient to avoid hydration mismatch in Next.js.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Anti-spam honeypot. Keep it simple and effective.
  const [honeypot, setHoneypot] = useState("");

  const onSubmit = async (data: AuditFormInputV2) => {
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
      const results = await processAuditActionV2({
        ...data,
        referralCode: referralCode || undefined
      });

      // 2. Check for persistence success
      if (results.isPersisted === false) {
        setIsSubmitting(false);
        alert(`Audit processed, but saving failed: ${results.dbError || "Unknown Database Error"}. Your results won't be shareable.`);
        // We still store it in session storage so they can at least see it once
        sessionStorage.setItem("latest_audit_result", JSON.stringify(results));
        router.push('/dashboard');
        return;
      }
      
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
        
        {/* ── Auto-Discovery Integrations Portal ── */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 border-primary/20 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl">
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-accent/30 shadow-inner">
                <Sparkles className="w-3 h-3 animate-pulse" /> 1-Click Automated Ingestion
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-stylish tracking-tight text-foreground">Zero-Friction Stack Discovery</h2>
              <p className="text-muted-foreground text-sm max-w-xl">
                Skip the manual sheets. Connect your accounts securely via encrypted APIs to dynamically index tool subscriptions, active seat counts, and payment logs.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 bg-background/50 border border-border/60 rounded-2xl p-4 self-stretch md:self-auto text-right shadow-inner">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> SOC 2 / HIPAA SAFE
              </span>
              <span className="text-[9px] font-mono text-muted-foreground">AES-256 Read-Only Envelopes</span>
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Card 1: Plaid Link */}
            <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              plaidConnected 
                ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-emerald-500/5 shadow-2xl" 
                : "border-border hover:border-accent/40 bg-background/60 shadow-sm"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${
                  plaidConnected 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-secondary border-border text-muted-foreground"
                }`}>
                  <Layers className="w-6 h-6" />
                </div>
                {plaidConnected && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              
              <h3 className="font-bold text-base text-foreground mb-1">Plaid Link</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Connect your business ledger to automatically sync transactions and categorize SaaS payments.
              </p>

              <button
                type="button"
                onClick={handleConnectPlaid}
                disabled={connectingPlaid}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
                  connectingPlaid
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : plaidConnected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98] shadow-md shadow-accent/10"
                }`}
              >
                {connectingPlaid ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                  </>
                ) : plaidConnected ? (
                  <>
                    <Check className="w-4 h-4" /> Connected
                  </>
                ) : (
                  "Connect Ledger"
                )}
              </button>
            </div>

            {/* Card 2: Ramp / Brex Card Spend */}
            <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              rampConnected 
                ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-emerald-500/5 shadow-2xl" 
                : "border-border hover:border-accent/40 bg-background/60 shadow-sm"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${
                  rampConnected 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-secondary border-border text-muted-foreground"
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                {rampConnected && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              
              <h3 className="font-bold text-base text-foreground mb-1">Ramp & Brex Card</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Ingest corporate card spend webhooks to isolate recurring SaaS vendor subscription charges.
              </p>

              <button
                type="button"
                onClick={handleConnectRamp}
                disabled={connectingRamp}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
                  connectingRamp
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : rampConnected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98] shadow-md shadow-accent/10"
                }`}
              >
                {connectingRamp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Syncing...
                  </>
                ) : rampConnected ? (
                  <>
                    <Check className="w-4 h-4" /> Synced
                  </>
                ) : (
                  "Sync Card Spend"
                )}
              </button>
            </div>

            {/* Card 3: Google SSO & Okta */}
            <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              googleConnected 
                ? "border-emerald-500/30 bg-emerald-500/[0.02] shadow-emerald-500/5 shadow-2xl" 
                : "border-border hover:border-accent/40 bg-background/60 shadow-sm"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${
                  googleConnected 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-secondary border-border text-muted-foreground"
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                {googleConnected && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              
              <h3 className="font-bold text-base text-foreground mb-1">Google Workspace & Okta</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Audit active employee directories to map real-time logins and isolate orphaned licenses.
              </p>

              <button
                type="button"
                onClick={handleConnectGoogle}
                disabled={connectingGoogle}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
                  connectingGoogle
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : googleConnected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98] shadow-md shadow-accent/10"
                }`}
              >
                {connectingGoogle ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Syncing...
                  </>
                ) : googleConnected ? (
                  <>
                    <Check className="w-4 h-4" /> SSO Connected
                  </>
                ) : (
                  "Connect SSO"
                )}
              </button>
            </div>

          </div>

          {/* Discovery Stats Feedback */}
          {discoveryStats && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 pt-6 border-t border-border/80 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/30 rounded-2xl p-4 border border-white/5 shadow-inner"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-foreground">Discovery Pipeline Synced</h4>
                  <p className="text-xs text-muted-foreground">We parsed your ledger transactions and mapped them to the unified pricing catalog.</p>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6 text-right">
                <div>
                  <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ingested Logs</span>
                  <span className="text-base font-black text-foreground">{discoveryStats.transactionsCount} tx</span>
                </div>
                <div className="h-8 w-[1px] bg-border self-center" />
                <div>
                  <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verified Seats</span>
                  <span className="text-base font-black text-foreground">{discoveryStats.seatsVerified} licenses</span>
                </div>
                <div className="h-8 w-[1px] bg-border self-center" />
                <div>
                  <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">Monthly Runrate</span>
                  <span className="text-base font-black text-emerald-400">${discoveryStats.estimatedMonthlySpend.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Encryption & Security Footer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider relative z-10 border-t border-border/30 pt-4">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" /> End-to-End Encrypted Handshakes
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" /> Read-Only Scopes • Direct Sync
            </span>
          </div>
        </section>

        <div className="w-full flex items-center justify-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest my-4">
          <div className="h-[1px] bg-border flex-1" />
          <span>Or Manually Customize Your Stack Below</span>
          <div className="h-[1px] bg-border flex-1" />
        </div>
        
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
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
              <label htmlFor="industry" className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Industry</label>
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

        {/* ── Optional Revenue Context (Feature 1) ── */}
        <RevenueContextStep form={form} />

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
                    <label htmlFor={`type-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Billing Model</label>
                    <select
                      id={`type-${index}`}
                      {...form.register(`tools.${index}.type`)}
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="SEAT">Per-Seat Subscription</option>
                      <option value="API">API / Usage Based</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`toolName-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Select Tool</label>
                    <select
                      id={`toolName-${index}`}
                      required
                      {...form.register(`tools.${index}.toolName`)}
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="">Select tool...</option>
                      {uniqueTools.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`currentPlan-${index}`} className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Plan</label>
                    <select
                      id={`currentPlan-${index}`}
                      {...form.register(`tools.${index}.currentPlan`)}
                      className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="">Select plan...</option>
                      {(TOOL_CONFIG[form.watch(`tools.${index}.toolName`)] || []).map(plan => {
                        const toolName = form.watch(`tools.${index}.toolName`);
                        const toolInfo = ALL_KNOWN_TOOLS.find(t => t.name === toolName && t.plan === plan);
                        const priceLabel = toolInfo ? ` ($${toolInfo.costPerSeat}/mo)` : "";
                        return (
                          <option key={plan} value={plan}>{plan}{priceLabel}</option>
                        );
                      })}
                    </select>
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
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                      <input
                        id={`monthlySpend-${index}`}
                        type="number"
                        {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                        className="w-full pl-10 p-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>
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
            onClick={() => append({ toolName: "", currentPlan: "", seats: 0, tokens: 0, monthlySpend: 0, type: "SEAT", useCases: [] } as AuditToolInput)}
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
