// The fixed unit list (ADR-0003). Plain TypeScript: no React or Next.js imports.
//
// Codes are stable: ingredient lines and allowed units point at them, and the unit
// converter keys its factors by them. Never rename a code; add a new unit instead.
// Mass and volume units are never changed from the app. Only an admin adds count units.

export type UnitKind = "mass" | "volume" | "kitchen" | "count";
export type UnitSystem = "metric" | "imperial";

export interface UnitDefinition {
  code: string;
  name: string;
  pluralName: string;
  /** Short display form. Count units have none. */
  abbreviation: string | null;
  kind: UnitKind;
  /** Set for mass and volume units only. Kitchen and count units never convert. */
  system: UnitSystem | null;
}

const mass = (
  code: string,
  name: string,
  pluralName: string,
  abbreviation: string,
  system: UnitSystem,
): UnitDefinition => ({
  code,
  name,
  pluralName,
  abbreviation,
  kind: "mass",
  system,
});

const volume = (
  code: string,
  name: string,
  pluralName: string,
  abbreviation: string,
  system: UnitSystem,
): UnitDefinition => ({
  code,
  name,
  pluralName,
  abbreviation,
  kind: "volume",
  system,
});

const kitchen = (
  code: string,
  name: string,
  pluralName: string,
  abbreviation: string,
): UnitDefinition => ({
  code,
  name,
  pluralName,
  abbreviation,
  kind: "kitchen",
  system: null,
});

const count = (
  code: string,
  name: string = code,
  pluralName: string = name,
): UnitDefinition => ({
  code,
  name,
  pluralName,
  abbreviation: null,
  kind: "count",
  system: null,
});

/** In display order: the order of this array is the `position` column. */
export const UNITS = [
  mass("g", "gram", "grams", "g", "metric"),
  mass("kg", "kilogram", "kilograms", "kg", "metric"),
  mass("oz", "ounce", "ounces", "oz", "imperial"),
  mass("lb", "pound", "pounds", "lb", "imperial"),

  volume("ml", "millilitre", "millilitres", "mL", "metric"),
  volume("l", "litre", "litres", "L", "metric"),
  volume("fl_oz", "fluid ounce", "fluid ounces", "fl oz", "imperial"),
  volume("pint", "pint", "pints", "pt", "imperial"),
  volume("quart", "quart", "quarts", "qt", "imperial"),

  kitchen("tsp", "teaspoon", "teaspoons", "tsp"),
  kitchen("tbsp", "tablespoon", "tablespoons", "tbsp"),
  kitchen("cup", "cup", "cups", "cup"),

  count("whole"),
  count("small"),
  count("medium"),
  count("large"),
  count("extra_large", "extra large"),
  count("clove", "cloves"),
  count("slice", "slices"),
  count("piece", "pieces"),
  count("head", "heads"),
  count("bulb", "bulbs"),
  count("bunch", "bunches"),
  count("sprig", "sprigs"),
  count("stalk", "stalks"),
  count("leaf", "leaves"),
  count("stick", "sticks"),
  count("ear", "ears"),
  count("spear", "spears"),
  count("wedge", "wedges"),
  count("fillet", "fillets"),
  count("can", "cans"),
  count("jar", "jars"),
  count("package", "packages"),
  count("pinch", "pinches"),
  count("dash", "dashes"),
] as const satisfies readonly UnitDefinition[];

export type UnitCode = (typeof UNITS)[number]["code"];

const byCode = new Map<string, UnitDefinition>(UNITS.map((u) => [u.code, u]));

export function isUnitCode(code: string): code is UnitCode {
  return byCode.has(code);
}

export function getUnit(code: UnitCode): UnitDefinition {
  return byCode.get(code)!;
}

/** Grams per unit for mass units. Exact by definition. */
export const GRAMS_PER_MASS_UNIT = {
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
} as const satisfies Partial<Record<UnitCode, number>>;

/** Millilitres per unit for volume and kitchen units (US customary). */
export const MILLILITRES_PER_VOLUME_UNIT = {
  ml: 1,
  l: 1000,
  fl_oz: 29.5735295625,
  pint: 473.176473,
  quart: 946.352946,
  tsp: 4.92892159375,
  tbsp: 14.78676478125,
  cup: 236.5882365,
} as const satisfies Partial<Record<UnitCode, number>>;

/**
 * The other-system counterpart of each mass and volume unit. Allowing one allows its
 * counterpart too, so the metric/imperial toggle always has something to convert to (ADR-0003).
 */
const COUNTERPARTS: Partial<Record<UnitCode, readonly UnitCode[]>> = {
  g: ["oz"],
  kg: ["lb"],
  oz: ["g"],
  lb: ["kg"],
  ml: ["fl_oz"],
  l: ["quart"],
  fl_oz: ["ml"],
  pint: ["ml"],
  quart: ["l"],
};

/** Adds the other-system counterparts of any mass or volume units, keeping list order. */
export function withCounterparts(codes: readonly UnitCode[]): UnitCode[] {
  const result: UnitCode[] = [];
  const add = (code: UnitCode) => {
    if (!result.includes(code)) result.push(code);
  };
  for (const code of codes) {
    add(code);
    for (const counterpart of COUNTERPARTS[code] ?? []) add(counterpart);
  }
  return result;
}
