# Skripsi Mentor — Web Bimbingan Skripsi + Asisten Telegram "Frida"

Web layanan jasa mentor skripsi: halaman paket, blog tips, testimoni, checkout pembayaran **Midtrans Snap**, dashboard 3 peran (**Mahasiswa / Mentor / Admin**), dan **asisten Telegram AI "Frida"** (FAQ instan + jawaban AI via Groq + notifikasi otomatis). Web ini juga mempromosikan **produk jasa pengembangan sistem** (mis. Sistem Pelaporan Komunitas Berbasis Web & GIS) yang datanya tampil live di landing page.

> Repo: https://github.com/Basuki-rahmat/skripsi

## ✨ Fitur Utama

### Web
- **Landing page** — hero, layanan, keunggulan, testimoni, peta live dari sistem pelaporan (Leaflet/OpenStreetMap, import dinamis agar SSR aman)
- **Chat widget dua mode** (mengambang, semua halaman publik):
  - 💬 **WhatsApp (manual)** — chat langsung ke admin
  - ✈️ **Telegram Bot (auto)** — chat dengan asisten Frida, jawaban otomatis 24/7
- **Halaman paket** — data dari database, dikelola admin
- **Blog & testimoni** — dikelola admin, tampil publik setelah disetujui
- **Dashboard 3 role**
  - Mahasiswa: statistik pesanan, progres tahapan skripsi (9 tahap baku + persentase), upload bukti transfer manual, kirim testimoni, **tombol "Hubungkan Sekali Klik ✈️"** untuk menghubungkan Telegram
  - Mentor: daftar klien, update progres & tahapan (otomatis notifikasi Telegram ke mahasiswa)
  - Admin: statistik, kelola pesanan/paket/user/testimoni/artikel

### Bot Telegram "Frida" (`@fridaasisten_Bot`)
- **Persona ramah, rajin, santun, pandai, berbahasa Indonesia** (diatur via system prompt AI)
- **Alur jawaban berlapis**: kata kunci FAQ instan → harga/paket **dinamis dari database** → pertanyaan tahapan skripsi (9 tahap format baku) → sisanya dijawab **AI Groq**
- **Menjelaskan tahapan penyusunan skripsi dari persiapan sampai selesai sesuai format baku** — sumber yang sama dengan tracking progres dashboard
- **Deep-link sekali klik**: `/start LINK:<userId>.<signature>` (HMAC-SHA256) — akun terhubung tanpa mengetik email
- `/link` tahan salah ketik: validasi email, deteksi email contoh (`emailkamu@x.com`), log lengkap
- Validasi token sekali di startup — token salah menghasilkan 1 pesan error jelas, bukan spam 401
- Notifikasi: pesanan baru, pembayaran masuk/dikonfirmasi, progres, status bayar, pesanan aktif

### Pembayaran
- **Midtrans Snap** dengan webhook verifikasi SHA512, **fallback transfer manual** + upload bukti (divalidasi: path `/uploads/` atau URL http(s), tolak injeksi)

## 🧰 Tech Stack

| Komponen     | Teknologi                                            |
| ------------ | ---------------------------------------------------- |
| Framework    | Next.js 16 (App Router) + Route Handlers             |
| Database     | MySQL/MariaDB + Prisma ORM 7 (driver adapter mariadb)|
| Autentikasi  | NextAuth (Auth.js) v5 beta (Credentials)             |
| Pembayaran   | Midtrans Snap (fetch + verifikasi webhook SHA512)    |
| Bot Telegram | grammY (long-polling)                                |
| AI           | Groq API (OpenAI-compatible), default `openai/gpt-oss-20b` |
| Validasi     | Zod                                                  |
| CSS          | Tailwind CSS v4                                      |

> Prisma 7 memakai `prisma.config.ts` dan driver adapter `@prisma/adapter-mariadb`. Route guard memakai `src/proxy.ts` (pengganti `middleware.ts` di Next 16).

## 🚀 Setup Development

```bash
# 1. Clone
git clone https://github.com/Basuki-rahmat/skripsi.git
cd skripsi

# 2. Dependensi
npm install

# 3. Salin & isi .env
cp .env.example .env

# 4. Buat database MySQL: skripsi_db (opsional kedua: pelaporan_db)

# 5. Migrasi + data awal
npx prisma migrate dev
npm run seed

# 6. Jalankan (Next.js + bot Telegram bersamaan)
npm run dev
```

