import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Proxy always runs on the Node.js runtime as of Next.js 16 — no `runtime`
// export needed (and setting one now throws), which is what lets the
// Credentials provider's authorize() pull in the MongoDB driver here.

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/discover");

  if (isProtectedRoute && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/discover/:path*"],
};
