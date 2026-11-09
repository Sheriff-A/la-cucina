import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/auth/redirect-path";

describe("safeRedirectPath", () => {
  it.each(["/", "/admin", "/posts/pasta?servings=4"])("keeps %s", (path) => {
    expect(safeRedirectPath(path)).toBe(path);
  });

  it.each([
    undefined,
    null,
    "",
    "admin",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/admin\nSet-Cookie: x",
  ])("sends %s to /", (value) => {
    expect(safeRedirectPath(value)).toBe("/");
  });
});
