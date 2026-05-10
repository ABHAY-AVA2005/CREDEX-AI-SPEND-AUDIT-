import AuditForm from "@/components/audit/AuditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
            Credex AI Spend Audit
          </h1>
          <p className="text-xl text-muted-foreground">
            Enter your current AI stack to uncover redundancies, optimize your SaaS spend, and discover how much you could save by buying or selling credits on Credex.rocks.
          </p>
        </div>
        
        <AuditForm />
      </div>
    </div>
    </div>
  );
}
