/**
 * lib/scraper.ts
 * AI-Powered Autonomous Pricing Scraper.
 * Fetches raw HTML from official AI vendor pricing pages, extracts structured tiers 
 * using Gemini, and updates the PostgreSQL pricing registry automatically.
 */

import { GoogleGenAI } from "@google/genai";
import { syncLiveToolPrice } from "./pricing-registry";

const ai = new GoogleGenAI({});

export interface ScrapedPlan {
  toolName: string;
  planName: string;
  costPerSeat: number;
  capabilities: string[];
  isEnterprise: boolean;
}

/**
 * Automates pricing catalog sync for a specific tool by scraping its landing page.
 */
export async function scrapeAndSyncToolPricing(
  toolName: string,
  pricingUrl: string
): Promise<{ success: boolean; plansSynced: ScrapedPlan[]; log: string }> {
  
  if (!process.env.GEMINI_API_KEY) {
    return { success: false, plansSynced: [], log: "Scraper failed: GEMINI_API_KEY not configured." };
  }

  try {
    console.log(`[Scraper] Ingesting live HTML from: ${pricingUrl}...`);
    
    // Fetch HTML with browser-like headers to avoid getting blocked by simple anti-scraping filters
    const response = await fetch(pricingUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with HTTP status: ${response.status}`);
    }

    const htmlText = await response.text();
    
    // Minify HTML size by stripping scripts and styles to avoid bloating Gemini context limits
    const cleanHtml = htmlText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .substring(0, 35000); // secure a clean 35k char limit

    const prompt = `
      You are an expert financial catalog parser.
      Analyze this raw, minified HTML from the pricing page of "${toolName}":
      
      --- HTML START ---
      ${cleanHtml}
      --- HTML END ---
      
      Extract all pricing tiers, active plans, and user-based monthly costs.
      Format the extracted records EXACTLY as a valid JSON array matching this TypeScript structure:
      
      interface ScrapedPlan {
        toolName: string; // Must be exactly "${toolName}"
        planName: string; // e.g. "Pro", "Team", "Business", "Free"
        costPerSeat: number; // Monthly cost per single user seat in USD (use numbers only, e.g. 20. If free/custom, use 0)
        capabilities: string[]; // e.g. ["CODE", "CHAT"]
        isEnterprise: boolean; // true if it is a corporate/enterprise tier
      }

      Strict Constraints:
      1. Output ONLY the raw JSON array. Do not wrap in markdown tags or add explanations.
      2. If pricing is only quoted annually (e.g. $240 billed annually), divide by 12 to save the monthly cost ($20).
    `;

    console.log(`[Scraper] Invoking Gemini to extract plans for ${toolName}...`);
    const responseBody = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const jsonCleanText = responseBody.text?.trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim() || "[]";

    const plans: ScrapedPlan[] = JSON.parse(jsonCleanText);

    if (!Array.isArray(plans) || plans.length === 0) {
      throw new Error("Gemini was unable to identify structured plan tiers.");
    }

    // Sync each extracted pricing tier dynamically into the database registry
    for (const plan of plans) {
      await syncLiveToolPrice(
        plan.toolName,
        plan.planName,
        plan.costPerSeat,
        plan.capabilities,
        plan.isEnterprise
      );
    }

    return {
      success: true,
      plansSynced: plans,
      log: `Successfully scraped and synced ${plans.length} pricing records for ${toolName}!`,
    };

  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[Scraper] Dynamic pricing updates failed for ${toolName}:`, error);
    return {
      success: false,
      plansSynced: [],
      log: `Failed to scrape ${toolName}: ${error.message || "Unknown error"}`,
    };
  }
}
