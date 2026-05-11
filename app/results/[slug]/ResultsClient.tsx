"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import {
  ArrowLeft, TrendingDown, DollarSign, Wallet,
  CheckCircle2, XCircle, AlertTriangle, Layers,
  Shield, Download, Copy, Check, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { captureLeadEmail } from "@/app/actions/audit";
import { AuditRecommendation } from "@/schemas/audit";
import { ProcessedAuditResult } from "@/app/actions/audit";
import { ThemeToggle } from "@/components/theme-toggle";

const actionConfig: Record<string, { label: string; bg: string; color: string; border: string; icon: React.ReactNode }> = {
  REPLACE:     { label: "Replace",     bg: "bg-destructive/10", color: "text-destructive", border: "border-destructive/20", icon: <XCircle className="w-4 h-4" /> },
  CONSOLIDATE: { label: "Consolidate", bg: "bg-secondary",       color: "text-accent",        border: "border-border",        icon: <Layers className="w-4 h-4" /> },
  DOWNGRADE:   { label: "Downgrade",   bg: "bg-secondary",       color: "text-accent",        border: "border-border",        icon: <AlertTriangle className="w-4 h-4" /> },
  KEEP:        { label: "Keep",        bg: "bg-secondary",       color: "text-accent",        border: "border-border",        icon: <CheckCircle2 className="w-4 h-4" /> },
};

