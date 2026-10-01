# 0003: Ingredient amounts and units

- **Status:** Accepted
- **Date:** 2026-09-30
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

Builds on the units rules in [ADR-0000](0000-initial-decisions.md#units-stored-as-entered-converted-at-render), which still apply: amounts are stored as entered and converted at render.

## Amounts

- An ingredient line has an **amount**: a quantity and a unit. The quantity is a decimal greater than 0. The amount is whatever the cook shops or cooks by: the weight for canned goods, since can sizes differ by brand and country, and the count for produce ("1 medium tomato").
- An **as needed** line has no amount: quantity and unit are both null. It isn't scaled.
- A line may have an **equivalent amount**: a second quantity and unit, shown in parentheses. It scales and converts with the amount, but scaling, the grocery list and nutrition are calculated from the amount only. Examples: "794 g crushed tomatoes (1 can)", "1 medium tomato (170 g)".
- No ranges ("2–3 cloves") for now.
- The database enforces `quantity > 0` with a check constraint, added as raw SQL in the migration because Prisma can't express it. The editor validates it too.

## Units

- Units are a **fixed, seeded table**, never free text. Each unit has a kind: mass, volume, kitchen or count. Mass (g, kg, oz, lb) and volume (mL, L, fl oz, pint, quart) are how the converter works, and are never changed from the app. "oz" is always mass and "fl oz" always volume.
- Count units include sizes (small, medium, large) and items such as clove, head, bulb, fillet and leg. Only an admin adds new count units.
- Each canonical ingredient has **allowed units**, curated by an admin. The editor's unit dropdown shows only those, e.g. garlic: g, oz, tsp, tbsp, clove; milk: mL, fl oz, cup, tsp, tbsp; fish: g, oz, fillet, whole. Mass or volume units appear only for ingredients where they're allowed: "10 fl oz milk", "1 lb fish".
- Allowing a mass or volume unit allows its counterparts in the other unit system too, so the reader's metric/imperial toggle always has something to convert to.
- **"Other unit…"** at the bottom of the dropdown opens the full unit list. Picking a unit from it applies to that ingredient line only. It doesn't change the ingredient's allowed units, so one creator's choice never shows up in anyone else's dropdown.

## Why

Units must come from a fixed list for conversion to work. Filtering by ingredient keeps the dropdown short as count units grow. Curating allowed units in the admin keeps shared data safe once there are several creators, and "Other unit…" keeps creators from being blocked by gaps in the list.

## Consequences

- Schema: a `Unit` table and a join table of canonical ingredient × allowed unit. Ingredient lines point to units by ID.
- The allowed-units join table is where per-unit gram weights will go when nutrition arrives ("garlic, clove = 5 g").
