"use server";

import { headers } from "next/headers";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** IP klien (melalui reverse proxy Nginx yang set X-Forwarded-For). */
async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function loginAction(
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email dan password wajib diisi." };
  }

  // Rate limit: maks 5 percobaan per email per IP, jendela 10 menit.
  const ip = await clientIp();
  const key = `login:${parsed.data.email.toLowerCase()}|${ip}`;
  const rl = checkRateLimit(key, 5, 10 * 60_000);
  if (!rl.ok) {
    console.warn(`[security] login rate-limited: ${key}`);
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${rl.retryAfterSec} detik.`,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email atau password salah." };
    }
    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
