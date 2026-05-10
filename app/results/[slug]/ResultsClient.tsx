"use client";

/**
 * ResultsClient.tsx
 * The main dashboard for viewing audit results.
 * Handles the charts, recommendations, and the 'Email Gate'.
 * 
 * DESIGN NOTE: We use a mix of serif and sans-serif to give it a 
 * "Financial Report" vibe while staying modern.
 */

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

// Configuration for the action badges. 
// Keeps the UI consistent without repeating tailwind classes everywhere.
const actionConfig: Record<string, { label: string; color: string; borderColor: string; icon: React.ReactNode }> = {
  REPLACE:     { label: "Replace",     color: "bg-red-50 text-red-700 border-red-200",       borderColor: "border-red-200",     icon: <XCircle className="w-4 h-4" /> },
  CONSOLIDATE: { label: "Consolidate", color: "bg-amber-50 text-amber-700 border-amber-200", borderColor: "border-amber-200",   icon: <Layers className="w-4 h-4" /> },
  DOWNGRADE:   { label: "Downgrade",   color: "bg-orange-50 text-orange-700 border-orange-200", borderColor: "border-orange-200", icon: <AlertTriangle className="w-4 h-4" /> },
  KEEP:        { label: "Keep",        color: "bg-emerald-50 text-emerald-700 border-emerald-200", borderColor: "border-slate-200", icon: <CheckCircle2 className="w-4 h-4" /> },
};

/**
 * Individual Recommendation Card
 * Shows the "Before vs After" for each tool.
 */
