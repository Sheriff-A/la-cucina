// Which database a seed or import is about to write to, and whether it may (ADR-0010).
//
// The check is by Neon branch, not by a flag: the DATABASE_URL host names a Neon compute
// endpoint, the Neon API says which branch that endpoint belongs to, and only known
// development branches and Vercel preview branches pass. Production never does for the
// seed. A local Postgres (Docker) passes too, but has no Neon Auth, so users are skipped.

import { NeonApi } from "./neon-api";

export const NEON_PROJECT_ID = "shiny-violet-64947144";
export const PRODUCTION_BRANCH_ID = "br-mute-queen-b7fdrdd4";

/** Development branches the seed may write to. Preview branches (`preview/…`) pass by name. */
export const DEVELOPMENT_BRANCH_IDS: readonly string[] = [
  "br-lucky-leaf-b7zy0nrj", // "development"
];

export type DatabaseHost =
  | { kind: "local"; host: string }
  | { kind: "neon"; host: string; endpointId: string }
  | { kind: "unknown"; host: string };

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "[::1]",
  "host.docker.internal",
]);

/** Reads the host of a Postgres URL and, for Neon, the compute endpoint it names. */
export function classifyDatabaseUrl(databaseUrl: string): DatabaseHost {
  let host: string;
  try {
    host = new URL(databaseUrl).hostname.toLowerCase();
  } catch {
    return { kind: "unknown", host: "(unparseable DATABASE_URL)" };
  }
  if (LOCAL_HOSTS.has(host)) return { kind: "local", host };
  const neon = /^(ep-[a-z0-9-]+?)(-pooler)?\.[a-z0-9.-]+\.neon\.tech$/.exec(
    host,
  );
  if (neon) return { kind: "neon", host, endpointId: neon[1]! };
  return { kind: "unknown", host };
}

export interface NeonBranchInfo {
  id: string;
  name: string;
  projectId: string;
  default: boolean;
  primary?: boolean;
  protected?: boolean;
}

export type SeedTarget =
  | { kind: "local"; host: string }
  | {
      kind: "neon";
      branchId: string;
      branchName: string;
      isProduction: boolean;
    };

export type TargetDecision =
  { ok: true; target: SeedTarget } | { ok: false; reason: string };

export interface TargetOptions {
  /** Lets the USDA import (reference data only) run against production. Never set by the seed. */
  allowProduction?: boolean;
}

export function isProductionBranch(branch: NeonBranchInfo): boolean {
  return (
    branch.id === PRODUCTION_BRANCH_ID ||
    branch.name === "production" ||
    branch.default ||
    branch.primary === true
  );
}

/** Decides whether a Neon branch may be written to. Pure, so it's tested directly. */
export function checkNeonBranch(
  branch: NeonBranchInfo,
  options: TargetOptions = {},
): TargetDecision {
  const target = (isProduction: boolean): TargetDecision => ({
    ok: true,
    target: {
      kind: "neon",
      branchId: branch.id,
      branchName: branch.name,
      isProduction,
    },
  });

  if (branch.projectId !== NEON_PROJECT_ID) {
    return {
      ok: false,
      reason: `Branch ${branch.id} is in project ${branch.projectId}, not ${NEON_PROJECT_ID}.`,
    };
  }
  if (isProductionBranch(branch)) {
    return options.allowProduction
      ? target(true)
      : {
          ok: false,
          reason: `Refusing to write to production (branch ${branch.name}, ${branch.id}). Seed data never goes to production.`,
        };
  }
  if (
    DEVELOPMENT_BRANCH_IDS.includes(branch.id) ||
    branch.name.startsWith("preview/")
  ) {
    return target(false);
  }
  return {
    ok: false,
    reason: `Branch ${branch.name} (${branch.id}) is not a known development or preview branch. Add its ID to DEVELOPMENT_BRANCH_IDS in prisma/seed/target.ts if it should be seeded.`,
  };
}

/** Works out the branch behind DATABASE_URL through the Neon API, then checks it. */
export async function resolveTarget(
  databaseUrl: string | undefined,
  neonApiKey: string | undefined,
  options: TargetOptions = {},
): Promise<TargetDecision> {
  if (!databaseUrl) return { ok: false, reason: "DATABASE_URL is not set." };

  const host = classifyDatabaseUrl(databaseUrl);
  if (host.kind === "local")
    return { ok: true, target: { kind: "local", host: host.host } };
  if (host.kind === "unknown") {
    return {
      ok: false,
      reason: `DATABASE_URL points at ${host.host}, which is neither a local Postgres nor a Neon endpoint.`,
    };
  }
  if (!neonApiKey) {
    return {
      ok: false,
      reason:
        "NEON_API_KEY is not set, so the target branch can't be checked. Add it to .env.seed.local (see .env.seed.example).",
    };
  }

  const api = new NeonApi(neonApiKey, NEON_PROJECT_ID);
  try {
    const branchId = await api.getEndpointBranchId(host.endpointId);
    const branch = await api.getBranch(branchId);
    return checkNeonBranch(branch, options);
  } catch (error) {
    return {
      ok: false,
      reason: `Couldn't confirm the branch behind ${host.host}: ${(error as Error).message}`,
    };
  }
}

export function describeTarget(target: SeedTarget): string {
  return target.kind === "local"
    ? `local Postgres at ${target.host} (no Neon Auth)`
    : `Neon branch ${target.branchName} (${target.branchId})${target.isProduction ? " — PRODUCTION" : ""}`;
}
