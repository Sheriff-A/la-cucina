import { describe, expect, it } from "vitest";
import { UNITS, withCounterparts } from "@/lib/units/unit-list";

describe("UNITS", () => {
  it("has unique codes", () => {
    const codes = UNITS.map((u) => u.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("gives a system to mass and volume units only", () => {
    for (const unit of UNITS) {
      expect(unit.system !== null).toBe(
        unit.kind === "mass" || unit.kind === "volume",
      );
    }
  });

  it("keeps oz as mass and fl oz as volume", () => {
    expect(UNITS.find((u) => u.code === "oz")?.kind).toBe("mass");
    expect(UNITS.find((u) => u.code === "fl_oz")?.kind).toBe("volume");
  });
});

describe("withCounterparts", () => {
  it("adds the other-system counterpart after each mass or volume unit", () => {
    expect(withCounterparts(["g", "tsp", "clove"])).toEqual([
      "g",
      "oz",
      "tsp",
      "clove",
    ]);
    expect(withCounterparts(["ml", "cup"])).toEqual(["ml", "fl_oz", "cup"]);
    expect(withCounterparts(["lb"])).toEqual(["lb", "kg"]);
  });

  it("doesn't duplicate units already listed", () => {
    expect(withCounterparts(["g", "oz", "kg", "lb"])).toEqual([
      "g",
      "oz",
      "kg",
      "lb",
    ]);
  });

  it("leaves kitchen and count units alone", () => {
    expect(withCounterparts(["cup", "tbsp", "whole"])).toEqual([
      "cup",
      "tbsp",
      "whole",
    ]);
  });
});
