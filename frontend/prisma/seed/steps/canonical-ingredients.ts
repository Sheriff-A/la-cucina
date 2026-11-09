import type { PrismaClient } from "@/app/generated/prisma/client";
import {
  STARTER_CANONICAL_INGREDIENTS,
  type StarterCanonicalIngredient,
} from "../data/starter-canonical-ingredients";

/**
 * Creates the starter canonical ingredients that don't exist yet (matched by name, ignoring
 * case), with their aliases and allowed units. Never updates an existing ingredient, so an
 * admin's edits survive a re-run. Needs the USDA import to have run first.
 */
export async function seedCanonicalIngredients(
  prisma: PrismaClient,
  ingredients: readonly StarterCanonicalIngredient[] = STARTER_CANONICAL_INGREDIENTS,
): Promise<void> {
  const fdcIds = [...new Set(ingredients.map((i) => i.fdcId))];
  const found = new Set(
    (
      await prisma.referenceFood.findMany({
        where: { fdcId: { in: fdcIds } },
        select: { fdcId: true },
      })
    ).map((f) => f.fdcId),
  );
  const missingFoods = fdcIds.filter((id) => !found.has(id));
  if (missingFoods.length > 0) {
    throw new Error(
      `${missingFoods.length} reference foods are missing (e.g. USDA ${missingFoods.slice(0, 5).join(", ")}). ` +
        "Run `npm run db:import-usda` first.",
    );
  }

  const sections = new Map(
    (
      await prisma.grocerySection.findMany({ select: { id: true, name: true } })
    ).map((s) => [s.name, s.id]),
  );
  const existing = new Set(
    (await prisma.canonicalIngredient.findMany({ select: { name: true } })).map(
      (i) => i.name.toLowerCase(),
    ),
  );
  const existingAliases = new Set(
    (await prisma.ingredientAlias.findMany({ select: { name: true } })).map(
      (a) => a.name.toLowerCase(),
    ),
  );

  let created = 0;
  for (const ingredient of ingredients) {
    if (existing.has(ingredient.name.toLowerCase())) continue;
    const sectionId = sections.get(ingredient.grocerySection);
    if (!sectionId) {
      throw new Error(
        `Grocery section "${ingredient.grocerySection}" (for ${ingredient.name}) doesn't exist. Was it renamed?`,
      );
    }
    const aliases = (ingredient.aliases ?? []).filter(
      (a) => !existingAliases.has(a.toLowerCase()),
    );
    await prisma.canonicalIngredient.create({
      data: {
        name: ingredient.name,
        pluralName: ingredient.pluralName,
        grocerySectionId: sectionId,
        status: "approved",
        referenceFoodId: ingredient.fdcId,
        aliases: { create: aliases.map((name) => ({ name })) },
        allowedUnits: {
          create: Object.entries(ingredient.units).map(
            ([unitCode, gramWeight]) => ({
              unitCode,
              gramWeight,
            }),
          ),
        },
      },
    });
    for (const a of aliases) existingAliases.add(a.toLowerCase());
    created++;
  }
  console.log(
    `  canonical ingredients: ${created} created, ${ingredients.length - created} already there`,
  );
}
