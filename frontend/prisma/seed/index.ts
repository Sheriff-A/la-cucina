// The development seed: `npm run db:seed` (or `npx prisma db seed --config prisma7.config.ts`).
//
// Re-runnable. Refuses to run unless DATABASE_URL is a known development or preview Neon
// branch, or a local Postgres (ADR-0010). Seeded users need Neon Auth, so they're skipped on
// a local Postgres. Reference foods come from the USDA import (`npm run db:import-usda`),
// which must have run first.

import { createPrismaClient, loadScriptEnv, scriptDatabaseUrl } from "./db";
import { describeTarget, resolveTarget } from "./target";
import { seedGrocerySections, seedUnits } from "./steps/units-and-sections";

async function main(): Promise<void> {
  loadScriptEnv();
  const databaseUrl = scriptDatabaseUrl();
  const decision = await resolveTarget(
    databaseUrl,
    process.env["NEON_API_KEY"],
  );
  if (!decision.ok) {
    console.error(`Seed refused: ${decision.reason}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Seeding ${describeTarget(decision.target)}`);

  const prisma = createPrismaClient(databaseUrl!);
  try {
    await seedUnits(prisma);
    await seedGrocerySections(prisma);
  } finally {
    await prisma.$disconnect();
  }
  console.log("Seed done.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
