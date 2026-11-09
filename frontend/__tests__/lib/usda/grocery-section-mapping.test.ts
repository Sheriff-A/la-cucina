import { describe, expect, it } from "vitest";
import { suggestGrocerySection } from "@/lib/usda/grocery-section-mapping";

describe("suggestGrocerySection", () => {
  it.each([
    ["Vegetables and Vegetable Products", "Onions, raw", "Produce"],
    ["Fruits and Fruit Juices", "Lemons, raw, without peel", "Produce"],
    [
      "Poultry Products",
      "Chicken, broilers or fryers, thigh, meat and skin, raw",
      "Meat & poultry",
    ],
    ["Lamb, Veal, and Game Products", "Lamb, ground, raw", "Meat & poultry"],
    [
      "Finfish and Shellfish Products",
      "Fish, salmon, Atlantic, farmed, raw",
      "Seafood",
    ],
    ["Dairy and Egg Products", "Egg, whole, raw, fresh", "Dairy & eggs"],
    ["Baked Products", "Bread, white, commercially prepared", "Bakery"],
    ["Spices and Herbs", "Spices, cumin seed", "Spices & seasonings"],
    [
      "Cereal Grains and Pasta",
      "Rice, white, long-grain, regular, raw, enriched",
      "Pantry",
    ],
    [
      "Breakfast Cereals",
      "Cereals, oats, regular and quick, not fortified, dry",
      "Pantry",
    ],
    [
      "Soups, Sauces, and Gravies",
      "Soup, stock, chicken, home-prepared",
      "Condiments & sauces",
    ],
  ])("maps %s by category", (category, description, section) => {
    expect(suggestGrocerySection(category, description)).toBe(section);
  });

  it("sends anything canned to Canned & jarred, whatever its category", () => {
    expect(
      suggestGrocerySection(
        "Legumes and Legume Products",
        "Chickpeas (garbanzo beans, bengal gram), mature seeds, canned, solids and liquids",
      ),
    ).toBe("Canned & jarred");
    expect(
      suggestGrocerySection(
        "Vegetables and Vegetable Products",
        "Tomatoes, crushed, canned",
      ),
    ).toBe("Canned & jarred");
  });

  it("sends condiments to Condiments & sauces by keyword", () => {
    expect(suggestGrocerySection("Spices and Herbs", "Vinegar, balsamic")).toBe(
      "Condiments & sauces",
    );
    expect(
      suggestGrocerySection(
        "Legumes and Legume Products",
        "Soy sauce made from soy and wheat (shoyu)",
      ),
    ).toBe("Condiments & sauces");
    expect(
      suggestGrocerySection("Vegetables and Vegetable Products", "Catsup"),
    ).toBe("Condiments & sauces");
    expect(
      suggestGrocerySection(
        "Fats and Oils",
        "Salad dressing, mayonnaise, regular",
      ),
    ).toBe("Condiments & sauces");
  });

  it("sends fresh herbs to Produce, but leaves dried spices alone", () => {
    expect(suggestGrocerySection("Spices and Herbs", "Basil, fresh")).toBe(
      "Produce",
    );
    expect(
      suggestGrocerySection("Spices and Herbs", "Spices, basil, dried"),
    ).toBe("Spices & seasonings");
    expect(
      suggestGrocerySection("Dairy and Egg Products", "Egg, whole, raw, fresh"),
    ).toBe("Dairy & eggs");
  });

  it("sends leavening agents to Pantry", () => {
    expect(
      suggestGrocerySection("Baked Products", "Leavening agents, baking soda"),
    ).toBe("Pantry");
  });

  it("matches keywords on word boundaries", () => {
    expect(
      suggestGrocerySection("Fruits and Fruit Juices", "Pecanned fruit"),
    ).toBe("Produce");
  });

  it("falls back to Pantry for unknown or missing categories", () => {
    expect(suggestGrocerySection("Beverages", "Coffee, brewed")).toBe("Pantry");
    expect(suggestGrocerySection(null, "Something")).toBe("Pantry");
  });
});
