"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-4 bg-destructive/10 rounded-full"
      >
        <AlertTriangle className="w-16 h-16 text-destructive" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black font-stylish tracking-tighter text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
          We encountered an unexpected error while processing your request. 
          Our engineers have been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-8 py-4 bg-secondary text-foreground font-bold rounded-2xl hover:bg-border transition-all active:scale-95"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 bg-secondary rounded-xl text-left overflow-auto max-w-2xl mx-auto">
            <p className="font-mono text-xs text-muted-foreground break-all">
              {error.message}
            </p>
          </div>
        )}
      </motion.div>

      {/* Subtle background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-destructive/5 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}
