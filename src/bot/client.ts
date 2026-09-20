import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

export const bot: Bot | null = token ? new Bot(token) : null;

export const adminChatId: string | null =
  process.env.TELEGRAM_ADMIN_CHAT_ID ?? null;

export function sendMarkdown(chatId: string | number, text: string) {
  if (!bot) return Promise.resolve();
  return bot.api.sendMessage(String(chatId), text, {
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
  });
}

export function sendTo(chatId: string | number, text: string) {
  if (!bot) return Promise.resolve();
  return bot.api.sendMessage(String(chatId), text, {
    link_preview_options: { is_disabled: true },
  });
}