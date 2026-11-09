# 0004: USDA reference foods for canonical ingredients

- **Status:** Accepted
- **Date:** 2026-09-30
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

## Decision

[USDA FoodData Central](https://fdc.nal.usda.gov/api-guide) is imported once into our own Postgres as a table of **reference foods**. Canonical ingredients are created from it on demand, not typed by hand and not copied wholesale.

- **Import, don't call.** The data is public domain (CC0), so it's copied into our database. The app never calls the USDA API at runtime.
- **On demand.** When the admin types an ingredient that doesn't exist yet, the editor searches reference foods. Picking one prefills a new canonical ingredient: a clean display name and plural, the grocery section (mapped from the USDA food category), allowed units (from USDA household portions) and their gram weights. The admin edits and confirms.
- **Seeded.** About 200 common ingredients are created the same way up front, so the first recipes don't stop at every line.
- **Not every row becomes an ingredient.** USDA names are technical ("Tomatoes, red, ripe, raw, year round average") and many rows are cooked or trimmed versions of the same food. Making them all canonical ingredients would flood autocomplete and split grocery lists.
- **Only admins create canonical ingredients.** In Phase 1 that's the owner. When there are other creators, an ingredient a creator adds starts as pending: usable in their own recipes, but hidden from everyone else's autocomplete until an admin approves or merges it.
- **Canonical ingredients** store a singular and a plural name, and may have **aliases** for synonyms ("scallion" finds "green onion"). Variants you'd shop for differently are separate ingredients (yellow onion, red onion); preparation belongs in the prep note ("diced").

The Canadian Nutrient File was considered. USDA was chosen for its household-portion weights and public-domain licence. CNF can be added as a second reference source later if Canadian brands or fortification matter.

## Amendment (2026-10-19): after the spike

The [USDA spike](../../notes/2026-10-01-usda-spike.md) confirmed the approach and settled the details:

- **Datasets:** SR Legacy is the main source (7,533 of 7,793 foods have household portions). Foundation Foods fills gaps (only 116 of its 469 foods have portions). Both are imported. Branded and survey foods are not.
- **Grocery sections are a table**, editable by an admin: name and display order. Starting sections: Produce, Meat & poultry, Seafood, Dairy & eggs, Bakery, Spices & seasonings, Pantry, Canned & jarred, Condiments & sauces. Adding, renaming or splitting a section later is a data change; grocery lists are computed on read, so it shows everywhere at once.
- **USDA category → grocery section** is a small mapping kept as config in the code, with keyword overrides ("canned" → Canned & jarred). It only suggests a section when a canonical ingredient is created. After that the ingredient keeps its own section.
- **The import is re-runnable.** It upserts reference foods by USDA food ID and never changes canonical ingredients. It reports any canonical ingredient whose linked reference food changed or disappeared, for the admin to review. SR Legacy is frozen; Foundation Foods gets new releases.
- **Meat and fish** have few count portions in USDA, so units like fillet or thigh are often added by the admin without a gram weight.
- **Cup weights depend on preparation** (chopped vs sliced onion). Not relevant in Phase 1. Nutrition later must pick a default cup weight per ingredient.

## Consequences

- Moves the nutrition data source decision into Phase 1. Showing nutrition to readers stays out of Phase 1. The nutrient tables (about 650,000 rows from SR Legacy) are added with the nutrition work, not in Phase 1: the import is re-runnable, so adding them later is purely additive.
- Week 2 gains the import and seed work. The week 1 spikes gain a check of the USDA food-category and household-portion fields, which this design depends on (verified 2026-10-01; see the amendment above).
- Schema: a reference food table (with its portions and nutrients), a grocery section table, a nullable link from canonical ingredient to reference food, singular and plural names, aliases, and a pending/approved status.
