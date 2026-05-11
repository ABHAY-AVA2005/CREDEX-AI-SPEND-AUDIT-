import React from "react";

export function FluxoraLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center relative group`}>
      {/* Outer glow effect */}
      <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full group-hover:bg-violet-500/30 transition-all duration-500" />
      
      {/* The Lightning Bolt Symbol */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
      >
        <path 
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
          fill="url(#thunder-gradient)" 
          stroke="#A78BFA" 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="thunder-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
