const { PrismaClient } = require('@prisma/client');

async function main() {
  process.env.DATABASE_URL = "postgresql://postgres.bftvpvlsuyxxwcfemxng:CREDEX-AI-SPEND-AUDIT@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
  
  console.log("Testing connection to Supabase...");
  const prisma = new PrismaClient();

  try {
    const start = Date.now();
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✅ CONNECTED SUCCESSFUL (", Date.now() - start, "ms )");
    
    const count = await prisma.audit.count();
    console.log("✅ DATABASE SCHEMA VERIFIED (", count, "audits found)");
    
    console.log("Testing write capability...");
    const testAudit = await prisma.audit.create({
      data: {
        companySize: 1,
        industry: "TEST",
        totalSpend: 0,
        optimizedSpend: 0,
        savings: 0,
        isPublic: false,
        publicSlug: "test-" + Date.now(),
      }
    });
    console.log("✅ WRITE SUCCESSFUL (ID:", testAudit.id, ")");
    
    // Cleanup
    await prisma.audit.delete({ where: { id: testAudit.id } });
    console.log("✅ DELETE SUCCESSFUL (Cleanup complete)");

  } catch (e) {
    console.error("❌ CONNECTION FAILED");
    console.error(e.message || e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
