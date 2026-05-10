"use client";

/**
 * LandingPage.tsx
 * The first impression for the Fluxora Audit platform.
 * I've gone for a "High-End Fintech" look—lots of whitespace, 
 * bold serif typography, and subtle grid backgrounds.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Subtle Fintech Grid Background (Standard for AI/Finance apps in 2026) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Light blue glow at the top */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Fluxora</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <a 
              href="https://credex.rocks/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block"
            >
              Marketplace
            </a>
            <Link 
              href="/audit" 
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              Start Free Audit
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow z-10">
        <section className="relative pt-32 pb-40 overflow-hidden">
          
          {/* Abstract background blobs for a bit of premium depth */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl opacity-50 -z-10"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* The Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-10 shadow-xl shadow-blue-500/10 border border-slate-800"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 mr-3 animate-pulse"></span>
              CFO-Grade AI Spend Intelligence
            </motion.div>
            
            {/* The Big Hook */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-8 text-slate-900 leading-[0.95]"
            >
              Audit your AI stack.<br />
              <span className="text-blue-600 italic">Stop the leak.</span>
            </motion.h1>
            
            {/* Subtext explaining the deterministic value prop */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 max-w-2xl text-lg md:text-xl text-slate-500 mx-auto mb-12 leading-relaxed"
            >
              Identify unused licenses, overlapping tools, and excessive cloud spend in under 60 seconds. Fluxora uses deterministic math to recover up to 40% of your AI budget.
            </motion.p>
            
            {/* CTA Group */}
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
                {/* Shimmer effect for that extra polish */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Run Free Audit <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/sample" 
                className="flex items-center justify-center px-10 py-5 text-lg font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto active:scale-[0.98]"
              >
                View Sample Report
              </Link>
            </motion.div>

            {/* Official Marketplace Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-col items-center"
            >
              <p className="text-slate-400 text-sm">
                Already have credits? Visit the official{" "}
                <a 
                  href="https://credex.rocks/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 font-bold hover:underline"
                >
                  Credex Marketplace →
                </a>
              </p>
            </motion.div>

            {/* Logo Wall — using text-based logos for a cleaner, modern look */}
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

        {/* Social Proof Section */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Trusted by Founders & Finance Teams</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote: "Fluxora found $2,400 in annual wastage across our engineering team in under a minute. It's the first thing I send to our portfolio companies now.",
                  author: "Sarah Chen",
                  role: "Founding Partner at SeedFlow Ventures"
                },
                {
                  quote: "I thought we were lean. Fluxora proved we were double-paying for LLM subscriptions across three different departments.",
                  author: "Markus V.",
                  role: "CTO at ScaleSync"
                }
              ].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative"
                >
                  <div className="text-blue-600 mb-4 text-4xl font-serif leading-none">“</div>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6 italic">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{testimonial.author}</p>
                      <p className="text-slate-400 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {[
                {
                  q: "Is this just another AI wrapper?",
                  a: "No. The core audit engine is deterministic. We use hardcoded math and a registry of real 2026 pricing data. We only use AI to summarize findings into a human-readable memo."
                },
                {
                  q: "Do I need to connect my bank account?",
                  a: "Not for the initial audit. You can manually enter your tool stack to get an instant report. For deeper capital recovery, we offer a consultation to review your actual billing data."
                },
                {
                  q: "How do you find &apos;Hidden&apos; savings?",
                  a: "We look for Functional Overlap. For example, if you pay for Cursor (which includes Claude 3.5) and a separate Claude Pro subscription for the same user, we flag that as 100% wastage."
                },
                {
                  q: "What happens after the audit?",
                  a: "You get a shareable URL and a PDF report. If you have significant wastage, we'll offer a path to liquidate unused credits on the Fluxora Marketplace."
                },
                {
                  q: "Is my data private?",
                  a: "Absolutely. Your audit is private by default. Only you can see the results unless you choose to generate a Shareable Link. We never sell your company data to third parties."
                }
              ].map((faq, i) => (
                <div key={i} className="border-b border-slate-100 pb-8">
                  <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-3">
                    <span className="text-blue-600 font-serif">Q.</span> {faq.q}
                  </h3>
                  <p className="text-slate-500 leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 relative bg-slate-900 text-white overflow-hidden">
          {/* Subtle noise pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Audit your stack before renewals hit.</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Connect your workspace to generate a full AI spend audit in under 60 seconds. <br className="hidden md:block"/> Get a CFO-ready report instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/audit" 
                className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Start Free Audit
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6 font-medium">
              No account or credit card required. — Or visit the official{" "}
              <a href="https://credex.rocks/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Marketplace
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">Fluxora</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">© {new Date().getFullYear()} Fluxora Platform. Deterministic AI Spend Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
