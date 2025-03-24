import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const isSuperUser = req.cookies.get("isSuperUser")?.value === "true";
  const path = req.nextUrl.pathname;

  // Redirect to login if not authenticated
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (path.startsWith("/admin") && !isSuperUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path === "/" && isSuperUser) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/admin", "/"],
};
