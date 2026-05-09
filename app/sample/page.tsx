import Link from "next/link";
import {
  ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, XCircle,
  BarChart3, Users, Zap, RefreshCcw, ShieldCheck, TrendingDown, Download
} from "lucide-react";

const tools = [
  {
    name: "ChatGPT Enterprise",
    vendor: "OpenAI",
    seats: 120,
    activeSeats: 48,
    inactiveSeats: 72,
    monthlyCost: 4320,
    wastedCost: 2592,
    status: "critical",
    overlap: ["GitHub Copilot", "Cursor"],
  },
  {
    name: "GitHub Copilot",
    vendor: "GitHub",
    seats: 95,
    activeSeats: 61,
    inactiveSeats: 34,
    monthlyCost: 1805,
    wastedCost: 646,
    status: "warning",
    overlap: ["ChatGPT Enterprise", "Cursor"],
  },
  {
    name: "Cursor",
    vendor: "Anysphere",
    seats: 80,
    activeSeats: 80,
    inactiveSeats: 0,
    monthlyCost: 1600,
    wastedCost: 0,
    status: "healthy",
    overlap: [],
  },
  {
    name: "AWS Credits",
    vendor: "Amazon",
    seats: null,
    activeSeats: null,
    inactiveSeats: null,
    monthlyCost: 8400,
    wastedCost: 3200,
    status: "critical",
    overlap: [],
    note: "$3,200 in unallocated reserved credits expiring in 38 days",
  },
  {
    name: "Claude Team",
    vendor: "Anthropic",
    seats: 60,
    activeSeats: 22,
    inactiveSeats: 38,
    monthlyCost: 1500,
    wastedCost: 950,
    status: "warning",
    overlap: ["ChatGPT Enterprise"],
  },
  {
    name: "Gemini API",
    vendor: "Google",
    seats: null,
    activeSeats: null,
    inactiveSeats: null,
    monthlyCost: 620,
    wastedCost: 620,
    status: "critical",
    overlap: [],
    note: "Zero usage detected in the last 30 days",
  },
];

const totalMonthly = tools.reduce((s, t) => s + t.monthlyCost, 0);
const totalWasted = tools.reduce((s, t) => s + t.wastedCost, 0);
const wastedPct = Math.round((totalWasted / totalMonthly) * 100);

const statusColors: Record<string, string> = {
  critical: "text-red-600 bg-red-50 border-red-200",
  warning: "text-amber-600 bg-amber-50 border-amber-200",
  healthy: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const statusLabels: Record<string, string> = {
  critical: "Critical",
  warning: "Review",
  healthy: "Healthy",
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "critical") return <XCircle className="w-4 h-4" />;
  if (status === "warning") return <AlertTriangle className="w-4 h-4" />;
  return <CheckCircle2 className="w-4 h-4" />;
};

