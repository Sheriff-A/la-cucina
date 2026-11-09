// The starting grocery sections (ADR-0004 amendment). Plain TypeScript.
//
// Grocery sections are a table an admin can edit; this list only seeds it. The seed
// creates a section when its name is missing and never renames or reorders existing ones.

/** In display order: the order of this array is the starting `position`. */
export const STARTING_GROCERY_SECTIONS = [
  "Produce",
  "Meat & poultry",
  "Seafood",
  "Dairy & eggs",
  "Bakery",
  "Spices & seasonings",
  "Pantry",
  "Canned & jarred",
  "Condiments & sauces",
] as const;

export type StartingGrocerySection = (typeof STARTING_GROCERY_SECTIONS)[number];
