import { waLink, whatsappNumber } from "@/lib/env";
import ChatWidgetPanel from "@/components/chat-widget-panel";

/**
 * Chat widget dua mode untuk seluruh halaman publik:
 *  1. WhatsApp (manual)   → chat langsung dengan admin
 *  2. Telegram Bot (auto) → jawaban otomatis 24/7 dari bot
 *
 * Telegram mode hanya tampil jika NEXT_PUBLIC_TELEGRAM_BOT_USERNAME diisi di .env
 * (token bot itu sendiri server-only dan tidak boleh sampai ke browser).
 */
export default function ChatWidget() {
  const waUrl = whatsappNumber ? waLink() : "#";

  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, "");
  const tgUrl = username ? `https://t.me/${username}` : null;

  return <ChatWidgetPanel waUrl={waUrl} tgUrl={tgUrl} />;
}
