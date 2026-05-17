"use client";

import { useEffect } from "react";

export function ScrollFix() {
  useEffect(() => {
    const handleWheel = () => {
      const activeEl = document.activeElement;
      
      // If a number input is focused, remove focus when scrolling starts
      if (
        activeEl &&
        activeEl.tagName === "INPUT" &&
        (activeEl as HTMLInputElement).type === "number"
      ) {
        (activeEl as HTMLInputElement).blur();
      }
    };

    // Passive listener keeps touchpad/mouse scrolling completely lag-free
    document.addEventListener("wheel", handleWheel, { passive: true });
    
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
