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
  { name: "Cursor", plan: "Pro+", costPerSeat: 60, capabilities: ["CODE", "CHAT"], isEnterprise: false },
  { name: "Cursor", plan: "Ultra", costPerSeat: 200, capabilities: ["CODE", "CHAT"], isEnterprise: false },
  { name: "Cursor", plan: "Teams", costPerSeat: 40, capabilities: ["CODE", "CHAT"], isEnterprise: true },
  { name: "Cursor", plan: "Enterprise", costPerSeat: 0, capabilities: ["CODE", "CHAT"], isEnterprise: true }, // Custom

  // GitHub Copilot
  { name: "GitHub Copilot", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Pro", costPerSeat: 10, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Pro+", costPerSeat: 39, capabilities: ["CODE"], isEnterprise: false },
  { name: "GitHub Copilot", plan: "Business", costPerSeat: 19, capabilities: ["CODE"], isEnterprise: true },
  { name: "GitHub Copilot", plan: "Enterprise", costPerSeat: 39, capabilities: ["CODE"], isEnterprise: true },

  // Claude
  { name: "Claude", plan: "Free", costPerSeat: 0, capabilities: ["CHAT"], isEnterprise: false },
  { name: "Claude", plan: "Pro", costPerSeat: 20, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Max ($100)", costPerSeat: 100, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Max ($200)", costPerSeat: 200, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Claude", plan: "Team (Standard)", costPerSeat: 25, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "Claude", plan: "Team (Premium)", costPerSeat: 100, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "Claude", plan: "Enterprise", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: true },

  // ChatGPT
  { name: "ChatGPT", plan: "Free", costPerSeat: 0, capabilities: ["CHAT"], isEnterprise: false },
  { name: "ChatGPT", plan: "Go", costPerSeat: 8, capabilities: ["CHAT"], isEnterprise: false },
  { name: "ChatGPT", plan: "Plus", costPerSeat: 20, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "ChatGPT", plan: "Pro ($100)", costPerSeat: 100, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "ChatGPT", plan: "Pro ($200)", costPerSeat: 200, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "ChatGPT", plan: "Business", costPerSeat: 25, capabilities: ["CHAT", "CODE"], isEnterprise: true },
  { name: "ChatGPT", plan: "Enterprise", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: true },

  // Windsurf
  { name: "Windsurf", plan: "Free", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Pro", costPerSeat: 20, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Max", costPerSeat: 200, capabilities: ["CODE"], isEnterprise: false },
  { name: "Windsurf", plan: "Teams", costPerSeat: 40, capabilities: ["CODE"], isEnterprise: true },
  { name: "Windsurf", plan: "Enterprise", costPerSeat: 0, capabilities: ["CODE"], isEnterprise: true },

  // Gemini
  { name: "Gemini", plan: "Free", costPerSeat: 0, capabilities: ["CHAT"], isEnterprise: false },
  { name: "Gemini", plan: "Pro", costPerSeat: 19.99, capabilities: ["CHAT"], isEnterprise: false },
  { name: "Gemini", plan: "Ultra (Quarterly)", costPerSeat: 41.66, capabilities: ["CHAT"], isEnterprise: false },
  
  // API Direct
  { name: "Anthropic API", plan: "Direct (Usage)", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "OpenAI API", plan: "Direct (Usage)", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
  { name: "Gemini API", plan: "Direct (Usage)", costPerSeat: 0, capabilities: ["CHAT", "CODE"], isEnterprise: false },
];
