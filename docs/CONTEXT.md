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
**Recipe**: The cookable part of a post: base servings, ingredient groups and step groups. Belongs to exactly one post. _Avoid_: using "recipe" for the whole post.
**Slug**: The readable part of a post's URL, `/posts/<slug>`. Follows the title while the post is a draft; frozen once published. Old slugs redirect to the current one.
**Story**: The backstory write-up that opens a post. _Avoid_: blurb, intro.
**Hero image**: The single lead image of a post, required to publish. Also the post's thumbnail on the feed and in link previews.
**Gallery**: The ordered set of additional images shown with the story.
**Alt text**: A description of an image for screen readers. Required on every image of a post before it can be unlisted or published.
**Caption**: Optional text shown under a gallery image.
**Base servings**: The number of servings the creator wrote the recipe's quantities for.
**Prep time** / **Cook time**: Optional durations on a recipe, in minutes.
**Total time**: Optional duration on a recipe, in minutes, for recipes where prep plus cook understates it (resting, marinating). When empty, prep time plus cook time is shown instead, and nothing is stored.
**Meal type**: Which meal a recipe suits, from a fixed list: breakfast, lunch, dinner, snack, dessert, side. A recipe can have several. Enforced by a database enum. _Avoid_: course, category.
**Tag**: A free-form label on a post, such as a cuisine (Italian, Mediterranean, Arabic). Only an admin adds new tags.
**Ingredient line**: One row in a recipe's ingredient list: canonical ingredient, amount (or "as needed"), optional equivalent amount, optional prep note. Has a stable ID.
**Amount**: The quantity and unit of an ingredient line: what the cook shops or cooks by. The quantity is a decimal greater than 0. Drives scaling, unit conversion and the grocery list. _Avoid_: primary amount.
**As needed**: An ingredient line with no amount, e.g. "salt, as needed". Not scaled. _Avoid_: to taste (in code).
**Equivalent amount**: An optional second quantity and unit on an ingredient line, shown in parentheses, e.g. "1 medium tomato (170 g)" or "794 g crushed tomatoes (1 can)". Scales and converts with the amount but nothing is calculated from it. _Avoid_: package size, alternate amount.
**Ingredient group**: An ordered set of ingredient lines within a recipe, with an optional heading, e.g. "For the dough". A simple recipe has one group with no heading. Ignored by the grocery list.
**Canonical ingredient**: A shared ingredient record that ingredient lines point to, with a singular and plural name. Enables autocomplete, grocery sections, allowed units and (later) merging. Created by an admin, usually from a reference food.
**Reference food**: A row of the imported USDA FoodData Central data. Used to prefill canonical ingredients and, later, nutrition. Never shown to readers. _Avoid_: ingredient.
**Alias**: Another name that finds a canonical ingredient in search, e.g. "scallion" for green onion.
**Pending ingredient**: A canonical ingredient added by a creator and not yet approved by an admin. Usable in that creator's recipes only. Phase 2+.
**Allowed units**: The units offered for a canonical ingredient in the editor's unit dropdown, curated by an admin. Other units can still be picked for a single ingredient line.
**Nutrition data**: Nutrient values per 100 g attached to a canonical ingredient, plus gram weights for its units. A recipe's nutrition per serving is computed from it, never stored. Not in Phase 1.
**Prep note**: Free text on an ingredient line describing preparation, e.g. "finely diced".
**Step**: One instruction in a recipe, with optional step photo and step tokens. Has a stable ID.
**Step group**: An ordered set of steps within a recipe, with an optional heading, e.g. "Make the dough". Independent of ingredient groups. Shown as section breaks in cook mode and the instructions PDF.
**Step token**: A marked value inside step text that renders per unit system: `{oven:…}`, `{temp:…}`, `{len:…}`.
**Draft**: A post not visible to readers. Unpublishing sets a post back to draft.
**Unlisted**: A post anyone with the link can view, but that doesn't appear on the home page or in search engines. _Avoid_: private, hidden.
**Published**: A post visible to readers and listed on the home page. Edits to an unlisted or published post are visible as soon as they are saved.
**Deleted**: A post removed from the site but restorable until permanently deleted. Its URL returns "removed", and its slugs stay reserved. _Avoid_: archived, trashed.
**Audit log**: An admin-only record of who changed which record and when. Not in Phase 1. _Avoid_: revision history, version history.

## Reading

**Feed**: The home page: published posts, newest `publishedAt` first. Filtered by meal type and tag through the URL query, e.g. `/?meal=dinner&tag=italian`. Different filter kinds narrow (dinner and Italian); several values of one kind widen (Italian or Arabic). _Avoid_: timeline, stream.

## Units

**Unit**: One entry in the fixed unit list, of kind mass, volume, kitchen or count. "oz" is mass; "fl oz" is volume.
**Unit system**: Metric or imperial.
**Source unit system**: The unit system a recipe was written in. Recipes display in it by default.
**Kitchen units**: tsp, tbsp and cup. Shown unchanged in both unit systems.
**Count units**: Units that are counted, not measured, and never convert: clove, can, pinch, whole, and sizes such as small, medium, large. They still scale.

## Reader tools

**Grocery list**: The ingredient lines of one recipe, scaled and converted as the reader chose, grouped by grocery section. Free, no sign-up.
**Grocery section**: The store area an ingredient belongs to, e.g. produce or dairy.
**Merged grocery list**: A grocery list built from several recipes with totalled quantities and "used in" references. Paid, Phase 2+.
**Checklist**: The in-app, tickable version of a grocery list, saved on the reader's device.
**Cook mode**: A recipe view with large step text that keeps the screen awake.