Buka `http://localhost:3000`. Akun seed:

| Role      | Email                | Password     |
| --------- | -------------------- | ------------ |
| Admin     | admin@skripsi.id     | admin123     |
| Mentor    | mentor@skripsi.id    | mentor123    |
| Mahasiswa | mahasiswa@skripsi.id | mahasiswa123 |

> Ganti password setelah dipakai sungguhan.

## 🔐 Konfigurasi `.env`

```env
# Database utama
DATABASE_URL="mysql://root:@localhost:3306/skripsi_db"
# Database sistem pelaporan (untuk peta live di landing; opsional)
PELAPORAN_DATABASE_URL="mysql://root:@localhost:3306/pelaporan_db"

# URL publik aplikasi — SEMUA link yang dikirim bot mengikuti nilai ini
# (dev: http://localhost:3000, produksi: https://domainanda.com)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-random-string-panjang"

# Midtrans (SB-... = sandbox; key produksi + MIDTRANS_IS_PRODUCTION=true saat rilis)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxx"
MIDTRANS_IS_PRODUCTION=false

# Telegram bot Frida
TELEGRAM_BOT_TOKEN="123456:ABC-DEFxxxx"
TELEGRAM_ADMIN_CHAT_ID="5170361667"           # chat id admin penerima notifikasi
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="fridaasisten_Bot"  # tanpa @ — untuk tombol chat & deep-link

# AI Groq (fallback FAQ bot) — key gratis di https://console.groq.com/keys
GROQ_API_KEY=""
GROQ_MODEL="openai/gpt-oss-20b"

# WhatsApp admin (tombol chat & floating)
NEXT_PUBLIC_WHATSAPP_NUMBER="62812xxxx"
NEXT_PUBLIC_WHATSAPP_MESSAGE="Halo, saya mau konsultasi skripsi"
```

Cara mendapat `TELEGRAM_ADMIN_CHAT_ID`: kirim `/start` ke bot dari akun admin → log mencetak `[Bot] /start dari chat id: ...`.

## 🤖 Setup Bot Telegram

