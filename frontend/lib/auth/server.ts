// Neon Auth (Managed Better Auth) on the server: the auth route, the proxy, and session
// reads in Server Components and Server Actions all go through this one instance.
// Created on first use, so `next build` doesn't need the auth env vars.

import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

type NeonAuth = ReturnType<typeof createNeonAuth>;

let instance: NeonAuth | undefined;

export function auth(): NeonAuth {
  instance ??= createNeonAuth({
    baseUrl: requiredEnv("NEON_AUTH_BASE_URL"),
    cookies: { secret: requiredEnv("NEON_AUTH_COOKIE_SECRET") },
  });
  return instance;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set (see frontend/.env.example)`);
  return value;
}
