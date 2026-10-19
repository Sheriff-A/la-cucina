-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'creator', 'reader');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'unlisted', 'published');

-- CreateEnum
CREATE TYPE "UnitSystem" AS ENUM ('metric', 'imperial');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'side');

-- CreateEnum
CREATE TYPE "UnitKind" AS ENUM ('mass', 'volume', 'kitchen', 'count');

-- CreateEnum
CREATE TYPE "IngredientStatus" AS ENUM ('pending', 'approved');

-- CreateEnum
CREATE TYPE "ReferenceFoodSource" AS ENUM ('sr_legacy', 'foundation');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'reader',
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "story" JSONB,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "author_id" UUID NOT NULL,
    "hero_image_id" UUID,
    "published_at" TIMESTAMP(3),
    "first_published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_slugs" (
    "slug" TEXT NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_slugs_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "post_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "r2_key" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "variant_widths" INTEGER[],
    "alt_text" TEXT,
    "caption" TEXT,
    "uploaded_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_gallery_images" (
    "post_id" UUID NOT NULL,
    "image_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "post_gallery_images_pkey" PRIMARY KEY ("post_id","image_id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "base_servings" INTEGER NOT NULL,
    "source_unit_system" "UnitSystem" NOT NULL,
    "prep_time_minutes" INTEGER,
    "cook_time_minutes" INTEGER,
    "total_time_minutes" INTEGER,
    "meal_types" "MealType"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_groups" (
    "id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "heading" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ingredient_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_lines" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "canonical_ingredient_id" UUID NOT NULL,
    "quantity" DECIMAL(10,4),
    "unit_code" TEXT,
    "equivalent_quantity" DECIMAL(10,4),
    "equivalent_unit_code" TEXT,
    "prep_note" TEXT,

    CONSTRAINT "ingredient_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_groups" (
    "id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "heading" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "step_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "photo_id" UUID,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plural_name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "kind" "UnitKind" NOT NULL,
    "system" "UnitSystem",
    "position" INTEGER NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "grocery_sections" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "grocery_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canonical_ingredients" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "plural_name" TEXT NOT NULL,
    "grocery_section_id" UUID NOT NULL,
    "status" "IngredientStatus" NOT NULL DEFAULT 'approved',
    "reference_food_id" INTEGER,
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canonical_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_aliases" (
    "id" UUID NOT NULL,
    "canonical_ingredient_id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ingredient_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canonical_ingredient_units" (
    "canonical_ingredient_id" UUID NOT NULL,
    "unit_code" TEXT NOT NULL,
    "gram_weight" DECIMAL(10,3),

    CONSTRAINT "canonical_ingredient_units_pkey" PRIMARY KEY ("canonical_ingredient_id","unit_code")
);

-- CreateTable
CREATE TABLE "reference_foods" (
    "fdc_id" INTEGER NOT NULL,
    "source" "ReferenceFoodSource" NOT NULL,
    "description" TEXT NOT NULL,
    "usda_category" TEXT,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_foods_pkey" PRIMARY KEY ("fdc_id")
);

-- CreateTable
CREATE TABLE "reference_food_portions" (
    "id" INTEGER NOT NULL,
    "fdc_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,3) NOT NULL,
    "unit_name" TEXT,
    "modifier" TEXT,
    "description" TEXT,
    "gram_weight" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "reference_food_portions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_auth_user_id_key" ON "profiles"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_status_deleted_at_published_at_idx" ON "posts"("status", "deleted_at", "published_at" DESC);

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

-- CreateIndex
CREATE INDEX "post_slugs_post_id_idx" ON "post_slugs"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "post_tags_tag_id_idx" ON "post_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_r2_key_key" ON "images"("r2_key");

-- CreateIndex
CREATE INDEX "post_gallery_images_post_id_position_idx" ON "post_gallery_images"("post_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_post_id_key" ON "recipes"("post_id");

-- CreateIndex
CREATE INDEX "ingredient_groups_recipe_id_position_idx" ON "ingredient_groups"("recipe_id", "position");

-- CreateIndex
CREATE INDEX "ingredient_lines_group_id_position_idx" ON "ingredient_lines"("group_id", "position");

-- CreateIndex
CREATE INDEX "ingredient_lines_canonical_ingredient_id_idx" ON "ingredient_lines"("canonical_ingredient_id");

-- CreateIndex
CREATE INDEX "step_groups_recipe_id_position_idx" ON "step_groups"("recipe_id", "position");

-- CreateIndex
CREATE INDEX "steps_group_id_position_idx" ON "steps"("group_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "grocery_sections_name_key" ON "grocery_sections"("name");

-- CreateIndex
CREATE INDEX "canonical_ingredients_grocery_section_id_idx" ON "canonical_ingredients"("grocery_section_id");

-- CreateIndex
CREATE INDEX "ingredient_aliases_canonical_ingredient_id_idx" ON "ingredient_aliases"("canonical_ingredient_id");

-- CreateIndex
CREATE INDEX "reference_foods_usda_category_idx" ON "reference_foods"("usda_category");

-- CreateIndex
CREATE INDEX "reference_food_portions_fdc_id_idx" ON "reference_food_portions"("fdc_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_fkey" FOREIGN KEY ("hero_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_slugs" ADD CONSTRAINT "post_slugs_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_gallery_images" ADD CONSTRAINT "post_gallery_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_gallery_images" ADD CONSTRAINT "post_gallery_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_groups" ADD CONSTRAINT "ingredient_groups_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ingredient_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_canonical_ingredient_id_fkey" FOREIGN KEY ("canonical_ingredient_id") REFERENCES "canonical_ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_unit_code_fkey" FOREIGN KEY ("unit_code") REFERENCES "units"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_equivalent_unit_code_fkey" FOREIGN KEY ("equivalent_unit_code") REFERENCES "units"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_groups" ADD CONSTRAINT "step_groups_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "step_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_ingredients" ADD CONSTRAINT "canonical_ingredients_grocery_section_id_fkey" FOREIGN KEY ("grocery_section_id") REFERENCES "grocery_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_ingredients" ADD CONSTRAINT "canonical_ingredients_reference_food_id_fkey" FOREIGN KEY ("reference_food_id") REFERENCES "reference_foods"("fdc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_ingredients" ADD CONSTRAINT "canonical_ingredients_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_aliases" ADD CONSTRAINT "ingredient_aliases_canonical_ingredient_id_fkey" FOREIGN KEY ("canonical_ingredient_id") REFERENCES "canonical_ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_ingredient_units" ADD CONSTRAINT "canonical_ingredient_units_canonical_ingredient_id_fkey" FOREIGN KEY ("canonical_ingredient_id") REFERENCES "canonical_ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canonical_ingredient_units" ADD CONSTRAINT "canonical_ingredient_units_unit_code_fkey" FOREIGN KEY ("unit_code") REFERENCES "units"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_food_portions" ADD CONSTRAINT "reference_food_portions_fdc_id_fkey" FOREIGN KEY ("fdc_id") REFERENCES "reference_foods"("fdc_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Rules Prisma can't express (see comments in schema.prisma) ─────────────

-- ADR-0003: an amount is a quantity > 0 with a unit, or neither (as needed).
ALTER TABLE "ingredient_lines"
  ADD CONSTRAINT "ingredient_lines_quantity_positive" CHECK ("quantity" IS NULL OR "quantity" > 0),
  ADD CONSTRAINT "ingredient_lines_amount_complete" CHECK (("quantity" IS NULL) = ("unit_code" IS NULL)),
  ADD CONSTRAINT "ingredient_lines_equivalent_complete" CHECK (("equivalent_quantity" IS NULL) = ("equivalent_unit_code" IS NULL)),
  ADD CONSTRAINT "ingredient_lines_equivalent_positive" CHECK ("equivalent_quantity" IS NULL OR "equivalent_quantity" > 0),
  ADD CONSTRAINT "ingredient_lines_equivalent_needs_amount" CHECK ("equivalent_quantity" IS NULL OR "quantity" IS NOT NULL);

-- Recipe numbers.
ALTER TABLE "recipes"
  ADD CONSTRAINT "recipes_base_servings_positive" CHECK ("base_servings" > 0),
  ADD CONSTRAINT "recipes_prep_time_non_negative" CHECK ("prep_time_minutes" IS NULL OR "prep_time_minutes" >= 0),
  ADD CONSTRAINT "recipes_cook_time_non_negative" CHECK ("cook_time_minutes" IS NULL OR "cook_time_minutes" >= 0),
  ADD CONSTRAINT "recipes_total_time_non_negative" CHECK ("total_time_minutes" IS NULL OR "total_time_minutes" >= 0);

ALTER TABLE "canonical_ingredient_units"
  ADD CONSTRAINT "canonical_ingredient_units_gram_weight_positive" CHECK ("gram_weight" IS NULL OR "gram_weight" > 0);

ALTER TABLE "images"
  ADD CONSTRAINT "images_dimensions_positive" CHECK ("width" > 0 AND "height" > 0);

-- ADR-0004: ingredient names and aliases are unique regardless of case.
CREATE UNIQUE INDEX "canonical_ingredients_name_lower_key" ON "canonical_ingredients" (lower("name"));
CREATE UNIQUE INDEX "ingredient_aliases_name_lower_key" ON "ingredient_aliases" (lower("name"));
