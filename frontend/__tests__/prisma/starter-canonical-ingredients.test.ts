import { describe, expect, it } from "vitest";
import { STARTER_CANONICAL_INGREDIENTS } from "@/prisma/seed/data/starter-canonical-ingredients";
import { STARTING_GROCERY_SECTIONS } from "@/lib/grocery/grocery-sections";
import {
  isUnitCode,
  withCounterparts,
  type UnitCode,
} from "@/lib/units/unit-list";

describe("starter canonical ingredients", () => {
  it("has the 146 spike candidates", () => {
    expect(STARTER_CANONICAL_INGREDIENTS).toHaveLength(146);
  });

  it("has unique names and aliases, ignoring case, that never collide", () => {
    const names = STARTER_CANONICAL_INGREDIENTS.map((i) =>
      i.name.toLowerCase(),
    );
    const aliases = STARTER_CANONICAL_INGREDIENTS.flatMap(
      (i) => i.aliases ?? [],
    ).map((a) => a.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(aliases).size).toBe(aliases.length);
    expect(aliases.filter((a) => names.includes(a))).toEqual([]);
  });

  it("uses only known grocery sections and units", () => {
    for (const ingredient of STARTER_CANONICAL_INGREDIENTS) {
      expect(STARTING_GROCERY_SECTIONS).toContain(ingredient.grocerySection);
      for (const code of Object.keys(ingredient.units))
        expect(isUnitCode(code), code).toBe(true);
    }
  });

  it("allows the other-system counterpart of every mass and volume unit", () => {
    for (const ingredient of STARTER_CANONICAL_INGREDIENTS) {
      const codes = Object.keys(ingredient.units) as UnitCode[];
      expect(new Set(withCounterparts(codes)), ingredient.name).toEqual(
        new Set(codes),
      );
    }
  });

  it("allows a mass unit for every ingredient, and only positive gram weights", () => {
    for (const ingredient of STARTER_CANONICAL_INGREDIENTS) {
      expect(ingredient.units.g, ingredient.name).toBe(1);
      for (const grams of Object.values(ingredient.units)) {
        if (grams !== null) expect(grams).toBeGreaterThan(0);
      }
    }
  });

  it("uses the corrected USDA foods for chicken thigh, beef chuck and leg of lamb", () => {
    const fdc = (name: string) =>
      STARTER_CANONICAL_INGREDIENTS.find((i) => i.name === name)?.fdcId;
    expect(fdc("chicken thigh")).toBe(172385);
    expect(fdc("beef chuck")).toBe(169491);
    expect(fdc("leg of lamb")).toBe(174311);
  });
});
