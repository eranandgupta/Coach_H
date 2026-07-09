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
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
