// Turns USDA household portions into our units and gram weights (ADR-0004, USDA spike).
// Plain TypeScript.
//
// USDA portion text is loose: "1 medium (2-1/2" dia)", "1 clove", "1 cup, chopped". In
// SR Legacy the unit is usually "undetermined", with the meaning in the modifier; Foundation
// Foods uses real measure units ("tablespoon") and sometimes a portion description. The
// parser reads the head of that text (before the first comma or parenthesis) and returns
// the first word it recognises as one of our units. Anything it can't place is ignored.

import type { UnitCode } from "@/lib/units/unit-list";

export interface UsdaPortion {
  /** How many of the unit the gram weight is for, e.g. 0.5 for "0.5 fillet". */
  amount: number;
  /** USDA measure unit name, e.g. "cup", "tablespoon" or "undetermined". */
  unitName?: string | null;
  modifier?: string | null;
  /** Foundation Foods' portion_description. */
  description?: string | null;
  gramWeight: number;
}

export interface ParsedPortion {
  unitCode: UnitCode;
  /** Grams for one unit, rounded to 3 decimals. */
  gramsPerUnit: number;
}

const WORD_TO_UNIT: Readonly<Record<string, UnitCode>> = {
  cup: "cup",
  cups: "cup",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  pint: "pint",
  pints: "pint",
  quart: "quart",
  quarts: "quart",
  small: "small",
  medium: "medium",
  large: "large",
  clove: "clove",
  cloves: "clove",
  slice: "slice",
  slices: "slice",
  piece: "piece",
  pieces: "piece",
  head: "head",
  heads: "head",
  bulb: "bulb",
  bulbs: "bulb",
  bunch: "bunch",
  bunches: "bunch",
  sprig: "sprig",
  sprigs: "sprig",
  stalk: "stalk",
  stalks: "stalk",
  leaf: "leaf",
  leaves: "leaf",
  stick: "stick",
  sticks: "stick",
  ear: "ear",
  ears: "ear",
  spear: "spear",
  spears: "spear",
  wedge: "wedge",
  wedges: "wedge",
  fillet: "fillet",
  fillets: "fillet",
  filet: "fillet",
  filets: "fillet",
  can: "can",
  cans: "can",
  jar: "jar",
  jars: "jar",
  package: "package",
  packages: "package",
  pinch: "pinch",
  dash: "dash",
  whole: "whole",
  each: "whole",
  unit: "whole",
  item: "whole",
  fruit: "whole",
};

/**
 * Words that end the search with no unit. Mass portions ("3 oz") say nothing a mass unit
 * doesn't already know; the rest are sizes or containers we don't have a unit for.
 */
const STOP_WORDS = new Set([
  "oz",
  "ounce",
  "ounces",
  "lb",
  "lbs",
  "pound",
  "pounds",
  "g",
  "gram",
  "grams",
  "kg",
  "serving",
  "servings",
  "nlea",
  "racc",
  "cubic",
  "inch",
  "jumbo",
  "box",
  "bag",
  "bottle",
  "container",
  "packet",
]);

/** USDA measure unit names that carry no unit meaning; the modifier is read instead. */
const MEANINGLESS_UNIT_NAMES = new Set(["undetermined", "racc", "serving"]);

const SIZE_UNITS = new Set(["small", "medium", "large", "extra_large"]);

/** Only the first few words of the head phrase are read. */
const MAX_WORDS = 3;

function singular(word: string): string {
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** True when the word names the food itself, e.g. "1 cucumber" for "Cucumber, with peel, raw". */
function namesTheFood(
  word: string,
  foodDescription: string | undefined,
): boolean {
  if (!foodDescription) return false;
  const head = foodDescription.toLowerCase().split(",")[0]!.trim();
  const target = singular(word);
  if (singular(head.replace(/\s+/g, "")) === target) return true;
  return head.split(/\s+/).some((w) => singular(w) === target);
}

function portionText(portion: UsdaPortion): string {
  const unitName = portion.unitName?.trim() ?? "";
  const parts = [
    MEANINGLESS_UNIT_NAMES.has(unitName.toLowerCase()) ? "" : unitName,
    portion.modifier ?? "",
    portion.description ?? "",
  ];
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ");
}

/** Returns our unit and grams per unit for a USDA portion, or null when it can't be placed. */
export function parsePortion(
  portion: UsdaPortion,
  foodDescription?: string,
): ParsedPortion | null {
  if (!(portion.amount > 0) || !(portion.gramWeight > 0)) return null;

  const text = portionText(portion)
    .toLowerCase()
    .replace(/^[\d\s./-]+/, "")
    .replace(/extra[\s-]+large/g, "extra_large")
    .replace(/fl\.?\s*oz\.?/g, "fl_oz");
  const head = text.split(/[,(]/)[0]!;
  const words = head.split(/\s+/).filter(Boolean).slice(0, MAX_WORDS);

  let unitCode: UnitCode | undefined;
  for (const [i, word] of words.entries()) {
    if (word === "extra_large" || word === "fl_oz") {
      unitCode = word;
      break;
    }
    if (STOP_WORDS.has(word) || /^extra/.test(word)) break;
    const known = WORD_TO_UNIT[word];
    if (known) {
      unitCode = known;
      break;
    }
    if (namesTheFood(word, foodDescription)) {
      // "1 potato large" is a large potato; "1 cucumber" is a whole one.
      const next = words[i + 1];
      unitCode = next && SIZE_UNITS.has(next) ? (next as UnitCode) : "whole";
      break;
    }
  }
  if (!unitCode) return null;
  // A size followed by a container is the container's size: "1 small box (1.5 oz)".
  if (SIZE_UNITS.has(unitCode)) {
    const next = words[words.indexOf(unitCode) + 1];
    if (next && STOP_WORDS.has(next)) return null;
  }

  return {
    unitCode,
    gramsPerUnit:
      Math.round((portion.gramWeight / portion.amount) * 1000) / 1000,
  };
}

/**
 * Parses a food's portions in USDA order and keeps the first gram weight per unit. Several
 * cup portions are common (onion: chopped 160 g, sliced 115 g); the first one wins here,
 * and nutrition work will pick a deliberate default later.
 */
export function unitWeightsFromPortions(
  portions: readonly UsdaPortion[],
  foodDescription?: string,
): ParsedPortion[] {
  const seen = new Map<UnitCode, ParsedPortion>();
  for (const portion of portions) {
    const parsed = parsePortion(portion, foodDescription);
    if (parsed && !seen.has(parsed.unitCode)) seen.set(parsed.unitCode, parsed);
  }
  return [...seen.values()];
}
