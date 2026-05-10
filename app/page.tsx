"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Zap, CheckCircle2, Search, Database, Fingerprint, Store } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle Fintech Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none"></div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Credex</span>
          </div>
          <nav>
            <Link 
              href="/audit" 
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors shadow-sm"
            >
              Start Free Audit
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow z-10">
        <section className="relative pt-32 pb-40 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl opacity-50 -z-10"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-10 shadow-xl shadow-blue-500/10 border border-slate-800"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 mr-3 animate-pulse"></span>
              CFO-Grade AI Spend Intelligence
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-8 text-slate-900 leading-[0.95]"
            >
              Audit your AI stack.<br />
              <span className="text-blue-600 italic">Stop the leak.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg md:text-xl text-slate-500 mx-auto mb-12 leading-relaxed"
            >
              Identify unused licenses, overlapping tools, and excessive cloud spend in under 60 seconds. Credex uses deterministic math to recover up to 40% of your AI budget.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link 
                href="/audit" 
                className="group relative flex items-center justify-center px-10 py-5 text-lg font-bold rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/25 w-full sm:w-auto overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Run Free Audit <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/sample" 
                className="flex items-center justify-center px-10 py-5 text-lg font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto active:scale-[0.98]"
              >
                View Sample
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-x-12 gap-y-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            >
              {["Cursor", "Claude", "OpenAI", "Gemini", "GitHub"].map((logo) => (
                <span key={logo} className="font-serif text-2xl font-black italic tracking-tighter text-slate-900">
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section 1: Core Feature */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded flex items-center justify-center mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-slate-900">Deterministic AI Spend Intelligence</h2>
                <p className="text-lg text-slate-500 mb-6 leading-relaxed">
                  Credex analyzes your enterprise AI and SaaS stack to detect:
                </p>
                <ul className="space-y-4 mb-8">
                  {["Inactive licenses", "Duplicate tools", "Overlapping AI capabilities", "Underutilized seats", "Excessive API or cloud spending"].map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-slate-600 font-medium bg-slate-50 p-4 rounded-lg border border-slate-200">
                  Unlike traditional analytics tools, Credex uses deterministic analysis instead of probabilistic usage estimates.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-sm">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                       <span className="font-semibold text-slate-900">Audit Preview</span>
                       <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded text-sm font-bold">Deterministic results</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Enter your current tool stack to get a real audit based on your own data. This preview explains the types of insights the system surfaces instead of showing estimated numbers.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 bg-white p-4 rounded border border-slate-100 shadow-sm text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Potential overlap across coding and AI tools
                      </li>
                      <li className="flex items-center gap-3 bg-white p-4 rounded border border-slate-100 shadow-sm text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Inactive seats and underutilized licenses
                      </li>
                      <li className="flex items-center gap-3 bg-white p-4 rounded border border-slate-100 shadow-sm text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Unoptimized API or cloud spend by tool category
                      </li>
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Optimization Layer */}
        <section className="py-24 bg-slate-50 border-y border-slate-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">Optimize before renewal cycles hit</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16">
              Identify exactly where budget is being wasted across your entire infrastructure.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {["ChatGPT Enterprise", "Claude Team", "GitHub Copilot", "Cursor", "AWS Credits", "OpenAI API", "Gemini API"].map((tool, idx) => (
                <span key={idx} className="px-4 py-2 bg-white border border-slate-200 rounded text-slate-700 font-medium shadow-sm">
                  {tool}
                </span>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                { title: "AI usage visibility", icon: <BarChart3 className="w-5 h-5"/> },
                { title: "License utilization tracking", icon: <Fingerprint className="w-5 h-5"/> },
                { title: "Redundant tool detection", icon: <Search className="w-5 h-5"/> },
                { title: "API spend monitoring", icon: <Zap className="w-5 h-5"/> },
                { title: "Team-level spend analytics", icon: <ShieldCheck className="w-5 h-5"/> }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-start gap-4">
                   <div className="mt-1 bg-slate-100 p-2 rounded text-slate-700">
                     {feature.icon}
                   </div>
                   <h3 className="text-lg font-semibold text-slate-900 mt-1.5">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Final CTA */}
        <section className="py-24 relative bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Audit your AI stack before costs spiral.</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Connect your workspace or upload a CSV to generate a full AI spend audit in under 60 seconds. <br className="hidden md:block"/> No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/audit" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm w-full sm:w-auto"
              >
                Start Free Audit
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6">No credit card required</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center">
              <Search className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">Credex</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Credex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
