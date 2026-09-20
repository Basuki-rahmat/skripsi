# Pengujian Perangkat Lunak — Sistem Pelaporan Komunitas

Bahan Lampiran Bab IV Skripsi. Pengujian dilakukan pada build produksi `next build` + `next start` (atau `next dev -p 3001`), browser Chrome/Edge.

Akun uji:

| Peran | Email | Sandi |
| --- | --- | --- |
| Admin | admin@pelaporan.id | admin123 |
| Petugas | petugas@pelaporan.id | petugas123 |
| Masyarakat | masyarakat@pelaporan.id | masyarakat123 |

## A. Matriks Pengujian Fungsional (Black-Box)

Metode: *Black-box testing*, teknik *Equivalence Partitioning* + *Boundary Value Analysis*.

| No | Fitur / Modul | Skenario Uji | Langkah | Hasil yang Diharapkan | Status |
| --- | --- | --- | --- | --- | --- |
| U-01 | Registrasi warga | Registrasi data valid | Isi `daftar` dengan email unik | Akun dibuat, diarahkan ke `/login`, data tersimpan di DB | ✅ |
| U-02 | Registrasi warga | Email duplikat | Daftar dengan email admin@… | Muncul pesan "Email sudah terdaftar", tidak ada data ganda | ✅ |
| U-03 | Registrasi warga | Field wajib kosong | Submit form kosong | Validasi menampilkan pesan per field | ✅ |
| U-04 | Login (3 peran) | Login berhasil | Login masing-masing akun | Redirect ke dashboard sesuai peran | ✅ |
| U-05 | Login | Sandi salah | Login dengan sandi salah | Pesan "Sandi atau email salah" | ✅ |
| U-06 | RBAC / Otorisasi | Akses URL langsung | Tanpa login buka `/app/admin`, `/app/petugas`. Login masyarakat buka `/app/admin` | Redirect ke `/login` / halaman 403; menu hanya sesuai peran | ✅ |
| U-07 | Buat laporan | Input valid + status awal | Login masyarakat, isi form lengkap | Muncul kode tiket `LAP-YYYYMMDD-000N`, status `MENUNGGU_VERIFIKASI`, notifikasi tercipta | ✅ |
| U-08 | Buat laporan | Kategori/wilayah wajib | Submit tanpa kategori & wilayah | Blokir submit, tampil pesan validasi | ✅ |
| U-09 | Buat laporan | Unggah lampiran foto | Lampirkan 3 foto | Foto tersimpan, miniatur tampil sebelum kirim | ✅ |
| U-10 | Buat laporan | Lokasi GPS otomatis | Izinkan geolocation browser | Koordinat terisi, reverse-geocode alamat muncul | ✅ |
| U-11 | Buat laporan | Pilih titik di peta | Klik peta pada form | Marker pindah, lat/lng terisi | ✅ |
| U-12 | Nomor tiket | Urutan per hari | Buat 2 laporan di hari sama | `LAP-…-0001` lalu `LAP-…-0002` | ✅ |
| U-13 | Verifikasi admin | Verifikasi + tentukan petugas | Admin di `/app/admin/verifikasi` klik "Verifikasi" | Status → `DIPROSES`, `assignedTo` terisi, petugas melihat queue, notifikasi pelapor | ✅ |
| U-14 | Verifikasi admin | Tolak laporan + catatan | Klik "Tolak" + isi catatan | Status → `VERIFIKASI_DITOLAK`, catatan tersimpan | ✅ |
| U-15 | Prioritas | Ubah prioritas | Admin set prioritas `TINGGI` | Tampil badge prioritas di semua daftar | ✅ |
| U-16 | Petugas | Tindak lanjut | Login petugas, buka tugas, tulis catatan | Status → `DITINDAKLANJUTI`, riwayat follow-up tersimpan | ✅ |
| U-17 | Petugas | Selesaikan laporan | Klik "Tandai Selesai" | Status → `SELESAI`, `closedAt` terisi, notifikasi pelapor | ✅ |
| U-18 | Notifikasi | Pembaruan status | Lihat dashboard masyarakat | Jumlah notifikasi meningkat sesuai status | ✅ |
| U-19 | Cek status publik | Kode tiket valid | `/cek` isi `LAP-…-0001` | Status & detail tampil tanpa login | ✅ |
| U-20 | Cek status publik | Kode tidak ditemukan | Isi kode salah | Info "laporan tidak ditemukan" | ✅ |
| U-21 | Peta publik | Klasternisasi marker | Buka `/peta` | Marker ter-cluster, warna sesuai status | ✅ |
| U-22 | Peta publik | Filter | Pilih kategori/wilayah/status | Marker terfilter sesuai pilihan | ✅ |
| U-23 | Statistik admin | Grafik & agregasi | `/app/admin/statistik` | Total, per bulan, per kategori, per wilayah, prioritas, rata-rata hari penyelesaian sesuai data | ✅ |
| U-24 | Ekspor CSV | Unduh rekap | Klik "Ekspor CSV" | File `.csv` UTF-8 (BOM) terunduh, kolom lengkap | ✅ |
| U-25 | Ekspor PDF | Unduh rekap | Klik "Ekspor PDF" | File `.pdf` A4 landscape + nomor halaman terunduh | ✅ |
| U-26 | Ekspor | Akses non-admin | Akses `/api/export/csv` akun masyarakat | HTTP 403 | ✅ |
| U-27 | Kelola kategori | Tambah/ubah/nonaktif | Admin di `/app/admin/kategori` | Data berubah & tampil di form laporan | ✅ |
| U-28 | Kelola wilayah | Tambah/ubah GPS | Admin di `/app/admin/wilayah` | Titik baru tampil di peta | ✅ |
| U-29 | Kelola pengguna | Ubah peran/nonaktif | Admin di `/app/admin/pengguna` | Perubahan berlaku saat login berikutnya | ✅ |
| U-30 | Responsivitas | Tampilan mobile | Buka halaman utama di lebar ≤ 375px | Layout tidak patah, header menu tetap aksesibel | ✅ |

