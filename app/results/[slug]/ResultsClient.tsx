"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import {
  ArrowLeft, TrendingDown, DollarSign, Wallet, ArrowRight,
  CheckCircle2, XCircle, AlertTriangle, Layers,
  Share2, Mail, Calendar, Copy, Check,
  Download, Users, Shield
} from "lucide-react";
import Link from "next/link";
import { captureLeadEmail } from "@/app/actions/audit";
import { AuditRecommendation } from "@/schemas/audit";
import { ProcessedAuditResult } from "@/app/actions/audit";
import { ThemeToggle } from "@/components/theme-toggle";

const actionConfig: Record<string, { label: string; bg: string; color: string; border: string; icon: React.ReactNode }> = {
  REPLACE:     { label: "Replace",     bg: "bg-destructive/10", color: "text-destructive", border: "border-destructive/20", icon: <XCircle className="w-4 h-4" /> },
  CONSOLIDATE: { label: "Consolidate", bg: "bg-orange-500/10",  color: "text-orange-400",    border: "border-orange-500/20", icon: <Layers className="w-4 h-4" /> },
  DOWNGRADE:   { label: "Downgrade",   bg: "bg-amber-500/10",  color: "text-amber-400",     border: "border-amber-500/20",  icon: <AlertTriangle className="w-4 h-4" /> },
  KEEP:        { label: "Keep",        bg: "bg-emerald-500/10", color: "text-emerald-400",   border: "border-emerald-500/20", icon: <CheckCircle2 className="w-4 h-4" /> },
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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await captureLeadEmail(email, result.companyName || "Lead", result.publicSlug, result.monthlySavings, result.annualSavings, result.aiSummary, role, teamSize ? parseInt(teamSize) : undefined);
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center text-emerald-500 font-bold">Report sent!</div>;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-4">Get the full report</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Work Email" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" required value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. CTO)" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
          <input type="number" required value={teamSize} onChange={e => setTeamSize(e.target.value)} placeholder="Team Size" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-foreground text-background font-semibold rounded-lg hover:opacity-90">
          {loading ? "Sending..." : "Send Free Report"}
        </button>
      </form>
    </div>
  );
}

function BenchmarkCard({ result }: { result: ProcessedAuditResult }) {
  const totalSeats = result.recommendations.reduce((acc, r) => acc + (r.originalSeats || 1), 0);
  const spendPerSeat = totalSeats > 0 ? Math.round(result.totalCurrentSpend / totalSeats) : 0;
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-4">Industry Benchmark</h3>
      <div className="text-2xl font-bold">${spendPerSeat}<span className="text-xs text-muted-foreground">/seat/mo</span></div>
    </div>
  );
}

function ShareCard({ slug }: { slug: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-bold text-foreground text-sm mb-2">Share this audit</h3>
      <div className="px-3 py-2 bg-secondary border border-border rounded-lg text-xs font-mono truncate">
        {`${typeof window !== 'undefined' ? window.location.origin : ''}/results/${slug}`}
      </div>
    </div>
  );
}

function ConsultationCTA({ annualSavings }: { annualSavings: number }) {
  if (annualSavings < 6000) return null;
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-xl p-6 border border-white/10 shadow-lg">
      <h3 className="font-extrabold text-lg mb-2">Unlock Capital Recovery</h3>
      <p className="text-blue-100 text-sm mb-4">Wastage detected. Book a call to liquidate unused credits.</p>
      <a href="https://credex.rocks" className="block w-full py-2 bg-white text-blue-900 font-bold rounded-lg text-center text-sm">Book Consultation</a>
    </div>
  );
}

export default function ResultsClient({ result, isShared = false }: { result: ProcessedAuditResult; isShared?: boolean; }) {
  const chartData = [
    { name: "Current", amount: result.totalCurrentSpend, fill: "#CF6679" },
    { name: "Optimized", amount: result.totalOptimizedSpend, fill: "#81C784" },
  ];

  const savingsPct = result.totalCurrentSpend > 0 ? Math.round((result.monthlySavings / result.totalCurrentSpend) * 100) : 0;
  const isSpendingWell = result.monthlySavings < 100;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
            { label: "Monthly Savings", value: `$${result.monthlySavings.toLocaleString()}`, sub: "/mo", color: "text-[#81C784]", icon: <TrendingDown className="w-4 h-4" /> },
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
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className={`p-6 rounded-2xl border ${isSpendingWell ? 'bg-secondary/30 border-border' : 'bg-emerald-500/10 border-emerald-500/20'} text-center`}>
              {isSpendingWell ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h2 className="text-xl font-black">You&apos;re spending well.</h2>
                  <p className="text-muted-foreground text-sm mt-2">Your stack is already optimized for your team size.</p>
                </>
              ) : (
                <>
                  <TrendingDown className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <h2 className="text-xl font-black">Wasted spend found.</h2>
                  <p className="text-muted-foreground text-sm mt-2">Identify <span className="font-bold text-emerald-500">${result.monthlySavings}/mo</span> in potential recovery.</p>
                </>
              )}
            </motion.div>

            <ConsultationCTA annualSavings={result.annualSavings} />

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-base font-black mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> Executive Summary</h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                {result.aiSummary.split('\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-sm font-bold mb-4">Spend Comparison</h2>
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

            <BenchmarkCard result={result} />
            <EmailCaptureCard result={result} />
            <ShareCard slug={result.publicSlug} />
          </div>

          {/* Right Panel: Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Actionable Steps <span className="text-sm font-medium text-muted-foreground">({result.recommendations.length})</span></h2>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-border transition-colors">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>

            {result.recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
