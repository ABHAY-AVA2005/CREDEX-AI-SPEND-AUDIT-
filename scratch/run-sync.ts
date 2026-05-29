import { syncAllRegistryPricing } from "../lib/bulk-pricing-syncer";

async function run() {
  console.log("Starting master bulk dynamic pricing registry sync using Gemini...");
  const report = await syncAllRegistryPricing();
  console.log("\n==================================================");
  console.log("Sync Completed Successfully!");
  console.log("Success Status:", report.success);
  console.log("Total Plan Tiers Synced:", report.totalSynced);
  console.log("==================================================");
  console.log("\nExecution Logs:");
  report.logs.forEach(l => console.log("  -", l));
}

run().catch(console.error);
