import { PrismaClient } from '@prisma/client';

// Vercel may expose the same Postgres connection under one of these aliases.
// Prefer the first configured value that is actually a PostgreSQL URL so a stale
// or empty DATABASE_URL cannot prevent every server route from rendering.
const postgresUrl = [
  process.env.DATABASE_URL,
  process.env.PRISMA_DATABASE_URL,
  process.env.NEON_POSTGRES_PRISMA_URL,
  process.env.NEON_POSTGRES_URL,
  process.env.POSTGRES_URL,
].map((value) => value?.trim().replace(/^['"]|['"]$/g, ''))
  .find((value) => value?.startsWith('postgresql://') || value?.startsWith('postgres://'))

if (postgresUrl) process.env.DATABASE_URL = postgresUrl

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
