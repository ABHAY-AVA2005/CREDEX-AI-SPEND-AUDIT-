import React from "react";

export function FluxoraLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center relative group`}>
      {/* Outer glow effect - enhanced for lavender theme */}
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-700 scale-150" />
      
      {/* The Lightning Bolt Symbol - Scaled up */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] group-hover:scale-110 transition-transform duration-500"
      >
        <path 
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
          fill="url(#thunder-gradient)" 
          stroke="none" 
          strokeLinejoin="round"
          className="opacity-100 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
        />
        <defs>
          <linearGradient id="thunder-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C4B5FD" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
