// The import's report: canonical ingredients whose linked reference food changed or
// disappeared. Read-only on canonical ingredients.

import type { PrismaClient } from "@/app/generated/prisma/client";

export interface LinkSnapshot {
  ingredientName: string;
  fdcId: number;
  description: string;
  usdaCategory: string | null;
  /** Sorted, stringified portions, so any change shows. */
  portions: string;
}

/** One entry per canonical ingredient that has a reference food. */
export async function snapshotLinks(
  prisma: PrismaClient,
): Promise<Map<string, LinkSnapshot>> {
  const ingredients = await prisma.canonicalIngredient.findMany({
    where: { referenceFoodId: { not: null } },
    select: {
      id: true,
      name: true,
      referenceFood: {
        select: {
          fdcId: true,
          description: true,
          usdaCategory: true,
          portions: {
            select: {
              id: true,
              amount: true,
              unitName: true,
              modifier: true,
              description: true,
              gramWeight: true,
            },
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  return new Map(
    ingredients.flatMap((ingredient) => {
      const food = ingredient.referenceFood;
      if (!food) return [];
      const portions = food.portions
        .map((p) =>
          [
            p.id,
            p.amount.toString(),
            p.unitName,
            p.modifier,
            p.description,
            p.gramWeight.toString(),
          ].join("|"),
        )
        .join("\n");
      return [
        [
          ingredient.id,
          {
            ingredientName: ingredient.name,
            fdcId: food.fdcId,
            description: food.description,
            usdaCategory: food.usdaCategory,
            portions,
          },
        ],
      ];
    }),
  );
}

/** Pure: compares the snapshots taken before and after an import. */
export function compareLinks(
  before: ReadonlyMap<string, LinkSnapshot>,
  after: ReadonlyMap<string, LinkSnapshot>,
  presentFdcIds: ReadonlySet<number>,
): string[] {
  const findings: string[] = [];
  for (const [id, now] of after) {
    const label = `${now.ingredientName} (USDA ${now.fdcId})`;
    if (!presentFdcIds.has(now.fdcId)) {
      findings.push(`${label}: reference food is no longer in the USDA data`);
      continue;
    }
    const then = before.get(id);
    if (!then || then.fdcId !== now.fdcId) continue;
    const changes: string[] = [];
    if (then.description !== now.description) {
      changes.push(`description "${then.description}" → "${now.description}"`);
    }
    if (then.usdaCategory !== now.usdaCategory) {
      changes.push(
        `category "${then.usdaCategory ?? "none"}" → "${now.usdaCategory ?? "none"}"`,
      );
    }
    if (then.portions !== now.portions)
      changes.push("household portions changed");
    if (changes.length > 0) findings.push(`${label}: ${changes.join("; ")}`);
  }
  return findings.sort();
}
