# Alur Cara Penggunaan Aplikasi — SkripsiMentor

Aplikasi pembimbingan skripsi & jasa pembuatan sistem. Terdapat **3 peran** (role):

| Peran | Hak Akses |
|---|---|
| **Mahasiswa** | Mendaftar, memilih paket, checkout, bayar, memantau pesanan & progres, melihat roadmap penyusunan skripsi, upload bukti transfer, memberi testimoni |
| **Mentor** | Melihat pesanan klien yang ditugaskan, menambah progres & persentase, memperbarui status tahapan roadmap penyusunan skripsi |
| **Admin** | Mengelola pesanan (status & penugasan mentor), paket/harga, pengguna, artikel blog, testimoni, dan ikut memperbarui roadmap |

URL: `http://localhost:3000`
Bot Telegram: konfigurasi via `TELEGRAM_BOT_TOKEN` di `.env`

---

## 1. Alur Status Pesanan

```
PENDING ──(pembayaran sukses)──▶ PAID ──(admin set status)──▶ PROCESSING
   │                                │
   │          (mentor tambah       │
   │           progres pertama)    ▼
   └──▶ (upload bukti → admin     IN_PROGRESS ──(progres 100%)──▶ COMPLETED
         konfirmasi → PAID)              │
                                         └──(batal/invalid)──▶ CANCELLED
```

| Status | Arti |
|---|---|
| `PENDING` | Pesanan dibuat, pembayaran belum lunas |
| `PAID` | Pembayaran lunas & dikonfirmasi |
| `PROCESSING` | Admin menandai pesanan sedang diproses |
| `IN_PROGRESS` | Mentor sudah menginput progres (otomatis saat progres pertama dibuat) |
| `COMPLETED` | Selesai (otomatis saat progres mencapai 100% **atau** semua tahapan roadmap berstatus SELESAI) |
| `CANCELLED` | Dibatalkan |

---

## 2. Alur Mahasiswa

```
Buka situs → Daftar / Login
   → Lihat halaman Paket
   → Pilih paket → Checkout
   → Bayar (Midtrans ATAU transfer manual)
   → Dashboard: pantau status & progres
   ↔ Hubungkan Telegram untuk notifikasi
   → (opsional) Kirim testimoni
```

### 2.1 Daftar Akun
1. Buka **/register** atau klik "Daftar gratis" di halaman login.
2. Isi **nama** (min. 3 karakter), **email**, dan **password** (min. 6 karakter).
3. Klik daftar → otomatis masuk ke dashboard.
4. Akun dibuat dengan peran default `MAHASISWA`.

### 2.2 Login
1. Buka **/login**, isi email & password.
2. Jika belum punya akun, klik "Daftar gratis".
3. Login berhasil diarahkan ke **/dashboard**. Jika belum login, semua halaman `/dashboard/*` otomatis diarahkan ke `/login`.

### 2.3 Memilih Paket & Checkout
1. Buka halaman **Paket** (`/paket`) — tampil dua kategori:
   - **Bimbingan Skripsi**: Basic, Pro, Premium, Konsultasi Awal.
   - **Pembuatan Sistem**: Web Landing, Sistem Pelaporan Komunitas + GIS, Aplikasi Kustom.
2. Klik paket → halaman **Checkout** (`/checkout/[id]`).
3. Isi **catatan kebutuhan** (opsional, mis. judul skripsi / spesifikasi sistem).
4. Klik **"Lanjut ke Pembayaran"**.

### 2.4 Pembayaran
Pesanan dibuat dengan status `PENDING` dan nomor order unik (`SKP-YYYYMMDD-XXXX`).

**Opsi A — Midtrans (otomatis):**
- Sistem membuat transaksi Snap Midtrans lalu mengarahkan ke halaman pembayaran Midtrans.
- Metode: kartu kredit/debit, transfer bank, e-wallet, QRIS.
- Setelah sukses, webhook Midtrans memproses status → pembayaran `PAID`, pesanan otomatis menjadi `PAID`.
- Jika server key Midtrans belum valid, sistem **otomatis fallback ke transfer manual** (tidak error).

**Opsi B — Transfer Manual:**
- Sistem mengarahkan ke `/dashboard?mode=manual`.
- Mahasiswa **upload bukti transfer** (screenshot/pdf) dari halaman dashboard pesanan (`/dashboard/orders/[id]`).
- Admin mengonfirmasi manual (set status → `PAID`).

> Notifikasi ke admin (via Telegram) dikirim otomatis saat pesanan baru dibuat dan pembayaran masuk.

### 2.5 Dashboard Mahasiswa
Menu: **Beranda** dan **Pesanan Saya**.

