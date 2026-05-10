"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

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
