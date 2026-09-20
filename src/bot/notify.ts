import { Prisma } from "@/generated/prisma/client";
import { adminChatId, sendMarkdown, sendTo } from "@/bot/client";
import { formatIDR, formatDate } from "@/lib/env";

export { sendMarkdown };

const sad = (msg: string) => `<b>${msg}</b>`;

async function safe(cb: () => Promise<unknown>) {
  try {
    await cb();
  } catch (err) {
    console.error("[Telegram notify]", err);
  }
}

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: { user: true; package: true; payments: true };
}>;

export function notifyAdminNewOrder(order: OrderWithRelations) {
  const chat = adminChatId;
  if (!chat) return;
  const pkgType = order.type === "BIMBINGAN" ? "Bimbingan Skripsi" : "Pembuatan Sistem";
  const text = [
    sad("📦 PESANAN BARU"),
    `🧾 No. Order  : <code>${order.code}</code>`,
    `👤 Pelanggan  : ${order.user.name} (${order.user.email})`,
    `📦 Layanan    : ${pkgType}`,
    `🏷️ Paket      : ${order.package.name}`,
    `💰 Harga      : ${formatIDR(order.package.price)}`,
    `📅 Waktu      : ${formatDate(order.createdAt)}`,
    ``,
    `Segera konfirmasi di dashboard admin.`,
  ].join("\n");
  return safe(() => sendMarkdown(chat, text));
}

export function notifyAdminPaymentReceived(order: OrderWithRelations) {
  const chat = adminChatId;
  if (!chat) return;
  const text = [
    sad("💰 PEMBAYARAN MASUK"),
    `🧾 No. Order  : <code>${order.code}</code>`,
    `👤 Pelanggan  : ${order.user.name}`,
    `💳 Metode     : ${order.payments.at(-1)?.method === "MIDTRANS" ? "Midtrans" : "Transfer Manual"}`,
    `📊 Status     : ${order.payments.at(-1)?.status}`,
    ``,
    `Cek & verifikasi pembayaran di dashboard.`,
  ].join("\n");
  return safe(() => sendMarkdown(chat, text));
}

export function notifyAdminPaymentConfirmed(order: OrderWithRelations) {
  const chat = adminChatId;
  if (!chat) return;
  const text = [
    sad("✅ PEMBAYARAN DIKONFIRMASI"),
    `🧾 No. Order  : <code>${order.code}</code>`,
    `👤 Pelanggan  : ${order.user.name}`,
    `📦 Layanan    : ${order.package.name}`,
    ``,
    `Pesanan siap diproses.`,
  ].join("\n");
  return safe(() => sendMarkdown(chat, text));
}

export function notifyStudentPaymentStatus(
  chatId: string | number,
  orderCode: string,
  status: string
) {
  return safe(() =>
    sendMarkdown(
      chatId,
      [
        sad("ℹ️ UPDATE STATUS PEMBAYARAN"),
        `🧾 No. Order : <code>${orderCode}</code>`,
        `📊 Status    : ${status}`,
        ``,
        `Lihat detail di dashboard Anda.`,
      ].join("\n")
    )
  );
}

export function notifyStudentProgress(
  chatId: string | number,
  orderCode: string,
  title: string,
  note: string | null,
  percent: number
) {
  return safe(() =>
    sendMarkdown(
      chatId,
      [
        sad("📈 PROGRES BIMBINGAN TERBARU"),
        `🧾 No. Order : <code>${orderCode}</code>`,
        `📝 Tahapan   : ${title}`,
        note ? `📌 Catatan  : ${note}` : "",
        `✔️ Progres   : ${percent}%`,
        ``,
        `Ada pertanyaan? Hubungi mentor Anda.`,
      ].join("\n")
    )
  );
}

export function notifyStudentOrderActive(
  chatId: string | number,
  orderCode: string
) {
  return safe(() =>
    sendMarkdown(
      chatId,
      [
        sad("🚀 PESANAN ANDA SUDAH AKTIF"),
        `🧾 No. Order : <code>${orderCode}</code>`,
        ``,
        `Mentor akan mulai mengerjakan. Pantau progres di dashboard!`,
      ].join("\n")
    )
  );
}

export async function sendRawTo(chatId: string | number, text: string) {
  await sendTo(chatId, text);
}