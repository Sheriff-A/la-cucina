// The auth route: proxies the browser's auth calls to Neon Auth. Sign-up requests are
// rejected here, before they reach Neon Auth (ADR-0010, closed sign-up).

import { auth } from "@/lib/auth/server";
import { isSignUpRequest, SIGN_UP_DISABLED } from "@/lib/auth/sign-up-guard";

type Context = RouteContext<"/api/auth/[...path]">;
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function handle(method: Method) {
  return async (request: Request, context: Context): Promise<Response> => {
    const { path } = await context.params;
    if (
      isSignUpRequest("/" + path.join("/")) ||
      isSignUpRequest(new URL(request.url).pathname)
    ) {
      return Response.json(SIGN_UP_DISABLED, { status: 403 });
    }
    // The SDK's handler takes a NextRequest; the App Router passes one at runtime.
    const handler = auth().handler()[method] as (
      request: Request,
      context: Context,
    ) => Promise<Response>;
    return handler(request, context);
  };
}

export const GET = handle("GET");
export const POST = handle("POST");
export const PUT = handle("PUT");
export const DELETE = handle("DELETE");
export const PATCH = handle("PATCH");
