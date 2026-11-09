// Starter canonical ingredients (ADR-0004: "about 200 common ingredients are created the
// same way up front"). Hand-reviewed: edit this file directly.
//
// Built once from the USDA spike's 146 candidates (notes/2026-10-01-usda-spike.md). Each
// entry names the USDA food it came from (FDC ID; its description and category are in the
// comment above it), a grocery section suggested by lib/usda/grocery-section-mapping.ts and
// then reviewed, and its allowed units. Gram weights for count and kitchen units come from
// the USDA household portions via lib/usda/portion-parser.ts (first portion per unit, then
// reviewed); mass units carry their exact weight; null means allowed, with no USDA weight.
// Mass and volume units always come with their other-system counterparts (ADR-0003).
//
// The seed only creates ingredients whose name doesn't exist yet and never updates one, so
// an admin's later edits survive a re-run.

import type { StartingGrocerySection } from "@/lib/grocery/grocery-sections";
import type { UnitCode } from "@/lib/units/unit-list";

export interface StarterCanonicalIngredient {
  name: string;
  pluralName: string;
  /** The reference food (USDA FDC ID) it was created from. */
  fdcId: number;
  grocerySection: StartingGrocerySection;
  /** Allowed units → grams per unit, or null when there's no USDA weight. */
  units: Partial<Record<UnitCode, number | null>>;
  aliases?: readonly string[];
}

