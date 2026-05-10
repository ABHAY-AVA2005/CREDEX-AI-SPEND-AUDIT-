"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import {
  ArrowLeft, TrendingDown, DollarSign, Wallet, ArrowRight,
  CheckCircle2, XCircle, AlertTriangle, Layers,
  Share2, Mail, Calendar, Copy, Check,
  Download, Code, Award, Users, Shield
} from "lucide-react";
import Link from "next/link";
import { captureLeadEmail } from "@/app/actions/audit";
import { AuditRecommendation } from "@/schemas/audit";
import { ProcessedAuditResult } from "@/app/actions/audit";



const actionConfig: Record<string, { label: string; color: string; borderColor: string; icon: React.ReactNode }> = {
  REPLACE:     { label: "Replace",     color: "bg-red-50 text-red-700 border-red-200",       borderColor: "border-red-200",     icon: <XCircle className="w-4 h-4" /> },
  CONSOLIDATE: { label: "Consolidate", color: "bg-amber-50 text-amber-700 border-amber-200", borderColor: "border-amber-200",   icon: <Layers className="w-4 h-4" /> },
  DOWNGRADE:   { label: "Downgrade",   color: "bg-orange-50 text-orange-700 border-orange-200", borderColor: "border-orange-200", icon: <AlertTriangle className="w-4 h-4" /> },
  KEEP:        { label: "Keep",        color: "bg-emerald-50 text-emerald-700 border-emerald-200", borderColor: "border-slate-200", icon: <CheckCircle2 className="w-4 h-4" /> },
};