- **Beranda** (`/dashboard`): ringkasan statistik (Total Pesanan, Sedang Berjalan, Selesai), progres terbaru, tombol hubungkan Telegram, dan daftar pesanan dengan persentase progres.
- **Detail Pesanan** (`/dashboard/orders/[id]`): **Roadmap Penyusunan Skripsi** (9 tahapan dari persiapan hingga revisi akhir dengan badge status tiap tahapan + persentase otomatis), timeline progres lengkap (judul tahapan, %, tanggal, nama mentor), ringkasan (harga, tipe, durasi, mentor, status bayar, bukti pembayaran), tombol upload bukti (khusus transfer manual yang masih `PENDING`).

### 2.6 Roadmap Penyusunan Skripsi (untuk mahasiswa)

Roadmap menampilkan **9 tahapan** baku penyusunan skripsi dari awal sampai selesai:

| # | Tahapan | Isi |
|---|---|---|
| 1 | Persiapan Awal | Pedoman penulisan, pemilihan topik, referensi awal |
| 2 | Pengajuan Judul | Pengajuan & pengesahan judul |
| 3 | BAB 1 — Pendahuluan | Latar belakang, rumusan masalah, tujuan, manfaat |
| 4 | BAB 2 — Kajian Pustaka | Landasan teori & penelitian relevan |
| 5 | BAB 3 — Metode Penelitian | Jenis penelitian, sampel, teknik analisis data |
| 6 | BAB 4 — Hasil & Pembahasan | Penyajian data & pembahasan hasil |
| 7 | BAB 5 — Kesimpulan & Saran | Kesimpulan & saran |
| 8 | Sidang / Ujian Skripsi | Seminar hasil & ujian |
| 9 | Revisi Akhir & Penjilidan | Revisi pasca-sidang & penjilidan |

- Status tiap tahapan: **Belum Dimulai** ⚪, **Dikerjakan** 🔵, **Revisi** 🟡, **Selesai** 🟢 (ditetapkan mentor/admin).
- Persentase roadmap dihitung otomatis dari status seluruh tahapan (Dikerjakan = 50%, Revisi = 75%, Selesai = 100% per tahapan).
- Catatan dari mentor tampil di bawah setiap tahapan.

### 2.7 Notifikasi Telegram
1. Klik **"Buka Bot & /link -mu"** di dashboard → buka bot di Telegram.
2. Di bot, ketik: `/link nama@email.com` (email yang dipakai daftar).
3. Akun terhubung → otomatis menerima notifikasi:
   - Pesanan aktif 🚀
   - Progres bimbingan terbaru 📈
   - Update status pembayaran ℹ️
4. Cek status kapan saja dengan `/status`.

### 2.8 Testimoni
- Di dashboard terdapat form **"Bagikan Pengalaman Kamu"**.
- Pilih rating (bintang) + tulis testimoni.
- Testimoni tampil di halaman publik **setelah disetujui admin**.

---

## 3. Alur Mentor

```
Login (role MENTOR)
   → Klien Saya / Pesanan (hanya pesanan yang ditugaskan)
   → Buka detail klien
   → Perbarui status tahapan Roadmap (Persiapan → … → Sidang → Revisi akhir)
   → (opsional) Tambah Progres (judul tahapan, catatan, persentase 0–100%)
```

### 3.1 Melihat Pesanan
- **Klien Saya** (`/dashboard/mentor`): daftar status ringkasan.
- **Pesanan** (`/dashboard/mentor/orders`): tabel seluruh pesanan yang ditugaskan kepada mentor (`mentorId` = id mentor).

### 3.2 Roadmap Penyusunan Skripsi (fitur utama mentor)
1. Buka detail pesanan (`/dashboard/mentor/orders/[id]`).
2. Pada kartu **Roadmap Penyusunan Skripsi**, klik **"Ubah status"** di setiap tahapan.
3. Pilih status `BELUM_DIMULAI / DIKERJAKAN / REVISI / SELESAI` dan isi **catatan** untuk mahasiswa (opsional).
4. Klik **"Simpan"**. Efek otomatis:
   - Badge status & persentase roadmap terbarui (terlihat langsung oleh mahasiswa).
   - Jika pesanan berstatus `PAID` → otomatis `IN_PROGRESS` (pesanan "aktif") saat tahapan mulai dikerjakan.
   - Jika **semua 9 tahapan** berstatus `SELESAI` → pesanan otomatis `COMPLETED`.
5. Mentor hanya bisa memperbarui pesanan yang memang ditugaskan kepadanya (admin boleh untuk semua).

### 3.3 Menambah Progres
1. Buka detail pesanan (`/dashboard/mentor/orders/[id]`).
2. Isi **judul tahapan** (min. 3 karakter), **catatan** (opsional), dan geser **persentase** (langkah 5%, maks 100%).
3. Klik **"Simpan Progres"**.
4. Efek otomatis:
   - Progres tersimpan & ditampilkan di timeline klien.
   - Jika pesanan berstatus `PAID` → berubah otomatis menjadi `IN_PROGRESS`.
   - Jika persentase **100%** → pesanan otomatis `COMPLETED`.
   - Notifikasi dikirim ke mahasiswa (jika Telegram sudah terhubung).

