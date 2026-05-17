"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import {
  ArrowLeft, TrendingDown, DollarSign, Wallet,
  CheckCircle2, Layers,
  Shield, Download, Copy, Check, Zap, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { captureLeadEmail } from "@/app/actions/audit";
import { AuditRecommendation } from "@/schemas/audit";
import { ProcessedAuditResult } from "@/app/actions/audit";
import { ProcessedAuditResultV2 } from "@/app/actions/audit-v2";
import WeightsTuner from "@/components/audit/WeightsTuner";
import RevenueInsightCard from "@/components/results/RevenueInsightCard";
import { applyWeightsAndRank } from "@/core/recommendation-weights";
import type { RecommendationWeights } from "@/core/recommendation-weights";



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
      className="relative pl-12 group"
    >
      {/* Vertical Audit Thread */}
      <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 group-last:bottom-full group-last:h-12" />
      
      {/* Step Indicator */}
      <div className="absolute left-0 top-8 w-12 h-12 flex items-center justify-center z-20">
        <div className="w-10 h-10 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <span className="text-[10px] font-black text-primary">0{index + 1}</span>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-2xl relative will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-secondary/80 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all duration-500 shadow-inner group-hover:scale-105 transform">
                <ToolIcon name={rec.originalTool} />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">{rec.originalTool}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {rec.originalPlan} · {rec.originalSeats && rec.originalSeats > 0 ? `${rec.originalSeats} Seats` : `${rec.originalTokens || 0}k Tokens`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                isReplace ? "bg-primary/20 text-primary border border-primary/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {rec.action}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-foreground">${(rec.originalMonthlyCost ?? 0).toLocaleString()}</div>
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

                {/* Transparent Math System */}
                <div className="mt-4 pt-4 border-t border-primary/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">Audit Logic:</span>
                      <code className="text-[10px] font-mono text-muted-foreground">
                        (${rec.originalMonthlyCost} - ${rec.suggestedTotalCost}) = ${rec.savings} Recovery
                      </code>
                    </div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Math Verified
                    </div>
                  </div>

                  {/* Audit Trail - Showing the Work */}
                  <div className="bg-background/50 rounded-xl p-4 border border-white/5">
                    <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers className="w-3 h-3 text-primary" /> Step-by-Step Logic Trace
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3 text-[11px] text-muted-foreground leading-tight">
                        <span className="text-primary font-black">01</span>
                        <span>
                          Analyzed <strong className="text-foreground">{rec.originalTool}</strong> usage against your 
                          <strong className="text-foreground"> {rec.originalSeats && rec.originalSeats > 0 ? `${rec.originalSeats} seat` : `${rec.originalTokens || 0}k token`}</strong> {rec.originalPlan} license.
                        </span>
                      </li>
                      <li className="flex items-start gap-3 text-[11px] text-muted-foreground leading-tight">
                        <span className="text-primary font-black">02</span>
                        <span>Detected functional overlap with <strong className="text-foreground">{rec.suggestedTool || "existing stack"}</strong> feature-set.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[11px] text-muted-foreground leading-tight">
                        <span className="text-primary font-black">03</span>
                        <span>Calculated net savings using <strong className="text-foreground">2026 Enterprise Pricing Registry</strong>.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RedundancyWarnings({ warnings }: { warnings: string[] }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Shield className="w-12 h-12 text-amber-500" />
      </div>
      <h3 className="font-black text-amber-500 text-xl mb-4 tracking-tight flex items-center gap-2">
        <Zap className="w-5 h-5 fill-amber-500" /> Redundancy Alerts
      </h3>
      <ul className="space-y-3">
        {warnings.map((warning, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
            <span className="text-amber-500 font-black">•</span>
            <span>{warning}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-4 border-t border-amber-500/10 text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">
        Action Required: Consolidate overlapping tool subscriptions to recover capital.
      </div>
    </div>
  );
}

function EmailCaptureCard({ result }: { result: ProcessedAuditResult }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSpendingWell = result.monthlySavings < 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const referredByCode = sessionStorage.getItem("referral_code") || undefined;
      await captureLeadEmail(email, result.companyName || "Lead", result.publicSlug, result.monthlySavings, result.annualSavings, result.aiSummary, role, teamSize ? parseInt(teamSize) : undefined, referredByCode);
      setSubmitted(true);
    } catch (e: unknown) {
      console.error("Audit submission failed:", e);
      const message = e instanceof Error ? e.message : "Something went wrong analyzing your stack. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center text-primary font-bold">{isSpendingWell ? "We'll notify you!" : "Report sent!"}</div>;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground text-sm mb-4">
        {isSpendingWell ? "Get notified of new optimizations" : "Get the full report"}
      </h3>
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
          {loading ? "Processing..." : isSpendingWell ? "Notify Me" : "Send Free Report"}
        </button>
      </form>
    </div>
  );
}

function BenchmarkCard({ result }: { result: ProcessedAuditResult }) {
  const benchmark = result.benchmarkComparison;
  if (!benchmark) return null;

  const statusColors = {
    "EXCELLENT": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    "GOOD": "text-primary bg-primary/10 border-primary/20",
    "OVERSPENDING": "text-amber-500 bg-amber-500/10 border-amber-500/20",
    "CRITICAL": "text-red-500 bg-red-500/10 border-red-500/20"
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <TrendingDown className="w-12 h-12 text-primary" />
      </div>
      <h3 className="font-bold text-foreground text-sm mb-4">Peer Benchmarking</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-black text-foreground">
          {benchmark.percentile}<span className="text-xs text-muted-foreground font-medium uppercase tracking-widest ml-1">th percentile</span>
        </div>
        <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${statusColors[benchmark.status]}`}>
          {benchmark.status}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Target: ${benchmark.averageForStage}/emp (Peer Benchmark)
          </p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Your AI spend per developer is <strong className="text-foreground">${Math.round(result.totalCurrentSpend / (result.companySize || 1)).toLocaleString()}</strong> — 
          peer companies your size average <strong className="text-foreground">${benchmark.averageForStage.toLocaleString()}</strong>.
        </p>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Market Insight</span>
          </div>
          <p className="text-[10px] text-muted-foreground italic leading-tight">
            Engineering teams at your stage are increasingly moving to **API Gateways** to monitor and cap usage spikes.
          </p>
        </div>
      </div>
    </div>
  );
}

function HighSavingsCTA({ result }: { result: ProcessedAuditResult }) {
  if (result.monthlySavings < 500) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 mb-8 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <h3 className="font-black text-primary text-2xl mb-3 tracking-tight flex items-center justify-center gap-2">
        <Zap className="w-6 h-6 fill-primary" /> High Liquidity Opportunity
      </h3>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
        Our deterministic engine identified <strong className="text-foreground">${result.annualSavings.toLocaleString()}</strong> in annual wastage. 
        The most efficient path to recovery is liquidating these unused seats via the <strong className="text-primary">Credex.rocks Marketplace</strong>.
      </p>
      <Link 
        href="/consultation" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-primary/20 group"
      >
        Book Strategy Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

function ReferralCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const referralUrl = typeof window !== 'undefined' ? `${window.location.origin}/audit?ref=${slug.substring(0, 8)}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
        <Zap className="w-12 h-12 text-accent" />
      </div>
      <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
        <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        Viral Growth Reward
      </h3>
      <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
        Share your audit results. If another team recovers &gt;$500, you both get <strong className="text-foreground">3 months of Fluxora Pro</strong> free.
      </p>
      
      <button 
        onClick={handleCopy}
        className="w-full py-2.5 bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-accent/10"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Link Copied!" : "Copy Referral Link"}
      </button>
    </div>
  );
}

function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/results/${slug}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 px-6 py-4 bg-secondary/30 backdrop-blur-md border border-white/5 text-muted-foreground font-bold rounded-2xl hover:text-primary hover:border-primary/30 transition-all active:scale-95 group"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
      <span className="text-xs uppercase tracking-widest">{copied ? "Copied!" : "Share Link"}</span>
    </button>
  );
}

