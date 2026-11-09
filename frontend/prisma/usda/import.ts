// USDA FoodData Central import (ADR-0004): `npm run db:import-usda -- [--data-dir <dir>]`.
//
// Upserts reference foods and their household portions by USDA ID from SR Legacy and
// Foundation Foods (foundation_food rows only). Re-runnable: run it again for a new
// Foundation Foods release. It never changes canonical ingredients. Reference foods that
// left the data are kept (deleting one would unlink canonical ingredients); the report lists
// every canonical ingredient whose reference food changed or disappeared, for an admin.
// Nutrients aren't imported yet: they come with the nutrition work.
//
// The data folder comes from --data-dir or USDA_DATA_DIR. Writes go through the same branch
// check as the seed; reference data may go to production only with --allow-production.

import { parseArgs } from "node:util";
import type { PrismaClient } from "@/app/generated/prisma/client";
import {
  createPrismaClient,
  loadScriptEnv,
  scriptDatabaseUrl,
} from "../seed/db";
import { describeTarget, resolveTarget } from "../seed/target";
import {
  findDatasetFolders,
  readDataset,
  sourceLabel,
  type Dataset,
} from "./datasets";
import { compareLinks, snapshotLinks } from "./link-report";

const BATCH_SIZE = 2000;

function chunks<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size)
    result.push(items.slice(i, i + size));
  return result;
}

async function upsertDataset(
  prisma: PrismaClient,
  dataset: Dataset,
): Promise<void> {
  for (const batch of chunks(dataset.foods, BATCH_SIZE)) {
    await prisma.$executeRaw`
      INSERT INTO reference_foods (fdc_id, source, description, usda_category, imported_at)
      SELECT f.fdc_id, f.source::"ReferenceFoodSource", f.description, f.usda_category, now()
      FROM unnest(
        ${batch.map((f) => f.fdcId)}::int[],
        ${batch.map((f) => f.source)}::text[],
        ${batch.map((f) => f.description)}::text[],
        ${batch.map((f) => f.usdaCategory)}::text[]
      ) AS f(fdc_id, source, description, usda_category)
      ON CONFLICT (fdc_id) DO UPDATE SET
        source = EXCLUDED.source,
        description = EXCLUDED.description,
        usda_category = EXCLUDED.usda_category,
        imported_at = EXCLUDED.imported_at`;
  }

  for (const batch of chunks(dataset.portions, BATCH_SIZE)) {
    await prisma.$executeRaw`
      INSERT INTO reference_food_portions (id, fdc_id, amount, unit_name, modifier, description, gram_weight)
      SELECT * FROM unnest(
        ${batch.map((p) => p.id)}::int[],
        ${batch.map((p) => p.fdcId)}::int[],
        ${batch.map((p) => p.amount)}::numeric[],
        ${batch.map((p) => p.unitName)}::text[],
        ${batch.map((p) => p.modifier)}::text[],
        ${batch.map((p) => p.description)}::text[],
        ${batch.map((p) => p.gramWeight)}::numeric[]
      )
      ON CONFLICT (id) DO UPDATE SET
        fdc_id = EXCLUDED.fdc_id,
        amount = EXCLUDED.amount,
        unit_name = EXCLUDED.unit_name,
        modifier = EXCLUDED.modifier,
        description = EXCLUDED.description,
        gram_weight = EXCLUDED.gram_weight`;
  }

  // Portions USDA removed from a food that's still here. Touches reference data only.
  const removedPortions = await prisma.$executeRaw`
    DELETE FROM reference_food_portions p
    USING reference_foods f
    WHERE p.fdc_id = f.fdc_id
      AND f.source = ${dataset.source}::"ReferenceFoodSource"
      AND NOT (p.id = ANY(${dataset.portions.map((p) => p.id)}::int[]))`;

  const goneFoods = await prisma.referenceFood.count({
    where: {
      source: dataset.source,
      fdcId: { notIn: dataset.foods.map((f) => f.fdcId) },
    },
  });

  console.log(
    `  ${sourceLabel(dataset.source)}: ${dataset.foods.length} foods, ${dataset.portions.length} portions upserted` +
      ` (${dataset.skippedPortions} portion rows skipped, ${removedPortions} stale portions removed,` +
      ` ${goneFoods} foods no longer in the data kept)`,
  );
}

async function main(): Promise<void> {
  loadScriptEnv();
  const { values } = parseArgs({
    options: {
      "data-dir": { type: "string" },
      "allow-production": { type: "boolean", default: false },
    },
  });
  const dataDir = values["data-dir"] ?? process.env["USDA_DATA_DIR"];
  if (!dataDir) {
    console.error(
      "Pass --data-dir <folder> or set USDA_DATA_DIR (see .env.seed.example).",
    );
    process.exitCode = 1;
    return;
  }

  const databaseUrl = scriptDatabaseUrl();
  const decision = await resolveTarget(
    databaseUrl,
    process.env["NEON_API_KEY"],
    {
      allowProduction: values["allow-production"],
    },
  );
  if (!decision.ok) {
    console.error(`USDA import refused: ${decision.reason}`);
    process.exitCode = 1;
    return;
  }

  const folders = findDatasetFolders(dataDir);
  if (!folders.has("sr_legacy")) {
    console.error(
      `No SR Legacy CSV folder (with sr_legacy_food.csv) found in ${dataDir}.`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    `Importing USDA reference foods into ${describeTarget(decision.target)}`,
  );

  const prisma = createPrismaClient(databaseUrl!);
  try {
    const before = await snapshotLinks(prisma);
    const presentIds = new Set<number>();
    for (const [source, folder] of folders) {
      console.log(`  reading ${folder}`);
      const dataset = readDataset(source, folder);
      await upsertDataset(prisma, dataset);
      for (const food of dataset.foods) presentIds.add(food.fdcId);
    }
    const after = await snapshotLinks(prisma);

    const findings = compareLinks(before, after, presentIds);
    if (findings.length === 0) {
      console.log(
        "No canonical ingredient's reference food changed or disappeared.",
      );
    } else {
      console.log(`Canonical ingredients to review (${findings.length}):`);
      for (const finding of findings) console.log(`  - ${finding}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
