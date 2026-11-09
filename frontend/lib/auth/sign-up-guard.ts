// Closed sign-up, our server's half (ADR-0010). Neon Auth's `disable_sign_up` is the other
// half; this catches a branch whose setting is ever wrong. Plain TypeScript.

/** Path under the auth route, e.g. "/sign-up/email", from a request URL to /api/auth/... */
function authPath(pathname: string): string {
  const prefix = "/api/auth";
  const rest = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : pathname;
  // Collapse duplicate slashes and drop a trailing one, so "//sign-up/email/" still matches.
  return ("/" + rest.split("/").filter(Boolean).join("/")).toLowerCase();
}

/** Whether a request to the auth route would create an account. */
export function isSignUpRequest(pathname: string): boolean {
  const path = authPath(decodeSafely(pathname));
  return path === "/sign-up" || path.startsWith("/sign-up/");
}

function decodeSafely(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export const SIGN_UP_DISABLED = {
  code: "SIGN_UP_DISABLED",
  message: "Sign up is not open yet.",
} as const;
