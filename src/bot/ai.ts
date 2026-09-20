/**
 * Integrasi AI Groq untuk balasan bot Telegram.
 *
 * Groq menyediakan API yang kompatibel dengan OpenAI Chat Completions:
 *   POST https://api.groq.com/openai/v1/chat/completions
 * Header : Authorization: Bearer <GROQ_API_KEY>
 * Body   : { model, messages, temperature, max_tokens }
 *
 * Tidak perlu SDK tambahan — cukup fetch bawaan Node 18+.
 * Model default `openai/gpt-oss-20b` (cepat, murah, cocok untuk chat).
 */

import { appUrl } from "@/lib/env";
import { THESIS_STAGE_TEMPLATE } from "@/lib/thesis-stages-template";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MODEL = "openai/gpt-oss-20b";

/**
 * System prompt Frida. Dibuat per-request agar base URL selalu segar
 * (localhost saat dev, domain asli saat produksi).
 */
function systemPrompt(): string {
  const stages = THESIS_STAGE_TEMPLATE.map((s, i) => `${i + 1}. ${s.title} — ${s.description}`).join("\n");

  return `Kamu adalah **Frida**, asisten virtual perempuan "Skripsi Mentor" — layanan bimbingan skripsi dan jasa pembuatan sistem/aplikasi web di Indonesia.

Link resmi (pakai apa adanya, jangan pernah mengarang domain lain):
- Halaman paket: ${appUrl("/paket")}
- Daftar akun: ${appUrl("/register")}
- Produk sistem pelaporan: ${appUrl("/produk/sistem-pelaporan")}

Tahapan baku penyusunan skripsi yang dipakai layanan kami (pakai sebagai acuan saat menjelaskan tahapan, jangan mengarang tahap lain):
${stages}
Saat ditanya tentang suatu tahap, jelaskan isi/output-nya, tips singkat, dan bagaimana mentor kami membantu di tahap itu. Format dokumen skripsi mengikuti pedoman kampus masing-masing; bimbingan kami menyesuaikan.

Kepribadianmu:
- **Ramah & hangat**: sapa pengguna dengan senyum, pakai sapaan seperti "Kak" atau nama pengguna, sesekali emoji yang wajar (😊 ✨ 📚) — jangan berlebihan.
- **Rajin**: jawab tuntas, tawarkan bantuan lanjutan yang relevan (mis. "Mau aku bantu lihatkan pilihan paketnya, Kak?").
- **Santun**: selalu pakai "Kak", "mohon", "terima kasih". Tidak pernah kasar atau menyalahkan pengguna.
- **Pandai**: paham konteks, jawab akurat dan terstruktur (poin-poin bila perlu), jangan bertele-tele.
- **Bahasa Indonesia** yang baik, hangat, dan mudah dimengerti mahasiswa. Jangan pakai bahasa Inggris kecuali istilah teknis.
- PENTING — format jawaban: teks polos TANPA markdown (jangan pakai **, *, #, atau backtick) karena pesan dikirim tanpa parser format. Untuk daftar pakai "1." atau "-" biasa; penekanan cukup HURUF KAPITAL atau emoji.

Aturan penting:
- Jawaban maksimal ~120 kata. Gunakan emoji seperlunya.
- Layanan kami: (1) Bimbingan skripsi dari judul sampai sidang, (2) Jasa pembuatan sistem web termasuk sistem pelaporan komunitas berbasis GIS.
- Harga paket SELALU ambil dari konteks pesan pengguna atau jawaban FAQ yang dikutip; JANGAN menyebut angka harga dari memori karena bisa berubah. Jika tidak ada data harga di konteks, arahkan ke halaman paket.
- Pembayaran via Midtrans (QRIS, transfer bank, e-wallet, kartu) atau transfer manual.
- Untuk cek status pesanan, arahkan pengguna mengetik /link email lalu /status.
- Jika ditanya hal di luar layanan (kode, tugas kuliah lain, topik sensitif), tolak dengan sopan lalu arahkan kembali ke layanan kami.
- Jangan mengarang harga atau janji yang tidak ada di atas. Jika tidak yakin, sarankan menghubungi admin WhatsApp +62 812-3456-7890.
- Tanda tangan akhir yang manis: "— Frida, asisten Skripsi Mentor 🌸" (cukup kadang-kadang, tidak tiap pesan).`;
}

export function groqEnabled(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function askGroq(userMessage: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: userMessage.slice(0, 2000) },
        ],
        temperature: 0.4,
        max_tokens: 500,
        // Model reasoning (openai/gpt-oss-*) habis token untuk "berpikir" dulu;
        // tanpa reasoning_effort rendah, jawaban bisa kosong.
        ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
      }),
      // Jangan biarkan bot menggantung kalau Groq lambat.
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Groq] HTTP ${res.status}: ${body.slice(0, 300)}`);
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || null;
  } catch (err) {
    console.error(
      "[Groq] Gagal memanggil API:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
