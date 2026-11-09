import { describe, expect, it } from "vitest";
import {
  parsePortion,
  unitWeightsFromPortions,
} from "@/lib/usda/portion-parser";

const sr = (amount: number, modifier: string, gramWeight: number) => ({
  amount,
  unitName: "undetermined",
  modifier,
  gramWeight,
});

describe("parsePortion", () => {
  it.each([
    ['medium (2-1/2" dia)', "medium", 110],
    ["large", "large", 150],
    ["clove", "clove", 3],
    ["cup, chopped", "cup", 160],
    ["tbsp chopped", "tbsp", 10],
    ["tsp", "tsp", 2.8],
    ['slice, large (1/4" thick)', "slice", 38],
    ["stick", "stick", 113],
    ["can (15.5 oz) drained", "can", 448],
    ["extra large", "extra_large", 56],
    ["fl oz", "fl_oz", 30.5],
    ['fruit (2-1/8" dia)', "whole", 58],
    ["sprigs", "sprig", 1],
    ["leaves", "leaf", 0.5],
    ['head, large (7" dia)', "head", 900],
  ])("reads SR Legacy modifier %j as %s", (modifier, unitCode, grams) => {
    expect(parsePortion(sr(1, modifier, grams))).toEqual({
      unitCode,
      gramsPerUnit: grams,
    });
  });

  it("divides the gram weight by the amount", () => {
    expect(parsePortion(sr(0.5, "fillet", 198))).toEqual({
      unitCode: "fillet",
      gramsPerUnit: 396,
    });
    expect(parsePortion(sr(3, "tbsp", 30))).toEqual({
      unitCode: "tbsp",
      gramsPerUnit: 10,
    });
  });

  it("rounds grams per unit to 3 decimals", () => {
    expect(parsePortion(sr(3, "tsp", 10))?.gramsPerUnit).toBe(3.333);
  });

  it("uses a real measure unit name, as Foundation Foods does", () => {
    expect(
      parsePortion({
        amount: 2,
        unitName: "tablespoon",
        modifier: "",
        gramWeight: 35.8,
      }),
    ).toEqual({
      unitCode: "tbsp",
      gramsPerUnit: 17.9,
    });
    expect(
      parsePortion({
        amount: 1,
        unitName: "cup",
        modifier: null,
        gramWeight: 244,
      })?.unitCode,
    ).toBe("cup");
  });

  it("reads a portion that names the food itself as whole, or as the size that follows", () => {
    expect(
      parsePortion(
        { amount: 1, unitName: "Onion", modifier: "Edible", gramWeight: 197 },
        "Onions, red, raw",
      ),
    ).toEqual({ unitCode: "whole", gramsPerUnit: 197 });
    expect(
      parsePortion(sr(1, 'cucumber (8-1/4")', 301), "Cucumber, with peel, raw")
        ?.unitCode,
    ).toBe("whole");
    expect(
      parsePortion(
        sr(1, 'sweetpotato, 5" long', 130),
        "Sweet potato, raw, unprepared",
      )?.unitCode,
    ).toBe("whole");
    expect(
      parsePortion(
        sr(1, 'potato large (3" to 4-1/4" dia)', 369),
        "Potatoes, flesh and skin, raw",
      )?.unitCode,
    ).toBe("large");
  });

  it("skips words it doesn't know to reach a unit", () => {
    expect(
      parsePortion(sr(1, "large whole", 50), "Egg, whole, raw, fresh")
        ?.unitCode,
    ).toBe("large");
    expect(parsePortion(sr(1, "cup cherry tomatoes", 149))?.unitCode).toBe(
      "cup",
    );
  });

  it.each([
    ["oz"],
    ["3 oz"],
    ["lb"],
    ["serving"],
    ["NLEA serving"],
    ["cubic inch"],
    ["jumbo"],
    ["extra small"],
    ['pat (1" sq, 1/3" high)'],
    ["floweret"],
    ["thigh with skin"],
    ["small box (1.5 oz)"],
    ["miniature box (.5 oz)"],
    [""],
  ])("ignores %j", (modifier) => {
    expect(parsePortion(sr(1, modifier, 10))).toBeNull();
  });

  it("ignores paired-weight rows and a food name it can't match", () => {
    expect(
      parsePortion({
        amount: 1,
        unitName: "paired raw w",
        modifier: "",
        gramWeight: 100,
      }),
    ).toBeNull();
    expect(parsePortion(sr(1, "italian tomato", 62), "Onions, raw")).toBeNull();
  });

  it("ignores rows without a positive amount or gram weight", () => {
    expect(parsePortion(sr(0, "cup", 100))).toBeNull();
    expect(parsePortion(sr(1, "cup", 0))).toBeNull();
    expect(parsePortion(sr(Number.NaN, "cup", 100))).toBeNull();
  });
});

describe("unitWeightsFromPortions", () => {
  it("keeps the first gram weight per unit, in USDA order", () => {
    const onion = [
      sr(1, "cup, chopped", 160),
      sr(1, "cup, sliced", 115),
      sr(1, "tbsp chopped", 10),
      sr(1, "large", 150),
      sr(3, "oz", 85),
      sr(1, 'medium (2-1/2" dia)', 110),
    ];
    expect(unitWeightsFromPortions(onion, "Onions, raw")).toEqual([
      { unitCode: "cup", gramsPerUnit: 160 },
      { unitCode: "tbsp", gramsPerUnit: 10 },
      { unitCode: "large", gramsPerUnit: 150 },
      { unitCode: "medium", gramsPerUnit: 110 },
    ]);
  });
});
