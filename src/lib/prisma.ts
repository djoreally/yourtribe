import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton.
 *
 * Next.js hot-reload re-executes modules, which without this guard would
 * spawn a new PrismaClient (and a new pool) per file change — exhausting
 * the database in minutes. We pin the instance on globalThis in dev so
 * subsequent imports reuse it. In production each Lambda/edge instance
 * gets its own PrismaClient at cold start, which is the desired shape.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
