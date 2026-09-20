import crypto from "crypto";
import { envVar } from "@/lib/env";

/**
 * Token one-click untuk menghubungkan akun Telegram:
 * dashboard → https://t.me/<bot>?start=LINK:<userId>.<signature>
 * Bot memverifikasi signature (HMAC-SHA256, secret = NEXTAUTH_SECRET)
 * supaya orang lain tidak bisa menghubungkan akun milik user lain
 * dengan menebak userId.
 */

function signature(userId: string): string {
  const secret = envVar("NEXTAUTH_SECRET");
  return crypto.createHmac("sha256", secret).update(userId).digest("hex").slice(0, 16);
}

export function makeTelegramLinkToken(userId: string): string {
  return `${userId}.${signature(userId)}`;
}

export function verifyTelegramLinkToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signature(userId);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return userId;
}