export default function SampleAuditPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {/* ⚠️ Sticky Demo Banner */}
      <div className="sticky top-0 z-[60] w-full bg-amber-400 text-amber-900 text-center text-sm font-bold py-2 px-4 flex items-center justify-center gap-2 shadow-md">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>You are viewing a <strong>SAMPLE DEMO</strong> with fictional data. This is not a real company audit.</span>
        <Link href="/audit" className="ml-3 underline underline-offset-2 hover:text-amber-950 transition-colors whitespace-nowrap">Run your real audit →</Link>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Credex</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded border border-slate-200">
              Sample Report — Acme Corp
            </span>
            <Link
              href="/audit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
              Audit Your Stack <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-widest mb-4">
            <AlertTriangle className="w-3.5 h-3.5" /> Sample / Demo Report — All Data is Fictional
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            AI & SaaS Spend Audit
          </h1>
          <p className="text-slate-500 text-lg mb-4">
            <span className="font-semibold text-slate-700">Acme Corp (Demo)</span> · Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · 6 tools analyzed
          </p>
          {/* Disclaimer Box */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">This is a simulated audit for demonstration purposes only.</p>
              <p className="text-sm text-amber-700 mt-0.5">All company names, seat counts, and spend figures shown below are fictional and used solely to illustrate how a real Credex audit report looks and works.</p>
            </div>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Demo</span>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Monthly Spend</p>
            <p className="text-3xl font-extrabold text-slate-900">${totalMonthly.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">across all AI & SaaS tools</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Demo</span>
            <p className="text-sm text-red-500 font-medium mb-1">Wasted Spend / Month</p>
            <p className="text-3xl font-extrabold text-red-600">${totalWasted.toLocaleString()}</p>
            <p className="text-xs text-red-400 mt-1">{wastedPct}% of total budget</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Demo</span>
            <p className="text-sm text-slate-500 font-medium mb-1">Annual Recovery Potential</p>
            <p className="text-3xl font-extrabold text-emerald-600">${(totalWasted * 12).toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">if optimized immediately</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Demo</span>
            <p className="text-sm text-slate-500 font-medium mb-1">Tools Analyzed</p>
            <p className="text-3xl font-extrabold text-slate-900">6</p>
            <p className="text-xs text-slate-400 mt-1">3 critical · 2 review · 1 healthy</p>
          </div>
        </div>

        {/* Waste Breakdown Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" /> Budget Efficiency Overview
            </h2>
            <span className="text-sm font-semibold text-slate-500">Monthly</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full"
              style={{ width: `${wastedPct}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-red-600">${totalWasted.toLocaleString()} wasted ({wastedPct}%)</span>
            <span className="text-emerald-600">${(totalMonthly - totalWasted).toLocaleString()} optimized ({100 - wastedPct}%)</span>
          </div>
        </div>

        {/* Tool-by-Tool Audit Table */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" /> Tool-by-Tool Analysis
          </h2>
          <div className="space-y-4">
            {tools.map((tool, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border p-6 shadow-sm ${
                  tool.status === "critical"
                    ? "border-red-200"
                    : tool.status === "warning"
                    ? "border-amber-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`mt-1 w-10 h-10 rounded flex items-center justify-center shrink-0 ${statusColors[tool.status]}`}>
                      <StatusIcon status={tool.status} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{tool.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${statusColors[tool.status]}`}>
                          <StatusIcon status={tool.status} />
                          {statusLabels[tool.status]}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{tool.vendor}</span>
                      </div>

                      {tool.note && (
                        <p className="text-sm text-red-600 font-medium mb-2 bg-red-50 px-3 py-1.5 rounded border border-red-100 inline-block">{tool.note}</p>
                      )}

                      {tool.seats !== null && (
                        <div className="flex items-center gap-6 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {tool.seats} total seats</span>
                          <span className="text-emerald-600 font-semibold">{tool.activeSeats} active</span>
                          <span className="text-red-600 font-semibold">{tool.inactiveSeats} inactive</span>
                        </div>
                      )}

                      {tool.overlap.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overlaps with:</span>
                          {tool.overlap.map((o, j) => (
                            <span key={j} className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                              {o}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 shrink-0 pt-1">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Monthly Cost</p>
                      <p className="text-xl font-extrabold text-slate-900">${tool.monthlyCost.toLocaleString()}</p>
                    </div>
                    {tool.wastedCost > 0 && (
                      <div className="text-right mt-1">
                        <p className="text-xs text-red-400 font-medium">Wasted</p>
                        <p className="text-lg font-extrabold text-red-600">-${tool.wastedCost.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" /> Optimization Recommendations
            </h2>
            <p className="text-slate-400 mb-8">Actioning these will recover <span className="text-white font-bold">${totalWasted.toLocaleString()}/month</span> — or <span className="text-white font-bold">${(totalWasted * 12).toLocaleString()}/year</span>.</p>
            <div className="space-y-4">
              {[
                { priority: "Immediate", action: "Reclaim 72 inactive ChatGPT Enterprise seats. Downsize or resell via Credex Exchange.", saving: "$2,592/mo" },
                { priority: "Immediate", action: "Redeploy $3,200 in expiring AWS reserved credits before 38-day deadline.", saving: "$3,200" },
                { priority: "Immediate", action: "Cancel Gemini API — zero usage in 30 days. No productivity impact.", saving: "$620/mo" },
                { priority: "Review", action: "Evaluate GitHub Copilot vs. Cursor overlap. Consolidate to one AI coding tool.", saving: "$646/mo" },
                { priority: "Review", action: "Reduce Claude Team licenses from 60 to 22 active users.", saving: "$950/mo" },
              ].map((rec, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5 ${
                    rec.priority === "Immediate" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {rec.priority}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1">{rec.action}</p>
                  <span className="text-emerald-400 font-bold text-sm shrink-0">{rec.saving}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-sm">
          <RefreshCcw className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">Ready to audit your real stack?</h2>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            Connect your workspace or upload a CSV. Get a full deterministic audit like this in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors shadow-sm text-base"
            >
              Start Free Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-200 bg-white text-slate-700 font-semibold rounded hover:bg-slate-50 transition-colors text-base shadow-sm">
              <Download className="w-4 h-4" /> Download Sample PDF
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-6">No credit card required · Results in 60 seconds</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 mt-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-900">Credex</span>
          </div>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Credex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