1. Buat bot via [@BotFather](https://t.me/BotFather) → `/newbot` → salin token ke `TELEGRAM_BOT_TOKEN`.
2. Isi `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` dengan username bot (tanpa `@`) → mode Telegram muncul otomatis di chat widget landing.
3. **Hubungkan akun (2 cara):**
   - Web: login → dashboard → tombol **"Hubungkan Sekali Klik ✈️"** → tekan START di Telegram (bot verifikasi token HMAC otomatis)
   - Bot: ketik `/link email@kamu.com`
4. Perintah bot:

| Perintah | Fungsi |
| -------- | ------ |
| `/start` | Sambutan Frida; otomatis menghubungkan akun jika dari tombol dashboard (`LINK:...`) |
| `/link`  | Hubungkan akun via email (tahan salah ketik & email contoh) |
| `/status` | Status pesanan & pembayaran miliknya |
| `/paket` | Daftar paket & harga **langsung dari database** |
| teks bebas | FAQ instan → harga dinamis → tahapan skripsi baku → **AI Groq** |

## 💳 Setup Midtrans

1. Mode **Sandbox** untuk dev: salin server/client key.
2. Dashboard Midtrans → Settings → Configuration → **Payment Notification URL**: `https://domainanda.com/api/webhooks/midtrans`
3. Kartu uji sandbox: `4811 1111 1111 1114`, OTP `112233`.
4. Produksi: key `Mid-...` + `MIDTRANS_IS_PRODUCTION=true`.

## 📜 Tahapan Skripsi (Format Baku)

Aplikasi & bot memakai sumber yang sama (`src/lib/thesis-stages-template.ts`):

1. Persiapan Awal → 2. Pengajuan Judul → 3. BAB 1 Pendahuluan → 4. BAB 2 Kajian Pustaka → 5. BAB 3 Metode Penelitian → 6. BAB 4 Hasil & Pembahasan → 7. BAB 5 Kesimpulan & Saran → 8. Sidang/Ujian → 9. Revisi Akhir & Penjilidan

Setiap tahap punya status (`BELUM_DIMULAI / DIKERJAKAN / REVISI / SELESAI`) yang di-update mentor, menentukan persentase progres, dan memicu notifikasi Telegram.

## 🖥️ Deploy VPS (Produksi)

Prasyarat: Ubuntu 22.04+, Node 20+, MySQL/MariaDB, Nginx + domain + SSL.

```bash
# 1. Database
mysql -e "CREATE DATABASE skripsi_db CHARACTER SET utf8mb4;
CREATE DATABASE pelaporan_db CHARACTER SET utf8mb4;
CREATE USER 'skripsi'@'localhost' IDENTIFIED BY 'passwordkuat';
GRANT ALL ON skripsi_db.* , pelaporan_db.* TO 'skripsi'@'localhost';"

# 2. Source + env
git clone https://github.com/Basuki-rahmat/skripsi.git && cd skripsi
cp .env.example .env && nano .env     # NEXTAUTH_URL pakai https://domainanda.com !

# 3. Jalankan SEMUA (install, generate, migrate deploy, seed, build, systemd):
sudo bash deploy/setup-vps.sh
```

Script tersebut memasang 2 service systemd:

| Service | Isi | Log |
| ------- | --- | --- |
| `skripsi-web` | `next start` (port 3000) | `/var/log/skripsi/web.log` |
| `skripsi-bot` | `tsx src/bot/run.ts` (long-polling) | `/var/log/skripsi/bot.log` |

> ⚠️ Bot long-polling **wajib hanya satu instance** per token (jangan jalan bareng pm2/lokal — akan konflik 409).

### Alternatif: PM2

```bash
npm install && npm run build
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

### Nginx (reverse proxy)

```nginx
server {
  server_name domainanda.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  client_max_body_size 10M;   # upload bukti
}
```

SSL: `sudo certbot --nginx -d domainanda.com`

### Checklist pasca-deploy

- [ ] Landing 200, peta live tampil (atau dummy bila `pelaporan_db` kosong)
- [ ] Ganti password admin seed
- [ ] Telegram: `/start` balas; `/paket` link sudah `https://domainanda.com/...`
- [ ] Tombol sekali-klik dari dashboard produksi berfungsi
- [ ] Transaksi Midtrans production → webhook masuk → status berubah
- [ ] Upload bukti tersimpan & notif admin masuk

## 📂 Struktur Folder

```
├── prisma/                  # schema, migrations, seed
├── src/
│   ├── app/
│   │   ├── (public)/        # landing, paket, produk, blog, kontak, testimoni
│   │   ├── dashboard/       # mahasiswa, mentor, admin
│   │   ├── checkout/ login/ register/
│   │   └── api/             # orders, webhooks/midtrans, upload, payments/proof, dst.
│   ├── bot/
│   │   ├── run.ts           # entry long-polling
│   │   ├── index.ts         # handler perintah + deep-link + persona pesan
│   │   ├── ai.ts            # integrasi Groq (system prompt Frida + tahapan baku)
│   │   ├── faq.ts           # FAQ instan + harga dinamis + jawaban tahapan
│   │   ├── notify.ts        # notifikasi admin & mahasiswa
│   │   └── client.ts
│   ├── components/
│   │   ├── chat-widget.tsx / chat-widget-panel.tsx   # chat dua mode
│   │   └── dashboard/
│   ├── lib/
│   │   ├── telegram-link.ts # token HMAC deep-link sekali klik
│   │   ├── thesis-stages-template.ts  # 9 tahap baku (sumber unik)
│   │   ├── env.ts           # appUrl(), formatIDR, link WA/TG
│   │   ├── db.ts mariadb.ts auth.ts midtrans.ts
│   ├── proxy.ts             # route guard per role
│   └── generated/prisma/    # prisma client (generated)
├── ecosystem.config.js      # pm2: skripsi-web + skripsi-bot
├── deploy/                  # systemd units + setup-vps.sh
└── .env.example
```

## 🧾 Scripts

| Command | Fungsi |
| ------- | ------ |
| `npm run dev` | Next.js + bot bersamaan (concurrently) |
| `npm run dev:next` / `dev:bot` | Jalankan salah satu |
| `npm run start` | Production server |
| `npm run start:bot` | Bot production (dipakai systemd/pm2) |
| `npm run build` | Build produksi |
| `npm run seed` | Data awal (idempotent) |
| `npx prisma migrate deploy` | Migrasi di produksi (jangan `migrate dev`) |
| `npm run lint` | ESLint |

## Lisensi

MIT