function RecommendationCard({ rec, index }: { rec: AuditRecommendation; index: number }) {
  const cfg = actionConfig[rec.action] ?? actionConfig.KEEP;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {cfg.icon} {cfg.label}
          </span>
          <h3 className="font-bold text-foreground text-base">{rec.originalTool}</h3>
        </div>
        
        {rec.savings > 0 && (
          <div className="text-right">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Monthly Saving</p>
            <p className="text-lg font-extrabold text-emerald-500">+${rec.savings.toLocaleString()}/mo</p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Current Setup</p>
            <p className="font-bold text-foreground">{rec.originalTool}</p>
            {rec.originalPlan && <p className="text-sm text-muted-foreground mt-0.5">Plan: <span className="font-semibold text-foreground/80">{rec.originalPlan}</span></p>}
            {rec.originalSeats !== undefined && <p className="text-sm text-muted-foreground mt-0.5">Seats: <span className="font-semibold text-foreground/80">{rec.originalSeats}</span></p>}
            {rec.originalMonthlyCost !== undefined && (
              <p className="text-sm text-muted-foreground mt-0.5">Current Bill: <span className="font-semibold text-foreground/80">${rec.originalMonthlyCost.toLocaleString()}/mo</span></p>
            )}
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Fluxora Fix</p>
            {rec.action === "KEEP" ? (
              <>
                <p className="font-bold text-foreground">{rec.originalTool}</p>
                <p className="text-sm text-muted-foreground mt-0.5 italic">Already optimized.</p>
              </>
            ) : (
              <>
                <p className="font-bold text-foreground">{rec.suggestedTool}</p>
                {rec.suggestedPlan && <p className="text-sm text-muted-foreground mt-0.5">Plan: <span className="font-semibold text-foreground/80">{rec.suggestedPlan}</span></p>}
                {rec.suggestedCostPerSeat !== undefined && rec.originalSeats !== undefined && (
                  <p className="text-sm text-muted-foreground mt-0.5">${rec.suggestedCostPerSeat}/seat × {rec.originalSeats} seats</p>
                )}
                {rec.suggestedTotalCost !== undefined && (
                  <p className="text-base font-extrabold text-emerald-500 mt-3">
                    ${rec.suggestedTotalCost.toLocaleString()}<span className="text-xs font-medium">/mo</span>
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-secondary/50 border border-border rounded-lg px-4 py-3">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Why</p>
          <p className="text-sm text-muted-foreground leading-relaxed italic">&quot;{rec.reasoning}&quot;</p>
        </div>

        {rec.savings > 0 && (
          <div className="mt-4 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-emerald-500">Annual recovery from this item</span>
            <span className="text-base font-extrabold text-emerald-500">${(rec.savings * 12).toLocaleString()}/yr</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmailCaptureCard({ result }: { result: ProcessedAuditResult }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await captureLeadEmail(email, result.companyName || "Lead", result.publicSlug, result.monthlySavings, result.annualSavings, result.aiSummary, role, teamSize ? parseInt(teamSize) : undefined);
      setSubmitted(true);
    } catch (e: unknown) {
      console.error("Audit submission failed:", e);
      const message = e instanceof Error ? e.message : "Something went wrong analyzing your stack. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center text-emerald-500 font-bold">Report sent!</div>;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-4">Get the full report</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Work Email" 
          aria-label="Work Email Address"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" 
        />
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="text" 
            required 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            placeholder="Role (e.g. CTO)" 
            aria-label="Your Job Role"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" 
          />
          <input 
            type="number" 
            required 
            value={teamSize} 
            onChange={e => setTeamSize(e.target.value)} 
            placeholder="Team Size" 
            aria-label="Total Team Size"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" 
          />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-accent text-accent-foreground font-semibold rounded-2xl hover:opacity-90">
          {loading ? "Sending..." : "Send Free Report"}
        </button>
      </form>
    </div>
  );
}

function BenchmarkCard({ result }: { result: ProcessedAuditResult }) {
  const totalSeats = result.recommendations.reduce((acc, r) => acc + (r.originalSeats || 1), 0);
  const spendPerSeat = totalSeats > 0 ? Math.round(result.totalCurrentSpend / totalSeats) : 0;
  const benchmarkAverage = 20; // Average AI spend per dev in 2026
  
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-4">Industry Benchmark</h3>
      <div className="text-2xl font-bold mb-1">${spendPerSeat}<span className="text-xs text-muted-foreground">/seat/mo</span></div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Your AI spend per developer is <span className="text-foreground font-bold">${spendPerSeat}</span> — companies your size average <span className="text-emerald-500 font-bold">${benchmarkAverage}</span>.
      </p>
    </div>
  );
}

function HighSavingsCTA({ result }: { result: ProcessedAuditResult }) {
  if (result.annualSavings < 1000) return null;

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 text-center">
      <h3 className="font-bold text-emerald-500 text-lg mb-2">High Recovery Potential Found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Our deterministic engine identified <strong>${result.annualSavings.toLocaleString()}</strong> in immediate annual recovery. 
        Book a professional Credex consultation to execute these savings and liquidate unused credits.
      </p>
      <a 
        href="https://credex.rocks/consultation" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block py-2.5 px-6 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors"
      >
        Book Credex Consultation →
      </a>
    </div>
  );
}

function ShareCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/results/${slug}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-3">Share this audit</h3>
      <div className="flex gap-2">
        <div className="flex-grow px-3 py-2 bg-secondary border border-border rounded-xl text-[10px] font-mono truncate text-muted-foreground flex items-center">
          {shareUrl}
        </div>
        <button 
          onClick={handleCopy}
          className="flex-shrink-0 p-2 bg-accent text-accent-foreground rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ReferralCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-3">Referral Perks</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        Share Fluxora with another founder. If they run an audit, both parties get a <span className="text-accent font-bold">5% Liquidation Bonus</span> on their first Credex credit sale.
      </p>
      <div className="px-3 py-2 bg-secondary border border-dashed border-border rounded-xl text-center font-mono text-xs text-foreground uppercase tracking-widest">
        FLUX-REF-2026
      </div>
    </div>
  );
}

function ConsultationCTA({ annualSavings }: { annualSavings: number }) {
  if (annualSavings < 1000) return null;
  return (
    <div className="bg-gradient-to-br from-[#0B0E14] to-[#1E293B] text-white rounded-2xl p-6 border border-white/10 shadow-lg">
      <h3 className="font-extrabold text-lg mb-2">High Recovery Potential Found</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Our engine identified <strong>${annualSavings.toLocaleString()}</strong> in annual waste. Book a professional Credex consultation to execute these savings.
      </p>
      <a 
        href="https://credex.rocks/consultation" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full py-2 bg-accent text-accent-foreground font-bold rounded-xl text-center text-sm hover:opacity-90 transition-opacity"
      >
        Book Consultation →
      </a>
    </div>
  );
}

export default function ResultsClient({ result: serverResult }: { result: ProcessedAuditResult | null; isShared?: boolean; }) {
  const [result, setResult] = useState<ProcessedAuditResult | null>(serverResult);
  const [isRecovering, setIsRecovering] = useState(!serverResult);

  useEffect(() => {
    if (!serverResult) {
      // Try to recover from session storage if the server couldn't find it in DB
      const saved = sessionStorage.getItem("latest_audit_result");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If we are recovering from session storage, it might not be persisted yet
          setResult({ ...parsed, isPersisted: parsed.isPersisted ?? false });
        } catch (e) {
          console.error("Local recovery failed:", e);
        }
      }
      setIsRecovering(false);
    }
  }, [serverResult]);

  if (isRecovering) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-bold tracking-widest uppercase text-xs">Recovering Audit...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-serif font-black mb-4">404: Audit Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">This audit may have expired or was never persisted to our database. Start a new analysis to see your savings.</p>
        <Link href="/audit" className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-bold hover:opacity-90 transition-all">New Audit →</Link>
      </div>
    );
  }

  const chartData = [
    { name: "Current", amount: result.totalCurrentSpend, fill: "#CF6679" },
    { name: "Optimized", amount: result.totalOptimizedSpend, fill: "#00A36C" },
  ];

  const isSpendingWell = result.monthlySavings < 100;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {result.isPersisted === false && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 flex flex-col items-center justify-center gap-1 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Offline Mode: This audit is stored locally. Shareable link will not work for others.
          </div>
          {result.dbError && (
            <div className="opacity-70 font-mono lowercase tracking-normal bg-black/20 px-2 rounded">
              Error: {result.dbError}
            </div>
          )}
        </div>
      )}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <h1 className="font-extrabold text-lg tracking-tight">Audit Results</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/audit" className="text-sm font-semibold text-accent hover:opacity-80">New Audit →</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Current Spend", value: `$${result.totalCurrentSpend.toLocaleString()}`, sub: "/mo", color: "text-foreground", icon: <DollarSign className="w-4 h-4" /> },
            { label: "Monthly Savings", value: `$${result.monthlySavings.toLocaleString()}`, sub: "/mo", color: "text-accent", icon: <TrendingDown className="w-4 h-4" /> },
            { label: "Optimized Spend", value: `$${result.totalOptimizedSpend.toLocaleString()}`, sub: "/mo", color: "text-foreground", icon: <Wallet className="w-4 h-4" /> },
            { label: "Annual Savings", value: `$${result.annualSavings.toLocaleString()}`, sub: "/yr", color: "text-accent", icon: <TrendingDown className="w-4 h-4" /> },
          ].map((card, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-card p-5 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">
                {card.icon} {card.label}
              </div>
              <div className={`text-2xl font-black ${card.color}`}>
                {card.value}<span className="text-xs font-medium opacity-50">{card.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <HighSavingsCTA result={result} />

            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" /> 
                Executive Summary
              </h2>
              <div className="text-base text-muted-foreground space-y-5 leading-relaxed">
                {result.aiSummary.split('\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black px-2 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-accent" />
                  Audit Recommendations
                </h2>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-border transition-colors">
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
              {result.recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className={`p-6 rounded-2xl border ${isSpendingWell ? 'bg-secondary/30 border-border' : 'bg-accent/10 border-accent/20'} text-center`}>
              {isSpendingWell ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h2 className="text-xl font-black">Stack Optimized.</h2>
                  <p className="text-muted-foreground text-sm mt-2">No redundant spend detected.</p>
                </>
              ) : (
                <>
                  <TrendingDown className="w-10 h-10 text-accent mx-auto mb-3" />
                  <h2 className="text-xl font-black">Wasted Spend.</h2>
                  <p className="text-muted-foreground text-sm mt-2">Identify <span className="font-bold text-accent">${result.monthlySavings}/mo</span> in potential recovery.</p>
                </>
              )}
            </motion.div>

            <ConsultationCTA annualSavings={result.annualSavings} />
            
            <BenchmarkCard result={result} />

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Spend Comparison</h2>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10, fill: 'currentColor' }} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ReferralCard />
            <ShareCard slug={result.publicSlug} />
            <EmailCaptureCard result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
