import type { PrismaClient } from "@/app/generated/prisma/client";
import { STARTING_GROCERY_SECTIONS } from "@/lib/grocery/grocery-sections";
import { UNITS } from "@/lib/units/unit-list";

/**
 * Upserts the fixed unit list by code. The seed owns these rows: mass and volume units are
 * never changed from the app (ADR-0003). Count units an admin added are left alone.
 */
export async function seedUnits(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction(
    UNITS.map((unit, position) => {
      const data = {
        name: unit.name,
        pluralName: unit.pluralName,
        abbreviation: unit.abbreviation,
        kind: unit.kind,
        system: unit.system,
        position,
      };
      return prisma.unit.upsert({
        where: { code: unit.code },
        create: { code: unit.code, ...data },
        update: data,
      });
    }),
  );
  console.log(`  units: ${UNITS.length} upserted`);
}

/**
 * Creates any starting grocery section that's missing. Existing sections are an admin's to
 * rename and reorder, so they're never changed here.
 */
export async function seedGrocerySections(prisma: PrismaClient): Promise<void> {
  const existing = new Set(
    (await prisma.grocerySection.findMany({ select: { name: true } })).map(
      (s) => s.name,
    ),
  );
  const missing = STARTING_GROCERY_SECTIONS.map((name, position) => ({
    name,
    position,
  })).filter((s) => !existing.has(s.name));
  if (missing.length > 0)
    await prisma.grocerySection.createMany({ data: missing });
  console.log(
    `  grocery sections: ${missing.length} created, ${STARTING_GROCERY_SECTIONS.length - missing.length} already there`,
  );
}
