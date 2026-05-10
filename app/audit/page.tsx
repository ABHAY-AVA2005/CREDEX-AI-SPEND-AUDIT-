import AuditForm from "@/components/audit/AuditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * AuditPage.tsx
 * The main intake portal for the deterministic audit engine.
 * We've designed this view to be distraction-free to maximize completion rates.
 */

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100">
      
      {/* Global Header — Pins the 'Back' button to the far left for consistent navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-full px-4 sm:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Intake Header — Focuses on the "Aha!" moment of savings */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter lg:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI Spend Audit
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Identify redundancies in your stack and recover up to 40% of your SaaS budget using our deterministic analysis engine.
            </p>
          </div>
          
          {/* The high-conversion single-page form */}
          <AuditForm />
        </div>
      </div>
    </div>
  );
}
