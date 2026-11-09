// Env loading and the Prisma client for scripts (seed, USDA import). Prisma 7 needs a driver
// adapter; scripts use node-postgres over the direct (unpooled) connection.

import { config } from "dotenv";

export { createPrismaClient } from "@/lib/db/prisma-client";

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
