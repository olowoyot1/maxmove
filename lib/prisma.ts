import { PrismaClient } from '@prisma/client';

// Vercel may expose the same Postgres connection under one of these aliases.
// Prisma reads DATABASE_URL, so normalize it before creating the client.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL ?? process.env.POSTGRES_URL;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