function RecommendationCard({ rec, index }: { rec: AuditRecommendation; index: number }) {
  const cfg = actionConfig[rec.action] ?? actionConfig.KEEP;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      className={`bg-white rounded-xl border shadow-sm overflow-hidden ${cfg.borderColor}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <h3 className="font-bold text-foreground text-base">{rec.originalTool}</h3>
        </div>
        
        {rec.savings > 0 && (
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Monthly Saving</p>
            <p className="text-lg font-extrabold text-emerald-600">+${rec.savings.toLocaleString()}/mo</p>
          </div>
        )}
        
        {rec.savings === 0 && rec.action === "KEEP" && (
          <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Optimized ✓
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {/* Current State Column */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Setup</p>
            <p className="font-bold text-foreground">{rec.originalTool}</p>
            {rec.originalPlan && <p className="text-sm text-slate-500 mt-0.5">Plan: <span className="font-semibold text-slate-700">{rec.originalPlan}</span></p>}
            {rec.originalSeats !== undefined && <p className="text-sm text-slate-500 mt-0.5">Seats: <span className="font-semibold text-slate-700">{rec.originalSeats}</span></p>}
            {rec.originalMonthlyCost !== undefined && (
              <p className="text-base font-extrabold text-red-600 mt-3">
                ${rec.originalMonthlyCost.toLocaleString()}<span className="text-xs text-red-400 font-medium">/mo</span>
              </p>
            )}
          </div>

          {/* Recommended State Column */}
          {rec.action !== "KEEP" && rec.suggestedTool ? (
            <div className={`rounded-lg p-4 border ${rec.action === "CONSOLIDATE" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {rec.action === "CONSOLIDATE" ? "Action Required" : "Recommended Switch"}
              </p>
              
              {rec.action === "CONSOLIDATE" ? (
                <>
                  <p className="font-bold text-amber-800">Remove / Cancel</p>
                  <p className="text-sm text-amber-700 mt-1 leading-snug">Capabilities already covered by the recommended replacement above.</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-3">$0<span className="text-xs font-medium">/mo</span></p>
                </>
              ) : (
                <>
                  <p className="font-bold text-foreground">{rec.suggestedTool}</p>
                  {rec.suggestedPlan && <p className="text-sm text-slate-500 mt-0.5">Plan: <span className="font-semibold text-slate-700">{rec.suggestedPlan}</span></p>}
                  {rec.suggestedCostPerSeat !== undefined && rec.originalSeats !== undefined && (
                    <p className="text-sm text-slate-500 mt-0.5">${rec.suggestedCostPerSeat}/seat × {rec.originalSeats} seats</p>
                  )}
                  {rec.suggestedTotalCost !== undefined && (
                    <p className="text-base font-extrabold text-emerald-700 mt-3">
                      ${rec.suggestedTotalCost.toLocaleString()}<span className="text-xs font-medium">/mo</span>
                    </p>
                  )}
                </>
              )}
            </div>
          ) : rec.action === "KEEP" ? (
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-700">No changes needed</p>
                <p className="text-xs text-emerald-600 mt-1">Cost-efficient for your team size</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Reasoning Block */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Why</p>
          <p className="text-sm text-slate-700 leading-relaxed italic">&quot;{rec.reasoning}&quot;</p>
        </div>

        {rec.savings > 0 && (
          <div className="mt-4 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-emerald-700">Annual recovery from this item</span>
            <span className="text-base font-extrabold text-emerald-700">${(rec.savings * 12).toLocaleString()}/yr</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Post-Audit Lead Capture
 * We show the results first (Trust), then ask for the email to send the report.
 */
function EmailCaptureCard({ result }: { result: ProcessedAuditResult }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) { setSubmitted(true); return; }
    
    setLoading(true);
    try {
      await captureLeadEmail(
        email,
        result.companyName || "Lead",
        result.publicSlug,
        result.monthlySavings,
        result.annualSavings,
        result.aiSummary,
        role,
        teamSize ? parseInt(teamSize) : undefined
      );
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <p className="font-bold text-emerald-800 text-lg">Report sent!</p>
        <p className="text-emerald-600 text-sm mt-1">Check your inbox for the PDF breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-foreground text-sm">Get the full report delivered</h3>
      </div>
      <p className="text-muted-foreground text-xs mb-4">We&apos;ll send the executive summary and PDF to your work email.</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot */}
        <input type="text" name="b_name" style={{display: 'none'}} value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
        
        <input
          type="email"
          required
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="Work Email"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
        />
        
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            required
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="Role (e.g. CTO)"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
          />
          <input
            type="number"
            required
            value={teamSize}
            onChange={e => setTeamSize(e.target.value)}
            placeholder="Team Size"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] text-sm disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Free Report"}
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

/**
 * Industry Benchmark Card
 * Shows how the user's per-seat spend compares to the 2026 average.
 */
function BenchmarkCard({ result }: { result: ProcessedAuditResult }) {
  const totalSeats = result.recommendations.reduce((acc, r) => acc + (r.originalSeats || 1), 0);
  const spendPerSeat = totalSeats > 0 ? Math.round(result.totalCurrentSpend / totalSeats) : 0;
  const industryAvg = 45; // Based on Fluxora 2026 dataset
  
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-foreground text-sm">Industry Benchmark</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-xs text-slate-500 font-medium">Your Spend / Seat</span>
          <span className="text-xl font-bold text-foreground">${spendPerSeat}<span className="text-xs font-normal opacity-50">/mo</span></span>
        </div>
        
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((spendPerSeat / 150) * 100, 100)}%` }}
            className={`h-full ${spendPerSeat > industryAvg ? 'bg-orange-400' : 'bg-emerald-400'}`}
          />
        </div>
        
        <p className="text-[11px] text-slate-500 leading-tight">
          {spendPerSeat > industryAvg 
            ? `Warning: Your team spends $${spendPerSeat - industryAvg} more per seat than the median high-growth startup.`
            : `Great! Your per-seat spend is currently below the $${industryAvg} industry average.`}
        </p>
      </div>
    </div>
  );
}

/**
 * Share Component
 * Generates a public URL with PII automatically stripped by the server slug logic.
 */
function ShareCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  React.useEffect(() => {
    setShareUrl(`${window.location.origin}/results/${slug}`);
  }, [slug]);

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-5 h-5 text-slate-600" />
        <h3 className="font-bold text-foreground text-sm">Share this audit</h3>
      </div>
      <p className="text-slate-500 text-xs mb-4">Public reports have identifying details (company name, email) automatically hidden.</p>
      
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-500 font-mono truncate flex items-center">
          {shareUrl}
        </div>
        <button
          onClick={copy}
          className="px-3 py-2 border border-border bg-card rounded-lg hover:bg-secondary transition-colors text-muted-foreground shrink-0"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}

/**
 * High-Value Consultation CTA
 * Only shown if potential savings exceed the $500/mo ($6k/yr) threshold.
 */
function ConsultationCTA({ annualSavings }: { annualSavings: number }) {
  if (annualSavings < 6000) return null;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl p-6 shadow-lg border border-indigo-500"
    >
      <div className="flex items-start gap-3 mb-4">
        <Calendar className="w-7 h-7 text-blue-200 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Significant Savings Found</p>
          <h3 className="font-extrabold text-xl leading-tight">Unlock Capital Recovery</h3>
        </div>
      </div>
      
      <p className="text-blue-100 text-sm leading-relaxed mb-5">
        Your stack has over <strong className="text-white">${Math.floor(annualSavings/12).toLocaleString()}/mo</strong> in wastage. Let&apos;s book a call to liquidate your unused enterprise credits on the Fluxora secondary market.
      </p>
      
      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-indigo-700 font-extrabold rounded-lg hover:bg-blue-50 transition-all text-sm"
      >
        Book Free Consultation <ArrowRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
}

/**
 * MAIN PAGE COMPONENT
 */
export default function ResultsClient({
  result,
  isShared = false,
}: {
  result: ProcessedAuditResult;
  isShared?: boolean;
}) {
  const chartData = [
    { name: "Current",   amount: result.totalCurrentSpend,  fill: "#ef4444" },
    { name: "Optimized", amount: result.totalOptimizedSpend, fill: "#22c55e" },
  ];

  const savingsPct = result.totalCurrentSpend > 0
    ? Math.round((result.monthlySavings / result.totalCurrentSpend) * 100)
    : 0;

  const isSpendingWell = result.monthlySavings < 100;

  return (
    <div className="min-h-screen bg-background/50 text-foreground font-sans">
      
      {/* Banner for Shared Public Reports */}
      {isShared && (
        <div className="bg-foreground text-background text-center text-[10px] font-bold py-1.5 uppercase tracking-widest px-4 border-b border-white/10">
          Shared AI Spend Audit Report &nbsp; | &nbsp;
          <Link href="/audit" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30">Run Your Own Stack Audit →</Link>
        </div>
      )}

      {/* Global Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-full px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          
          <h1 className="font-extrabold text-foreground text-lg tracking-tight">
            {!isShared && result.companyName ? `${result.companyName} — ` : ""}Audit Results
          </h1>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/audit"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              New Audit →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Top-Level KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Current Spend", value: `$${result.totalCurrentSpend.toLocaleString()}`, sub: "/mo", icon: <DollarSign className="w-4 h-4" />, color: "text-slate-500", border: "border-slate-200" },
            { label: "Monthly Savings", value: `$${result.monthlySavings.toLocaleString()}`, sub: "/mo", icon: <TrendingDown className="w-4 h-4" />, color: isSpendingWell ? "text-slate-500" : "text-emerald-600", border: isSpendingWell ? "border-slate-200" : "border-emerald-300", extra: isSpendingWell ? "Optimized stack" : `${savingsPct}% reduction` },
            { label: "Optimized Spend", value: `$${result.totalOptimizedSpend.toLocaleString()}`, sub: "/mo", icon: <Wallet className="w-4 h-4" />, color: "text-slate-500", border: "border-slate-200" },
            { label: "Annual Savings", value: `$${result.annualSavings.toLocaleString()}`, sub: "/yr", icon: <TrendingDown className="w-4 h-4" />, color: isSpendingWell ? "text-slate-400" : "text-blue-600", border: "border-blue-200" },
          ].map((card, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}
              className={`bg-card p-5 rounded-xl border ${card.border} shadow-sm`}>
              <div className={`flex items-center gap-2 ${card.color} text-xs font-semibold mb-2 uppercase tracking-tight`}>
                {card.icon} {card.label}
              </div>
              <div className={`text-3xl font-extrabold ${card.color}`}>
                {card.value}<span className="text-base font-medium opacity-60">{card.sub}</span>
              </div>
              {card.extra && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{card.extra}</p>}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Analysis & Insights */}
          <div className="lg:col-span-1 space-y-5">

            {/* Savings Status Flag */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}
              className={`p-6 rounded-2xl border ${isSpendingWell ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50 border-emerald-200'} shadow-sm flex flex-col items-center text-center`}>
              {isSpendingWell ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-slate-400 mb-3" />
                  <h2 className="text-2xl font-black text-foreground leading-tight">You&apos;re spending well.</h2>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm">
                    Our audit confirms your stack is already lean. We don&apos;t manufacture fake savings.
                  </p>
                </>
              ) : (
                <>
                  <TrendingDown className="w-12 h-12 text-emerald-500 mb-3" />
                  <h2 className="text-2xl font-black text-foreground leading-tight">Wasted spend found.</h2>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                    We identified <span className="font-bold text-emerald-600">${result.monthlySavings}/mo</span> in potential recovery by consolidating overlapping tools.
                  </p>
                </>
              )}
            </motion.div>

            {/* High-Value Action Hook */}
            <ConsultationCTA annualSavings={result.annualSavings} />

            {/* AI Executive Summary — Designed like a formal memo */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-serif font-black text-foreground italic tracking-tight underline decoration-secondary decoration-4 underline-offset-4">Executive Summary</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fluxora ID: {result.publicSlug.toUpperCase()}</p>
                </div>
                <Shield className="w-8 h-8 text-slate-100" />
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  Dear {result.companyName || "Founder"},
                </p>
                <div className="text-sm text-slate-600 leading-relaxed mt-4 space-y-4">
                  {result.aiSummary.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">FA</div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Fluxora Audit Engine</p>
                    <p className="text-[10px] text-slate-400 font-medium">Deterministic Intelligence</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visualization: Spend Comparison Chart */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.28 }}
              className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-base font-extrabold text-foreground mb-5">Spend Delta Comparison</h2>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(val: any) => [`$${val?.toLocaleString()}`, "Monthly"]} />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Current: ${result.totalCurrentSpend.toLocaleString()}</span>
                <span>Target: ${result.totalOptimizedSpend.toLocaleString()}</span>
              </div>
            </motion.div>

            {/* Lead Gen & Benchmarking */}
            <div className="space-y-4">
              {!isShared && (
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <BenchmarkCard result={result} />
                </motion.div>
              )}
              
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <EmailCaptureCard result={result} />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Detailed Recommendations */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">
                Actionable Optimization Steps
                <span className="ml-2 text-sm font-semibold text-slate-400">({result.recommendations.length} items)</span>
              </h2>
              
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm group"
              >
                <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /> Save as PDF
              </button>
            </div>
            
            {result.recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}

            {/* Public Sharing Component */}
            <div className="grid grid-cols-1 pt-4">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                <ShareCard slug={result.publicSlug} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
