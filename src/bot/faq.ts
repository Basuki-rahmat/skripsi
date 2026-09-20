import prisma from "@/lib/db";
import { appUrl, formatIDR } from "@/lib/env";
import { THESIS_STAGE_TEMPLATE } from "@/lib/thesis-stages-template";

export interface FaqEntry {
  keywords: string[];
  answer: string;
}

/**
 * Jawaban instan untuk kata kunci umum (tanpa AI).
 * Gaya bahasa mengikuti persona Frida: ramah, rajin, santun, pandai,
 * berbahasa Indonesia, emoji secukupnya. Catatan: pesan FAQ dikirim
 * tanpa parse_mode, jadi gunakan teks polos (tanpa tag HTML/markdown).
 *
 * Semua link memakai appUrl() sehingga otomatis menyesuaikan base URL
 * (localhost saat dev, domain asli saat produksi).
 */
export const FAQ: FaqEntry[] = [
  {
    keywords: ["daftar", "cara", "order", "pesan", "mulai"],
    answer:
      "✨ Dengan senang hati! Cara memulainya:\n\n1. Daftar dulu di " + appUrl("/register") + "\n2. Pilih paket yang pas\n3. Checkout & selesaikan pembayaran\n4. Mentor siap mendampingi Kakak!\n\nMau tanya-tanya dulu? Silakan, aku di sini 😊",
  },
  {
    keywords: ["proposal", "bimbingan", "mentor", "konsultasi"],
    answer:
      "📚 Bimbingan di kami lengkap, Kak: konsultasi judul, kerangka proposal, penulisan BAB 1-5, metode penelitian, format, sampai persiapan sidang.\n\nYuk lihat paketnya: " + appUrl("/paket") + "\n\nAda bagian yang mau ditanyakan lebih detail? 😊",
  },
  {
    keywords: ["sistem", "aplikasi", "gis", "pelaporan", "website", "app"],
    answer:
      "🛠️ Kami juga menerima jasa pembuatan sistem, Kak: aplikasi web, sistem pelaporan komunitas + peta GIS, dashboard, dan lainnya — lengkap dengan database, dokumentasi, dan source code.\n\nContoh produknya di sini ya: " + appUrl("/produk/sistem-pelaporan") + "\n\nCeritakan ide Kakak, nanti kami bantu wujudkan ✨",
  },
  {
    keywords: ["status", "cek", "pesanan", "order"],
    answer:
      "🔎 Untuk cek status pesanan, Kak:\n\n1. Hubungkan akunnya dulu: /link emailkamu\n2. Lalu ketik /status\n\nBisa juga langsung cek di dashboard web. Kalau ada kendala, bilang saja — aku bantu! 🌸",
  },
  {
    keywords: ["link", "hubungkan", "akun"],
    answer:
      "🔗 Caranya gampang, Kak. Ketik: /link emailkamu\n\nContoh: /link budi@email.com\n\nSetelah terhubung, Kakak bisa cek /status dan otomatis menerima notifikasi progres dari mentor 😊",
  },
  {
    keywords: ["kontak", "hubungi", "admin", "whatsapp", "telepon", "cs"],
    answer:
      "📞 Kalau butuh bantuan langsung dari admin, silakan hubungi ya, Kak:\n\n• WhatsApp: +62 812-3456-7890\n• Telegram: @skripsimentor\n\nJam operasional: Senin–Sabtu, 08.00–21.00 WIB 🌸",
  },
];

const PRICE_KEYWORDS = ["harga", "biaya", "tarif", "price", "cost"];
const PACKAGE_KEYWORDS = ["paket", "pilihan", "layanan", "service"];

/**
 * Kata kunci pertanyaan tentang tahapan penyusunan skripsi.
 * Dijawab instan dari THESIS_STAGE_TEMPLATE — sumber yang sama dengan
 * tracking progres di dashboard, jadi selalu konsisten & format baku.
 */
const THESIS_STAGE_KEYWORDS = [
  "tahapan", "tahap", "langkah", "alur", "penyusunan", "struktur skripsi",
  "format baku", "bagian skripsi", "urutan", "mulai dari mana",
];

export function thesisStagesAnswer(): string {
  const lines: string[] = [
    "📚 Dengan senang hati, Kak! Ini tahapan penyusunan skripsi dari persiapan sampai selesai (format baku):",
    "",
  ];

  THESIS_STAGE_TEMPLATE.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.title}`);
    lines.push(`    ${s.description}`);
  });

  lines.push("");
  lines.push(
    "✨ Di Skripsi Mentor, 9 tahapan ini dipantau di dashboard lengkap dengan progres persentase & notifikasi — jadi tidak ada tahap yang terlewat, Kak."
  );
  lines.push("");
  lines.push(
    `Mau aku jelaskan salah satu tahap lebih detail? Atau lihat paket bimbingannya: ${appUrl("/paket")} 😊`
  );

  return lines.join("\n");
}

/**
 * Jawaban dinamis untuk harga & daftar paket — diambil LANGSUNG dari database,
 * jadi otomatis ikut ketika admin mengubah harga/paket di dashboard.
 */
async function dynamicPriceAnswer(text: string): Promise<string | null> {
  const lower = text.toLowerCase();
  const wantsPrice = PRICE_KEYWORDS.some((k) => lower.includes(k));
  const wantsPackage = PACKAGE_KEYWORDS.some((k) => lower.includes(k));
  if (!wantsPrice && !wantsPackage) return null;

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: [{ type: "asc" }, { price: "asc" }],
  });

  if (packages.length === 0) {
    return (
      "📦 Untuk daftar paket terbaru, silakan cek langsung: " +
      appUrl("/paket") +
      "\n\nAda yang bisa aku bantu jelaskan dulu, Kak? 😊"
    );
  }

  const bimbingan = packages.filter((p) => p.type === "BIMBINGAN");
  const pembuatan = packages.filter((p) => p.type === "PEMBUATAN");

  const lines: string[] = ["💰 Siap, Kak! Ini daftar harganya:", ""];

  if (bimbingan.length > 0) {
    lines.push("📚 Bimbingan Skripsi");
    for (const p of bimbingan) {
      lines.push(`▪️ ${p.name} — ${formatIDR(p.price)}${p.duration ? ` (${p.duration})` : ""}`);
    }
    lines.push("");
  }

  if (pembuatan.length > 0) {
    lines.push("🛠️ Pembuatan Sistem");
    for (const p of pembuatan) {
      lines.push(`▪️ ${p.name} — dari ${formatIDR(p.price)}`);
    }
    lines.push("");
  }

  lines.push(`Detail lengkap: ${appUrl("/paket")}`);
  lines.push("");
  lines.push("Mau aku bantu pilihkan yang paling cocok, Kak? 😊");

  return lines.join("\n");
}

export async function findAnswer(text: string): Promise<string | null> {
  const lower = text.toLowerCase();

  // Prioritas 1: pertanyaan tahapan penyusunan skripsi (jawaban baku dari template)
  if (THESIS_STAGE_KEYWORDS.some((k) => lower.includes(k))) {
    return thesisStagesAnswer();
  }

  // Prioritas 2: jawaban dinamis (harga/paket dari database)
  const dynamic = await dynamicPriceAnswer(text).catch(() => null);
  if (dynamic) return dynamic;

  // Prioritas 3: FAQ statis
  for (const entry of FAQ) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.answer;
  }
  return null;
}
