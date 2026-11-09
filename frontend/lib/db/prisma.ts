// The app's Prisma client, over the pooled DATABASE_URL. One client per server process; in
// development it survives hot reloads on globalThis so reloads don't open new pools.

import "server-only";
import type { PrismaClient } from "@/app/generated/prisma/client";
import { createPrismaClient } from "@/lib/db/prisma-client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function prisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const client = createPrismaClient(databaseUrl);
  globalForPrisma.prisma = client;
  return client;
}