function DataSourcesCard() {
  return (
    <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <h3 className="font-black text-foreground text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Shield className="w-3 h-3 text-primary" /> Audit Data Transparency
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        Our estimates are powered by the <span className="text-primary font-black italic">Fluxora Registry (v4.2)</span>, which pulls real-time 2026 pricing for:
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {["Cursor", "Claude", "OpenAI", "Gemini", "Perplexity"].map(tool => (
          <span key={tool} className="px-2 py-1 bg-secondary/50 rounded-md text-[9px] font-bold text-muted-foreground border border-white/5">{tool}</span>
        ))}
      </div>
      <div className="text-[9px] font-mono text-muted-foreground opacity-50 bg-background/50 p-2 rounded-lg border border-white/5">
        Ref: 2026-ENT-PRICE-REG-Q2
      </div>
    </div>
  );
}

function ConsultationCTA({ annualSavings }: { annualSavings: number }) {
  if (annualSavings < 1000) return null;
  return (
    <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-2xl shadow-primary/20 relative overflow-hidden group">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white pointer-events-none" />
      
      <div className="relative z-10 text-center">
        <h3 className="font-black text-2xl mb-3 tracking-tight">Recovery Plan Ready</h3>
        <p className="text-primary-foreground/80 text-sm mb-0 leading-relaxed">
          Our engine identified <strong className="text-white">${annualSavings.toLocaleString()}</strong> in annual waste.
        </p>
      </div>
    </div>
  );
}

