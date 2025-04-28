import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const isSuperUser = req.cookies.get("isSuperUser")?.value === "true";
  const path = req.nextUrl.pathname;

  if (
    path === "/admin/login"
    || path === "/venue/login"
    || path === "/venue/register"
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!accessToken) {
    return NextResponse.redirect(new URL("/venue/login", req.url));
  }

  // Redirect based on user type when accessing the root path
  if (path === "/") {
    return NextResponse.redirect(
      new URL(isSuperUser ? "/admin" : "/venue", req.url)
    );
  }

  // Protect admin routes from non-superusers
  if (path.startsWith("/admin") && !isSuperUser) {
    return NextResponse.redirect(new URL("/venue", req.url));
  }

  // Protect restaurant routes from superusers
  if (path.startsWith("/venue") && isSuperUser) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    "/admin/:path*", // Protect all admin routes
    "/venue/:path*", // Protect all venue routes
    "/", // Protect the root path
  ],
};