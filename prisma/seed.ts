import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { mariadbPoolConfig } from "../src/lib/mariadb";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(mariadbPoolConfig()),
});

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const mentorPassword = await bcrypt.hash("mentor123", 10);
  const studentPassword = await bcrypt.hash("mahasiswa123", 10);

  await prisma.user.upsert({
    where: { email: "admin@skripsi.id" },
    update: {},
    create: {
      name: "Admin Skripsi Mentor",
      email: "admin@skripsi.id",
      password: adminPassword,
      role: "ADMIN",
      phone: "081234567890",
      whatsapp: "6281234567890",
    },
  });

  await prisma.user.upsert({
    where: { email: "mentor@skripsi.id" },
    update: {},
    create: {
      name: "Mentor Senior",
      email: "mentor@skripsi.id",
      password: mentorPassword,
      role: "MENTOR",
      phone: "081234567891",
      whatsapp: "6281234567891",
    },
  });

  await prisma.user.upsert({
    where: { email: "mahasiswa@skripsi.id" },
    update: {},
    create: {
      name: "Mahasiswa Contoh",
      email: "mahasiswa@skripsi.id",
      password: studentPassword,
      role: "MAHASISWA",
      phone: "081234567892",
      whatsapp: "6281234567892",
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-basic" },
    update: {},
    create: {
      id: "pck-basic",
      name: "Basic",
      type: "BIMBINGAN",
      description: "Konsultasi judul, outline, dan arahan penulisan BAB 1-2.",
      price: 299000,
      duration: "1 bulan",
      features: [
        "Konsultasi judul & topik",
        "Penyusunan outline/kerangka",
        "Review BAB 1 (revisi maksimal 2x)",
        "Akses grup diskusi",
        "Konsultasi via chat",
      ],
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-pro" },
    update: {},
    create: {
      id: "pck-pro",
      name: "Pro",
      type: "BIMBINGAN",
      description: "Pendampingan penuh dari proposal hingga BAB akhir.",
      price: 599000,
      duration: "2 bulan",
      features: [
        "Semua fitur paket Basic",
        "Review BAB 1-3",
        "Bimbingan metode penelitian",
        "Bantuan daftar pustaka & format",
        "Grup whatsapp pribadi",
      ],
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-premium" },
    update: {},
    create: {
      id: "pck-premium",
      name: "Premium",
      type: "BIMBINGAN",
      description: "Pendampingan sampai sidang. Mentor tetap mendampingi.",
      price: 999000,
      duration: "Sampai sidang",
      features: [
        "Semua fitur paket Pro",
        "Review seluruh BAB 1-5",
        "Bimbingan sampai sidang",
        "Simulasi sidang & tanya jawab",
        "Prioritas respon mentor",
        "Support revisi pasca-sidang",
      ],
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-konsul" },
    update: {},
    create: {
      id: "pck-konsul",
      name: "Konsultasi Awal",
      type: "BIMBINGAN",
      description: "1x sesi konsultasi online untuk mencocokkan arah skripsi.",
      price: 99000,
      duration: "1x sesi (60 menit)",
      features: [
        "1x sesi konsultasi video call",
        "Analisis topik & celah riset",
        "Rekomendasi metode",
        "Catatan hasil konsultasi",
      ],
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-web-landing" },
    update: {},
    create: {
      id: "pck-web-landing",
      name: "Web Landing / Profil",
      type: "PEMBUATAN",
      description: "Website company profile / landing page profesional.",
      price: 1500000,
      duration: "± 2 minggu",
      features: [
        "Desain responsif (mobile friendly)",
        "Halaman yang kamu butuhkan",
        "Form kontak + WhatsApp",
        "Optimasi kecepatan & SEO dasar",
        "Source code + dokumentasi",
      ],
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-sistem-pelaporan" },
    update: {},
    create: {
      id: "pck-sistem-pelaporan",
      name: "Sistem Pelaporan Komunitas + GIS",
      type: "PEMBUATAN",
      description:
        "Aplikasi pelaporan permasalahan masyarakat lengkap dengan peta interaktif (GIS), verifikasi, dan tindak lanjut.",
      price: 3500000,
      duration: "± 4-6 minggu",
      features: [
        "3 role: masyarakat, petugas, admin",
        "Form laporan + upload foto + lokasi GPS",
        "Nomor tiket & status laporan",
        "Peta interaktif (Leaflet/OpenStreetMap)",
        "Marker, filter, & dashboard statistik",
        "Manajemen kategori & wilayah",
        "Riwayat & tindak lanjut laporan",
        "Source code + dokumentasi + instalasi",
      ],
    },
  });

  await prisma.package.upsert({
    where: { id: "pck-custom" },
    update: {},
    create: {
      id: "pck-custom",
      name: "Aplikasi Kustom (Custom Request)",
      type: "PEMBUATAN",
      description:
        "Konsultasi kebutuhan, kami bangunkan aplikasi sesuai spesifikasi Anda.",
      price: 5000000,
      duration: "Menyesuaikan",
      features: [
        "Konsultasi kebutuhan (free)",
        "Rancangan database & fitur",
        "Pengembangan sistem sesuai setuju",
        "Database + source code",
        "Dokumentasi penggunaan",
        "Garansi perbaikan bug 1 bulan",
      ],
    },
  });

  const posts = [
    {
      title: "5 Cara Memilih Judul Skripsi yang Mudah Dikembangkan",
      slug: "cara-memilih-judul-skripsi",
      excerpt:
        "Judul yang baik adalah setengah dari perjalanan skripsi. Ini 5 tips memilih judul yang tidak bikin jalan di tempat.",
      content:
        "## 1. Sesuaikan dengan minat\nPilih topik yang benar-benar kamu minat agar semangat menulis bertahan.\n\n## 2. Pastikan datanya ada\nSebelum memutuskan judul, pastikan data penelitian mudah diakses.\n\n## 3. Cek literatur\nJudul yang sudah banyak diteliti justru punya banyak referensi pembanding.\n\n## 4. Ukur kemampuan\". Hindari judul yang butuh keahlian di luar kemampuan agar bisa diselesaikan tepat waktu.\n\n## 5. Diskusikan dengan dosen\nKonsultasi lebih awal mencegah revisi judul di tengah jalan.",
    },
    {
      title: "Tips Menyusun BAB 3 Metode Penelitian dengan Mudah",
      slug: "tips-bab-3-metode-penelitian",
      excerpt:
        "BAB 3 sering dianggap paling membingungkan. Ikuti kerangka ini agar cepat selesai dan sesuai kaidah.",
      content:
        "## Jenis penelitian\nTuliskan jenis penelitian (kualitatif/kuantitatif) beserta alasannya.\n\n## Populasi & sampel\nGambarkan siapa subjek penelitian dan teknik pengambilannya.\n\n## Teknik pengumpulan data\nJelaskan instrumen: kuesioner, wawancara, observasi, atau studi dokumentasi.\n\n## Teknik analisis data\nTuliskan cara menganalisis data — deskriptif, statistik, atau tematik.\n\n## Jadwal penelitian\nSertakan timeline agar proposal terlihat realistis.",
    },
    {
      title: "Mengenal Sistem Pelaporan Komunitas Berbasis Web dan GIS",
      slug: "sistem-pelaporan-komunitas-web-gis",
      excerpt:
        "Aplikasi yang membantu masyarakat melapor permasalahan lingkungan dengan peta interaktif dan monitoring terpusat.",
      content:
        "## Apa itu?\nSistem pelaporan komunitas adalah aplikasi untuk melaporkan permasalahan masyarakat (jalan rusak, sampah, drainase, dll) secara digital.\n\n## Keunggulan lokasi GPS\nSetiap laporan menyimpan koordinat lokasi sehingga petugas tahu titik persisnya.\n\n## Peran GIS\nPeta interaktif menampilkan persebaran laporan per kategori dan status, memudahkan pemantauan.\n\n## Alur singkat\nMasyarakat lapor → sistem terbitkan nomor tiket → verifikasi → tindak lanjut → selesai.\n\nKami juga menerima jasa pembuatan sistem serupa — lihat halaman produk.",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  const testimonies = [
    {
      content:
        "Alhamdulillah skripsi saya selesai tepat waktu. Mentor sabar banget memandu dari judul sampai sidang.",
      rating: 5,
    },
    {
      content:
        "Bimbingannya terstruktur, banyak tips praktis. BAB 3 yang tadinya ribet jadi mudah dipahami.",
      rating: 5,
    },
    {
      content:
        "Progres saya selalu terpantau, ada notifikasi tiap pembaruan. Sangat membantu bagi yang kerja sambil kuliah.",
      rating: 4,
    },
  ];

  const studentUser = await prisma.user.findUnique({
    where: { email: "mahasiswa@skripsi.id" },
  });

  if (studentUser) {
    for (const t of testimonies) {
      await prisma.testimonial.create({
        data: { userId: studentUser.id, ...t, isApproved: true },
      });
    }
  }

  console.log("✅ Seed selesai.");
  console.log(`   Admin  → admin@skripsi.id / admin123`);
  console.log(`   Mentor → mentor@skripsi.id / mentor123`);
  console.log(`   Siswa  → mahasiswa@skripsi.id / mahasiswa123`);
  console.log(`   Packages → ${await prisma.package.count()}`);
  console.log(`   Posts   → ${await prisma.post.count()}`);
  console.log(`   Testimoni → ${await prisma.testimonial.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());