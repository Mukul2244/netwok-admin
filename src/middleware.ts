import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const isSuperUser = req.cookies.get("isSuperUser")?.value === "true";
  const path = req.nextUrl.pathname;

  // Exclude `/user/register` from middleware
  if (path === "/user/register") {
    return NextResponse.next();
  }

  if (path.startsWith("/user") && !accessToken) {
    return NextResponse.redirect(new URL("/user/register", req.url));
  }
  // Redirect to login if not authenticated
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Restrict access to `/admin` for non-superusers
  if (path.startsWith("/admin") && !isSuperUser) {
    return NextResponse.redirect(new URL("/restaurant", req.url));
  }

  // Prevent superusers from accessing `/restaurant`
  if (path.startsWith("/restaurant") && isSuperUser) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/admin/:path*", "/restaurant/:path*", "/user/:path*", "/"],
};
