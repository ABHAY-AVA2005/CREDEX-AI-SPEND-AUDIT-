"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground transition-all active:scale-95 border border-border shadow-sm group"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 overflow-hidden">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-0 left-0 text-indigo-400" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
        {theme === "light" ? "Dark" : "Light"}
      </span>
    </button>
  )
}
