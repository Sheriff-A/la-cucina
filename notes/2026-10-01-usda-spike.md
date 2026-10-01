---
type: spike
date: 2026-10-01
status: complete
tags: [spike, usda, ingredients, phase-1]
related: ["[[2026-09-30-recipe-structure-grilling]]"]
---

# USDA spike: can reference foods prefill canonical ingredients?

Checks the assumptions in [ADR-0004](../docs/adr/0004-usda-reference-foods-for-canonical-ingredients.md). Data in `references/usda/` (gitignored): Foundation Foods CSV 2026-04-30 and SR Legacy CSV 2018-04, from https://fdc.nal.usda.gov/download-datasets/. Candidate list: `references/usda/spike-seed-candidates.csv`.

## Answers

> [!success] 1. Is SR Legacy still relevant? Yes, it's the main source.
> - **Foundation Foods:** 469 foods, only **116 with household portions**.
> - **SR Legacy:** 7,793 foods, **7,533 with portions**. "Legacy" means frozen since 2018, not wrong; raw onions haven't changed.
> - Use both. SR Legacy gives the portions; Foundation Foods fills a few gaps (7 of 146 test matches came from it: red onion, kale, whole milk, whole wheat flour, Greek yogurt, ricotta, yellow mustard).

> [!success] 2. Do common ingredients exist? Yes: 146 of 146.
> I wrote a list of 146 everyday ingredients and matched each to a USDA food by hand-written patterns. All 146 exist (3 needed a corrected pattern: chicken thigh, beef chuck, lamb leg). 141 have household portions.

> [!success] 3. Do household portions give usable count units? Yes for produce, dairy, pantry. Thin for meat and fish.
> - Onion: 1 large = 150 g, 1 medium = 110 g, 1 cup chopped = 160 g, 1 tbsp chopped = 10 g
> - Garlic: 1 clove = 3 g, 1 tsp = 2.8 g
> - Egg: small 38 g, medium 44 g, large 50 g, extra large 56 g, jumbo 63 g
> - Butter: 1 tbsp = 14.2 g, 1 stick = 113 g, 1 cup = 227 g
> - Canned chickpeas: 1 can = 448 g
> - **Meat and fish** mostly have only "3 oz" / "4 oz" / "1 piece". Chicken breast has no "breast"; salmon has "0.5 fillet". Count units like *fillet*, *thigh*, *leg* will often be added by the admin without a USDA weight.

> [!warning] 4. Names need a human. Matching can't be fully automatic.
> - Names are technical: "Tomatoes, red, ripe, raw, year round average", "Beef, ground, 85% lean meat / 15% fat, raw (Includes foods for USDA's Food Distribution Program)".
> - Near-duplicates are common: "Beef, chuck … raw" has **65** variants; "beef" matches 1,088 foods.
> - So the on-demand search must rank sensibly (raw first, shortest description first, prepared-food categories hidden), and the admin picks. The **seed list is hand-curated once** (name → chosen USDA food), which this spike has largely done.
> - Hiding Baby Foods, Fast Foods, Restaurant Foods, Meals/Entrees, Snacks, Breakfast Cereals and American Indian/Alaska Native Foods cuts 8,262 foods to 6,874. (Oats live in Breakfast Cereals, so keep that one searchable or special-case it.)

## Findings that affect the design

1. **Cup weights depend on preparation.** 209 foods have several cup portions (onion: chopped 160 g, sliced 115 g). ADR-0003 has one "cup" per ingredient. Doesn't matter in Phase 1 (allowed units only), but **nutrition later must pick a default cup weight per ingredient**.
2. **Portion text must be parsed** into our units: "1 medium (2-1/2" dia)" → `medium`; "1 clove" → `clove`; "1 cup, chopped" → `cup`. The unit column is often `undetermined` with the meaning in the modifier text. A small rule-based parser covers the common cases; anything unparsed is ignored.
3. **USDA categories map to grocery sections, with overrides.** Category alone is wrong for canned goods (canned chickpeas are "Legumes"; crushed tomatoes are "Vegetables"). Rule: category default, then "canned" in the description → Canned goods, then the admin can change it.

## Proposed grocery sections (pending owner)

| Grocery section | From USDA category (default) |
|---|---|
| Produce | Vegetables and Vegetable Products; Fruits and Fruit Juices (fresh herbs are in Vegetables) |
| Meat & poultry | Beef; Pork; Poultry; Lamb, Veal, and Game; Sausages and Luncheon Meats |
| Seafood | Finfish and Shellfish Products |
| Dairy & eggs | Dairy and Egg Products |
| Bakery | Baked Products |
| Spices & seasonings | Spices and Herbs |
| Pantry | Cereal Grains and Pasta; Legumes (dry); Sweets; Nut and Seed Products; Fats and Oils; Breakfast Cereals |
| Canned & jarred | any description containing "canned" |
| Condiments & sauces | Soups, Sauces, and Gravies; plus vinegar, soy sauce, mustard, ketchup, mayonnaise by override |

## Seed candidates (146)

Produce, herbs, spices, baking, grains, legumes, dairy, oils, condiments, nuts, meat and fish. Full list with matched USDA foods and portions in `references/usda/spike-seed-candidates.csv`. Short of the ~200 target; the remainder can come from the first real recipes.