export const STARTER_CANONICAL_INGREDIENTS: readonly StarterCanonicalIngredient[] =
  [
    // Onions, raw (Vegetables and Vegetable Products)
    {
      name: "onion",
      pluralName: "onions",
      fdcId: 170000,
      grocerySection: "Produce",
      units: {
        g: 1,
        kg: 1000,
        oz: 28.35,
        lb: 453.592,
        tbsp: 10,
        cup: 160,
        small: 70,
        medium: 110,
        large: 150,
        slice: 38,
      },
    },
    // Onions, red, raw (Vegetables and Vegetable Products)
    {
      name: "red onion",
      pluralName: "red onions",
      fdcId: 790577,
      grocerySection: "Produce",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: 197 },
    },
    // Onions, spring or scallions (includes tops and bulb), raw (Vegetables and Vegetable Products)
    {
      name: "green onion",
      pluralName: "green onions",
      fdcId: 170005,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        tbsp: 6,
        cup: 100,
        small: 5,
        medium: 15,
        large: 25,
        bunch: null,
      },
      aliases: ["scallion", "spring onion"],
    },
    // Shallots, raw (Vegetables and Vegetable Products)
    {
      name: "shallot",
      pluralName: "shallots",
      fdcId: 170499,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tbsp: 10, whole: null },
    },
    // Garlic, raw (Vegetables and Vegetable Products)
    {
      name: "garlic",
      pluralName: "garlic",
      fdcId: 169230,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tsp: 2.8, cup: 136, clove: 3, head: null },
    },
    // Ginger root, raw (Vegetables and Vegetable Products)
    {
      name: "ginger",
      pluralName: "ginger",
      fdcId: 169231,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tsp: 2, cup: 96, slice: 2.2 },
    },
    // Tomatoes, red, ripe, raw, year round average (Vegetables and Vegetable Products)
    {
      name: "tomato",
      pluralName: "tomatoes",
      fdcId: 170457,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        cup: 149,
        small: 91,
        medium: 123,
        large: 182,
        slice: 20,
        wedge: 31,
      },
    },
    // Tomatoes, red, ripe, raw, year round average (Vegetables and Vegetable Products)
    {
      name: "cherry tomato",
      pluralName: "cherry tomatoes",
      fdcId: 170457,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 149, whole: 17 },
    },
    // Potatoes, flesh and skin, raw (Vegetables and Vegetable Products)
    {
      name: "potato",
      pluralName: "potatoes",
      fdcId: 170026,
      grocerySection: "Produce",
      units: {
        g: 1,
        kg: 1000,
        oz: 28.35,
        lb: 453.592,
        cup: 150,
        small: 170,
        medium: 213,
        large: 369,
      },
    },
    // Sweet potato, raw, unprepared (Includes foods for USDA's Food Distribution Program) (Vegetables and Vegetable Products)
    {
      name: "sweet potato",
      pluralName: "sweet potatoes",
      fdcId: 168482,
      grocerySection: "Produce",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, cup: 133, whole: 130 },
    },
    // Carrots, raw (Vegetables and Vegetable Products)
    {
      name: "carrot",
      pluralName: "carrots",
      fdcId: 170393,
      grocerySection: "Produce",
      units: {
        g: 1,
        kg: 1000,
        oz: 28.35,
        lb: 453.592,
        cup: 128,
        small: 50,
        medium: 61,
        large: 72,
        slice: 3,
      },
    },
    // Celery, raw (Vegetables and Vegetable Products)
    {
      name: "celery",
      pluralName: "celery",
      fdcId: 169988,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tbsp: 7.5, cup: 101, stalk: 64 },
    },
    // Peppers, sweet, red, raw (Vegetables and Vegetable Products)
    {
      name: "red bell pepper",
      pluralName: "red bell peppers",
      fdcId: 170108,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        tbsp: 9.3,
        cup: 149,
        small: 74,
        medium: 119,
        large: 164,
      },
      aliases: ["red pepper", "capsicum"],
    },
    // Peppers, sweet, green, raw (Vegetables and Vegetable Products)
    {
      name: "green bell pepper",
      pluralName: "green bell peppers",
      fdcId: 170427,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        tbsp: 9.3,
        cup: 149,
        small: 74,
        medium: 119,
        large: 164,
      },
    },
    // Peppers, jalapeno, raw (Vegetables and Vegetable Products)
    {
      name: "jalapeño",
      pluralName: "jalapeños",
      fdcId: 168576,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 90, whole: 14 },
      aliases: ["jalapeno"],
    },
    // Cucumber, with peel, raw (Vegetables and Vegetable Products)
    {
      name: "cucumber",
      pluralName: "cucumbers",
      fdcId: 168409,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 104, whole: 301 },
    },
    // Squash, summer, zucchini, includes skin, raw (Vegetables and Vegetable Products)
    {
      name: "zucchini",
      pluralName: "zucchini",
      fdcId: 169291,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        cup: 124,
        small: 118,
        medium: 196,
        large: 323,
        slice: 9.9,
      },
      aliases: ["courgette"],
    },
    // Eggplant, raw (Vegetables and Vegetable Products)
    {
      name: "eggplant",
      pluralName: "eggplants",
      fdcId: 169228,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 82, whole: 458 },
      aliases: ["aubergine"],
    },
    // Broccoli, raw (Vegetables and Vegetable Products)
    {
      name: "broccoli",
      pluralName: "broccoli",
      fdcId: 170379,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 91, bunch: 608, stalk: 151, spear: 31 },
    },
    // Cauliflower, raw (Vegetables and Vegetable Products)
    {
      name: "cauliflower",
      pluralName: "cauliflower",
      fdcId: 169986,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 107, head: 840 },
    },
    // Cabbage, raw (Vegetables and Vegetable Products)
    {
      name: "cabbage",
      pluralName: "cabbage",
      fdcId: 169975,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 89, head: 1248, leaf: 33 },
    },
    // Spinach, raw (Vegetables and Vegetable Products)
    {
      name: "spinach",
      pluralName: "spinach",
      fdcId: 168462,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 30, bunch: 340, leaf: 10, package: 284 },
    },
    // Kale, raw (Vegetables and Vegetable Products)
    {
      name: "kale",
      pluralName: "kale",
      fdcId: 323505,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 20.6 },
    },
    // Lettuce, cos or romaine, raw (Vegetables and Vegetable Products)
    {
      name: "lettuce",
      pluralName: "lettuce",
      fdcId: 169247,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 47, head: 626, leaf: 6 },
      aliases: ["romaine"],
    },
    // Mushrooms, white, raw (Vegetables and Vegetable Products)
    {
      name: "mushroom",
      pluralName: "mushrooms",
      fdcId: 169251,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        cup: 70,
        small: 10,
        medium: 18,
        large: 23,
        slice: 6,
      },
      aliases: ["white mushroom", "button mushroom"],
    },
    // Beans, snap, green, raw (Vegetables and Vegetable Products)
    {
      name: "green bean",
      pluralName: "green beans",
      fdcId: 169961,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 100 },
      aliases: ["string bean"],
    },
    // Peas, green, raw (Vegetables and Vegetable Products)
    {
      name: "pea",
      pluralName: "peas",
      fdcId: 170419,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 145 },
    },
    // Corn, sweet, yellow, raw (Vegetables and Vegetable Products)
    {
      name: "corn",
      pluralName: "corn",
      fdcId: 169998,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 145, ear: 143 },
    },
    // Asparagus, raw (Vegetables and Vegetable Products)
    {
      name: "asparagus",
      pluralName: "asparagus",
      fdcId: 168389,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 134, spear: 12 },
    },
    // Leeks, (bulb and lower leaf-portion), raw (Vegetables and Vegetable Products)
    {
      name: "leek",
      pluralName: "leeks",
      fdcId: 169246,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 89, whole: 89, slice: 6 },
    },
    // Lemons, raw, without peel (Fruits and Fruit Juices)
    {
      name: "lemon",
      pluralName: "lemons",
      fdcId: 167746,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 212, whole: 58, wedge: 7 },
    },
    // Limes, raw (Fruits and Fruit Juices)
    {
      name: "lime",
      pluralName: "limes",
      fdcId: 168155,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, whole: 67, wedge: null },
    },
    // Oranges, raw, all commercial varieties (Fruits and Fruit Juices)
    {
      name: "orange",
      pluralName: "oranges",
      fdcId: 169097,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 180, whole: 131, small: 96, large: 184 },
    },
    // Apples, raw, with skin (Includes foods for USDA's Food Distribution Program) (Fruits and Fruit Juices)
    {
      name: "apple",
      pluralName: "apples",
      fdcId: 171688,
      grocerySection: "Produce",
      units: {
        g: 1,
        kg: 1000,
        oz: 28.35,
        lb: 453.592,
        cup: 125,
        small: 149,
        medium: 182,
        large: 223,
      },
    },
    // Bananas, raw (Fruits and Fruit Juices)
    {
      name: "banana",
      pluralName: "bananas",
      fdcId: 173944,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        cup: 225,
        small: 101,
        medium: 118,
        large: 136,
        extra_large: 152,
      },
    },
    // Avocados, raw, all commercial varieties (Fruits and Fruit Juices)
    {
      name: "avocado",
      pluralName: "avocados",
      fdcId: 171705,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 150, whole: 201 },
    },
    // Strawberries, raw (Fruits and Fruit Juices)
    {
      name: "strawberry",
      pluralName: "strawberries",
      fdcId: 167762,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        cup: 152,
        small: 7,
        medium: 12,
        large: 18,
        extra_large: 27,
      },
    },
    // Blueberries, raw (Fruits and Fruit Juices)
    {
      name: "blueberry",
      pluralName: "blueberries",
      fdcId: 171711,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 148 },
    },
    // Raisins, dark, seedless (Includes foods for USDA's Food Distribution Program) (Fruits and Fruit Juices)
    {
      name: "raisin",
      pluralName: "raisins",
      fdcId: 168165,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 165 },
    },
    // Dates, medjool (Fruits and Fruit Juices)
    {
      name: "date",
      pluralName: "dates",
      fdcId: 168191,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, whole: 24 },
    },
    // Parsley, fresh (Vegetables and Vegetable Products)
    {
      name: "parsley",
      pluralName: "parsley",
      fdcId: 170416,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tbsp: 3.8, cup: 60, bunch: null, sprig: 1 },
    },
    // Coriander (cilantro) leaves, raw (Vegetables and Vegetable Products)
    {
      name: "cilantro",
      pluralName: "cilantro",
      fdcId: 169997,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 16, bunch: null, sprig: 2.222 },
      aliases: ["fresh coriander"],
    },
    // Basil, fresh (Spices and Herbs)
    {
      name: "basil",
      pluralName: "basil",
      fdcId: 172232,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tbsp: 2.65, cup: 24, bunch: null, leaf: 0.5 },
    },
    // Spearmint, fresh (Spices and Herbs)
    {
      name: "mint",
      pluralName: "mint",
      fdcId: 173475,
      grocerySection: "Produce",
      units: {
        g: 1,
        oz: 28.35,
        tbsp: 5.7,
        bunch: null,
        sprig: null,
        leaf: 0.15,
      },
    },
    // Thyme, fresh (Spices and Herbs)
    {
      name: "thyme",
      pluralName: "thyme",
      fdcId: 173470,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tsp: 0.8, sprig: null },
    },
    // Rosemary, fresh (Spices and Herbs)
    {
      name: "rosemary",
      pluralName: "rosemary",
      fdcId: 173473,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, tsp: 0.7, tbsp: 1.7, sprig: null },
    },
    // Dill weed, fresh (Spices and Herbs)
    {
      name: "dill",
      pluralName: "dill",
      fdcId: 172233,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 8.9, bunch: null, sprig: 0.2 },
    },
    // Spices, bay leaf (Spices and Herbs)
    {
      name: "bay leaf",
      pluralName: "bay leaves",
      fdcId: 170917,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 0.6, tbsp: 1.8, whole: null, pinch: null },
    },
    // Spices, oregano, dried (Spices and Herbs)
    {
      name: "dried oregano",
      pluralName: "dried oregano",
      fdcId: 171328,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 1, pinch: null },
    },
    // Spices, cumin seed (Spices and Herbs)
    {
      name: "cumin",
      pluralName: "cumin",
      fdcId: 170923,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 2.1, tbsp: 6, pinch: null },
    },
    // Spices, paprika (Spices and Herbs)
    {
      name: "paprika",
      pluralName: "paprika",
      fdcId: 171329,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 2.3, tbsp: 6.8, pinch: null },
    },
    // Spices, cinnamon, ground (Spices and Herbs)
    {
      name: "cinnamon",
      pluralName: "cinnamon",
      fdcId: 171320,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 2.6, tbsp: 7.8, pinch: null },
    },
    // Spices, pepper, black (Spices and Herbs)
    {
      name: "black pepper",
      pluralName: "black pepper",
      fdcId: 170931,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 2.3, tbsp: 6.9, pinch: null, dash: 0.1 },
    },
    // Spices, chili powder (Spices and Herbs)
    {
      name: "chili powder",
      pluralName: "chili powder",
      fdcId: 171319,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 2.7, tbsp: 8, pinch: null },
    },
    // Spices, turmeric, ground (Spices and Herbs)
    {
      name: "turmeric",
      pluralName: "turmeric",
      fdcId: 172231,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 3, tbsp: 9.4, pinch: null },
    },
    // Spices, nutmeg, ground (Spices and Herbs)
    {
      name: "nutmeg",
      pluralName: "nutmeg",
      fdcId: 171326,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 2.2, tbsp: 7, pinch: null },
    },
    // Spices, pepper, red or cayenne (Spices and Herbs)
    {
      name: "cayenne",
      pluralName: "cayenne",
      fdcId: 170932,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 1.8, tbsp: 5.3, pinch: null },
      aliases: ["cayenne pepper"],
    },
    // Spices, coriander seed (Spices and Herbs)
    {
      name: "ground coriander",
      pluralName: "ground coriander",
      fdcId: 170922,
      grocerySection: "Spices & seasonings",
      units: { g: 1, oz: 28.35, tsp: 1.8, tbsp: 5, pinch: null },
    },
    // Salt, table (Spices and Herbs)
    {
      name: "salt",
      pluralName: "salt",
      fdcId: 173468,
      grocerySection: "Spices & seasonings",
      units: {
        g: 1,
        oz: 28.35,
        tsp: 6,
        tbsp: 18,
        cup: 292,
        pinch: null,
        dash: 0.4,
      },
    },
    // Sugars, granulated (Sweets)
    {
      name: "sugar",
      pluralName: "sugar",
      fdcId: 169655,
      grocerySection: "Pantry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, tsp: 4.2, cup: 200 },
      aliases: ["granulated sugar", "white sugar"],
    },
    // Sugars, brown (Sweets)
    {
      name: "brown sugar",
      pluralName: "brown sugar",
      fdcId: 168833,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tsp: 3, cup: 220 },
    },
    // Sugars, powdered (Sweets)
    {
      name: "powdered sugar",
      pluralName: "powdered sugar",
      fdcId: 169656,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tsp: 2.5, tbsp: 8, cup: 120 },
      aliases: ["icing sugar", "confectioners' sugar"],
    },
    // Honey (Sweets)
    {
      name: "honey",
      pluralName: "honey",
      fdcId: 169640,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 21, cup: 339 },
    },
    // Syrups, maple (Sweets)
    {
      name: "maple syrup",
      pluralName: "maple syrup",
      fdcId: 169661,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, ml: null, fl_oz: null, tbsp: 20, cup: 315 },
    },
    // Wheat flour, white, all-purpose, enriched, bleached (Cereal Grains and Pasta)
    {
      name: "all-purpose flour",
      pluralName: "all-purpose flour",
      fdcId: 168894,
      grocerySection: "Pantry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, tbsp: null, cup: 125 },
      aliases: ["flour", "plain flour"],
    },
    // Flour, whole wheat, unenriched (Cereal Grains and Pasta)
    {
      name: "whole wheat flour",
      pluralName: "whole wheat flour",
      fdcId: 790085,
      grocerySection: "Pantry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, tbsp: null, cup: null },
      aliases: ["wholemeal flour"],
    },
    // Leavening agents, baking powder, double-acting, sodium aluminum sulfate (Baked Products)
    {
      name: "baking powder",
      pluralName: "baking powder",
      fdcId: 172803,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tsp: 4.6 },
    },
    // Leavening agents, baking soda (Baked Products)
    {
      name: "baking soda",
      pluralName: "baking soda",
      fdcId: 175040,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tsp: 4.6 },
      aliases: ["bicarbonate of soda"],
    },
    // Leavening agents, yeast, baker's, active dry (Baked Products)
    {
      name: "active dry yeast",
      pluralName: "active dry yeast",
      fdcId: 175043,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tsp: 4, tbsp: 12, package: 7.2 },
      aliases: ["yeast"],
    },
    // Cornstarch (Cereal Grains and Pasta)
    {
      name: "cornstarch",
      pluralName: "cornstarch",
      fdcId: 169698,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: null, cup: 128 },
      aliases: ["cornflour"],
    },
    // Cocoa, dry powder, unsweetened (Sweets)
    {
      name: "cocoa powder",
      pluralName: "cocoa powder",
      fdcId: 169593,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 5.4, cup: 86 },
    },
    // Candies, semisweet chocolate (Sweets)
    {
      name: "chocolate chip",
      pluralName: "chocolate chips",
      fdcId: 167976,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 182 },
    },
    // Vanilla extract (Spices and Herbs)
    {
      name: "vanilla extract",
      pluralName: "vanilla extract",
      fdcId: 173471,
      grocerySection: "Pantry",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        fl_oz: null,
        tsp: 4.2,
        tbsp: 13,
        cup: 208,
      },
    },
    // Rice, white, long-grain, regular, raw, enriched (Cereal Grains and Pasta)
    {
      name: "white rice",
      pluralName: "white rice",
      fdcId: 168877,
      grocerySection: "Pantry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, cup: 185 },
      aliases: ["rice"],
    },
    // Rice, brown, long-grain, raw (Includes foods for USDA's Food Distribution Program) (Cereal Grains and Pasta)
    {
      name: "brown rice",
      pluralName: "brown rice",
      fdcId: 169703,
      grocerySection: "Pantry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, cup: 185 },
    },
    // Pasta, dry, enriched (Cereal Grains and Pasta)
    {
      name: "pasta",
      pluralName: "pasta",
      fdcId: 169736,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 91 },
    },
    // Pasta, dry, enriched (Cereal Grains and Pasta)
    {
      name: "spaghetti",
      pluralName: "spaghetti",
      fdcId: 169736,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 91 },
    },
    // Cereals, oats, regular and quick, not fortified, dry (Breakfast Cereals)
    {
      name: "rolled oats",
      pluralName: "rolled oats",
      fdcId: 173904,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 81 },
      aliases: ["oats"],
    },
    // Bread, white, commercially prepared (includes soft bread crumbs) (Baked Products)
    {
      name: "bread",
      pluralName: "bread",
      fdcId: 174924,
      grocerySection: "Bakery",
      units: { g: 1, oz: 28.35, cup: 45, whole: null, slice: 29 },
    },
    // Bread, crumbs, dry, grated, plain (Baked Products)
    {
      name: "breadcrumb",
      pluralName: "breadcrumbs",
      fdcId: 174928,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 108 },
    },
    // Quinoa, uncooked (Cereal Grains and Pasta)
    {
      name: "quinoa",
      pluralName: "quinoa",
      fdcId: 168874,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 170 },
    },
    // Couscous, dry (Cereal Grains and Pasta)
    {
      name: "couscous",
      pluralName: "couscous",
      fdcId: 169699,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 173 },
    },
    // Bulgur, dry (Cereal Grains and Pasta)
    {
      name: "bulgur",
      pluralName: "bulgur",
      fdcId: 170688,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 140 },
    },
    // Lentils, raw (Legumes and Legume Products)
    {
      name: "lentil",
      pluralName: "lentils",
      fdcId: 172420,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 12, cup: 192 },
    },
    // Chickpeas (garbanzo beans, bengal gram), mature seeds, raw (Legumes and Legume Products)
    {
      name: "dried chickpea",
      pluralName: "dried chickpeas",
      fdcId: 173756,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 12.5, cup: 200 },
      aliases: ["garbanzo bean"],
    },
    // Chickpeas (garbanzo beans, bengal gram), mature seeds, canned, solids and liquids (Legumes and Legume Products)
    {
      name: "canned chickpea",
      pluralName: "canned chickpeas",
      fdcId: 175206,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, cup: 240, can: 448 },
    },
    // Beans, black, mature seeds, canned, low sodium (Legumes and Legume Products)
    {
      name: "canned black bean",
      pluralName: "canned black beans",
      fdcId: 175238,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, cup: 240, can: null },
    },
    // Beans, kidney, red, mature seeds, canned, solids and liquids (Legumes and Legume Products)
    {
      name: "canned kidney bean",
      pluralName: "canned kidney beans",
      fdcId: 175195,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, tbsp: 16, cup: 256, can: 436 },
    },
    // Tofu, raw, firm, prepared with calcium sulfate (Legumes and Legume Products)
    {
      name: "tofu",
      pluralName: "tofu",
      fdcId: 172475,
      grocerySection: "Produce",
      units: { g: 1, oz: 28.35, cup: 252, package: null },
    },
    // Butter, salted (Dairy and Egg Products)
    {
      name: "butter",
      pluralName: "butter",
      fdcId: 173410,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: 14.2, cup: 227, stick: 113 },
    },
    // Butter, without salt (Dairy and Egg Products)
    {
      name: "unsalted butter",
      pluralName: "unsalted butter",
      fdcId: 173430,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: 14.2, cup: 227, stick: 113 },
    },
    // Milk, whole, 3.25% milkfat, with added vitamin D (Dairy and Egg Products)
    {
      name: "milk",
      pluralName: "milk",
      fdcId: 322892,
      grocerySection: "Dairy & eggs",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        l: null,
        fl_oz: 30.5,
        quart: 976,
        tbsp: 15,
        cup: 229,
      },
      aliases: ["whole milk"],
    },
    // Cream, fluid, heavy whipping (Dairy and Egg Products)
    {
      name: "heavy cream",
      pluralName: "heavy cream",
      fdcId: 170859,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, ml: null, fl_oz: 29.8, tbsp: 15, cup: 238 },
      aliases: ["whipping cream", "double cream"],
    },
    // Cream, sour, cultured (Dairy and Egg Products)
    {
      name: "sour cream",
      pluralName: "sour cream",
      fdcId: 171257,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: 12, cup: 230 },
    },
    // Yogurt, plain, whole milk (Dairy and Egg Products)
    {
      name: "yogurt",
      pluralName: "yogurt",
      fdcId: 171284,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: null, cup: 245 },
      aliases: ["plain yogurt", "yoghurt"],
    },
    // Yogurt, Greek, plain, whole milk (Dairy and Egg Products)
    {
      name: "greek yogurt",
      pluralName: "greek yogurt",
      fdcId: 2259794,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: null, cup: null },
    },
    // Egg, whole, raw, fresh (Dairy and Egg Products)
    {
      name: "egg",
      pluralName: "eggs",
      fdcId: 171287,
      grocerySection: "Dairy & eggs",
      units: {
        g: 1,
        oz: 28.35,
        cup: 243,
        small: 38,
        medium: 44,
        large: 50,
        extra_large: 56,
      },
    },
    // Egg, yolk, raw, fresh (Dairy and Egg Products)
    {
      name: "egg yolk",
      pluralName: "egg yolks",
      fdcId: 172184,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, cup: 243, large: 17 },
    },
    // Egg, white, raw, fresh (Dairy and Egg Products)
    {
      name: "egg white",
      pluralName: "egg whites",
      fdcId: 172183,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, cup: 243, large: 33 },
    },
    // Cheese, parmesan, grated (Dairy and Egg Products)
    {
      name: "parmesan",
      pluralName: "parmesan",
      fdcId: 171247,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: 5, cup: 100 },
      aliases: ["parmigiano-reggiano"],
    },
    // Cheese, cheddar (Includes foods for USDA's Food Distribution Program) (Dairy and Egg Products)
    {
      name: "cheddar",
      pluralName: "cheddar",
      fdcId: 173414,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, cup: 132, slice: 28 },
    },
    // Cheese, mozzarella, whole milk (Dairy and Egg Products)
    {
      name: "mozzarella",
      pluralName: "mozzarella",
      fdcId: 170845,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, cup: 112, slice: 28.333 },
    },
    // Cheese, feta (Dairy and Egg Products)
    {
      name: "feta",
      pluralName: "feta",
      fdcId: 173420,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, cup: 150, wedge: 38 },
    },
    // Cheese, ricotta, whole milk (Dairy and Egg Products)
    {
      name: "ricotta",
      pluralName: "ricotta",
      fdcId: 323444,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, cup: 323 },
    },
    // Cheese, cream (Dairy and Egg Products)
    {
      name: "cream cheese",
      pluralName: "cream cheese",
      fdcId: 173418,
      grocerySection: "Dairy & eggs",
      units: { g: 1, oz: 28.35, tbsp: 14.5, cup: 232, package: 85 },
    },
    // Oil, olive, salad or cooking (Fats and Oils)
    {
      name: "olive oil",
      pluralName: "olive oil",
      fdcId: 171413,
      grocerySection: "Pantry",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        l: null,
        fl_oz: null,
        quart: null,
        tsp: 4.5,
        tbsp: 13.5,
        cup: 216,
      },
    },
    // Oil, canola (Fats and Oils)
    {
      name: "vegetable oil",
      pluralName: "vegetable oil",
      fdcId: 172336,
      grocerySection: "Pantry",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        l: null,
        fl_oz: null,
        quart: null,
        tsp: 4.5,
        tbsp: 14,
        cup: 218,
      },
      aliases: ["canola oil"],
    },
    // Oil, sesame, salad or cooking (Fats and Oils)
    {
      name: "sesame oil",
      pluralName: "sesame oil",
      fdcId: 171016,
      grocerySection: "Pantry",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        fl_oz: null,
        tsp: 4.5,
        tbsp: 13.6,
        cup: 218,
      },
    },
    // Vinegar, distilled (Spices and Herbs)
    {
      name: "white vinegar",
      pluralName: "white vinegar",
      fdcId: 172237,
      grocerySection: "Condiments & sauces",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        fl_oz: null,
        tsp: 5,
        tbsp: 14.9,
        cup: 238,
      },
      aliases: ["distilled vinegar", "vinegar"],
    },
    // Vinegar, balsamic (Spices and Herbs)
    {
      name: "balsamic vinegar",
      pluralName: "balsamic vinegar",
      fdcId: 172241,
      grocerySection: "Condiments & sauces",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        fl_oz: null,
        tsp: 5.3,
        tbsp: 16,
        cup: 255,
      },
    },
    // Vinegar, red wine (Spices and Herbs)
    {
      name: "red wine vinegar",
      pluralName: "red wine vinegar",
      fdcId: 172240,
      grocerySection: "Condiments & sauces",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        fl_oz: null,
        tsp: 5,
        tbsp: 14.9,
        cup: 239,
      },
    },
    // Soy sauce made from soy and wheat (shoyu) (Legumes and Legume Products)
    {
      name: "soy sauce",
      pluralName: "soy sauce",
      fdcId: 174277,
      grocerySection: "Condiments & sauces",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        fl_oz: null,
        tsp: 5.3,
        tbsp: 16,
        cup: 255,
      },
    },
    // Mustard, prepared, yellow (Spices and Herbs)
    {
      name: "mustard",
      pluralName: "mustard",
      fdcId: 326698,
      grocerySection: "Condiments & sauces",
      units: { g: 1, oz: 28.35, tsp: 6, tbsp: null, cup: 249 },
      aliases: ["yellow mustard"],
    },
    // Salad dressing, mayonnaise, regular (Fats and Oils)
    {
      name: "mayonnaise",
      pluralName: "mayonnaise",
      fdcId: 171009,
      grocerySection: "Condiments & sauces",
      units: { g: 1, oz: 28.35, tbsp: 13.8, cup: 220 },
      aliases: ["mayo"],
    },
    // Catsup (Vegetables and Vegetable Products)
    {
      name: "ketchup",
      pluralName: "ketchup",
      fdcId: 168556,
      grocerySection: "Condiments & sauces",
      units: { g: 1, oz: 28.35, tbsp: 17, cup: 240 },
    },
    // Tomato products, canned, paste, without salt added (Includes foods for USDA's Food Distribution Program) (Vegetables and Vegetable Products)
    {
      name: "tomato paste",
      pluralName: "tomato paste",
      fdcId: 170459,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, tbsp: 16, cup: 264, can: 170 },
      aliases: ["tomato purée"],
    },
    // Tomatoes, crushed, canned (Vegetables and Vegetable Products)
    {
      name: "crushed tomatoes",
      pluralName: "crushed tomatoes",
      fdcId: 170501,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, cup: 242, can: null },
    },
    // Tomatoes, red, ripe, canned, packed in tomato juice, no salt added (Vegetables and Vegetable Products)
    {
      name: "diced tomatoes",
      pluralName: "diced tomatoes",
      fdcId: 170138,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, tbsp: 15, cup: 240, can: 190 },
    },
    // Tomato products, canned, sauce, spanish style (Vegetables and Vegetable Products)
    {
      name: "tomato sauce",
      pluralName: "tomato sauce",
      fdcId: 170085,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, ml: null, fl_oz: null, cup: 244, can: 425 },
    },
    // Soup, stock, chicken, home-prepared (Soups, Sauces, and Gravies)
    {
      name: "chicken stock",
      pluralName: "chicken stock",
      fdcId: 172884,
      grocerySection: "Pantry",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        l: null,
        fl_oz: null,
        quart: null,
        cup: 240,
      },
      aliases: ["chicken broth"],
    },
    // Soup, stock, beef, home-prepared (Soups, Sauces, and Gravies)
    {
      name: "beef stock",
      pluralName: "beef stock",
      fdcId: 172883,
      grocerySection: "Pantry",
      units: {
        g: 1,
        oz: 28.35,
        ml: null,
        l: null,
        fl_oz: null,
        quart: null,
        cup: 240,
      },
      aliases: ["beef broth"],
    },
    // Seeds, sesame butter, tahini, from raw and stone ground kernels (Nut and Seed Products)
    {
      name: "tahini",
      pluralName: "tahini",
      fdcId: 169410,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 15 },
    },
    // Peanut butter, smooth style, without salt (Legumes and Legume Products)
    {
      name: "peanut butter",
      pluralName: "peanut butter",
      fdcId: 172470,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 16, cup: 258 },
    },
    // Nuts, almonds (Nut and Seed Products)
    {
      name: "almond",
      pluralName: "almonds",
      fdcId: 170567,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 143 },
    },
    // Nuts, walnuts, english (Nut and Seed Products)
    {
      name: "walnut",
      pluralName: "walnuts",
      fdcId: 170187,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 117 },
    },
    // Nuts, pine nuts, dried (Nut and Seed Products)
    {
      name: "pine nut",
      pluralName: "pine nuts",
      fdcId: 170591,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 135 },
    },
    // Nuts, pistachio nuts, raw (Nut and Seed Products)
    {
      name: "pistachio",
      pluralName: "pistachios",
      fdcId: 170184,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: 123 },
    },
    // Nuts, cashew nuts, raw (Nut and Seed Products)
    {
      name: "cashew",
      pluralName: "cashews",
      fdcId: 170162,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, cup: null },
    },
    // Seeds, sesame seeds, whole, dried (Nut and Seed Products)
    {
      name: "sesame seed",
      pluralName: "sesame seeds",
      fdcId: 170150,
      grocerySection: "Pantry",
      units: { g: 1, oz: 28.35, tbsp: 9, cup: 144 },
    },
    // Olives, ripe, canned (small-extra large) (Fruits and Fruit Juices)
    {
      name: "black olive",
      pluralName: "black olives",
      fdcId: 169094,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, tbsp: 8.4, small: 3.2, large: 4.4, jar: null },
      aliases: ["olive"],
    },
    // Capers, canned (Spices and Herbs)
    {
      name: "caper",
      pluralName: "capers",
      fdcId: 172238,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, tsp: null, tbsp: 8.6, jar: null },
    },
    // Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw (Poultry Products)
    {
      name: "chicken breast",
      pluralName: "chicken breasts",
      fdcId: 171077,
      grocerySection: "Meat & poultry",
      units: {
        g: 1,
        kg: 1000,
        oz: 28.35,
        lb: 453.592,
        whole: null,
        piece: 272,
      },
    },
    // Chicken, broilers or fryers, thigh, meat and skin, raw (Poultry Products)
    {
      name: "chicken thigh",
      pluralName: "chicken thighs",
      fdcId: 172385,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: 193 },
    },
    // Chicken, broilers or fryers, meat and skin, raw (Poultry Products)
    {
      name: "whole chicken",
      pluralName: "whole chickens",
      fdcId: 171447,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: null },
    },
    // Beef, ground, 85% lean meat / 15% fat, raw (Includes foods for USDA's Food Distribution Program) (Beef Products)
    {
      name: "ground beef",
      pluralName: "ground beef",
      fdcId: 171796,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592 },
      aliases: ["minced beef", "beef mince"],
    },
    // Beef, chuck, arm pot roast, separable lean and fat, trimmed to 1/8" fat, all grades, raw (Beef Products)
    {
      name: "beef chuck",
      pluralName: "beef chuck",
      fdcId: 169491,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592 },
      aliases: ["chuck roast"],
    },
    // Beef, top sirloin, steak, separable lean and fat, trimmed to 1/8" fat, all grades, raw (Beef Products)
    {
      name: "sirloin steak",
      pluralName: "sirloin steaks",
      fdcId: 168726,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: 608 },
      aliases: ["steak"],
    },
    // Lamb, ground, raw (Lamb, Veal, and Game Products)
    {
      name: "ground lamb",
      pluralName: "ground lamb",
      fdcId: 174370,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592 },
      aliases: ["minced lamb", "lamb mince"],
    },
    // Lamb, leg, whole (shank and sirloin), separable lean and fat, trimmed to 1/4" fat, choice, raw (Lamb, Veal, and Game Products)
    {
      name: "leg of lamb",
      pluralName: "legs of lamb",
      fdcId: 174311,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: null },
      aliases: ["lamb leg"],
    },
    // Pork, fresh, shoulder, whole, separable lean and fat, raw (Pork Products)
    {
      name: "pork shoulder",
      pluralName: "pork shoulder",
      fdcId: 167843,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592 },
    },
    // Pork, fresh, loin, center loin (chops), bone-in, separable lean and fat, raw (Pork Products)
    {
      name: "pork chop",
      pluralName: "pork chops",
      fdcId: 168238,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: 199 },
    },
    // Pork, cured, bacon, unprepared (Pork Products)
    {
      name: "bacon",
      pluralName: "bacon",
      fdcId: 168277,
      grocerySection: "Meat & poultry",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, slice: 28 },
    },
    // Fish, salmon, Atlantic, farmed, raw (Finfish and Shellfish Products)
    {
      name: "salmon",
      pluralName: "salmon",
      fdcId: 175167,
      grocerySection: "Seafood",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, fillet: 396 },
    },
    // Fish, cod, Atlantic, raw (Finfish and Shellfish Products)
    {
      name: "cod",
      pluralName: "cod",
      fdcId: 171955,
      grocerySection: "Seafood",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, fillet: 231 },
    },
    // Crustaceans, shrimp, raw (Finfish and Shellfish Products)
    {
      name: "shrimp",
      pluralName: "shrimp",
      fdcId: 175179,
      grocerySection: "Seafood",
      units: { g: 1, kg: 1000, oz: 28.35, lb: 453.592, whole: null },
      aliases: ["prawn"],
    },
    // Fish, tuna, light, canned in water, drained solids (Includes foods for USDA's Food Distribution Program) (Finfish and Shellfish Products)
    {
      name: "canned tuna",
      pluralName: "canned tuna",
      fdcId: 173709,
      grocerySection: "Canned & jarred",
      units: { g: 1, oz: 28.35, cup: 154, can: 165 },
    },
  ];
