import { describe, expect, it } from "vitest";
import { parseCsv } from "@/prisma/usda/csv";
import { compareLinks, type LinkSnapshot } from "@/prisma/usda/link-report";

describe("parseCsv", () => {
  it("handles quotes, doubled quotes, commas and newlines in fields", () => {
    const text =
      '"id","modifier"\r\n"1","medium (2-1/2"" dia)"\r\n"2","cup, chopped"\n"3","two\nlines"';
    expect(parseCsv(text)).toEqual([
      ["id", "modifier"],
      ["1", 'medium (2-1/2" dia)'],
      ["2", "cup, chopped"],
      ["3", "two\nlines"],
    ]);
  });

  it("drops a byte-order mark and keeps empty fields", () => {
    expect(parseCsv(String.fromCharCode(0xfeff) + "a,b,c\n1,,3\n")).toEqual([
      ["a", "b", "c"],
      ["1", "", "3"],
    ]);
  });
});

describe("compareLinks", () => {
  const snapshot = (overrides: Partial<LinkSnapshot> = {}): LinkSnapshot => ({
    ingredientName: "onion",
    fdcId: 170000,
    description: "Onions, raw",
    usdaCategory: "Vegetables and Vegetable Products",
    portions: "1|1|undetermined|large||150",
    ...overrides,
  });

  it("reports nothing when nothing changed", () => {
    const links = new Map([["a", snapshot()]]);
    expect(compareLinks(links, links, new Set([170000]))).toEqual([]);
  });

  it("reports a reference food that disappeared from the data", () => {
    const links = new Map([["a", snapshot()]]);
    expect(compareLinks(links, links, new Set())).toEqual([
      "onion (USDA 170000): reference food is no longer in the USDA data",
    ]);
  });

  it("reports description, category and portion changes", () => {
    const before = new Map([["a", snapshot()]]);
    const after = new Map([
      [
        "a",
        snapshot({
          description: "Onions, yellow, raw",
          usdaCategory: "Vegetables",
          portions: "1|1|undetermined|large||155",
        }),
      ],
    ]);
    expect(compareLinks(before, after, new Set([170000]))).toEqual([
      'onion (USDA 170000): description "Onions, raw" → "Onions, yellow, raw"; category "Vegetables and Vegetable Products" → "Vegetables"; household portions changed',
    ]);
  });
});