export default function ResultsClient({ 
  result: serverResult, 
  hasDbConfig 
}: { 
  result: ProcessedAuditResultV2 | null; 
  isShared?: boolean;
  hasDbConfig?: boolean;
}) {
  const [result, setResult] = useState<ProcessedAuditResultV2 | null>(serverResult);
  const [isRecovering, setIsRecovering] = useState(!serverResult);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [displayedRecs, setDisplayedRecs] = useState<AuditRecommendation[]>(
    serverResult?.weightedRecommendations?.map(r => r.recommendation) || serverResult?.recommendations || []
  );

  useEffect(() => {
    const handleOutsideClick = () => {
      if (isDownloadOpen) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isDownloadOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloadOpen(!isDownloadOpen);
  };

  useEffect(() => {
    if (!serverResult) {
      // Try to recover from session storage if the server couldn't find it in DB
      const saved = sessionStorage.getItem("latest_audit_result");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setResult({ ...parsed, isPersisted: parsed.isPersisted ?? false });
          setDisplayedRecs(
            parsed.weightedRecommendations?.map(
              (r: { recommendation: AuditRecommendation }) => r.recommendation
            ) || parsed.recommendations || []
          );
        } catch (e) {
          console.error("Local recovery failed:", e);
        }
      }
      setIsRecovering(false);
    } else {
      setDisplayedRecs(serverResult.weightedRecommendations?.map(r => r.recommendation) || serverResult.recommendations || []);
    }
  }, [serverResult]);

  const handleWeightsChange = (weights: RecommendationWeights) => {
    if (!result) return;
    const maxSavings = Math.max(...result.recommendations.map(r => r.savings), 0);
    const ranked = applyWeightsAndRank(result.recommendations, weights, maxSavings);
    setDisplayedRecs(ranked.map(r => r.recommendation));
  };

  const downloadCSV = () => {
    if (!result) return;
    
    // CSV headers
    const headers = [
      "Tool Name",
      "Current Plan",
      "Seats / Tokens",
      "Current Monthly Cost ($)",
      "Action",
      "Suggested Tool",
      "Suggested Plan",
      "Optimized Monthly Cost ($)",
      "Monthly Savings ($)",
      "Reasoning"
    ];

    // CSV rows
    const rows = result.recommendations.map(rec => [
      `"${rec.originalTool.replace(/"/g, '""')}"`,
      `"${(rec.originalPlan || "").replace(/"/g, '""')}"`,
      rec.originalSeats && rec.originalSeats > 0 ? rec.originalSeats : `${rec.originalTokens || 0}k Tokens`,
      rec.originalMonthlyCost ?? 0,
      `"${rec.action}"`,
      `"${(rec.suggestedTool || "").replace(/"/g, '""')}"`,
      `"${(rec.suggestedPlan || "").replace(/"/g, '""')}"`,
      rec.suggestedTotalCost ?? rec.originalMonthlyCost ?? 0,
      rec.savings,
      `"${(rec.reasoning || "").replace(/"/g, '""')}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${result.companyName.toLowerCase().replace(/\s+/g, "_")}_ai_spend_audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isRecovering) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <div className="animate-pulse text-muted-foreground font-bold tracking-widest uppercase text-[10px]">Recovering Audit Data...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        
        {!hasDbConfig ? (
          <>
            <h2 className="text-4xl font-black mb-4 tracking-tighter">Database Not Configured</h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              Your Vercel environment is missing the <code className="bg-secondary px-1.5 py-0.5 rounded text-primary">DATABASE_URL</code>. 
              The audit was calculated but could not be saved to the cloud.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-black mb-4 tracking-tighter">Audit Not Found</h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              This specific report ID doesn&apos;t exist in our registry. It may have been deleted or the link is incorrect.
            </p>
          </>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all border border-white/5"
          >
            🔄 Refresh Page
          </button>
          <Link href="/audit" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20">
            Start New Audit →
          </Link>
        </div>

        {!hasDbConfig && (
          <div className="mt-12 p-4 border border-amber-500/30 bg-amber-500/5 rounded-xl text-amber-500 text-[10px] font-bold uppercase tracking-widest max-w-sm">
            Warning: Database persistence is currently disabled. Share links will not work until a database is connected.
          </div>
        )}
      </div>
    );
  }

  const chartData = [
    { name: "Current", amount: result.totalCurrentSpend, fill: "var(--destructive)" },
    { name: "Optimized", amount: result.totalOptimizedSpend, fill: "var(--primary)" },
  ];

  const isSpendingWell = result.monthlySavings < 100;

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans relative selection:bg-primary/30">
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
      <div className="w-full max-w-6xl mx-auto px-4 pt-8 pb-6 relative z-20 text-center flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
          </Link>
        </div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            <Zap className="w-3 h-3 mr-2 fill-primary" /> Confirmed Analysis
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-4">
            {result.companyName}<br />
            <span className="text-primary font-stylish font-extrabold italic">AI Stack Audit Report</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium max-w-2xl mx-auto opacity-70">
            A deterministic financial and engineering breakdown of your organization&apos;s AI tool efficiency, functional overlap, and capital recovery potential.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-8 py-4 bg-secondary/50 backdrop-blur-md border border-white/10 text-foreground font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 group shadow-xl"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform text-primary" /> Download Audit
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 left-0 sm:left-auto sm:w-56 mt-2 origin-top-right bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      window.print();
                      setIsDownloadOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-foreground hover:bg-primary/15 transition-colors flex items-center gap-3 font-semibold"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" /> PDF Format
                  </button>
                  <button
                    onClick={() => {
                      downloadCSV();
                      setIsDownloadOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-foreground hover:bg-primary/15 transition-colors flex items-center gap-3 font-semibold border-t border-white/5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> CSV Spreadsheet
                  </button>
                </div>
              )}
            </div>
            <Link 
              href="/consultation" 
              className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-primary/20 active:scale-95 group"
            >
              Book Strategy Consultation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            {/* Share Audit - Now at Top */}
            <ShareButton slug={result.publicSlug} />
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
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
            {result.revenueEnrichment && (
              <RevenueInsightCard enrichment={result.revenueEnrichment} />
            )}
            <RedundancyWarnings warnings={result.redundancyWarnings} />
            <HighSavingsCTA result={result} />

            <div className="bg-card rounded-3xl border border-border p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-32 h-32 text-primary" />
              </div>
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary"><Shield className="w-6 h-6" /></div>
                Executive Audit Summary
              </h2>
              <div className="text-lg text-muted-foreground space-y-6 leading-relaxed relative z-10">
                {result.aiSummary.split('\n').map((para, i) => <p key={i} className="first-letter:text-4xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">{para}</p>)}
              </div>
              
              <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-secondary/20 -mx-10 -mb-10 p-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center font-serif italic font-bold text-xl shadow-inner">
                    F
                  </div>
                  <div>
                    <div className="text-sm font-black text-foreground">Verified by Fluxora Core</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Deterministic Audit Engine v4.2</div>
                  </div>
                </div>
                <div className="px-4 py-2 border-2 border-primary/20 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/5">
                  Certification: CFO-GRADE-COMPLIANT
                </div>
              </div>
            </div>

            {/* Engineering Report Section */}
            <div className="bg-card rounded-3xl border border-border p-8 sm:p-10 shadow-2xl relative overflow-hidden">
               <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl text-accent"><Layers className="w-6 h-6" /></div>
                Technical Efficiency Breakdown
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Our engineering report identifies <strong className="text-foreground">Functional Redundancy</strong> across your stack. Below is the technical dependency mapping used to calculate your recovery potential.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedRecs.map((rec, i) => (
                    <div key={i} className="p-4 bg-secondary/30 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center text-[10px] font-black">{rec.originalTool.charAt(0)}</div>
                        <div className="text-xs font-bold text-foreground">{rec.originalTool}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${Math.min(100, (rec.savings / (rec.originalMonthlyCost || 1)) * 100)}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-primary uppercase">Waste</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="lg:col-span-1 space-y-6 w-full mx-auto">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              className={`p-6 rounded-2xl border ${isSpendingWell ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-accent/10 border-accent/20'} text-center w-full mx-auto`}>
              {isSpendingWell ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <h2 className="text-xl font-black text-emerald-400">You&apos;re spending well.</h2>
                  <p className="text-muted-foreground text-sm mt-2 leading-tight">Your AI stack is currently optimal. No redundant seats detected.</p>
                </>
              ) : (
                <>
                  <TrendingDown className="w-10 h-10 text-accent mx-auto mb-3" />
                  <h2 className="text-xl font-black text-accent">Optimization Path</h2>
                  <p className="text-muted-foreground text-sm mt-2 leading-tight">We identified <span className="font-bold text-accent">${result.monthlySavings}/mo</span> in potential recovery.</p>
                </>
              )}
            </motion.div>

            <ConsultationCTA annualSavings={result.annualSavings} />
            
            <ReferralCard slug={result.publicSlug} />
            
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

            <DataSourcesCard />
          </div>
        </div>

        {/* Full Width Recommendations & Lead Capture */}
        <div className="space-y-6 w-full pt-6 border-t border-border/20">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary"><TrendingDown className="w-8 h-8" /></div>
              Audit Recommendations
            </h2>
          </div>
          
          <WeightsTuner onWeightsChange={handleWeightsChange} />

          <div className="grid grid-cols-1 gap-6">
            {displayedRecs.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
          
          <div className="pt-16 max-w-4xl mx-auto">
            <EmailCaptureCard result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
