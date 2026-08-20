import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 proxy performs only fast, cookie-presence redirects. Protected
 * pages and APIs still validate the session against Better Auth on the server
 * before returning tenant data or accepting mutations.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Retain the legacy admin-token gate while older admin routes remain in the repository.
  if (pathname.startsWith("/admin")) {
    const expected = process.env.ADMIN_TOKEN;
    if (!expected) return new NextResponse(null, { status: 404 });

    const fromCookie = request.cookies.get("admin_token")?.value;
    const authorization = request.headers.get("authorization");
    const fromHeader = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : undefined;

    if ((fromCookie ?? fromHeader) !== expected) return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
