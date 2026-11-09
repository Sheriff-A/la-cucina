import { describe, expect, it } from "vitest";
import {
  checkNeonBranch,
  classifyDatabaseUrl,
  NEON_PROJECT_ID,
  PRODUCTION_BRANCH_ID,
  resolveTarget,
  type NeonBranchInfo,
} from "@/prisma/seed/target";

const branch = (overrides: Partial<NeonBranchInfo>): NeonBranchInfo => ({
  id: "br-lucky-leaf-b7zy0nrj",
  name: "development",
  projectId: NEON_PROJECT_ID,
  default: false,
  primary: false,
  ...overrides,
});

describe("classifyDatabaseUrl", () => {
  it("reads the Neon endpoint from direct and pooled hosts", () => {
    expect(
      classifyDatabaseUrl(
        "postgresql://u:p@ep-old-dust-b7ni773i.c-13.us-east-1.aws.neon.tech/neondb",
      ),
    ).toMatchObject({ kind: "neon", endpointId: "ep-old-dust-b7ni773i" });
    expect(
      classifyDatabaseUrl(
        "postgresql://u:p@ep-old-dust-b7ni773i-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require",
      ),
    ).toMatchObject({ kind: "neon", endpointId: "ep-old-dust-b7ni773i" });
  });

  it("recognises a local Postgres", () => {
    expect(
      classifyDatabaseUrl(
        "postgresql://postgres:postgres@localhost:5434/la_cucina",
      ),
    ).toMatchObject({
      kind: "local",
    });
  });

  it("treats anything else as unknown", () => {
    expect(classifyDatabaseUrl("postgresql://u:p@db.example.com/x").kind).toBe(
      "unknown",
    );
    expect(classifyDatabaseUrl("not a url").kind).toBe("unknown");
  });
});

describe("checkNeonBranch", () => {
  it("allows the development branch and preview branches", () => {
    expect(checkNeonBranch(branch({})).ok).toBe(true);
    expect(
      checkNeonBranch(
        branch({ id: "br-orange-dew-b77gthx8", name: "preview/develop" }),
      ).ok,
    ).toBe(true);
  });

  it.each([
    ["the production branch ID", { id: PRODUCTION_BRANCH_ID, name: "renamed" }],
    ["a branch named production", { id: "br-other", name: "production" }],
    ["the default branch", { id: "br-other", name: "main", default: true }],
    ["the primary branch", { id: "br-other", name: "main", primary: true }],
    [
      "the production ID even if it claims a preview name",
      { id: PRODUCTION_BRANCH_ID, name: "preview/x" },
    ],
  ])("refuses %s", (_label, overrides) => {
    const decision = checkNeonBranch(branch(overrides));
    expect(decision.ok).toBe(false);
  });

  it("refuses unknown branches and other projects", () => {
    expect(
      checkNeonBranch(branch({ id: "br-random", name: "scratch" })).ok,
    ).toBe(false);
    expect(checkNeonBranch(branch({ projectId: "another-project" })).ok).toBe(
      false,
    );
  });

  it("allows production only when asked, and says so", () => {
    expect(
      checkNeonBranch(
        branch({ id: PRODUCTION_BRANCH_ID, name: "production" }),
        { allowProduction: true },
      ),
    ).toEqual({
      ok: true,
      target: {
        kind: "neon",
        branchId: PRODUCTION_BRANCH_ID,
        branchName: "production",
        isProduction: true,
      },
    });
  });
});

describe("resolveTarget", () => {
  it("refuses a Neon URL when there's no API key to check the branch with", async () => {
    const decision = await resolveTarget(
      "postgresql://u:p@ep-old-dust-b7ni773i.c-13.us-east-1.aws.neon.tech/neondb",
      undefined,
    );
    expect(decision.ok).toBe(false);
  });

  it("refuses a missing or unknown URL", async () => {
    expect((await resolveTarget(undefined, "key")).ok).toBe(false);
    expect(
      (await resolveTarget("postgresql://u:p@db.example.com/x", "key")).ok,
    ).toBe(false);
  });
});
