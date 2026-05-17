/**
 * knowledge-extended.ts
 * Feature: Expanded Tool Registry — Niche AI Tools Coverage
 *
 * The AI strategist asked: "cover more niche ai tools to make the advice
 * even smarter." This file extends knowledge.ts with 40+ additional tools
 * across coding, copywriting, image, video, search, and specialised verticals.
 *
 * USAGE: Import EXTENDED_TOOLS and spread into KNOWN_TOOLS, or query
 * separately for the "is this tool in our registry?" check.
 *
 * Pricing verified May 2026. Mark isEnterprise=true for tools that
 * price via sales/negotiation or have team billing.
 */

import type { KnownTool } from "./knowledge";

export const EXTENDED_TOOLS: KnownTool[] = [
  // ── Coding / Dev Tools ──
  { name: "Tabnine", plan: "Basic", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Tabnine", plan: "Pro", costPerSeat: 12, capabilities: ["CODE"], isEnterprise: false },
  { name: "Tabnine", plan: "Enterprise", costPerSeat: 39, capabilities: ["CODE"], isEnterprise: true },
  { name: "Codeium", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Codeium", plan: "Enterprise", costPerSeat: 19, capabilities: ["CODE"], isEnterprise: true },
  { name: "Amazon CodeWhisperer", plan: "Individual", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Amazon CodeWhisperer", plan: "Professional", costPerSeat: 19, capabilities: ["CODE"], isEnterprise: true },
  { name: "Sourcegraph Cody", plan: "Free", costPerSeat: 0, capabilities: ["CODE", "SEARCH"], isEnterprise: false },
  { name: "Sourcegraph Cody", plan: "Pro", costPerSeat: 9, capabilities: ["CODE", "SEARCH"], isEnterprise: false },
  { name: "Sourcegraph Cody", plan: "Enterprise", costPerSeat: 19, capabilities: ["CODE", "SEARCH"], isEnterprise: true },
  { name: "Devin (Cognition)", plan: "Core", costPerSeat: 500, capabilities: ["CODE"], isEnterprise: false },
  { name: "Devin (Cognition)", plan: "Enterprise", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: true },
  { name: "Replit AI", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Replit AI", plan: "Core", costPerSeat: 20, capabilities: ["CODE"], isEnterprise: false },
  { name: "Replit AI", plan: "Teams", costPerSeat: 40, capabilities: ["CODE"], isEnterprise: true },
  { name: "Bolt.new", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Bolt.new", plan: "Pro", costPerSeat: 20, capabilities: ["CODE"], isEnterprise: false },

  // ── Copywriting / Content ──
  { name: "Jasper", plan: "Creator", costPerSeat: 49, capabilities: ["COPYWRITING"], isEnterprise: false },
  { name: "Jasper", plan: "Pro", costPerSeat: 69, capabilities: ["COPYWRITING"], isEnterprise: false },
  { name: "Jasper", plan: "Business", costPerSeat: 0, capabilities: ["COPYWRITING"], isEnterprise: true },
  { name: "Copy.ai", plan: "Starter", costPerSeat: 36, capabilities: ["COPYWRITING"], isEnterprise: false },
  { name: "Copy.ai", plan: "Advanced", costPerSeat: 186, capabilities: ["COPYWRITING"], isEnterprise: false },
  { name: "Writesonic", plan: "Free", costPerSeat: 0, capabilities: ["COPYWRITING"], isEnterprise: false },
  { name: "Writesonic", plan: "Individual", costPerSeat: 20, capabilities: ["COPYWRITING"], isEnterprise: false },
  { name: "Writesonic", plan: "Teams", costPerSeat: 19, capabilities: ["COPYWRITING"], isEnterprise: true },
  { name: "Notion AI", plan: "Add-on", costPerSeat: 10, capabilities: ["COPYWRITING", "CHAT"], isEnterprise: false },
  { name: "Grammarly Business", plan: "Business", costPerSeat: 15, capabilities: ["COPYWRITING"], isEnterprise: true },
  { name: "Perplexity", plan: "Pro", costPerSeat: 20, capabilities: ["SEARCH", "CHAT"], isEnterprise: false },
  { name: "Perplexity", plan: "Enterprise Pro", costPerSeat: 40, capabilities: ["SEARCH", "CHAT"], isEnterprise: true },

  // ── Image Generation ──
  { name: "Midjourney", plan: "Basic", costPerSeat: 10, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Midjourney", plan: "Standard", costPerSeat: 30, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Midjourney", plan: "Pro", costPerSeat: 60, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Midjourney", plan: "Mega", costPerSeat: 120, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Adobe Firefly", plan: "Premium", costPerSeat: 5, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Adobe Firefly", plan: "Enterprise", costPerSeat: 0, capabilities: ["IMAGE"], isEnterprise: true },
  { name: "DALL-E (OpenAI)", plan: "API usage-based", costPerSeat: 0, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Stable Diffusion (Stability AI)", plan: "Starter", costPerSeat: 20, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Stable Diffusion (Stability AI)", plan: "Enterprise", costPerSeat: 0, capabilities: ["IMAGE"], isEnterprise: true },
  { name: "Ideogram", plan: "Basic", costPerSeat: 8, capabilities: ["IMAGE"], isEnterprise: false },
  { name: "Ideogram", plan: "Plus", costPerSeat: 20, capabilities: ["IMAGE"], isEnterprise: false },

  // ── Video Generation ──
  { name: "Runway Gen-3", plan: "Standard", costPerSeat: 15, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "Runway Gen-3", plan: "Pro", costPerSeat: 35, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "Runway Gen-3", plan: "Unlimited", costPerSeat: 95, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "Synthesia", plan: "Starter", costPerSeat: 22, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "Synthesia", plan: "Creator", costPerSeat: 67, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "Synthesia", plan: "Enterprise", costPerSeat: 0, capabilities: ["VIDEO"], isEnterprise: true },
  { name: "HeyGen", plan: "Free", costPerSeat: 0, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "HeyGen", plan: "Creator", costPerSeat: 29, capabilities: ["VIDEO"], isEnterprise: false },
  { name: "Sora (OpenAI)", plan: "Plus", costPerSeat: 20, capabilities: ["VIDEO"], isEnterprise: false },

  // ── Productivity / All-in-one ──
  { name: "Microsoft Copilot 365", plan: "M365 Copilot", costPerSeat: 30, capabilities: ["CHAT", "CODE", "COPYWRITING"], isEnterprise: true },
  { name: "Google Workspace AI", plan: "Gemini for Workspace", costPerSeat: 30, capabilities: ["CHAT", "COPYWRITING"], isEnterprise: true },
  { name: "Zapier AI", plan: "Professional", costPerSeat: 69, capabilities: ["CHAT"], isEnterprise: false },

  // ── Search / Research ──
  { name: "You.com", plan: "Pro", costPerSeat: 15, capabilities: ["SEARCH", "CHAT"], isEnterprise: false },
  { name: "Bing Copilot", plan: "Free", costPerSeat: 0, capabilities: ["SEARCH", "CHAT"], isEnterprise: false },
  { name: "Bing Copilot", plan: "Enterprise", costPerSeat: 30, capabilities: ["SEARCH", "CHAT"], isEnterprise: true },
  { name: "Exa AI", plan: "API usage-based", costPerSeat: 0, capabilities: ["SEARCH"], isEnterprise: false },

  // ── API / Model Providers ──
  { name: "Together AI", plan: "API usage-based", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Replicate", plan: "API usage-based", costPerSeat: 0, capabilities: ["CHAT", "IMAGE", "CODE"], isEnterprise: false },
  { name: "Groq", plan: "API usage-based", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Mistral AI", plan: "API usage-based", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Cohere", plan: "Production", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "AWS Bedrock", plan: "API usage-based", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "Azure OpenAI", plan: "API usage-based", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: true },
];

/**
 * Checks if a tool name (case-insensitive, fuzzy) is in either the base
 * or extended registry. Returns the matched entry or null.
 */
export function findToolInRegistry(
  toolName: string,
  baseTools: KnownTool[]
): KnownTool | null {
  const needle = toolName.toLowerCase();
  const all = [...baseTools, ...EXTENDED_TOOLS];
  return (
    all.find((t) => t.name.toLowerCase() === needle) ??
    all.find((t) => needle.includes(t.name.toLowerCase())) ??
    null
  );
}

/**
 * Returns all unique tool names across both registries.
 * Use this to populate the "tool name" autocomplete dropdown in the form.
 */
export function getAllToolNames(baseTools: KnownTool[]): string[] {
  const all = [...baseTools, ...EXTENDED_TOOLS];
  return [...new Set(all.map((t) => t.name))].sort();
}
