"use client";

import React, { useState } from "react";
import { FluxoraLogo } from "@/components/Logo";
import { ArrowRight, Zap } from "lucide-react";

export default function WidgetPage() {
  const [step, setStep] = useState(1);
  const [tool, setTool] = useState("");
  const [spend, setSpend] = useState("");

  const calculateEstimate = () => {
    const val = parseFloat(spend) || 0;
    return Math.round(val * 0.4); // 40% heuristic for the teaser
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-[320px] bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-6">
          <FluxoraLogo className="w-6 h-6" />
          <span className="font-stylish text-lg font-black tracking-tight">FLUXORA</span>
        </div>

        {step === 1 ? (
          <div className="space-y-4 relative z-10">
            <h2 className="text-sm font-bold text-foreground">Estimate your AI savings instantly.</h2>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Primary Tool</label>
              <select 
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="w-full bg-background border border-border p-2 rounded-lg text-sm"
              >
                <option value="">Select...</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Claude">Claude</option>
                <option value="Cursor">Cursor</option>
                <option value="Copilot">Copilot</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Monthly Spend ($)</label>
              <input 
                type="number" 
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                placeholder="e.g. 500"
                className="w-full bg-background border border-border p-2 rounded-lg text-sm"
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!tool || !spend}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              Check Savings <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-6 relative z-10 animate-in fade-in zoom-in duration-500">
            <div>
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Estimated Recovery</div>
              <div className="text-4xl font-black text-foreground tracking-tighter">${calculateEstimate()}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Per Month</div>
            </div>
            
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-3 text-left">
              <Zap className="w-5 h-5 text-primary fill-primary/20" />
              <p className="text-[10px] text-muted-foreground leading-tight">
                Our engine detected <strong className="text-foreground">Functional Redundancy</strong> in your {tool} usage.
              </p>
            </div>

            <a 
              href={`${window.location.origin}/audit`}
              target="_blank"
              className="block w-full py-3 bg-accent text-accent-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all"
            >
              Get Full CFO Audit
            </a>
            
            <button 
              onClick={() => setStep(1)}
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
