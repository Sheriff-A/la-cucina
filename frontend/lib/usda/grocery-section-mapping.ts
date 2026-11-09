// USDA food category → grocery section (ADR-0004 amendment). Plain TypeScript.
//
// This only *suggests* a section when a canonical ingredient is created from a reference
// food. After that the ingredient keeps its own section, which an admin can change.

import type { StartingGrocerySection } from "@/lib/grocery/grocery-sections";

/** Default section for each USDA food category (SR Legacy and Foundation Foods names). */
export const USDA_CATEGORY_TO_GROCERY_SECTION: Readonly<
  Record<string, StartingGrocerySection>
> = {
  "Vegetables and Vegetable Products": "Produce",
  "Fruits and Fruit Juices": "Produce",
  "Beef Products": "Meat & poultry",
  "Pork Products": "Meat & poultry",
  "Poultry Products": "Meat & poultry",
  "Lamb, Veal, and Game Products": "Meat & poultry",
  "Sausages and Luncheon Meats": "Meat & poultry",
  "Finfish and Shellfish Products": "Seafood",
  "Dairy and Egg Products": "Dairy & eggs",
  "Baked Products": "Bakery",
  "Spices and Herbs": "Spices & seasonings",
  "Cereal Grains and Pasta": "Pantry",
  "Legumes and Legume Products": "Pantry",
  Sweets: "Pantry",
  "Nut and Seed Products": "Pantry",
  "Fats and Oils": "Pantry",
  "Breakfast Cereals": "Pantry",
  "Soups, Sauces, and Gravies": "Condiments & sauces",
};

/** Used when the category is missing or not in the table. */
export const FALLBACK_GROCERY_SECTION: StartingGrocerySection = "Pantry";

interface KeywordOverride {
  /** Matched against the lowercased USDA description, on word boundaries. */
  keywords: readonly string[];
  section: StartingGrocerySection;
  /** Only applies to foods in this category, when set. */
  category?: string;
}

/**
 * Checked in order before the category default; the first match wins.
 * "Canned" first: canned chickpeas are Legumes and crushed tomatoes are Vegetables in USDA,
 * but both are shopped from the canned aisle.
 */
export const KEYWORD_OVERRIDES: readonly KeywordOverride[] = [
  { keywords: ["canned"], section: "Canned & jarred" },
  {
    keywords: [
      "vinegar",
      "soy sauce",
      "mustard",
      "catsup",
      "ketchup",
      "mayonnaise",
      "salad dressing",
      "hot sauce",
      "worcestershire",
      "fish sauce",
    ],
    section: "Condiments & sauces",
  },
  // USDA files basil, dill, rosemary etc. under Spices and Herbs; fresh ones are in Produce.
  { keywords: ["fresh"], section: "Produce", category: "Spices and Herbs" },
  // Baking powder, baking soda and yeast are Baked Products in USDA but sit in the pantry.
  { keywords: ["leavening agents"], section: "Pantry" },
];

function containsWord(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z])${escaped}($|[^a-z])`).test(haystack);
}

/** Suggests a grocery section for a reference food from its USDA category and description. */
export function suggestGrocerySection(
  usdaCategory: string | null | undefined,
  description: string,
): StartingGrocerySection {
  const text = description.toLowerCase();
  for (const override of KEYWORD_OVERRIDES) {
    if (override.category && override.category !== usdaCategory) continue;
    if (override.keywords.some((keyword) => containsWord(text, keyword))) {
      return override.section;
    }
  }
  return (
    (usdaCategory && USDA_CATEGORY_TO_GROCERY_SECTION[usdaCategory]) ||
    FALLBACK_GROCERY_SECTION
  );
}
