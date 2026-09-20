import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ROLE_RULES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/app/admin", roles: ["ADMIN"] },
  { prefix: "/app/petugas", roles: ["PETUGAS", "ADMIN"] },
  { prefix: "/app/masyarakat", roles: ["MASYARAKAT"] },
  { prefix: "/app", roles: ["MASYARAKAT", "PETUGAS", "ADMIN"] },
];

export default auth((req) => {
  const session = req.auth;
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return undefined;
  }

  const isLoggedIn = !!session?.user;

  if (pathname === "/login" || pathname === "/daftar") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/app", nextUrl));
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
    const home: Record<string, string> = {
      MASYARAKAT: "/app/masyarakat",
      PETUGAS: "/app/petugas",
      ADMIN: "/app/admin",
    };

    if (pathname === "/app") {
      return NextResponse.redirect(new URL(home[role] ?? "/", nextUrl));
    }

    if (!rule.roles.includes(role)) {
      return NextResponse.redirect(new URL(home[role] ?? "/", nextUrl));
    }
  }

  return undefined;
});

export const config = {
  matcher: ["/app/:path*", "/login", "/daftar"],
};