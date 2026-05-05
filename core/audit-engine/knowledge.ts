export type Capability = "CODE" | "CHAT" | "COPYWRITING" | "IMAGE" | "SEARCH" | "VIDEO";

export interface KnownTool {
  name: string;
  plan: string;
  costPerSeat: number;
  capabilities: Capability[];
  isEnterprise: boolean;
}

export const KNOWN_TOOLS: KnownTool[] = [
  // Cursor
  { name: "Cursor", plan: "Hobby", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Cursor", plan: "Pro", costPerSeat: 20, capabilities: ["CODE", "CHAT"], isEnterprise: false },
  { name: "Cursor", plan: "Business", costPerSeat: 40, capabilities: ["CODE", "CHAT"], isEnterprise: true },

  // GitHub Copilot
  { name: "GitHub Copilot", plan: "Individual", costPerSeat: 10, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Business", costPerSeat: 19, capabilities: ["CODE"], isEnterprise: true },
  { name: "GitHub Copilot", plan: "Enterprise", costPerSeat: 39, capabilities: ["CODE"], isEnterprise: true },

  // Claude
  { name: "Claude", plan: "Pro", costPerSeat: 20, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Team", costPerSeat: 25, capabilities: ["CHAT", "CODE"], isEnterprise: true },

  // ChatGPT
  { name: "ChatGPT", plan: "Plus", costPerSeat: 20, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "ChatGPT", plan: "Team", costPerSeat: 25, capabilities: ["CHAT", "CODE"], isEnterprise: true },

  // Windsurf
  { name: "Windsurf", plan: "Pro", costPerSeat: 20, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Max", costPerSeat: 100, capabilities: ["CODE"], isEnterprise: true },

  // Gemini
  { name: "Gemini", plan: "Advanced", costPerSeat: 20, capabilities: ["CHAT"], isEnterprise: false },
  
  // API Direct (Calculated as usage-based, but benchmarked at $0 seat cost)
  { name: "Anthropic API", plan: "Direct", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "OpenAI API", plan: "Direct", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Gemini API", plan: "Direct", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
];
