import { Mail, Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white rotate-45" />
              </div>
              <span className="font-black text-lg tracking-tighter uppercase italic">Fluxora</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The deterministic AI spend auditor for high-growth startups. Built to uncover waste and reclaim capital.
            </p>
          </div>

          <div className="space-y-4 md:text-right md:flex md:flex-col md:items-end">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Support & Feedback</h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed md:text-right">
              Found a bug? Have a suggestion for improvement? I&apos;d love to hear from you.
            </p>
            <a 
              href="mailto:abhayvarshit2005@gmail.com" 
              className="group flex items-center gap-2 text-accent font-bold hover:text-accent/80 transition-colors"
            >
              <Mail className="w-4 h-4" />
              abhayvarshit2005@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            © 2026 Fluxora Audit Engine. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold hover:text-foreground transition-colors flex items-center gap-1">
              Credex.rocks <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
