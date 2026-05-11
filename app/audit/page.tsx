import AuditForm from "@/components/audit/AuditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FluxoraLogo } from "@/components/Logo";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background/50 text-foreground selection:bg-primary/20">
      
      {/* Global Header — Pins the 'Back' button to the far left for consistent navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-full px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <FluxoraLogo className="w-8 h-8" />
          <ThemeToggle />
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Intake Header — Focuses on the "Aha!" moment of savings */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter lg:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AI Spend Audit
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
