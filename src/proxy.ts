import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ROLE_RULES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard/mentor", roles: ["MENTOR", "ADMIN"] },
  { prefix: "/dashboard", roles: ["MAHASISWA", "MENTOR", "ADMIN"] },
];

export default auth((req) => {
  const session = req.auth;
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return undefined;
  }

  const isLoggedIn = !!session?.user;

  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return undefined;
  }

  const rule = ROLE_RULES.find((r) => pathname.startsWith(r.prefix));
  if (rule) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = session.user.role;
    if (!rule.roles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};