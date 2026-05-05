"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center text-slate-500">
      Loading your audit results...
    </div>
  );

  return <ResultsClient result={result} />;
}
