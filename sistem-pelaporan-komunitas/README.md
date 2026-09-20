# Sistem Pelaporan Komunitas Berbasis Web dan GIS

Aplikasi skripsi — **Sistem Pelaporan Komunitas Berbasis Web dan GIS** (studi kasus Kecamatan Palmerah, Jakarta Barat). Dibangun dengan Next.js 16 (App Router), Prisma 7 + MySQL (MariaDB), NextAuth v5, dan Leaflet (GIS).

## Fitur

- **Publik**: beranda, peta interaktif (`/peta`) dengan marker berstatus + clustering, cek status laporan via kode tiket (`/cek`).
- **Masyarakat**: daftar/login, buat laporan (kategori, wilayah, GPS/klik peta, foto), pantau status & notifikasi.
- **Petugas**: antrean tugas, tindak lanjut, tandai selesai.
- **Admin**: verifikasi/tolak & tentukan petugas, prioritas, kelola user/kategori/wilayah, **statistik** (recharts), **ekspor rekap PDF & CSV** (A4, nomor halaman → `@react-pdf/renderer`).
- **Keamanan**: otorisasi dua lapis (`src/proxy.ts` + `auth()` di tiap API), sandi `bcryptjs`, validasi `zod`.
- Kode tiket `LAP-YYYYMMDD-NNNN` (tabel `Counter`, transaksi atomik).

## Menjalankan

```bash
npm install
npx prisma generate          # Client ke src/generated/prisma
npm run seed                 # Akun & data dasar (lihat .env DATABASE_URL)
npm run seed:demo            # 14 laporan contoh untuk demo/statistik
npm run dev                  # http://localhost:3001
```

Build produksi: `npm run build && npm start` (port 3001).

## Akun uji

| Peran | Email | Sandi |
| --- | --- | --- |
| Admin | admin@pelaporan.id | admin123 |
| Petugas | petugas@pelaporan.id | petugas123 |
| Masyarakat | masyarakat@pelaporan.id | masyarakat123 |

## Lingkungan

- `.env` — `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`/`NEXTAUTH_URL` (lihat `.env.example`).
- Migrasi DB: `prisma/migrations/`; backup: `backup/pelaporan_db-YYYYMMDD.sql` (dari `mysqldump`).
- GIS membutuhkan internet untuk tile OpenStreetMap.

## Dokumentasi pendukung

- `docs/pengujian.md` — matriks black-box (30 kasus) + uji penerimaan.
- `docs/skenario-demo-sidang.md` — skenario demo untuk sidang.
- Generator template skripsi BINUS: folder `../format-skripsi/` (output `template-skripsi-binus.docx`).