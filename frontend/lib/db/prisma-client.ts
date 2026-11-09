// Creating a Prisma client. Prisma 7 needs a driver adapter; we use node-postgres.
// Shared by the app (lib/db/prisma.ts) and the scripts (prisma/seed/db.ts).

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

/**
 * node-postgres treats sslmode=require as verify-full today and warns that this will change.
 * Asking for verify-full explicitly keeps today's (stricter) behaviour without the warning.
 */
export function withExplicitSslMode(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  if (url.searchParams.get("sslmode") === "require")
    url.searchParams.set("sslmode", "verify-full");
  return url.toString();
}

export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: withExplicitSslMode(databaseUrl),
    }),
  });
}
