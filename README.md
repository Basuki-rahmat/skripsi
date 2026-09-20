# Skripsi Mentor — Web Bimbingan Skripsi Online

Web layanan jasa mentor skripsi: halaman paket, blog tips, testimoni, checkout pembayaran **Midtrans Snap**, dan notifikasi otomatis via **Bot Telegram**. Terdiri dari dashboard untuk 3 peran: **Mahasiswa**, **Mentor**, dan **Admin**. Selain layanan bimbingan, web ini juga mempromosikan **produk jasa pengembangan sistem** (mis. Sistem Pelaporan Komunitas Berbasis Web & GIS).

## Fitur

- **Landing page** — hero, layanan, keunggulan, testimoni, CTA WhatsApp & Telegram
- **Halaman paket harga** — paket bimbingan & pembuatan skripsi lengkap dengan fitur, durasi, dan harga
- **Produk jasa** — showcase sistem pelaporan komunitas (Web & GIS) di `/produk/sistem-pelaporan`
- **Blog tips skripsi** — artikel + halaman detail, dikelola admin
- **Testimoni klien** — dikirim mahasiswa, ditampilkan publik setelah disetujui admin
- **Dashboard 3 role**
  - Mahasiswa: ringkasan, daftar pesanan, upload bukti bayar manual, detail pesanan + timeline progres, kirim testimoni
  - Mentor: daftar klien bimbingan, update progres + catatan (otomatis notif Telegram)
  - Admin: ringkasan statistik, kelola pesanan (konfirmasi bayar, tugaskan mentor, ubah status), paket, user, testimoni, artikel
- **Pembayaran** — Midtrans Snap (`/api/orders` → snap token → redirect) dengan **fallback transfer manual** bila Midtrans gagal, plus webhook verifikasi SHA512
- **Bot Telegram** — notifikasi transaksi & progres, perintah `/link` `/status` `/paket`, dan jawaban FAQ otomatis

## Tech Stack

| Komponen      | Teknologi                                  |
| ------------- | ------------------------------------------ |
| Framework     | Next.js 16 (App Router) + Route Handlers  |
| Database      | MySQL 8 + Prisma ORM 7 (driver adapter)    |
| Autentikasi   | NextAuth (Auth.js) v5 beta (Credentials)   |
| Pembayaran    | Midtrans Snap (HTTP fetch, verifikasi webhook) |
| Bot Telegram  | grammY (long-polling)                      |
| Validasi      | Zod                                        |
| CSS           | Tailwind CSS v4                            |

> Catatan: versi ini memakai **Prisma 7** — konfigurasi di `prisma.config.ts` (URL db tidak lagi di `schema.prisma`) dan client memakai `@prisma/adapter-mariadb` untuk koneksi MySQL. Route guard memakai `src/proxy.ts` (pengganti `middleware.ts` di Next 16).

## Prasyarat

