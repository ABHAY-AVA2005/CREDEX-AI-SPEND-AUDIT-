import { PrismaClient } from "@prisma/client";
import { ALL_KNOWN_TOOLS } from "../core/audit-engine/knowledge";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AI Pricing Registry into PostgreSQL database...");
  
  let seededCount = 0;
  for (const tool of ALL_KNOWN_TOOLS) {
    const id = `${tool.name}-${tool.plan}`.toLowerCase().replace(/\s+/g, "_");
    await prisma.aiPricingRegistry.upsert({
      where: { id },
      update: {
        costPerSeat: tool.costPerSeat,
        capabilities: tool.capabilities,
        isEnterprise: tool.isEnterprise
      },
      create: {
        id,
        toolName: tool.name,
        planName: tool.plan,
        costPerSeat: tool.costPerSeat,
        capabilities: tool.capabilities,
        isEnterprise: tool.isEnterprise
      }
    });
    seededCount++;
  }

  console.log(`Successfully seeded ${seededCount} AI pricing catalog records!`);
}

main()
  .catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
