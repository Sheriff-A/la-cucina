import { describe, expect, it } from "vitest";
import { isSignUpRequest } from "@/lib/auth/sign-up-guard";

describe("isSignUpRequest", () => {
  it.each([
    "/api/auth/sign-up/email",
    "/api/auth/sign-up",
    "/api/auth/sign-up/",
    "/api/auth//sign-up/email",
    "/api/auth/SIGN-UP/email",
    "/api/auth/sign%2Dup/email",
  ])("blocks %s", (path) => {
    expect(isSignUpRequest(path)).toBe(true);
  });

  it.each([
    "/api/auth/sign-in/email",
    "/api/auth/sign-out",
    "/api/auth/get-session",
    "/api/auth/sign-upper",
    "/api/auth/%E0%A4%A",
  ])("allows %s", (path) => {
    expect(isSignUpRequest(path)).toBe(false);
  });
});
