import { getPrismaClient } from "./prisma";
import { ALL_KNOWN_TOOLS, KnownTool } from "@/core/audit-engine/knowledge";

/**
 * Production-grade Pricing Registry Manager.
 * Queries live PostgreSQL pricing rows dynamically.
 * Features automatic soft-fail fallback to the static local registry if the database is unseeded or offline.
 */
export async function getLivePricingRegistry(): Promise<KnownTool[]> {
  try {
    if (!process.env.DATABASE_URL) {
      return ALL_KNOWN_TOOLS;
    }

    const prisma = getPrismaClient();
    const dbTools = await prisma.aiPricingRegistry.findMany();

    if (dbTools.length === 0) {
      console.warn("[PricingRegistry] DB registry is empty. Defaulting to static local library.");
      return ALL_KNOWN_TOOLS;
    }

    return dbTools.map(t => ({
      name: t.toolName,
      plan: t.planName,
      costPerSeat: t.costPerSeat,
      capabilities: t.capabilities as any,
      isEnterprise: t.isEnterprise
    }));
  } catch (err) {
    console.warn("[PricingRegistry] Failed to query PostgreSQL. Using local fallback array.", err);
    return ALL_KNOWN_TOOLS;
  }
}

/**
 * Live Sync Scraper Hook:
 * Overwrites or inserts a live pricing update into the database registry,
 * allowing live dynamic pricing updates without editing code files.
 */
export async function syncLiveToolPrice(
  toolName: string,
  planName: string,
  costPerSeat: number,
  capabilities: string[] = ["CHAT"],
  isEnterprise = false
): Promise<boolean> {
  try {
    const prisma = getPrismaClient();

    await prisma.aiPricingRegistry.upsert({
      where: {
        // Find existing plan or create new one
        id: `${toolName}-${planName}`.toLowerCase().replace(/\s+/g, "_")
      },
      update: {
        costPerSeat,
        capabilities,
        isEnterprise
      },
      create: {
        id: `${toolName}-${planName}`.toLowerCase().replace(/\s+/g, "_"),
        toolName,
        planName,
        costPerSeat,
        capabilities,
        isEnterprise
      }
    });
    return true;
  } catch (err) {
    console.error("[PricingRegistry] Live sync pricing update failed:", err);
    return false;
  }
}