---

## 4. Alur Admin

```
Login (role ADMIN)
   → Ringkasan
   → Pesanan (kelola status & mentor)
   → Paket & Harga
   → Pengguna
   → Artikel Blog
   → Testimoni
```

### 4.1 Ringkasan (`/dashboard/admin`)
Statistik umum seluruh pesanan.

### 4.2 Kelola Pesanan (`/dashboard/admin/orders`)
1. Lihat tabel semua pesanan (kode, klien, paket, total, mentor, status, status bayar).
2. Klik **"Kelola →"** pada baris pesanan.
3. Di halaman detail, menu **"Kelola Status Pesanan"**:
   - Ubah **status**: `PENDING → PAID → PROCESSING → IN_PROGRESS → COMPLETED / CANCELLED`.
   - Tetapkan **mentor** penanggung jawab.
4. Klik **"Simpan Perubahan"**.
5. Efek otomatis:
   - Jika status diubah ke `PAID` dari `PENDING`: pembayaran ditandai `PAID` + waktu bayar tersimpan, notifikasi dikirim ke admin & mahasiswa ("pesanan sudah aktif").
   - Perubahan status lain mengirim notifikasi status ke mahasiswa.
6. Di halaman detail yang sama, admin juga dapat memperbarui **Roadmap Penyusunan Skripsi** (sama seperti mentor) untuk memantau/menyelesaikan tahapan.

### 4.3 Paket & Harga (`/dashboard/admin/packages`)
Tambah / ubah / nonaktifkan paket (nama, tipe `BIMBINGAN`/`PEMBUATAN`, harga, durasi, fitur, deskripsi).

### 4.4 Pengguna (`/dashboard/admin/users`)
Daftar pengguna serta ubah peran (`MAHASISWA` / `MENTOR` / `ADMIN`).

### 4.5 Artikel Blog (`/dashboard/admin/posts`)
Tambah / ubah / hapus artikel blog yang tampil di halaman publik /blog.

### 4.6 Testimoni (`/dashboard/admin/testimonials`)
Setujui / tolak / hapus testimoni mahasiswa sebelum tampil di publik.

---

## 5. Bot Telegram

Bot mulai saat `npm run dev` (skrip `src/bot/run.ts`). Jika token valid, bot online dan siap long-polling.

| Perintah | Fungsi |
|---|---|
| `/start` | Sambutan & daftar perintah |
| `/paket` | Daftar paket & harga |
| `/link email@x.com` | Hubungkan akun web dengan chat Telegram |
| `/status` | Cek status semua pesanan |
| `/kontak` | Kontak admin |
| `/help` | Bantuan perintah |
| teks bebas | Jawaban FAQ otomatis (harga, paket, bayar, daftar, sistem, kontak, dll.) |

**Notifikasi otomatis ke admin (chat id dari `TELEGRAM_ADMIN_CHAT_ID`):**
- Pesanan baru 📦
- Pembayaran masuk 💰
- Pembayaran dikonfirmasi ✅

**Notifikasi otomatis ke mahasiswa (jika `/link` sudah dilakukan):**
- Pesanan sudah aktif 🚀
- Progres terbaru 📈
- Update status pembayaran/status ℹ️

---

## 6. Alur Notifikasi (ringkas)

| Kejadian | Notifikasi |
|---|---|
| Pesanan dibuat | Admin |
| Pembayaran sukses (Midtrans/webhook) | Admin |
| Admin set status `PAID` | Admin + Mahasiswa |
| Mentor menambah progres | Mahasiswa |
| Mentor memulai tahapan roadmap (pesanan `PAID` → `IN_PROGRESS`) | Mahasiswa ("pesanan aktif") |
| Semua tahapan roadmap `SELESAI` (otomatis `COMPLETED`) | Mahasiswa |
| Upload bukti transfer manual | Menunggu konfirmasi admin |

---

## 7. Akun Uji (hasil seed)

| Role | Email | Password |
|---|---|---|
| ADMIN | `admin@skripsi.id` | `admin123` |
| MENTOR | `mentor@skripsi.id` | `mentor123` |
| MAHASISWA | `mahasiswa@skripsi.id` | `mahasiswa123` |

---

## 8. Catatan Penting

- Cookie sesi aplikasi ini memakai nama khusus `skripsi.*` agar tidak bentrok dengan aplikasi lain yang berjalan di `localhost` pada port berbeda (mis. `localhost:3001`).
- Jika Midtrans (sandbox/live) gagal membuat transaksi (mis. key belum diisi), pembayaran otomatis menjadi **transfer manual** — alur aplikasi tetap berjalan.
- Persentase progres yang menurun akan meminta konfirmasi pada mentor.