- Node.js ≥ 20 (disarankan v24)
- MySQL 8 (misal via [Laragon](https://laragon.org))
- Akun Midtrans (mode **sandbox** untuk development)
- Token bot Telegram dari [@BotFather](https://t.me/BotFather)

## Setup & Instalasi

```bash
# 1. Clone atau salin project
git clone https://github.com/username/skripsi-mentor.git
cd skripsi-mentor

# 2. Install dependensi
npm install

# 3. Buat file .env
copy .env.example .env

# 4. Buat database di MySQL (misal via Laragon/phpMyAdmin)
#    nama database: skripsi_db

# 5. Migrasi + isi data awal
npx prisma migrate dev
npm run seed

# 6. Jalankan (Next.js + Bot Telegram berjalan bersamaan)
npm run dev
```

Buka `http://localhost:3000`.

## Konfigurasi `.env`

Lihat `.env.example`. Yang wajib diisi:

```env
DATABASE_URL="mysql://root:@localhost:3306/skripsi_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-dengan-random-string-panjang"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION=false
TELEGRAM_BOT_TOKEN="123456:ABC-DEFxxxx"
TELEGRAM_ADMIN_CHAT_ID="-1001234567890"
```

## Setup Bot Telegram

1. Buat bot baru lewat [@BotFather](https://t.me/BotFather) → perintah `/newbot`.
2. Salin **token** ke `TELEGRAM_BOT_TOKEN`.
3. Buat grup admin (misal "Notifikasi Skripsi"), tambahkan bot ke grup.
4. Isi `TELEGRAM_ADMIN_CHAT_ID` dengan ID grup. Cara cek: kirim pesan apa pun di grup, lalu buka `https://api.telegram.org/bot<TOKEN>/getUpdates` dan lihat `chat.id` pada update terakhir (grup biasanya negatif, `-100...`).
5. Bot berjalan otomatis bersama `npm run dev` (lewat `concurrently`).

### Perintah Bot

| Perintah   | Fungsi                                                          |
| ---------- | --------------------------------------------------------------- |
| `/start`   | Sambutan + menu utama                                           |
| `/link`    | Tautkan akun: `/link nama@email.com` — syarat menerima notifikasi pribadi |
| `/status`  | Cek status pesanan & pembayaran miliknya                        |
| `/paket`   | Ringkasan paket + harga                                         |
| teks biasa | Jawaban otomatis FAQ (kata kunci: harga, paket, bayar, daftar, bimbingan, ...) |

## Setup Midtrans

1. Daftar di [Midtrans](https://midtrans.com) → pilih mode **Sandbox** saat development.
2. Salin `Server Key` & `Client Key` ke `.env`.
3. Di dashboard Midtrans → **Settings > Configuration**, isi **Payment Notification URL**:
   ```
   http://localhost:3000/api/webhooks/midtrans
   ```
   (Untuk production gunakan domain publik + HTTPS.)
4. Untuk uji coba, pakai kartu uji sandbox Midtrans (`4811 1111 1111 1114`, OTP/3DS `112233`).

> Saat siap produksi, ubah `MIDTRANS_IS_PRODUCTION=true` dan ganti key dengan key produksi.

## Struktur Folder

```
skripsi/
├── prisma/
│   ├── schema.prisma        # skema database
│   ├── prisma.config.ts     # konfigurasi Prisma 7 (DSN, seed)
│   └── seed.ts              # data awal (3 user, paket, artikel, testimoni)
├── src/
│   ├── app/
│   │   ├── (public)/        # landing, paket, produk showcase, blog, tentang, kontak, testimoni
│   │   ├── dashboard/       # dashboard mahasiswa & mentor
│   │   ├── dashboard/admin/ # dashboard & CRUD admin
│   │   ├── checkout/        # checkout pesanan
│   │   ├── login/ register/ # autentikasi
│   │   └── api/             # route handlers (orders, webhook midtrans, admin CRUD, upload, progress)
│   ├── bot/
│   │   ├── run.ts           # entry long-polling (dijalankan via npm run dev / npm run bot)
│   │   ├── index.ts         # startBot + /start /link /status /paket
│   │   ├── client.ts        # inisialisasi & helper kirim pesan
│   │   ├── faq.ts           # keyword auto-reply
│   │   └── notify.ts        # notifikasi ke grup admin & per-user
│   ├── components/          # UI (navbar, footer, auth, checkout, dashboard) + brand
│   ├── lib/
│   │   ├── db.ts            # singleton Prisma + adapter MariaDB
│   │   ├── mariadb.ts       # parsing DSN → pool config
│   │   ├── auth.ts          # konfigurasi NextAuth v5 + CredentialsProvider
│   │   ├── midtrans.ts      # wrapper HTTP Midtrans Snap
│   │   └── env.ts           # helper env, rupiah, tanggal, kode order, link WA/TG
│   ├── proxy.ts             # route guard per role (pengganti middleware)
│   └── types/               # augmentation tipe next-auth
├── .env.example             # template variabel lingkungan
└── public/uploads/          # bukti pembayaran terunggah
```

## Alur Pembayaran

```
Mahasiswa checkout paket
        │
        ▼
/api/orders → buat Order + Payment (PENDING) + Snap Token
        │
        ├─ Midtrans OK → redirect ke halaman Snap → bayar
        │                 └─ webhook /api/webhooks/midtrans (verifikasi SHA512)
        │                    └─ update Payment/Order + notifikasi Telegram
        └─ Midtrans gagal → fallback TRANSFER_MANUAL
                            └─ mahasiswa upload bukti di dashboard
                               └─ admin konfirmasi → order aktif + notifikasi
```

## Command Scripts

| Command            | Fungsi                                       |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Jalankan Next.js + Bot Telegram bersama-sama |
| `npm run dev:next` | Jalankan Next.js saja                        |
| `npm run dev:bot`  | Jalankan bot Telegram saja                   |
| `npm run build`    | Build production                             |
| `npm run start`    | Jalankan production                          |
| `npm run lint`     | Cek lint                                     |
| `npm run seed`     | Isi data awal ke database                    |

## Akun Default (Seed)

| Role      | Email                | Password   |
| --------- | -------------------- | ---------- |
| Admin     | admin@skripsi.id     | admin123   |
| Mentor    | mentor@skripsi.id    | mentor123  |
| Mahasiswa | mahasiswa@skripsi.id | mahasiswa123 |

> Segera ganti password ini setelah pertama kali masuk.

## Catatan Deployment

- Ganti `NEXTAUTH_URL`, key Midtrans, dan set `MIDTRANS_IS_PRODUCTION=true`.
- Pastikan server mendukung proses persisten; di hosting tanpa proses gunakan **webhook Telegram** (bukan long-polling).
- Aktifkan HTTPS; webhook Midtrans/Telegram wajib HTTPS di production.
- Jalankan `npx prisma migrate deploy` di production (bukan `migrate dev`).
- `public/uploads/` berisi bukti pembayaran — pastikan persist/replikasi saat deploy.

## Lisensi

MIT