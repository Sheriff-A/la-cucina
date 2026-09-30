---
type: grilling-session
date: 2026-09-29
status: complete
tags: [grilling, domain-model, phase-1]
related: ["[[README]]"]
---

# Phase 1 open questions: grilling session

Working through the three open questions in [phase-1-overview](../docs/design/phase-1-overview.md#open-questions) that block `prisma/schema.prisma`. Not authoritative: outcomes get copied to `docs/` once decided.

| # | Question | Status |
|---|---|---|
| 1 | Post vs Recipe | ✅ decided → [[#1. Post vs Recipe]] |
| 2 | Editing published recipes | ✅ decided → [[#2. Editing published posts]] |
| 3 | Nutrition timing | ✅ decided → [[#3. Nutrition timing]] |

---

## 1. Post vs Recipe

**Evidence in the docs:** CLAUDE.md says "each post is a recipe with a backstory"; CONTEXT.md defines only **Recipe** (no **Post**); Phase 1 scope has no non-recipe content.

**Initial recommendation (superseded):** same entity, drop the word "Post".

**Owner's answer:** In Phase 1 a post always has a recipe. Later, other people will post about meals in general, e.g. reviewing a dish at a restaurant, and may *add a recipe to the post afterwards* once they figure out how to make it.

> [!important] Consequence
> A post can exist **without** a recipe, and a recipe can be **attached later**. So **Post** and **Recipe** are different concepts: the Post is the container (story, hero, gallery, publish state); the Recipe is an optional part of it (base servings, ingredient lines, steps).

### Decision (2026-09-29)
**Model it now:** `Post` has zero or one `Recipe`.
- `Post`: slug, title, story, hero, gallery, author, draft/published.
- `Recipe`: base servings, source unit system, ingredient lines, steps.
- Phase 1 "every post has a recipe" is an app rule, not a DB constraint.
- Story belongs to Post (for a review-only post it *is* the review). Owner said "model it now" to a message proposing this split; treated as agreement.

**Formalized in:** [ADR-0001](../docs/adr/0001-post-and-recipe-are-separate.md), [CONTEXT.md](../docs/CONTEXT.md) (Post, Recipe, Draft, Published), [phase-1-overview](../docs/design/phase-1-overview.md#open-questions).

---

## 2. Editing published posts

**Recommendation offered:** edits go live immediately; no revisions in Phase 1; `updatedAt` plus an optional "Updated" note.

**Owner's answer:**
- Agreed: edits go live on save.
- Wants a **banner/badge at the top of the edit page** saying the post is live and saved edits are reflected immediately.
- **No "Updated" note section.**
- Later: an **admin audit log table** for history of changes to records, in case demand for history appears.
- Heavy rework of a still-published post is also live on save, regardless of size. No staged copy.

### Decision (2026-09-29)
Edits to a published post go live immediately. No revision tables, no pending state, no reader-facing "Updated" indicator. Private rework = set back to draft (my note; follows from draft/publish). Audit log deferred, admin-only.

**Formalized in:** [ADR-0002](../docs/adr/0002-published-edits-go-live-immediately.md), [CONTEXT.md](../docs/CONTEXT.md) (Published, Audit log), [phase-1-overview](../docs/design/phase-1-overview.md#open-questions).

---

## 3. Nutrition timing

**Context:** nutrition per serving was listed as core (not paywalled) with timing undecided. Not in the Phase 1 scope list or timeline; ~110 h plan with little slack.

**Recommendation offered:** out of Phase 1; later, calculated from canonical ingredients rather than typed per post.

**Owner's answers:** leave it out of Phase 1; wants ideas beyond manual entry; fine with importing a dataset; asked whether nutrition is then determined per ingredient (yes).

### Data source options researched (2026-09-29)
- **USDA FoodData Central**: free, public domain (CC0); API key required, 1,000 requests/h per IP; downloadable. Best for generic ingredients. [API guide](https://fdc.nal.usda.gov/api-guide)
- **Canadian Nutrient File**: free open data, ~5,993 foods, CSV plus JSON/XML API; the 2015 version is available while the 2026 dataset is made easier to access. Relevant for Canadian readers and brands.
- **Open Food Facts**: crowd-sourced, open (ODbL, from memory, unverified); packaged goods only.
- **Edamam / Spoonacular / Nutritionix / FatSecret**: paid or thin free tiers (5–12 nutrients; Edamam free = 400 recipe analyses/month). Conflicts with the $0 budget and adds a runtime dependency.

### Decision (2026-09-29)
- Not in Phase 1. Phase 1 schema needs nothing; nutrition data can hang off canonical ingredients in an additive migration.
- Later approach: import a public dataset once into our own Postgres (no runtime API), map to canonical ingredients via an admin match-suggestion screen, compute per serving = sum of ingredient lines in grams × per-100 g values ÷ servings. Never stored on the recipe.
- Needs per-ingredient gram weights per unit; unmapped ingredients make the total "approximate".
- Manual entry only as per-ingredient fallback.
- **Source choice (USDA / CNF / both) is deferred** to its own ADR when the work starts. Assumed rather than confirmed by the owner; the second question was not answered.

**Formalized in:** [phase-1-overview](../docs/design/phase-1-overview.md#open-questions), [CONTEXT.md](../docs/CONTEXT.md) (Nutrition data). No ADR: no architecture changes yet.

---

## Status
All three questions resolved. Next session: `prisma/schema.prisma`.
