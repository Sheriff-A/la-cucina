// Finds and reads the USDA FoodData Central CSV downloads (ADR-0004 amendment): SR Legacy
// (the main source) and Foundation Foods (fills gaps). Branded and survey foods aren't used.

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { readCsvRecords } from "./csv";

export type ReferenceFoodSource = "sr_legacy" | "foundation";

export interface ImportedFood {
  fdcId: number;
  source: ReferenceFoodSource;
  description: string;
  usdaCategory: string | null;
}

export interface ImportedPortion {
  id: number;
  fdcId: number;
  /** Kept as text so the decimal reaches Postgres unchanged. */
  amount: string;
  unitName: string | null;
  modifier: string | null;
  description: string | null;
  gramWeight: string;
}

export interface Dataset {
  source: ReferenceFoodSource;
  folder: string;
  foods: ImportedFood[];
  portions: ImportedPortion[];
  /** Portion rows dropped: no gram weight or amount, or for a food we don't import. */
  skippedPortions: number;
}

/** Each source's marker file and the `food.data_type` we keep from it. */
const SOURCES: Record<
  ReferenceFoodSource,
  { marker: string; dataType: string; label: string }
> = {
  sr_legacy: {
    marker: "sr_legacy_food.csv",
    dataType: "sr_legacy_food",
    label: "SR Legacy",
  },
  foundation: {
    marker: "foundation_food.csv",
    dataType: "foundation_food",
    label: "Foundation Foods",
  },
};

export function sourceLabel(source: ReferenceFoodSource): string {
  return SOURCES[source].label;
}

/**
 * Finds one folder per source in `dataDir` (or `dataDir` itself). When there are several
 * releases of a source, the last by name wins: USDA folder names end in the release date.
 */
export function findDatasetFolders(
  dataDir: string,
): Map<ReferenceFoodSource, string> {
  if (!existsSync(dataDir))
    throw new Error(`USDA data folder not found: ${dataDir}`);
  const candidates = [
    dataDir,
    ...readdirSync(dataDir)
      .map((name) => join(dataDir, name))
      .filter((path) => statSync(path).isDirectory())
      .sort(),
  ];
  const found = new Map<ReferenceFoodSource, string>();
  for (const folder of candidates) {
    for (const [source, { marker }] of Object.entries(SOURCES) as [
      ReferenceFoodSource,
      (typeof SOURCES)[ReferenceFoodSource],
    ][]) {
      if (existsSync(join(folder, marker))) found.set(source, folder);
    }
  }
  return found;
}

const nullIfEmpty = (value: string | undefined): string | null =>
  value === undefined || value.trim() === "" ? null : value.trim();

export function readDataset(
  source: ReferenceFoodSource,
  folder: string,
): Dataset {
  const { dataType } = SOURCES[source];
  const categories = new Map(
    readCsvRecords(join(folder, "food_category.csv")).map((r) => [
      r["id"]!,
      r["description"]!,
    ]),
  );
  const measureUnits = new Map(
    readCsvRecords(join(folder, "measure_unit.csv")).map((r) => [
      r["id"]!,
      r["name"]!,
    ]),
  );

  const foods: ImportedFood[] = readCsvRecords(join(folder, "food.csv"))
    .filter((r) => r["data_type"] === dataType)
    .map((r) => ({
      fdcId: Number(r["fdc_id"]),
      source,
      description: r["description"]!.trim(),
      usdaCategory: categories.get(r["food_category_id"] ?? "") ?? null,
    }));
  const fdcIds = new Set(foods.map((f) => f.fdcId));

  let skippedPortions = 0;
  const portions: ImportedPortion[] = [];
  for (const r of readCsvRecords(join(folder, "food_portion.csv"))) {
    const fdcId = Number(r["fdc_id"]);
    const amount = nullIfEmpty(r["amount"]);
    const gramWeight = nullIfEmpty(r["gram_weight"]);
    if (
      !fdcIds.has(fdcId) ||
      amount === null ||
      gramWeight === null ||
      Number(gramWeight) <= 0
    ) {
      skippedPortions++;
      continue;
    }
    portions.push({
      id: Number(r["id"]),
      fdcId,
      amount,
      unitName: measureUnits.get(r["measure_unit_id"] ?? "") ?? null,
      modifier: nullIfEmpty(r["modifier"]),
      description: nullIfEmpty(r["portion_description"]),
      gramWeight,
    });
  }

  return { source, folder, foods, portions, skippedPortions };
}
