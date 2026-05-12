const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("Database URL:", process.env.DATABASE_URL);
  const prisma = new PrismaClient();
  try {
    const start = Date.now();
    console.log("Attempting to connect to DB...");
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("Success! Database responded in", Date.now() - start, "ms");
    console.log("Response:", result);
    
    const count = await prisma.audit.count();
    console.log("Found", count, "audits in the database.");
  } catch (e) {
    console.error("Database connection failed:");
    console.error(e.message);
    if (e.message.includes("Can't reach database server")) {
      console.error("TIP: Check your internet connection or if the DB server is active.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
