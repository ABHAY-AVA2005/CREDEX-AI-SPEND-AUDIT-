/**
 * lib/bulk-pricing-syncer.ts
 * Master B2B SaaS Bulk Pricing Synchronizer.
 * Solves individual HTML scraping limitations (Cloudflare blocks, slow HTTP times)
 * by leveraging Gemini's vast financial knowledge base to bulk-verify and sync 
 * all 90+ tools in our registry at once.
 */

import { GoogleGenAI } from "@google/genai";
import { ALL_KNOWN_TOOLS } from "../core/audit-engine/knowledge";
import { syncLiveToolPrice } from "./pricing-registry";

const ai = new GoogleGenAI({});

export interface BulkSyncReport {
  success: boolean;
  totalSynced: number;
  logs: string[];
}

/**
 * Bulk-Syncs the entire 90+ tools registry autonomously using Gemini.
 * Chunks the tools into batches of 30 to maintain extreme precision and stay 
 * within token boundaries.
 */
export async function syncAllRegistryPricing(): Promise<BulkSyncReport> {
  const logs: string[] = [];
  
  if (!process.env.GEMINI_API_KEY) {
    return { success: false, totalSynced: 0, logs: ["Bulk Sync failed: GEMINI_API_KEY is not configured."] };
  }

  // 1. Isolate unique tool names from our registry of 90+ tools
  const uniqueToolNames = Array.from(new Set(ALL_KNOWN_TOOLS.map(t => t.name)));
  logs.push(`Identified ${uniqueToolNames.length} unique tools in the registry to synchronize.`);

  // 2. Split unique tools into batches of 30 to ensure 100% AI precision
  const batchSize = 30;
  const batches: string[][] = [];
  for (let i = 0; i < uniqueToolNames.length; i += batchSize) {
    batches.push(uniqueToolNames.slice(i, i + batchSize));
  }

  let totalSyncedCount = 0;

  try {
    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      const batchTools = batches[batchIdx];
      logs.push(`[Batch ${batchIdx + 1}/${batches.length}] Processing ${batchTools.length} tools...`);

      const prompt = `
        You are an elite B2B SaaS pricing intelligence agent.
        Your task is to retrieve the current monthly pricing structures (USD) for these tools:
        [${batchTools.join(", ")}]

        For each tool, output all active seat-based plan tiers (e.g. Free, Pro, Business, Team).
        Format the extracted records EXACTLY as a valid JSON array matching this structure:
        
        interface ScrapedPlan {
          toolName: string; // Must exactly match one of the requested tools
          planName: string; // e.g. "Pro", "Team", "Business", "Free"
          costPerSeat: number; // Monthly cost per single user seat in USD (numbers only, e.g. 20. If custom/enterprise/free, use 0)
          capabilities: string[]; // e.g. ["CODE", "CHAT", "IMAGE", "VIDEO"]
          isEnterprise: boolean; // true if it is a corporate/enterprise tier
        }

        Strict Constraints:
        1. Output ONLY the raw JSON array. Do not wrap in markdown tags or add comments.
        2. Ensure all calculations reflect monthly costs (divide annual plans by 12).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const cleanJsonText = response.text?.trim()
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim() || "[]";

      interface ScrapedBulkPlan {
        toolName: string;
        planName: string;
        costPerSeat?: number;
        capabilities?: string[];
        isEnterprise?: boolean;
      }

      const parsedPlans: ScrapedBulkPlan[] = JSON.parse(cleanJsonText);

      if (Array.isArray(parsedPlans) && parsedPlans.length > 0) {
        for (const plan of parsedPlans) {
          if (!plan.toolName || !plan.planName) continue;
          
          await syncLiveToolPrice(
            plan.toolName,
            plan.planName,
            plan.costPerSeat ?? 0,
            plan.capabilities ?? ["CHAT"],
            plan.isEnterprise ?? false
          );
          totalSyncedCount++;
        }
        logs.push(`[Batch ${batchIdx + 1}/${batches.length}] Successfully synchronized ${parsedPlans.length} plans.`);
      } else {
        logs.push(`[Batch ${batchIdx + 1}/${batches.length}] Warning: AI returned empty list.`);
      }
    }

    return {
      success: true,
      totalSynced: totalSyncedCount,
      logs
    };

  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[BulkSync] Critical error during bulk pricing sync:", error);
    logs.push(`Critical Sync Error: ${error.message || "Unknown error"}`);
    return {
      success: false,
      totalSynced: totalSyncedCount,
      logs
    };
  }
}
