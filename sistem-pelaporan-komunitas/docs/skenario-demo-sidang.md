# Skenario Demo Sidang — Sistem Pelaporan Komunitas

Durasi: ± 6 menit. Gunakan browser (Chrome/Edge, ukuran 1280px+), pastikan internet aktif (tile OpenStreetMap) dan aplikasi berjalan `npm run dev` / `npm run build && npm run start` di port 3001.

## Alur 1 — Halaman Publik (90 detik)

1. Buka `http://localhost:3001` → landing page menjelaskan sistem (tujuan, alur pelaporan).
2. **Peta interaktif** → menu "Peta Laporan": tunjukkan klaster marker berwarna status, zoom masuk agar marker terpisah, terapkan filter kategori + status.
3. **Cek Status** → menu "Cek Status": ketik kode tiket `DEMO-1005` → tampil status "DIPROSES" beserta detail lokasi.

## Alur 2 — Pelaporan oleh Warga (90 detik)

4. Menu "Masuk" → login `masyarakat@pelaporan.id` / `masyarakat123`.
5. Dashboard → "Buat Laporan Baru":
   - Pilih kategori (mis. Infrastruktur Jalan) & wilayah (mis. Palmerah),
   - isi judul & deskripsi, izinkan **GPS**, klik **peta** untuk memastikan titik,
   - lampirkan 1–3 foto,
   - submit → tampil kode tiket `LAP-…-0002` dan status awal.
6. Kembali ke dashboard → notifikasi bertambah.

## Alur 3 — Verifikasi & Prioritas oleh Admin (45 detik)

7. Tanpa logout, buka mode penyamaran *incognito* → login `admin@pelaporan.id` / `admin123`.
8. **Laporan → Perlu Verifikasi**: verifikasi laporan baru → pilih petugas → status "DIPROSES". Tunjukkan juga tombol "Tolak" dengan catatan.
9. Set prioritas laporan contoh menjadi `TINGGI`.

## Alur 4 — Tindak Lanjut oleh Petugas (60 detik)

10. *Incognito* kedua → login `petugas@pelaporan.id` / `petugas123`.
11. Dashboard → quartier tugas ("Laporan Saya") berisi laporan yang baru diverifikasi.
12. Buka detail → tulis catatan tindak lanjut → status "DITINDAKLANJUTI" → "Tandai Selesai" → status "SELESAI".

## Alur 5 — Statistik & Ekspor (60 detik)

13. *Incognito* admin → menu **Statistik**: total laporan, grafik bulanan, sebaran status & kategori, wilayah terpadat, rata-rata waktu penyelesaian.
14. Klik **Ekspor PDF** dan **Ekspor CSV** → file terbuka, tunjukkan nomor halaman pada PDF.

## Alur 6 — Penutup (45 detik)

15. Cek status tiket tadi di `/cek` → kini tampil "SELESAI" (bukti siklus end-to-end).
16. Tampilkan skema alur: Masyarakat → Laporan → Kecamatan (Admin/Petugas) → Tindak lanjut → Selesai, dan bahwa seluruh data tersimpan di MySQL.

## Poin yang Berpotensi Ditanya Dosen

- **Arsitektur**: Next.js 16 (App Router) + Prisma ORM + MySQL (MariaDB) via Laragon; NextAuth v5 (JWT, 3 peran).
- **GIS**: Leaflet + React-Leaflet + MarkerCluster; marker dibedakan warna status; data koordinat disimpan `lat/lng`.
- **Keamanan**: autorisasi dua lapis (middleware `proxy.ts` + `auth()` di API), sandi `bcryptjs`, validasi `zod`.
- **Keunikan**: pencarian status via kode tiket tanpa login, klaster peta, ekspor rekap PDF/CSV untuk pelaporan admin.

> Catatan demo: jika jaringan tile OSM bermasalah, siapkan vodafone/mobile hotspot; data demo dapat diperbarui ulang dengan `npm run seed:demo`.