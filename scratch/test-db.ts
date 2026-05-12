import { PrismaClient } from '@prisma/client';

async function testConnection() {
  const prisma = new PrismaClient();
  try {
    console.log("Checking DATABASE_URL connection...");
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful:", result);
    
    console.log("Checking schema...");
    const auditCount = await prisma.audit.count();
    console.log(`Current audit count in DB: ${auditCount}`);
    
  } catch (error) {
    console.error("Database connection failed!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
