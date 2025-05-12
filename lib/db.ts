import { PrismaClient } from '../lib/generated/prisma/client'


let prisma: PrismaClient;

// In development mode, use the global instance to avoid multiple Prisma instances
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export const db = prisma;
