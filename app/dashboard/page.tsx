"use client";

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
    const saved = sessionStorage.getItem("latest_audit_result");
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      router.push("/audit");
    }
  }, [router]);

  if (!result) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 bg-[#FAFAFA]">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
      <p className="font-medium mb-6">Analyzing your stack...</p>
      <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );

  return <ResultsClient result={result} />;
}
