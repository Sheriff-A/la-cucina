---
type: grilling-session
date: 2026-09-30
status: in-progress
tags: [grilling, domain-model, phase-1]
related: ["[[2026-09-29-open-questions-grilling]]", "[[README]]"]
---

# Recipe structure: grilling session

Questions that come up once you try to write `prisma/schema.prisma`, found after [[2026-09-29-open-questions-grilling]] was done. Not authoritative: outcomes get copied to `docs/` once decided.

| # | Question | Status |
|---|---|---|
| 1 | Quantities | ✅ decided → [[#1. Quantities]] |
| 2 | Ingredient and step groups ("For the sauce") | ✅ decided → [[#2. Ingredient and step groups]] |
| 3 | Canonical ingredients: inline creation, grocery section, synonyms/plurals | ✅ decided → [[#3. Canonical ingredients]] |
| 4 | Units: fixed list or free text; per-ingredient units | ✅ decided → [[#4. Units]] |
| 5 | Slugs: rename on title edit, redirects | ✅ decided → [[#5. Slugs]] |
| 6 | Recipe metadata: prep/cook time, yield, cuisine, tags (SEO, home page) | ✅ decided → [[#6. Recipe metadata]] |
| 7 | Images: shared Image table, alt text required? | ✅ decided → [[#7. Images]] |
| 8 | Story rich-text format / editor | ✅ decided → [[#8. Story format]] |
| 9 | Lifecycle: unpublish, delete (soft/hard), publishedAt, unlisted | ✅ decided → [[#9. Post lifecycle]] |
| 10 | Users and roles vs the `neon_auth` schema | ⚪ |

---

## 1. Quantities

**Recommendation offered:** decimal `quantity`, optional `quantityMax` for ranges, `null` for "to taste" / "as needed", formatter renders 0.333 as ⅓, "1 can (400 g)" as a count unit with the size in the prep note, lines without a quantity don't scale.

**Owner's answers:**
- `quantity` is a **decimal, and must be > 0** when present. A zero quantity means the ingredient isn't needed.
- **No `quantityMax`** (no ranges) for now.
- `null` = **as needed**. Editor UI: a "Quantity" section with an amount field (number) and a unit dropdown; an **"As needed" checkbox** beside the label disables both fields and sets the quantity to null, and the post renders the right text.
- Formatter: agreed.
- Scaling: agreed (lines with no quantity aren't scaled).
- Count units: asked for more explanation.

**Count units / package sizes.** Options offered: (A) size in the prep note, (B) weight only, (C) structured package size. I recommended A.

**Owner's input:** looked at other recipe sites: "1 28-ounce (794 g) can", "1 medium (6-ounce, 170 g) tomato". Position:
- The real measurement should drive the data and the conversion. Package sizes differ by brand and location, so for canned goods **the weight is primary**.
- For produce, **count is primary**: nobody weighs a tomato at the store.
- So the primary amount is **whatever you shop or cook by**, and the other measure is supporting information.

**Proposal (pending):** one primary amount (quantity + unit) that drives scaling, conversion, the grocery list and later nutrition, plus an **optional second amount** (quantity + unit) shown in parentheses that also scales and converts. The name for it isn't agreed yet. Bonus: for count items the second amount gives nutrition its gram weight. Open: where the size word ("medium") goes.

> [!note] For the schema session
> Prisma can't express `CHECK (quantity > 0)` in the schema itself, so it needs a line of raw SQL in the migration, plus validation in the editor.

### Decision (2026-09-30)
- **Amount** = quantity (decimal, > 0) + unit. What you shop or cook by. Drives scaling, conversion, grocery list, later nutrition.
- **As needed** = no amount (quantity and unit both null). Editor: checkbox beside the "Quantity" label disables both fields.
- **Equivalent amount** = optional second quantity + unit, shown in parentheses, scales and converts, nothing calculated from it. Owner chose the name.
- Sizes (small / medium / large) are **count units** in the unit dropdown.
- No ranges (`quantityMax`) for now.
- Canned goods: weight is the amount, "1 can" the equivalent. Produce: "1 medium" the amount, weight the equivalent.

**Formalized in:** [CONTEXT.md](../docs/CONTEXT.md) (Ingredient line, Amount, As needed, Equivalent amount, Count units). Also [ADR-0003](../docs/adr/0003-ingredient-amounts-and-units.md), together with #4.

---

## 4. Units

**Owner's input:** the unit list will get long (heads, bulbs, leaves, fillets, legs…). Wants the dropdown **filtered by the selected ingredient**, e.g.
- garlic → oz, g, tsp, tbsp, clove
- milk → oz, g, cup, tsp, tbsp
- fish → oz, g, fillet, whole

Implies units are a fixed, seeded list (not free text) and canonical ingredients carry their allowed units.

**Recommendation offered:** seeded `Unit` table (mass / volume / kitchen / count); allowed units per canonical ingredient; "Other unit…" that *adds* the chosen unit to the ingredient's list; later gram weights on that join table. Flagged fl oz vs oz.

**Owner's answers:**
- Volume uses **fl oz**; no ambiguous "oz" for liquids.
- **Creators must not change shared data.** "Other unit…" opens the full list, but the choice is stored only on that ingredient line. It must never add to the ingredient's allowed units, so a malicious creator can't put "fillet" on milk for everyone.
- Mass units appear only where mass is used, volume only where volume is used: "10 fl oz milk", "1 lb fish".

### Decision (2026-09-30)
- Fixed seeded unit table; mass and volume fixed; admin-only additions of count units.
- Allowed units per canonical ingredient, admin-curated.
- "Other unit…" = per-line choice, never changes the allowed list.
- **Assumption (mine, flagged to owner):** allowing a mass/volume unit brings its other-system counterparts (g ↔ oz), so the reader's toggle always has a target.

**Formalized in:** [ADR-0003](../docs/adr/0003-ingredient-amounts-and-units.md), [CONTEXT.md](../docs/CONTEXT.md) (Unit, Allowed units, Canonical ingredient).

Owner confirmed the counterpart assumption (2026-09-30).

---

## 3. Canonical ingredients

**Recommendation offered:** admin-only creation via an inline dialog in the editor (name, plural, grocery section, allowed units); stored plurals; aliases for synonyms; separate records for variants you shop for differently (yellow vs red onion); later, creator-added ingredients start *pending* until an admin approves.

**Owner's pushback:** there are too many ingredients to add by hand. Isn't that what USDA / the Canadian Nutrient File are for?

**Response:** yes, use the dataset to *fill in* ingredients, but don't make every dataset row a canonical ingredient:
- USDA names are long and technical, and many rows are cooked or prepared versions of the same food. Thousands of those in autocomplete would flood it and split grocery lists.
- Proposal: import the dataset as a separate **reference table**. Canonical ingredients are created **on demand**: typing a missing ingredient searches the reference table, and picking a match fills in the name, grocery section (from the food category), allowed units and gram weights (from the household portions). The admin checks and confirms. Optionally seed ~200 common ingredients up front the same way.
- This pulls the import (not nutrition display) into Phase 1 week 2, and makes the source choice (USDA / CNF) a Phase 1 ADR.
- USDA field details (food categories, household portions) are from memory; confirm in a spike.

### Decision (2026-09-30)
Owner: "go with USDA and seed the common ones. Let's see how that works and go from there."
- USDA FoodData Central imported as **reference foods**; canonical ingredients created on demand from them, prefilled, admin confirms.
- Seed ~200 common ingredients up front.
- Admin-only creation; singular + plural names; aliases; variants as separate ingredients; pending ingredients for creators later. The owner didn't object to these when the dataset question came up; treated as accepted.
- Canadian Nutrient File not used for now.

**Formalized in:** [ADR-0004](../docs/adr/0004-usda-reference-foods-for-canonical-ingredients.md), [CONTEXT.md](../docs/CONTEXT.md) (Canonical ingredient, Reference food, Alias, Pending ingredient), [phase-1-overview](../docs/design/phase-1-overview.md) (timeline weeks 1–2, nutrition resolution).

---

## 2. Ingredient and step groups

**Recommendation offered:** groups in Phase 1 with an optional heading; one headless group for simple recipes; grocery list ignores groups (duplicates across groups stay separate until merging in Phase 2+); cook mode and instructions PDF show step group headings. Asked whether ingredient and step groups should be linked.

### Decision (2026-09-30)
Owner: groups in Phase 1, **independent** (no link between ingredient groups and step groups).

**Formalized in:** [CONTEXT.md](../docs/CONTEXT.md) (Recipe, Ingredient group, Step group). No ADR: data shape, not architecture.

---

## 5. Slugs

**Recommendation offered:** slug generated from the title and frozen at publish; editable by hand with a warning; old slugs 301 to the new one; drafts follow the title; `/posts/<slug>` vs `/recipes/<slug>`.

**Owner's answers:**
- `/posts/<slug>`, since recipes live inside posts.
- Idea: `/recipes/<slug>` as a **streamlined view** of just the recipe and steps (later).
- Freeze + manual edit + redirects agreed. "Make sure the warning system and redirects are built properly. Broken links can be dangerous and cost users."

### Decision (2026-09-30)
Added hardening from my side: redirects collapse chains (always point to the current slug), retired slugs can't be reused by another post, redirect lookup only on a miss, explicit test list.

> [!question] Open for later
> How is the `/recipes/<slug>` streamlined view different from cook mode? It could be the same thing reached by URL. Not a term yet; don't name it in code until decided.

**Formalized in:** [ADR-0005](../docs/adr/0005-post-slugs-and-redirects.md), [CONTEXT.md](../docs/CONTEXT.md) (Slug).

---

## 9. Post lifecycle

**Recommendation offered:** unpublish = back to draft (URL 404s, slug kept); soft delete via `deletedAt` (URL 410 Gone, friendly page, slugs stay reserved); hard delete + R2 cleanup later; `publishedAt` set on first publish and kept; no scheduling in Phase 1.

**Owner's answers:**
- A soft-deleted post must be **restorable** until it's permanently deleted.
- `deletedAt` null = not deleted.
- New status: **Unlisted** (or "Private"). Published but not public: a direct link can be shared with non-owners, but it doesn't appear in the public feed.

**Follow-ups asked:**
- Name: I recommend **Unlisted** (the YouTube meaning); "Private" suggests only the owner can see it, which is what Draft already is.
- Slugs are readable ("nonnas-sunday-ragu"), so an unlisted URL can be **guessed**. Accept, or add a random share key for unlisted posts?
- Is `publishedAt` set when a post first becomes unlisted, or only when it first becomes public?

**Owner's answers:** guessable unlisted links are fine. Asked whether publish → unlist → republish resets the date; wants it reset.

### Decision (2026-09-30)
- Statuses: **Draft / Unlisted / Published**; `deletedAt` separate, restorable until permanent deletion. Name "Unlisted" (my recommendation; owner didn't object).
- Unlisted: link works, not on home/sitemap, `noindex`; guessable accepted, no share key.
- `publishedAt` resets on every transition to Published (drives home page order and shown date); `firstPublishedAt` fixed; `updatedAt` internal (structured-data modified date only).
- Deleted URL → 410 with a friendly page; slugs stay reserved.

**Formalized in:** [ADR-0006](../docs/adr/0006-post-lifecycle.md), [CONTEXT.md](../docs/CONTEXT.md) (Draft, Unlisted, Published, Deleted).

---

## 6. Recipe metadata

**Recommendation offered:** prep, cook and total time (total stored separately, for resting/marinating); optional yield note; tags on the post covering cuisine and course; difficulty and equipment later; home page as a reverse-chronological feed plus `/tags/<tag>` pages.

**Owner's answers:**
- Prep time and cook time on the recipe. **Total time calculated** (prep + cook), not stored.
- Base servings: yes. (Yield note: not mentioned, so not added.)
- **Meal types**: breakfast, lunch, dinner, snack.
- **Tags** for extras: Italian, Mediterranean, Arabic, etc.
- Difficulty and equipment later; equipment could be a simple list of strings.
- Wasn't sure what I meant about the home page.

**Assumptions (mine):** meal types are a fixed list and multi-select (a dish can be lunch and dinner), on the recipe as the owner said; tags on the post (so reviews can have them) and admin-only to add.

Formalized so far in [CONTEXT.md](../docs/CONTEXT.md) (Prep time, Cook time, Total time, Meal type, Tag). Pending: home page, whether the meal type list is complete.

**Owner's follow-up (2026-09-30):**
- Assumptions confirmed: meal types multi-select, tags on the post, admins add tags.
- Total time: **stored as a nullable column after all**. If left empty in the form, the UI shows prep + cook and the column stays null.
- Home page: option 2 (feed + filtering), but **no `/tags/<tag>` route**: filters are URL query parameters on the feed.

### Decision (2026-09-30)
Feed = published posts, newest `publishedAt` first, filtered via query string (`/?meal=dinner&tag=italian`). Trade-off noted to owner: filtered views aren't separate indexable pages for SEO.

**Formalized in:** [CONTEXT.md](../docs/CONTEXT.md) (Total time, Feed), [phase-1-overview](../docs/design/phase-1-overview.md) (in-scope list). 

**Final answers:** filter combining agreed (kinds AND, values within a kind OR). Meal types: **breakfast, lunch, dinner, snack, dessert, side**, validated by a **database enum** so no free text gets in.

---

## 7. Images

**Recommendation offered:** one `Image` table (R2 key, size, alt text, caption, uploader) used by hero, gallery and step photos; alt text required at publish, not upload; hero required to publish; optional captions; resize at upload to WebP widths in R2 (avoids Vercel Hobby's image optimization limit); direct browser-to-R2 upload with signed URLs; cleanup job later.

### Decision (2026-10-01)
Owner agreed to all of it, and added: **the hero image doubles as the feed thumbnail**.

**Formalized in:** [ADR-0007](../docs/adr/0007-images.md), [CONTEXT.md](../docs/CONTEXT.md) (Hero image, Gallery, Alt text, Caption), [components.md](../docs/components.md) (Image resizer, Publish check).

**Owner's clarification (2026-10-01):** to be explicit: hero required to publish; **gallery optional** (a post can have a hero and no gallery); **step photos optional** for every step. ADR-0007 and CONTEXT.md updated to say so.

---

## 8. Story format

**Recommendation offered:** Tiptap, JSON in JSONB (per ADR-0000), small fixed formatting set (paragraphs, two heading levels, bold, italic, links, lists, block quotes); no story images, tables, colours, embeds; no length limit, ~160-character excerpt for the feed. Markdown would contradict ADR-0000; Lexical viable but fewer React examples.

### Decision (2026-10-01)
Owner: "I'm good with Tiptap." Add a note that Tiptap's LLM docs are needed.

**Formalized in:** [ADR-0008](../docs/adr/0008-story-editor-tiptap.md), [CONTEXT.md](../docs/CONTEXT.md) (Story), [coding.md](../docs/coding.md) (Tiptap row in the LLM docs index).

> [!note] Working agreement
> From 2026-10-01 the owner asked for a commit after each decision.
