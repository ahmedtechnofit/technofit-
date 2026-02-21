import { PrismaClient } from '@prisma/client';

// Global variable to prevent multiple Prisma instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with PostgreSQL
function createPrismaClient() {
  return new PrismaClient({
    log: ['error'],
  });
}

// Use existing client or create new one
export const db = globalForPrisma.prisma ?? createPrismaClient();

// In development, save to global to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
