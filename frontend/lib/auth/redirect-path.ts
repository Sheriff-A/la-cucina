// Where to send someone after signing in. Plain TypeScript.

/**
 * The `next` query value if it is a path on this site, else "/". Refuses absolute URLs and
 * protocol-relative paths ("//evil.example", "/\evil.example") so sign-in can't be used as an
 * open redirect.
 */
export function safeRedirectPath(next: unknown): string {
  if (typeof next !== "string") return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/";
  if (/[\u0000-\u001f]/.test(next)) return "/";
  return next;
}
