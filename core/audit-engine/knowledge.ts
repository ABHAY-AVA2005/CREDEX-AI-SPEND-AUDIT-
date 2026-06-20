/**
 * knowledge.ts
 * Our registry of AI tool pricing and capabilities as of May 2026.
 * 
 * IMPORTANT: This is the source of truth for the deterministic engine. 
 * If OpenAI raises prices, we update it here, and every subsequent audit 
 * reflects the change immediately.
 */

export type Capability = "CODE" | "CHAT" | "COPYWRITING" | "IMAGE" | "SEARCH" | "VIDEO";

export interface KnownTool {
  name: string;
  plan: string;
  costPerSeat: number;
  capabilities: Capability[];
  isEnterprise: boolean;
}

export const KNOWN_TOOLS: KnownTool[] = [
  // ── Cursor ──
  { name: "Cursor", plan: "Hobby", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Cursor", plan: "Pro", costPerSeat: 20, capabilities: ["CODE", "CHAT"], isEnterprise: false },
  { name: "Cursor", plan: "Business", costPerSeat: 40, capabilities: ["CODE", "CHAT"], isEnterprise: true },
  { name: "Cursor", plan: "Enterprise", costPerSeat: 0, capabilities: ["CODE", "CHAT"], isEnterprise: true }, 

  // ── GitHub Copilot ──
  { name: "GitHub Copilot", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Individual", costPerSeat: 10, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Pro+", costPerSeat: 20, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Business", costPerSeat: 19, capabilities: ["CODE"], isEnterprise: true },
  { name: "GitHub Copilot", plan: "Enterprise", costPerSeat: 39, capabilities: ["CODE"], isEnterprise: true },

  // ── Claude (Anthropic) ──
  { name: "Claude", plan: "Free", costPerSeat: 0, capabilities: ["CHAT"], isEnterprise: false },
  { name: "Claude", plan: "Pro", costPerSeat: 20, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Max ($100)", costPerSeat: 100, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Max ($200)", costPerSeat: 200, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Team", costPerSeat: 30, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "Claude", plan: "Enterprise", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "Anthropic API", plan: "Claude 3.5 Sonnet", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Anthropic API", plan: "Claude 3 Opus", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Anthropic API", plan: "Claude 3.5 Haiku", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },

  // ── ChatGPT (OpenAI) ──
  { name: "ChatGPT", plan: "Free", costPerSeat: 0, capabilities: ["CHAT"], isEnterprise: false },
  { name: "ChatGPT", plan: "Go", costPerSeat: 10, capabilities: ["CHAT"], isEnterprise: false },
  { name: "ChatGPT", plan: "Plus", costPerSeat: 20, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "ChatGPT", plan: "Pro", costPerSeat: 200, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "ChatGPT", plan: "Team", costPerSeat: 30, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "ChatGPT", plan: "Enterprise", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "OpenAI API", plan: "GPT-4o (Flagship)", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "OpenAI API", plan: "GPT-4o-mini", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "OpenAI API", plan: "o1-preview", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },

  // ── Windsurf ──
  { name: "Windsurf", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Pro", costPerSeat: 20, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Max", costPerSeat: 200, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Teams", costPerSeat: 40, capabilities: ["CODE"], isEnterprise: true },

  // ── v0 (Vercel) ──
  { name: "v0", plan: "Free", costPerSeat: 0, capabilities: ["IMAGE", "CODE"], isEnterprise: false },
  { name: "v0", plan: "Team", costPerSeat: 30, capabilities: ["IMAGE", "CODE"], isEnterprise: true },
  { name: "v0", plan: "Business", costPerSeat: 100, capabilities: ["IMAGE", "CODE"], isEnterprise: true },
  { name: "v0", plan: "Enterprise", costPerSeat: 0, capabilities: ["IMAGE", "CODE"], isEnterprise: true },

  // ── Gemini (Google) ──
  { name: "Gemini", plan: "Free", costPerSeat: 0, capabilities: ["CHAT"], isEnterprise: false },
  { name: "Gemini", plan: "Advanced (Pro)", costPerSeat: 20, capabilities: ["CHAT"], isEnterprise: false },
  { name: "Gemini", plan: "Business", costPerSeat: 20, capabilities: ["CHAT"], isEnterprise: true },
  { name: "Gemini", plan: "Enterprise", costPerSeat: 30, capabilities: ["CHAT"], isEnterprise: true },
  { name: "Gemini API", plan: "1.5 Pro", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Gemini API", plan: "1.5 Flash", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
];

import { EXTENDED_TOOLS } from "./knowledge-extended";
export const ALL_KNOWN_TOOLS = [...KNOWN_TOOLS, ...EXTENDED_TOOLS];
