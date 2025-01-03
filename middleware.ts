import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { enableTestnet } from "./app/lib/flags";

export async function middleware(request: NextRequest) {
  // Check if the path matches any of the protected routes
  const isProtectedPath = /^\/(?:swap|token|pools|tokens(?:\/.*)?)/i.test(
    request.nextUrl.pathname
  );

  if (isProtectedPath) {
    const isEnabled = await enableTestnet();

    if (!isEnabled) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/swap", "/token", "/pools", "/tokens/:path*"],
};
