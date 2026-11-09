// The development seed: `npm run db:seed` (or `npx prisma db seed --config prisma7.config.ts`).
//
// Re-runnable. Refuses to run unless DATABASE_URL is a known development or preview Neon
// branch, or a local Postgres (ADR-0010). Seeded users need Neon Auth, so they're skipped on
// a local Postgres. Reference foods come from the USDA import (`npm run db:import-usda`),
// which must have run first.

import { createPrismaClient, loadScriptEnv, scriptDatabaseUrl } from "./db";
import { NeonApi } from "./neon-api";
import { describeTarget, NEON_PROJECT_ID, resolveTarget } from "./target";
import { seedCanonicalIngredients } from "./steps/canonical-ingredients";
import { seedGrocerySections, seedUnits } from "./steps/units-and-sections";
import { readSeedUsers, seedUsers } from "./steps/users";

async function main(): Promise<void> {
  loadScriptEnv();
  const databaseUrl = scriptDatabaseUrl();
  const neonApiKey = process.env["NEON_API_KEY"];
  const decision = await resolveTarget(databaseUrl, neonApiKey);
  if (!decision.ok) {
    console.error(`Seed refused: ${decision.reason}`);
    process.exitCode = 1;
    return;
  }
  const { target } = decision;
  // Belt and braces: resolveTarget never allows production for the seed.
  if (target.kind === "neon" && target.isProduction)
    throw new Error("Seed refused: production.");
  console.log(`Seeding ${describeTarget(target)}`);

  // Read before writing anything, so a missing setting fails fast.
  const users = target.kind === "neon" ? readSeedUsers() : [];

  const prisma = createPrismaClient(databaseUrl!);
  try {
    await seedUnits(prisma);
    await seedGrocerySections(prisma);
    await seedCanonicalIngredients(prisma);
    if (target.kind === "neon") {
      await seedUsers(
        prisma,
        new NeonApi(neonApiKey!, NEON_PROJECT_ID),
        target.branchId,
        users,
      );
    } else {
      console.log("  users: skipped (no Neon Auth on a local Postgres)");
    }
  } finally {
    await prisma.$disconnect();
  }
  console.log("Seed done.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
