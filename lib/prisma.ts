import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // @ts-expect-error - Prisma 7 constructor types are strictly bound to schema
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalForPrisma.prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    } as any);
  }
  return globalForPrisma.prisma;
}
