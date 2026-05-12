"use client";

/**
 * DashboardPage.tsx
 * The post-audit landing zone. 
 * We use sessionStorage to show the latest result immediately after submission
 * to keep the UX snappy without waiting for the DB query.
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProcessedAuditResult } from "@/app/actions/audit";
import ResultsClient from "@/app/results/[slug]/ResultsClient";

export default function DashboardPage() {
  const [result, setResult] = useState<ProcessedAuditResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Attempt to pull the result we just generated from session storage
    const saved = sessionStorage.getItem("latest_audit_result");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        console.error("Soft-fail: Corrupted session data", e);
        router.push("/audit");
      }
    } else {
      // If no result is found, kick them back to the intake form
      router.push("/audit");
    }
  }, [router]);

  // Loading state while we wait for hydration/session storage access
  if (!result) return (
    <div className="min-h-screen bg-transparent flex flex-col p-8">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group pr-4 border-r border-white/10">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </Link>
      <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4 shadow-lg shadow-primary/20"></div>
        <p className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6 animate-pulse">Preparing your financial breakdown...</p>
      </div>
    </div>
  );

  // We reuse the ResultsClient component for a consistent dashboard view
  return <ResultsClient result={result} />;
}