function RecommendationCard({ rec, index }: { rec: AuditRecommendation; index: number }) {
  const cfg = actionConfig[rec.action] ?? actionConfig.KEEP;
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      className={`bg-white rounded-xl border shadow-sm overflow-hidden ${cfg.borderColor}`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <h3 className="font-bold text-slate-900 text-base">{rec.originalTool}</h3>
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
          {/* Current */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Setup</p>
            <p className="font-bold text-slate-900">{rec.originalTool}</p>
            {rec.originalPlan && <p className="text-sm text-slate-500 mt-0.5">Plan: <span className="font-semibold text-slate-700">{rec.originalPlan}</span></p>}
            {rec.originalSeats !== undefined && <p className="text-sm text-slate-500 mt-0.5">Seats: <span className="font-semibold text-slate-700">{rec.originalSeats}</span></p>}
            {rec.originalMonthlyCost !== undefined && (
              <p className="text-base font-extrabold text-red-600 mt-3">
                ${rec.originalMonthlyCost.toLocaleString()}<span className="text-xs text-red-400 font-medium">/mo</span>
              </p>
            )}
          </div>

          {/* Recommended */}
          {rec.action !== "KEEP" && rec.suggestedTool ? (
            <div className={`rounded-lg p-4 border ${rec.action === "CONSOLIDATE" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {rec.action === "CONSOLIDATE" ? "Action Required" : "Recommended Switch"}
              </p>
              {rec.action === "CONSOLIDATE" ? (
                <>
                  <p className="font-bold text-amber-800">Remove / Cancel</p>
                  <p className="text-sm text-amber-700 mt-1">Capabilities already covered by the recommended replacement above.</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-3">$0<span className="text-xs font-medium">/mo</span></p>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-900">{rec.suggestedTool}</p>
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

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Why</p>
          <p className="text-sm text-slate-700 leading-relaxed">{rec.reasoning}</p>
        </div>

        {rec.savings > 0 && (
          <div className="mt-4 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-emerald-700">Annual saving from this change</span>
            <span className="text-base font-extrabold text-emerald-700">${(rec.savings * 12).toLocaleString()}/yr</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Email Capture Card (shown AFTER results) ──
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
    } catch (e: any) {
      setError(e.message || "Failed to send.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <p className="font-bold text-emerald-800 text-lg">Report sent!</p>
        <p className="text-emerald-600 text-sm mt-1">Check your inbox for the full audit breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-900 text-sm">Send this report to your inbox</h3>
      </div>
      <p className="text-slate-500 text-xs mb-4">Get the full audit delivered. All fields below are optional except email.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot */}
        <input type="text" name="b_name" style={{display: 'none'}} value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
        
        <input
          type="email"
          required
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="Work Email"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="Role (e.g. CTO)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <input
            type="number"
            value={teamSize}
            onChange={e => setTeamSize(e.target.value)}
            placeholder="Team Size"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] text-sm disabled:opacity-50"
        >
          {loading ? "Sending..." : "Get Full Report"}
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

// ── Benchmark Card ──
function BenchmarkCard({ result }: { result: ProcessedAuditResult }) {
  const totalSeats = result.recommendations.reduce((acc, r) => acc + (r.originalSeats || 1), 0);
  const spendPerSeat = totalSeats > 0 ? Math.round(result.totalCurrentSpend / totalSeats) : 0;
  const industryAvg = 45; // Simulated industry average per seat
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-slate-900 text-sm">Industry Benchmark</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-xs text-slate-500 font-medium">Your Spend / Seat</span>
          <span className="text-xl font-bold text-slate-900">${spendPerSeat}<span className="text-xs font-normal opacity-50">/mo</span></span>
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
            ? `Your team spends $${spendPerSeat - industryAvg} more per seat than the average high-growth startup.`
            : `Great! Your per-seat spend is below the $${industryAvg} industry average.`}
        </p>
      </div>
    </div>
  );
}

// ── Referral Card ──
function ReferralCard() {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-6 shadow-md border border-emerald-400">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-5 h-5 text-emerald-100" />
        <h3 className="font-bold text-sm">Refer a Founder</h3>
      </div>
      <p className="text-emerald-50 text-[11px] leading-relaxed mb-4">
        Share this tool with another founder. If they run an audit, you both get $100 off your next Credex purchase.
      </p>
      <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-bold transition-all active:scale-95 border border-white/20">
        Copy Referral Link
      </button>
    </div>
  );
}

// ── Widget Snippet ──
function WidgetSnippet() {
  const [copied, setCopied] = useState(false);
  const code = `<script src="https://credex-audit.vercel.app/widget.js" async></script>`;
  
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-400 rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-white text-[11px] uppercase tracking-wider">Embed on your blog</h3>
        </div>
        <button onClick={copy} className="text-[10px] hover:text-white transition-colors">
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="text-[10px] font-mono bg-black/30 p-2 rounded border border-white/5 overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}

// ── Share Card ──
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
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-5 h-5 text-slate-600" />
        <h3 className="font-bold text-slate-900 text-sm">Share this audit</h3>
      </div>
      <p className="text-slate-500 text-xs mb-4">Identifying details (company, email) are automatically stripped from the shared version.</p>
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-500 font-mono truncate flex items-center">
          {shareUrl}
        </div>
        <button
          onClick={copy}
          className="px-3 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-100 transition-colors text-slate-600 shrink-0"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}

// ── Consultation CTA (high-savings) ──
function ConsultationCTA({ annualSavings }: { annualSavings: number }) {
  if (annualSavings < 6000) return null; // $500/mo threshold
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
          <h3 className="font-extrabold text-xl leading-tight">Unlock Capital Recovery with Credex</h3>
        </div>
      </div>
      <p className="text-blue-100 text-sm leading-relaxed mb-5">
        Your stack has over <strong className="text-white">${Math.floor(annualSavings/12).toLocaleString()}/mo</strong> in wastage. Beyond optimizing plans, Credex can help you resell existing enterprise credits for immediate capital injection.
      </p>
      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-indigo-700 font-extrabold rounded-lg hover:bg-blue-50 transition-all text-sm"
      >
        Book Free Consult <ArrowRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
}

// ── Main Component ──
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
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {/* Shared banner */}
      {isShared && (
        <div className="bg-slate-900 text-white text-center text-[10px] font-bold py-1.5 uppercase tracking-widest px-4 border-b border-white/10">
          Shared AI Spend Audit Report &nbsp; | &nbsp;
          <Link href="/audit" className="text-blue-400 hover:text-blue-300 transition-colors">Audit Your Stack →</Link>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">
            {!isShared && result.companyName ? `${result.companyName} — ` : ""}Audit Results
          </h1>
          <Link
            href="/audit"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            New Audit →
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Current Spend", value: `$${result.totalCurrentSpend.toLocaleString()}`, sub: "/mo", icon: <DollarSign className="w-4 h-4" />, color: "text-slate-500", border: "border-slate-200" },
            { label: "Monthly Savings", value: `$${result.monthlySavings.toLocaleString()}`, sub: "/mo", icon: <TrendingDown className="w-4 h-4" />, color: isSpendingWell ? "text-slate-500" : "text-emerald-600", border: isSpendingWell ? "border-slate-200" : "border-emerald-300", extra: isSpendingWell ? "Optimized stack" : `${savingsPct}% reduction` },
            { label: "Optimized Spend", value: `$${result.totalOptimizedSpend.toLocaleString()}`, sub: "/mo", icon: <Wallet className="w-4 h-4" />, color: "text-slate-500", border: "border-slate-200" },
            { label: "Annual Savings", value: `$${result.annualSavings.toLocaleString()}`, sub: "/yr", icon: <TrendingDown className="w-4 h-4" />, color: isSpendingWell ? "text-slate-400" : "text-blue-600", border: "border-blue-200" },
          ].map((card, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}
              className={`bg-white p-5 rounded-xl border ${card.border} shadow-sm`}>
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

          {/* Left column */}
          <div className="lg:col-span-1 space-y-5">

            {/* Low savings / Spending well card */}
            {isSpendingWell && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">You&apos;re spending well.</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our audit shows your AI stack is already highly optimized. We don&apos;t manufacture fake savings. Enter your email below to be notified if new optimization rules apply to your stack in the future.
                </p>
              </motion.div>
            )}

            {/* Main KPI: Monthly Savings */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}
              className={`p-6 rounded-2xl border ${isSpendingWell ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50 border-emerald-200'} shadow-sm flex flex-col items-center text-center`}>
              {isSpendingWell ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-slate-400 mb-3" />
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">You're spending well.</h2>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm">
                    Our audit shows your AI stack is already highly optimized. We don't manufacture fake savings. Enter your email below to be notified if new optimization rules apply to your stack in the future.
                  </p>
                </>
              ) : (
                <>
                  <TrendingDown className="w-12 h-12 text-emerald-500 mb-3" />
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">You're losing money.</h2>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm">
                    We found <span className="font-bold text-emerald-600">${result.monthlySavings}/mo</span> in potential savings by optimizing your plans and consolidating tools.
                  </p>
                </>
              )}
            </motion.div>

            {/* Consultation CTA — only for high savings */}
            <ConsultationCTA annualSavings={result.annualSavings} />

            {/* Executive Summary — Letter Format */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-serif font-black text-slate-900 italic tracking-tight">Executive Summary</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Credex Audit ID: {result.publicSlug.toUpperCase()}</p>
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
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">CA</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Credex Audit Engine</p>
                    <p className="text-[10px] text-slate-400 font-medium">Deterministic Intelligence Unit</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.28 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-extrabold text-slate-900 mb-5">Spend Delta</h2>
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

            <div className="space-y-4">
              {/* Benchmark */}
              {!isShared && (
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <BenchmarkCard result={result} />
                </motion.div>
              )}

              {/* Email capture — AFTER results */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <EmailCaptureCard result={result} />
              </motion.div>
            </div>



          </div>

          {/* Right column — Recommendations */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900">
                Optimization Steps
                <span className="ml-2 text-sm font-semibold text-slate-400">({result.recommendations.length} items)</span>
              </h2>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <Download className="w-3 h-3" /> Export PDF
              </button>
            </div>
            
            {result.recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}

            {/* Share & Extra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                <ShareCard slug={result.publicSlug} />
              </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <ReferralCard />
              </motion.div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
              <WidgetSnippet />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
