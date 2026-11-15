import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Prisma Accelerate is a managed connection pool that sits between the (serverless)
// app and the database. It's a SAFETY NET that activates only when PRISMA_ACCELERATE_URL
// is set (a `prisma://accelerate.prisma-data.net/?api_key=...` string from the Prisma
// Data Platform). When it's absent, we use the normal direct connection, so this file is
// a no-op change until you flip it on in the environment.
//
// We only need Accelerate's connection pooling (automatic when routing through the
// prisma:// URL) — no query changes are required. It is cast to PrismaClient so every
// existing call site keeps its types unchanged.
//
// Migrations (`prisma db push` / `migrate`) still use the direct mysql DATABASE_URL — do
// NOT point DATABASE_URL at the Accelerate URL; use PRISMA_ACCELERATE_URL for that.
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

function createPrismaClient(): PrismaClient {
  if (accelerateUrl) {
    return new PrismaClient({ datasourceUrl: accelerateUrl }).$extends(
      withAccelerate()
    ) as unknown as PrismaClient;
  }
  return new PrismaClient({ datasourceUrl: withPoolLimits(process.env.DATABASE_URL) });
}

/**
 * Serverless guard for the direct MySQL connection. Every Vercel function instance gets its
 * own client, and Hostinger caps this database user at 75 concurrent connections. Prisma's
 * default pool is (CPU count x 2 + 1) connections per instance, so a traffic burst that spins
 * up many instances blew past the cap and every query failed until it drained (Nov 2026).
 * One connection per instance keeps a burst within the cap. Values already present in the
 * URL win, so the environment can still override them.
 */
function withPoolLimits(url: string | undefined): string | undefined {
  if (!url || !url.startsWith('mysql://')) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has('connection_limit')) u.searchParams.set('connection_limit', '1');
    if (!u.searchParams.has('pool_timeout')) u.searchParams.set('pool_timeout', '20');
    return u.toString();
  } catch {
    return url;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client per process (dev hot reload, and warm serverless instances).
globalForPrisma.prisma = prisma;
