import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_TOKEN_COOKIE } from "@/constants/cookies";
import { PROTECTED_ROUTES, ROUTES } from "@/constants/routes";

function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(
    request.cookies.get(AUTH_TOKEN_COOKIE)?.value,
  );

  if (matchesRoute(pathname, PROTECTED_ROUTES) && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
