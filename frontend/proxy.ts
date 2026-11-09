// Runs before admin pages render. Neon Auth's proxy refreshes the session cookies (Server
// Components can't set cookies) and sends signed-out visitors to sign-in. It is not the
// access check: requireAdmin() in each admin page and server action is.

import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export default function proxy(request: NextRequest) {
  return auth().middleware({ loginUrl: "/sign-in?next=/admin" })(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
