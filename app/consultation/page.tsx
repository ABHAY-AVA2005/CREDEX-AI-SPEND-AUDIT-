"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Shield, Zap, ArrowRight, CheckCircle2, 
  MessageSquare, User, Mail, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { FluxoraLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("GENERAL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-card border border-primary/20 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4">Request Received</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            A Fluxora specialist will review your audit data and contact you within 2 business hours to schedule your strategy session.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20"
          >
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Global grid handles the background */}
      
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group pr-4 border-r border-white/10">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 group">
              <FluxoraLogo className="w-8 h-8" />
              <span className="font-stylish text-xl font-black tracking-tight text-foreground transition-all group-hover:text-primary">FLUXORA.</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Branding & Trust */}
          <div className="space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                <Shield className="w-3 h-3 mr-2" /> Concierge Consultation
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">
                Liquidity & Recovery <br />
                <span className="text-primary font-stylish font-extrabold italic">Strategy Session.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Connect with a Credex-certified auditor to execute your recovery plan, liquidate unused credits, and optimize your 2026 AI budget for maximum ROI.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { title: "Credit Liquidation", desc: "Convert unused licenses into secondary market capital.", icon: <Zap className="w-5 h-5" /> },
                { title: "Contract Review", desc: "Expert analysis of your enterprise AI agreements.", icon: <Calendar className="w-5 h-5" /> },
                { title: "Functional Audit", desc: "Eliminate tool overlap with deterministic mapping.", icon: <Shield className="w-5 h-5" /> },
                { title: "Direct Recovery", desc: "Average recovery of $1,200/seat per year.", icon: <CheckCircle2 className="w-5 h-5" /> }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col gap-3 hover:border-primary/40 transition-all"
                >
                  <div className="p-2 bg-primary/10 rounded-lg w-fit text-primary">{item.icon}</div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <h2 className="text-2xl font-black mb-2 tracking-tight flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" /> We’re Always Here to Help!
            </h2>
            <p className="text-xs text-muted-foreground mb-8">
              If you have any questions, please fill the form, we will get back to you asap.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all" 
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all" 
                    placeholder="jane@acme.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1">
                  👉 Reason of Contact
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "GENERAL", label: "General" },
                    { value: "LINK_INSERTION", label: "Link Insertion" },
                    { value: "BUY_SITE", label: "Want to Buy the Site" }
                  ].map((option) => (
                    <label 
                      key={option.value}
                      className={`flex items-center justify-center p-3 rounded-2xl border text-[11px] font-bold cursor-pointer transition-all ${
                        reason === option.value 
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25" 
                          : "bg-secondary/40 border-white/5 hover:border-white/20 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="reason" 
                        value={option.value} 
                        checked={reason === option.value}
                        onChange={() => setReason(option.value)}
                        className="sr-only" 
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                <textarea 
                  required
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all min-h-[120px] resize-none" 
                  placeholder="Your Message"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full group relative flex items-center justify-center py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? "Processing..." : "Schedule Strategy Session"} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Trusted by finance teams at SeedFlow, ScaleSync, & more.
              </p>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          © 2026 Fluxora Spend Intelligence • Licensed by Credex
        </p>
      </footer>
    </div>
  );
}