Catatan: uji fungsi peta (U-21, U-22) bergantung koneksi internet (tile OpenStreetMap).

## B. Uji Penerimaan Pengguna (UAT)

Dilakukan dengan skenario nyata dari 3 peran pengguna. Simulator dianggap "LULUS" jika ≥ 90% skenario berjalan sesuai hasil yang diharapkan.

| Peran | Skenario UAT | Hasil yang Diharapkan | Accept |
| --- | --- | --- | --- |
| Masyarakat | Melaporkan kerusakan jalan dengan foto & lokasi GPS, lalu mengecek status melalui kode tiket | Laporan tersimpan, tiket muncul, status dapat dipantau sampai selesai | LULUS |
| Masyarakat | Menerima notifikasi saat status berubah | Notifikasi muncul di dashboard | LULUS |
| Petugas | Melihat daftar laporan yang ditugaskan, melakukan tindak lanjut, dan menandai selesai | Antrean tugas terisi dan status laporan berubah sesuai alur | LULUS |
| Admin | Memverifikasi/tolak laporan, mengatur prioritas, dan mengunduh rekap PDF/CSV | Alur verifikasi berjalan, file rekap terunduh | LULUS |
| Semua | Menggunakan peta untuk melihat sebaran laporan | Marker/klaster menampilkan sebaran sesuai lokasi | LULUS |

### Form Uji Penerimaan (diisi penguji/user)

- Tanggal pelaksanaan: …
- Lokasi/daring: …
- Kelas penguji: Masyarakat ☐ Petugas ☐ Admin ☐
- Skenario yang diuji: …
- Hasil: LULUS ☐ / BELUM ☐ — catatan: …
- Tanda tangan penguji: …

## C. Pengujian Non-Fungsional

| Aspek | Metode | Hasil |
| --- | --- | --- |
| Keamanan | RBAC di `proxy.ts` + `auth()` di setiap api/halaman admin | Akses lintas peran ditolak |
| Kinerja | `next build` (optimasi produksi), prisma query terindeks | Build sukses, halaman dimuat pre-render |
| Kompatibilitas | Chrome & Edge, layar 375px–1920px | Responsif |
| Pemulihan data | MySQL dump | Restore sukses (lihat `docs/database.md`) |