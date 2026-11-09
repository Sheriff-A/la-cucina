// Env loading and the Prisma client for scripts (seed, USDA import). Prisma 7 needs a driver
// adapter; scripts use node-postgres over the direct (unpooled) connection.

import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

/**
 * Loads .env.development.local (DATABASE_URL: the Neon development branch) and
 * .env.seed.local (NEON_API_KEY, seeded users). Variables already set in the environment
 * win, so a one-off `DATABASE_URL_UNPOOLED=… npm run db:seed` targets another branch, and
 * still goes through the branch check.
 */
export function loadScriptEnv(): void {
  config({ path: [".env.development.local", ".env.seed.local"], quiet: true });
}

/** The URL scripts connect with (and the one the branch check checks): direct when there is one. */
export function scriptDatabaseUrl(): string | undefined {
  return process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"];
}

/**
 * node-postgres treats sslmode=require as verify-full today and warns that this will change.
 * Asking for verify-full explicitly keeps today's (stricter) behaviour without the warning.
 */
function withExplicitSslMode(databaseUrl: string): string {
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
