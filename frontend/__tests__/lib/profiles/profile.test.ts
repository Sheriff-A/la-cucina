import { describe, expect, it } from "vitest";
import {
  displayNameFor,
  findOrCreateProfile,
  type Profile,
  type ProfileStore,
} from "@/lib/profiles/profile";

function memoryStore(initial: Profile[] = []) {
  const profiles = [...initial];
  const calls = { createReader: 0 };
  const store: ProfileStore = {
    async findByAuthUserId(authUserId) {
      return profiles.find((p) => p.authUserId === authUserId) ?? null;
    },
    async createReader(authUserId, displayName) {
      calls.createReader++;
      const existing = profiles.find((p) => p.authUserId === authUserId);
      if (existing) return existing;
      const profile: Profile = {
        id: `p-${profiles.length + 1}`,
        authUserId,
        role: "reader",
        displayName,
      };
      profiles.push(profile);
      return profile;
    },
  };
  return { store, profiles, calls };
}

describe("displayNameFor", () => {
  it("uses the auth user's name, trimmed", () => {
    expect(displayNameFor({ id: "u", name: "  Ada  ", email: "a@x.io" })).toBe(
      "Ada",
    );
  });

  it("falls back to the email's local part", () => {
    expect(displayNameFor({ id: "u", name: " ", email: "ada@x.io" })).toBe(
      "ada",
    );
    expect(displayNameFor({ id: "u", email: "ada@x.io" })).toBe("ada");
  });

  it("falls back to Reader when there is nothing to use", () => {
    expect(displayNameFor({ id: "u", name: null, email: null })).toBe("Reader");
  });

  it("caps long names", () => {
    expect(displayNameFor({ id: "u", name: "a".repeat(200) })).toHaveLength(80);
  });
});

describe("findOrCreateProfile", () => {
  it("returns the existing profile without creating one", async () => {
    const admin: Profile = {
      id: "p-1",
      authUserId: "auth-1",
      role: "admin",
      displayName: "Owner",
    };
    const { store, calls } = memoryStore([admin]);
    await expect(
      findOrCreateProfile(store, { id: "auth-1", name: "Someone else" }),
    ).resolves.toEqual(admin);
    expect(calls.createReader).toBe(0);
  });

  it("creates a reader on first sign-in", async () => {
    const { store, profiles } = memoryStore();
    const profile = await findOrCreateProfile(store, {
      id: "auth-2",
      name: "New Reader",
      email: "new@x.io",
    });
    expect(profile).toMatchObject({
      authUserId: "auth-2",
      role: "reader",
      displayName: "New Reader",
    });
    expect(profiles).toHaveLength(1);
  });

  it("finds the profile it created on the next sign-in", async () => {
    const { store, profiles } = memoryStore();
    const first = await findOrCreateProfile(store, { id: "auth-3" });
    const second = await findOrCreateProfile(store, { id: "auth-3" });
    expect(second).toEqual(first);
    expect(profiles).toHaveLength(1);
  });
});
