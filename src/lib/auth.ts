import { headers } from "next/headers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { Role } from "@/generated/prisma/enums";

// Cookie aman otomatis: secure=true ketika aplikasi berjalan di HTTPS.
const useSecure = (process.env.NEXTAUTH_URL ?? "").startsWith("https://");
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: useSecure,
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  cookies: {
    sessionToken: {
      name: "skripsi.session-token",
      options: cookieOptions,
    },
    callbackUrl: {
      name: "skripsi.callback-url",
      options: cookieOptions,
    },
    csrfToken: {
      name: "skripsi.csrf-token",
      options: { ...cookieOptions, httpOnly: true },
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Lapis kedua rate limit (per email, lintas IP) — melindungi
        // POST langsung ke /api/auth/callback/credentials tanpa lewat UI.
        const rl = checkRateLimit(`auth:${email.toLowerCase()}`, 10, 10 * 60_000);
        if (!rl.ok) {
          console.warn(`[security] authorize rate-limited untuk: ${email}`);
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});