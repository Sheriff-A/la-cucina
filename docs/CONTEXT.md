# Glossary

The project's agreed terms. This file is a glossary only: no specs, implementation details or notes.
Format: **Term**: definition. _Avoid_: words not to use for it.

## People and access

**Admin**: A user who runs the platform (moderation, featuring, settings). In Phase 1 the owner is the only admin and the only creator.
**Creator**: A user who writes and publishes recipes. Can edit only their own recipes.
**Reader**: A user who views recipes. Most readers are anonymous; signing up is needed only for account features (Phase 2+).
**Role**: One of admin, creator or reader. Describes what a user may do, never what they have paid for.
**Entitlement**: Access to a paid feature, tracked separately from roles and backed by Stripe. _Avoid_: premium role, paid role.
**Follow**: A reader choosing to be notified when a creator publishes. Free. _Avoid_: subscribe.
**Subscription**: Billing only: a reader paying for premium tools. Never used for following a creator.

## Recipes

**Post**: What a creator publishes about a meal: title, story, hero image, gallery, and optionally a recipe. In Phase 1 every post has a recipe; later a post may have none (e.g. a restaurant review) and gain one afterwards.
**Recipe**: The cookable part of a post: base servings, ingredient lines and steps. Belongs to exactly one post. _Avoid_: using "recipe" for the whole post.
**Story**: The backstory write-up that opens a post. _Avoid_: blurb, intro.
**Hero image**: The single lead image of a post.
**Gallery**: The set of additional images shown with the story.
**Base servings**: The number of servings the creator wrote the recipe's quantities for.
**Ingredient line**: One row in a recipe's ingredient list: quantity, unit, canonical ingredient, optional prep note. Has a stable ID.
**Canonical ingredient**: A shared ingredient record that ingredient lines point to. Enables autocomplete, grocery sections and (later) merging.
**Nutrition data**: Nutrient values per 100 g attached to a canonical ingredient, plus gram weights for its units. A recipe's nutrition per serving is computed from it, never stored. Not in Phase 1.
**Prep note**: Free text on an ingredient line describing preparation, e.g. "finely diced".
**Step**: One instruction in a recipe, with optional step photo and step tokens. Has a stable ID.
**Step token**: A marked value inside step text that renders per unit system: `{oven:…}`, `{temp:…}`, `{len:…}`.
**Draft**: A post not yet visible to readers.
**Published**: A post visible to readers. Edits to a published post are visible as soon as they are saved.
**Audit log**: An admin-only record of who changed which record and when. Not in Phase 1. _Avoid_: revision history, version history.

## Units

**Unit system**: Metric or imperial.
**Source unit system**: The unit system a recipe was written in. Recipes display in it by default.
**Kitchen units**: tsp, tbsp and cup. Shown unchanged in both unit systems.
**Count units**: Units that never convert: clove, can, pinch, whole items.

## Reader tools

**Grocery list**: The ingredient lines of one recipe, scaled and converted as the reader chose, grouped by grocery section. Free, no sign-up.
**Grocery section**: The store area an ingredient belongs to, e.g. produce or dairy.
**Merged grocery list**: A grocery list built from several recipes with totalled quantities and "used in" references. Paid, Phase 2+.
**Checklist**: The in-app, tickable version of a grocery list, saved on the reader's device.
**Cook mode**: A recipe view with large step text that keeps the screen awake.
