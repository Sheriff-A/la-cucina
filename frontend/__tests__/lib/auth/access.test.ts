import { describe, expect, it } from "vitest";
import { checkAdminAccess } from "@/lib/auth/access";
import type { Profile, Role } from "@/lib/profiles/profile";

const profile = (role: Role): Profile => ({
  id: "p-1",
  authUserId: "auth-1",
  role,
  displayName: "Someone",
});

describe("checkAdminAccess", () => {
  it("refuses signed-out visitors", () => {
    expect(checkAdminAccess(null)).toEqual({
      allowed: false,
      reason: "signed-out",
    });
  });

  it("refuses readers and creators", () => {
    expect(checkAdminAccess(profile("reader"))).toEqual({
      allowed: false,
      reason: "not-admin",
    });
    expect(checkAdminAccess(profile("creator"))).toEqual({
      allowed: false,
      reason: "not-admin",
    });
  });

  it("lets admins in", () => {
    const admin = profile("admin");
    expect(checkAdminAccess(admin)).toEqual({ allowed: true, profile: admin });
  });
});
