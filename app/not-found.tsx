"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Zap } from "lucide-react";
import { FluxoraLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* 3D Perspective Grid */}
      <div className="grid-perspective opacity-20" />
      
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <FluxoraLogo className="w-8 h-8" />
            <span className="font-stylish text-xl font-black tracking-tight text-foreground transition-all group-hover:text-primary">Fluxora</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <FluxoraLogo className="w-32 h-32 mx-auto relative z-10 drop-shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-destructive/20">
            <Zap className="w-3 h-3 mr-2 fill-destructive" /> Error Code: 404
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-stylish tracking-tighter text-foreground mb-4 leading-none">
            Report Lost.
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            The audit report you&apos;re looking for has been liquidated or never existed in our deterministic database.
          </h2>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-8 py-4 bg-secondary/50 backdrop-blur-md border border-white/10 text-foreground font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Safety
            </Link>
            <Link 
              href="/audit" 
              className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 group"
            >
              Start New Audit <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Fluxora Intelligence • Verified Analysis
        </p>
      </footer>

      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
}
