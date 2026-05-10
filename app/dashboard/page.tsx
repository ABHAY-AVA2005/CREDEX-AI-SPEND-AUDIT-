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
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 bg-[#FAFAFA]">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p className="font-medium mb-6">Preparing your financial breakdown...</p>
      <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );

  // We reuse the ResultsClient component for a consistent dashboard view
  return <ResultsClient result={result} />;
}
