import { Bot, GrammyError } from "grammy";
import { prisma } from "@/lib/db";
import { adminChatId, sendMarkdown } from "@/bot/client";
import { findAnswer } from "@/bot/faq";
import { askGroq, groqEnabled } from "@/bot/ai";
import { appUrl, formatIDR, formatDate, telegramLink } from "@/lib/env";
import { verifyTelegramLinkToken } from "@/lib/telegram-link";

const token = process.env.TELEGRAM_BOT_TOKEN;

function isAuthError(err: unknown): boolean {
  if (err instanceof GrammyError) return err.error_code === 401 || err.error_code === 403;
  const msg = err instanceof Error ? err.message : String(err);
  return /\(40[13]:/.test(msg);
}

// Jaga proses tetap hidup tanpa log berulang. Penting: `npm run dev` memakai
// `concurrently -k`, jadi bot TIDAK boleh exit (proses mati = next dev ikut mati).
function idleForever(): Promise<never> {
  return new Promise(() => {});
}

export async function startBot() {
  if (!token) {
    console.warn("[Bot] TELEGRAM_BOT_TOKEN kosong — bot tidak berjalan.");
    return;
  }

  const bot = new Bot(token);

  bot.command("start", async (ctx) => {
    // Kemudahan dev: tampilkan chat id supaya bisa disalin ke TELEGRAM_ADMIN_CHAT_ID
    if (ctx.from) {
      console.log(
        `[Bot] /start dari chat id: ${ctx.from.id} (${ctx.from.username ? "@" + ctx.from.username : ctx.from.first_name})`
      );
    }

    // Deep-link one-click dari dashboard: /start LINK:<userId>.<signature>
    const payload = ctx.match?.trim() ?? "";
    if (payload.startsWith("LINK:")) {
      const token = payload.slice("LINK:".length).trim();
      const userId = verifyTelegramLinkToken(token);
      const chatId = String(ctx.from?.id ?? "");

      if (!userId || !ctx.from) {
        await ctx.reply(
          "⚠️ Tautan hubungkan akun tidak valid atau kedaluwarsa. Buka dashboard lalu klik tombol Telegram lagi, ya."
        );
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        await ctx.reply("⚠️ Akun tidak ditemukan. Mungkin akun sudah dihapus — hubungi admin ya.");
        return;
      }

      if (user.telegramChatId && user.telegramChatId !== chatId) {
        await ctx.reply(
          `Akun <b>${user.email}</b> sudah terhubung ke chat Telegram lain. Hubungi admin +62 812-3456-7890 jika ini akunmu.`,
          { parse_mode: "HTML" }
        );
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { telegramChatId: chatId },
      });
      console.log(`[Bot] deep-link OK: ${user.email} → chat ${chatId}`);

      await ctx.reply(
        [
          `✅ Siap, Kak ${ctx.from.first_name ?? ""}! Akun <b>${user.email}</b> berhasil terhubung 🎉`,
          "",
          "Selamat datang! Aku Frida, asisten Skripsi Mentor 🌸",
          "▪ <code>/status</code> — cek status pesanan kapan saja",
          "▪ Notifikasi progres & pembayaran akan otomatis masuk ke chat ini",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    await ctx.reply(
      [
        `Halo Kak ${ctx.from?.first_name ?? ""}! ✨ Aku <b>Frida</b>, asisten Skripsi Mentor 🌸`,
        ``,
        `Senang bisa nemenin perjalanan skripsi Kakak! Dari bimbingan sampai sidang, atau butuh aplikasi dibangunkan — semua bisa aku bantu aturin. 😊`,
        ``,
        `Perintah yang bisa Kakak pakai:`,
        `▪ <code>/paket</code> — daftar paket & harga`,          `▪ <code>/link emailkamu</code> — hubungkan akun`,
        `▪ <code>/status</code> — cek status pesanan`,
        `▪ <code>/kontak</code> — kontak admin`,
        ``,
        `Atau tanya apa saja ke aku, contoh: "bedanya paket Pro dan Premium apa ya?"`,
      ].join("\n"),
      { parse_mode: "HTML" }
    );
  });

  bot.command("paket", async (ctx) => {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { price: "asc" }],
    });

    const bimbingan = packages.filter((p) => p.type === "BIMBINGAN");
    const pembuatan = packages.filter((p) => p.type === "PEMBUATAN");

    const lines: string[] = ["<b>📦 DAFTAR PAKET</b>", ""];

    if (bimbingan.length) {
      lines.push("<b>📚 Bimbingan Skripsi</b>");
      for (const p of bimbingan) {
        lines.push(`▪ ${p.name} — ${formatIDR(p.price)}${p.duration ? ` (${p.duration})` : ""}`);
      }
      lines.push("");
    }

    if (pembuatan.length) {
      lines.push("<b>🛠️ Pembuatan Sistem</b>");
      for (const p of pembuatan) {
        lines.push(`▪ ${p.name} — dari ${formatIDR(p.price)}`);
      }
      lines.push("");
    }

    lines.push(`Detail lengkap: ${appUrl("/paket")}`);

    await ctx.reply(lines.join("\n"), { parse_mode: "HTML" });
  });

  bot.command("link", async (ctx) => {
    // Bersihkan input: buang mailto:, tanda <>, kutip, dan spasi.
    const email = ctx.match
      ?.trim()
      .replace(/^mailto:/i, "")
      .replace(/[<>"']/g, "")
      .trim()
      .toLowerCase();

    if (!email) {
      await ctx.reply(
        [
          "🔗 Mau hubungkan akunnya, Kak? Caranya:",
          "",
          "Ketik: <code>/link emailkamu</code>",
          "Contoh: <code>/link budi@email.com</code>",
          "",
          "Email-nya yang dipakai daftar di web ya 😊",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      console.log(`[Bot] /link gagal (format email salah): "${email}" dari chat ${ctx.from?.id}`);
      await ctx.reply(
        [
          `Hmm, "${email}" sepertinya bukan format email yang benar 🤔`,
          "",
          "Coba lagi ya, Kak. Contoh yang benar:",
          "<code>/link budi@email.com</code>",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    // User mengetik email contoh dari pesan bantuan (bukan email asli).
    const placeholderEmails = ["emailkamu@x.com", "emailkamu@email.com", "nama@email.com", "budi@email.com", "email@example.com"];
    const emailDomain = email.split("@")[1] ?? "";
    if (placeholderEmails.includes(email) || emailDomain === "x.com" || emailDomain === "example.com") {
      console.log(`[Bot] /link: user mengetik email contoh ("${email}") dari chat ${ctx.from?.id}`);
      await ctx.reply(
        [
          "😄 Hehe, itu cuma <b>contoh penulisan</b>, Kak — bukan email yang bisa dihubungkan.",
          "",
          "Gunakan email yang Kakak pakai saat <b>daftar di web</b> ya.",
          "",
          "💡 Cara paling gampang: login di web, buka dashboard, lalu klik tombol <b>“Hubungkan Sekali Klik ✈️”</b> — akun langsung terhubung tanpa perlu ngetik email:",
          appUrl("/dashboard"),
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`[Bot] /link gagal (email tidak terdaftar): ${email} dari chat ${ctx.from?.id}`);
      await ctx.reply(
        [
          `⚠️ Email <b>${email}</b> belum terdaftar, Kak.`,
          "",
          `Pastikan kamu sudah daftar dulu di web: ${appUrl("/register")}`,
          "Sudah daftar tapi tetap gagal? Cek lagi e-mail yang dipakai saat mendaftar, atau hubungi admin +62 812-3456-7890 🌸",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    const chatId = String(ctx.from?.id ?? "");
    if (user.telegramChatId && user.telegramChatId !== chatId) {
      console.log(`[Bot] /link ditolak: ${email} sudah terhubung ke chat lain`);
      await ctx.reply(
        "Akun email ini sudah terhubung ke chat Telegram lain. Hubungi admin jika ini akunmu: +62 812-3456-7890"
      );
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { telegramChatId: chatId },
    });

    console.log(`[Bot] /link OK: ${email} → chat ${chatId}`);
    await ctx.reply(
      [
        `✅ Siap, Kak! Akun <b>${user.email}</b> berhasil terhubung 🎉`,
        "",
        "Sekarang kamu bisa:",
        "▪ <code>/status</code> — cek status pesanan",
        "▪ dan otomatis menerima notifikasi progres dari mentor 🌸",
      ].join("\n"),
      { parse_mode: "HTML" }
    );
  });

  bot.command("status", async (ctx) => {
    const chatId = String(ctx.from?.id ?? "");
    const user = await prisma.user.findUnique({ where: { telegramChatId: chatId } });

    if (!user) {
      await ctx.reply(
        [
          "🔗 Akunnya belum terhubung, Kak.",
          "",
          "Hubungkan dulu supaya aku bisa lihatkan status pesananmu:",
          "1. Ketik: <code>/link emailkamu</code>",
          "   contoh: <code>/link budi@email.com</code>",
          "2. Lalu ketik lagi: <code>/status</code>",
          "",
          "Email-nya yang dipakai daftar di web ya 😊",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { package: true, payments: true },
      orderBy: { createdAt: "desc" },
    });

    if (!orders.length) {
      await ctx.reply("Kamu belum punya pesanan. Cek paket di: " + appUrl("/paket"));
      return;
    }

    const lines: string[] = ["<b>🧾 STATUS PESANAN</b>", ""];
    for (const o of orders) {
      const payment = o.payments.at(-1);
      lines.push(
        `▪ <code>${o.code}</code>`,
        `  ${o.package.name}`,
        `  Pesanan : <b>${o.status}</b>`,
        `  Bayar   : ${payment?.status ?? "-"}`,
        `  Tanggal : ${formatDate(o.createdAt)}`,
        ""
      );
    }

    await ctx.reply(lines.join("\n"), { parse_mode: "HTML" });
  });

  bot.command("kontak", async (ctx) => {
    await ctx.reply(
      [
        "📞 Kontak admin:",
        "• WhatsApp: +62 813-6658-4799",
        "• Telegram: @rahmatbandarlampung",
        "• Web: http://localhost:3000/kontak",
      ].join("\n")
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      [
        "Perintah yang tersedia, Kak:",
        "/start — sambutan",
        "/paket — daftar paket & harga",
        "/link email — hubungkan akun",
        "/status — cek status pesanan",
        "/kontak — kontak admin",
        "",
        "Kakak juga bisa bertanya bebas ke aku, contoh: 'cara bayar paket gimana ya?'",
      ].join("\n")
    );
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    console.log(
      `[Bot] pesan masuk dari chat ${ctx.from?.id} (${ctx.from?.username ? "@" + ctx.from.username : ctx.from?.first_name}): "${text.slice(0, 80)}"`
    );

    // User mengetik email saja (lupa prefix /link) → tunjukkan caranya.
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text.toLowerCase())) {
      await ctx.reply(
        [
          `Sepertinya Kakak mau hubungkan akun <b>${text.toLowerCase()}</b>? 😊`,
          "",
          "Ketik begini ya:",
          `<code>/link ${text.toLowerCase()}</code>`,
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      return;
    }

    const answer = await findAnswer(ctx.message.text);
    if (answer) {
      await ctx.reply(answer, { link_preview_options: { is_disabled: true } });
      return;
    }

    // Fallback ke AI Groq untuk pertanyaan di luar FAQ.
    if (groqEnabled()) {
      try {
        const aiReply = await askGroq(ctx.message.text);
        if (aiReply) {
          await ctx.reply(aiReply, { link_preview_options: { is_disabled: true } });
          return;
        }
      } catch (err) {
        console.error("[Bot] Groq error:", err instanceof Error ? err.message : err);
      }
    }

    await ctx.reply(
      [
        `Maaf Kak, aku belum paham maksudnya 🙏`,
        ``,
        `Coba ketik kata kunci seperti: <i>harga, paket, bayar, daftar, sistem, cara, kontak</i> — atau tanya pakai kalimat bebas, aku usahakan jawab sebaik mungkin ✨`,
        ``,
        `Kalau butuh bantuan manusia, admin siap membantu: +62 813-6658-4799 🌸`,
      ].join("\n"),
      { parse_mode: "HTML" }
    );
  });

  bot.catch((err) => {
    console.error("[Bot] Error:", err.message);
  });

  // Validasi token sekali di awal supaya token salah tidak membanjiri log tiap 30 detik.
  try {
    await bot.api.getMe();
  } catch (err) {
    if (isAuthError(err)) {
      console.error(
        "[Bot] TELEGRAM_BOT_TOKEN ditolak Telegram (401/403). Bot TIDAK berjalan.\n" +
          "     Perbaiki token di .env (ambil dari @BotFather), lalu jalankan ulang `npm run dev`."
      );
      await idleForever();
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[Bot] getMe gagal (kemungkinan jaringan) — polling tetap dicoba. (${msg})`);
  }

  if (adminChatId) {
    try {
      await sendMarkdown(
        adminChatId,
        `<b>🤖 Bot Skripsi Mentor online!</b>\nSiap menerima notifikasi transaksi & pesanan baru.`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : err;
      if (String(msg).includes("chat not found")) {
        console.warn(
          "[Bot] TELEGRAM_ADMIN_CHAT_ID tidak valid (chat not found).\n" +
            "     Cara memperbaiki: kirim /start ke bot dari akun admin Telegram,\n" +
            "     lalu salin 'chat id' yang tercetak di log ke .env, dan restart dev."
        );
      } else {
        console.warn("[Bot] Gagal mengirim pesan online:", msg);
      }
    }
  }

  const RETRY_MS = 30_000;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (;;) {
    try {
      await bot.start({
        onStart: (info) => console.log(`[Bot] @${info.username} berjalan (long-polling)`),
      });
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isAuthError(err)) {
        console.error(`[Bot] Token ditolak Telegram (${msg}). Bot berhenti mencoba.`);
        await idleForever();
      }
      console.warn(
        `[Bot] Belum bisa polling (jaringan?). Coba lagi dalam ${RETRY_MS / 1000}s. (${msg})`
      );
      await sleep(RETRY_MS);
    }
  }
}