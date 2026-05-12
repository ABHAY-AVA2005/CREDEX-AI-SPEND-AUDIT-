"use client";

/**
 * LandingPage.tsx
 * The first impression for the Fluxora Audit platform.
 * I've gone for a "High-End Fintech" look—lots of whitespace, 
 * bold serif typography, and subtle grid backgrounds.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FluxoraLogo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground selection:bg-primary/20 relative">
      
      {/* Subtle glow at the top - dimmed for dark mode */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-accent/10 to-transparent z-0 pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 sm:gap-4 group cursor-pointer">
            <FluxoraLogo className="w-8 h-8 sm:w-12 sm:h-12" />
            <span className="font-stylish text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground transition-all group-hover:text-primary">FLUXORA.</span>
          </div>
          
          <nav className="flex items-center gap-3 sm:gap-6">
            <ThemeToggle />
            <a 
              href="https://credex.rocks/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden min-[480px]:block"
            >
              Marketplace
            </a>
            <Link 
              href="/consultation" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Strategy
            </Link>
            <Link 
              href="/audit" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-xl sm:rounded-2xl hover:opacity-90 transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              Start Free Audit
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow z-10 pt-4">
        <section className="relative pt-12 pb-32 md:pt-16 md:pb-40 overflow-hidden">
          
          {/* Abstract background blobs for a bit of premium depth */}
          <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl opacity-50 -z-10"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* The Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary text-foreground text-[10px] font-bold uppercase tracking-widest mb-8 md:mb-10 shadow-xl shadow-accent/5 border border-border"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent mr-3 animate-pulse"></span>
              CFO-Grade AI Spend Intelligence
            </motion.div>
            
            {/* The Big Hook */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-8xl font-stylish font-black tracking-tighter mb-8 text-foreground leading-[0.95]"
            >
              Paying for AI tools?<br />
              <span className="text-primary font-stylish font-extrabold tracking-tight italic">Stop overpaying.</span>
            </motion.h1>
            
            {/* Subtext explaining the deterministic value prop */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 md:mt-8 max-w-2xl text-base md:text-xl text-muted-foreground mx-auto mb-10 md:mb-12 leading-relaxed"
            >
              Identify unused licenses, overlapping tools, and excessive cloud spend in under 60 seconds. FLUXORA. uses deterministic math to recover up to 40% of your AI budget.
            </motion.p>
            
            {/* CTA Group */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center"
            >
              <Link 
                href="/audit" 
                className="group relative flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-all shadow-2xl shadow-primary/20 w-full sm:w-auto overflow-hidden active:scale-[0.98]"
              >
                {/* Shimmer effect for that extra polish */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Run Free Audit <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/sample" 
                className="flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold rounded-2xl border-2 border-border bg-card text-foreground hover:bg-secondary transition-all w-full sm:w-auto active:scale-[0.98]"
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
              <p className="text-muted-foreground text-sm">
                Already have credits? Visit the official{" "}
                <a 
                  href="https://credex.rocks/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent font-bold hover:underline"
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
              className="mt-20 pt-10 border-t border-border flex flex-wrap justify-center gap-x-12 gap-y-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            >
              {["Cursor", "Claude", "OpenAI", "Gemini", "GitHub"].map((logo) => (
                <span key={logo} className="font-stylish text-2xl font-bold tracking-tight text-foreground/40">
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 bg-primary/5 backdrop-blur-sm border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-stylish font-bold text-foreground tracking-tight">Trusted by Founders & Finance Teams</h2>
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
                  className="bg-card p-8 rounded-2xl border border-border shadow-sm relative"
                >
                  <div className="text-accent mb-4 text-4xl font-serif leading-none">“</div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6 italic">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{testimonial.author}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-stylish font-bold text-foreground tracking-tight text-center mb-16">Frequently Asked Questions</h2>
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
                <div key={i} className="border-b border-border pb-8">
                  <h3 className="font-bold text-foreground text-lg mb-3 flex items-center gap-3">
                    <span className="text-accent font-serif">Q.</span> {faq.q}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 relative bg-transparent text-foreground overflow-hidden border-y border-border">
          {/* Subtle noise pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <FluxoraLogo className="w-20 h-20 mx-auto mb-8" />
            <h2 className="text-4xl font-stylish font-extrabold mb-6 tracking-tight">Audit your stack before renewals hit.</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect your workspace to generate a full AI spend audit in under 60 seconds. <br className="hidden md:block"/> Get a CFO-ready report instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/audit" 
                className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-bold rounded-lg bg-primary text-primary-foreground hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Start Free Audit
              </Link>
            </div>
            <p className="text-muted-foreground text-sm mt-6 font-medium">
              No account or credit card required. — Or visit the official{" "}
              <a href="https://credex.rocks/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Marketplace
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
