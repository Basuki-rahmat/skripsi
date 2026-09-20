import dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export function envVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variabel lingkungan "${name}" belum diisi di .env`);
  }
  return value;
}

export const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

/**
 * Base URL aplikasi, otomatis menyesuaikan environment:
 * dev → NEXTAUTH_URL di .env (mis. http://localhost:3000), produksi → domain asli.
 * Pakai untuk semua link yang dikirim bot/notifikasi agar tidak ada URL hardcode.
 */
export function appUrl(path = "/"): string {
  const base = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function waLink(message?: string): string {
  const msg = message ?? process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Halo";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export function telegramLink(): string {
  // Utamakan username eksplisit (NEXT_PUBLIC_TELEGRAM_BOT_USERNAME) karena token
  // hanya memuat ID numerik bot — t.me/<id-numerik> tidak mengarah ke bot.
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, "");
  if (username) return `https://t.me/${username}`;
  const token = process.env.TELEGRAM_BOT_TOKEN ?? "";
  return `https://t.me/${token.split(":")[0]}`;
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function generateOrderCode(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKP-${ymd}-${rand}`;
}