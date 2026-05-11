"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { FluxoraLogo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <FluxoraLogo className="w-24 h-24 mx-auto" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-black font-stylish tracking-tighter text-foreground mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground mb-8">
          Report Not Found
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
          The audit you&apos;re looking for doesn&apos;t exist or has been moved. 
          Start a new analysis to uncover your savings.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-8 py-4 bg-secondary text-foreground font-bold rounded-2xl hover:bg-border transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link 
            href="/audit" 
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            Start New Audit <Search className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Subtle background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}
