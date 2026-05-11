"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import {
  ArrowLeft, TrendingDown, DollarSign, Wallet,
  CheckCircle2, XCircle, AlertTriangle, Layers,
  Shield, Download, Copy, Check, AlertCircle, Zap, Mail, Trash2
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

// Helper for tool icons (mocking for aesthetic)
function ToolIcon({ name }: { name: string }) {
  return <div className="text-primary font-black text-xl italic">{name.charAt(0)}</div>;
}

function RecommendationCard({ rec, index }: { rec: AuditRecommendation; index: number }) {
  const isReplace = rec.action === "REPLACE" || rec.action === "DOWNGRADE" || rec.action === "CONSOLIDATE";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      className="group bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-2xl relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-secondary/80 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all duration-500 shadow-inner group-hover:scale-105 transform">
              <ToolIcon name={rec.originalTool} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">{rec.originalTool}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{rec.originalPlan} · {rec.originalSeats} Seats</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
              isReplace ? "bg-primary/20 text-primary border border-primary/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}>
              {rec.action}
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-foreground">${rec.originalMonthlyCost.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Current Spend</div>
            </div>
          </div>
        </div>

        {isReplace && (
          <div className="relative">
            {/* Animated connecting line */}
            <div className="absolute -top-6 left-8 w-[2px] h-6 bg-gradient-to-b from-primary/10 to-primary/40 group-hover:h-8 transition-all duration-500" />
            
            <div className="bg-primary/[0.05] border border-primary/20 rounded-2xl p-6 relative overflow-hidden group/opt shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/opt:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-xl shadow-primary/10 group-hover/opt:rotate-12 transition-transform">
                    <Zap className="w-6 h-6 text-primary fill-primary/20" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Recommended Fluxora Fix</div>
                    <div className="font-black text-lg text-foreground">{rec.suggestedTool || "Consolidated Stack"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xl font-black text-primary">-${rec.savings.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Monthly Recovery</div>
                  </div>
                  <div className="h-10 w-[1px] bg-primary/20 hidden sm:block" />
                  <div className="text-right">
                    <div className="text-xl font-black text-foreground">${(rec.suggestedTotalCost || 0).toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Optimized Cost</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-primary/10 text-sm text-muted-foreground leading-relaxed italic opacity-80 group-hover/opt:opacity-100 transition-opacity">
                &ldquo;{rec.reasoning}&rdquo;
              </div>
            </div>
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

  if (submitted) return <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center text-primary font-bold">Report sent!</div>;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
        Your AI spend per developer is <span className="text-foreground font-bold">${spendPerSeat}</span> — companies your size average <span className="text-primary font-bold">${benchmarkAverage}</span>.
      </p>
    </div>
  );
}

function HighSavingsCTA({ result }: { result: ProcessedAuditResult }) {
  if (result.annualSavings < 1000) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 text-center">
      <h3 className="font-bold text-primary text-lg mb-2">High Recovery Potential Found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Our deterministic engine identified <strong>${result.annualSavings.toLocaleString()}</strong> in immediate annual recovery. 
        Book a professional Credex consultation to execute these savings and liquidate unused credits.
      </p>
      <a 
        href="https://credex.rocks/consultation" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block py-2.5 px-6 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-opacity"
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
    <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <h3 className="font-black text-foreground text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Copy className="w-3 h-3 text-primary" /> Share Audit
      </h3>
      <div className="flex gap-2 relative z-10">
        <div className="flex-grow px-3 py-2.5 bg-secondary/50 border border-white/5 rounded-xl text-[10px] font-mono truncate text-muted-foreground flex items-center group-hover:border-primary/20 transition-colors">
          {shareUrl}
        </div>
        <button 
          onClick={handleCopy}
          className="flex-shrink-0 p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ReferralCard() {
  return (
    <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <h3 className="font-black text-foreground text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Zap className="w-3 h-3 text-primary" /> Partner Perks
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-6">
        Share Fluxora with a founder. If they audit, both get a <span className="text-primary font-black">5% Liquidation Bonus</span> on their first credit sale.
      </p>
      <div className="px-4 py-3 bg-secondary/50 border border-dashed border-primary/30 rounded-xl text-center font-mono text-xs text-primary uppercase tracking-[0.2em] group-hover:bg-primary/5 transition-colors">
        FLUX-REF-2026
      </div>
    </div>
  );
}

function ConsultationCTA({ annualSavings }: { annualSavings: number }) {
  if (annualSavings < 1000) return null;
  return (
    <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden group">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="font-black text-xl mb-2 tracking-tight">High Recovery Potential</h3>
        <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
          Our engine identified <strong className="text-white">${annualSavings.toLocaleString()}</strong> in annual waste. Book a professional Credex consultation to execute these savings and liquidate credits.
        </p>
        <a 
          href="https://credex.rocks/consultation" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full py-3 bg-white text-primary font-bold rounded-xl text-center text-sm hover:bg-opacity-90 transition-all active:scale-95 shadow-lg"
        >
          Book Consultation →
        </a>
      </div>
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
    { name: "Current", amount: result.totalCurrentSpend, fill: "var(--destructive)" },
    { name: "Optimized", amount: result.totalOptimizedSpend, fill: "var(--primary)" },
  ];

  const isSpendingWell = result.monthlySavings < 100;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative selection:bg-primary/30">
      {/* 3D Perspective Grid for 'Sexy' Depth */}
      <div className="grid-perspective" />

      {result.isPersisted === false && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 flex flex-col items-center justify-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 animate-pulse" />
            Limited Access: This audit is stored locally. Submit email to persist result.
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-1 sm:gap-4">
          <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden min-[380px]:block">Engine Room</span>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-stylish text-lg sm:text-2xl font-black tracking-tight text-foreground leading-none">
              Audit Report
            </h1>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1 opacity-50">Deterministic Analysis</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link 
              href="/audit" 
              className="px-4 py-2 bg-primary text-primary-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
            >
              Restart <span className="hidden sm:inline">Audit</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
          {[
            { label: "Current Spend", value: `$${result.totalCurrentSpend.toLocaleString()}`, sub: "/mo", color: "text-foreground", icon: <DollarSign className="w-4 h-4" />, glow: "shadow-white/5" },
            { label: "Monthly Savings", value: `$${result.monthlySavings.toLocaleString()}`, sub: "/mo", color: "text-primary", icon: <TrendingDown className="w-4 h-4" />, glow: "shadow-primary/20" },
            { label: "Optimized Spend", value: `$${result.totalOptimizedSpend.toLocaleString()}`, sub: "/mo", color: "text-foreground", icon: <Wallet className="w-4 h-4" />, glow: "shadow-white/5" },
            { label: "Annual Savings", value: `$${result.annualSavings.toLocaleString()}`, sub: "/yr", color: "text-primary", icon: <TrendingDown className="w-4 h-4" />, glow: "shadow-primary/20" },
          ].map((card, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
              className={`group bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-2xl ${card.glow} w-full mx-auto relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  <div className="p-1.5 bg-secondary rounded-lg">{card.icon}</div>
                  {card.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tighter">
                  <span className={card.color}>{card.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-2">{card.sub}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mx-auto">
          {/* Main Column (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6 w-full mx-auto">
            <HighSavingsCTA result={result} />

            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm w-full mx-auto">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" /> 
                Executive Summary
              </h2>
              <div className="text-base text-muted-foreground space-y-5 leading-relaxed">
                {result.aiSummary.split('\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>

            <div className="space-y-6 w-full mx-auto">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black flex items-center gap-2">
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
          <div className="lg:col-span-1 space-y-6 w-full mx-auto">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className={`p-6 rounded-2xl border ${isSpendingWell ? 'bg-secondary/30 border-border' : 'bg-accent/10 border-accent/20'} text-center w-full mx-auto`}>
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

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm w-full mx-auto">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Spend Comparison</h2>
              <div className="w-full h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10, fill: 'currentColor' }} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
