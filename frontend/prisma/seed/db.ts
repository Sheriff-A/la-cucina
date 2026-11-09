// Env loading and the Prisma client for scripts (seed, USDA import). Prisma 7 needs a driver
// adapter; scripts use node-postgres over the direct (unpooled) connection.

import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

/**
 * Loads .env.development.local (DATABASE_URL: the Neon development branch) and
 * .env.seed.local (NEON_API_KEY, seeded users). Variables already set win, so a one-off
 * `DATABASE_URL=… npm run db:seed` targets something else, and still goes through the check.
 */
export function loadScriptEnv(): void {
  config({ path: [".env.development.local", ".env.seed.local"], quiet: true });
}

/** The URL scripts connect with: the direct connection when there is one. */
export function scriptDatabaseUrl(): string | undefined {
  return process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"];
}

export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}
