# Sistem Pelaporan Komunitas Berbasis Web dan GIS

## Pengembangan Sistem Pelaporan Komunitas Berbasis Web dan GIS untuk Melaporkan dan Memantau Permasalahan Masyarakat

> **Dokumen Rencana Produk & Pengembangan Skripsi**\
> Target utama: **Submit Skripsi Januari 2027**\
> Target Sidang & Revisi: **Februari--Maret 2027**\
> Target Wisuda: **Agustus 2027**

------------------------------------------------------------------------

## 1. Deskripsi Produk

**Sistem Pelaporan Komunitas Berbasis Web dan GIS** merupakan aplikasi
berbasis web yang dirancang untuk membantu masyarakat melaporkan
berbagai permasalahan di lingkungan sekitar sekaligus membantu
petugas/admin melakukan verifikasi, pemantauan, dan tindak lanjut
laporan.

Sistem menggabungkan:

-   Pelaporan permasalahan masyarakat.
-   Informasi lokasi berbasis koordinat/GPS.
-   Peta interaktif berbasis GIS.
-   Verifikasi laporan.
-   Pengelolaan tindak lanjut.
-   Pemantauan status laporan.
-   Dashboard statistik.
-   Riwayat penanganan.

Konsep utama sistem:

``` text
Masyarakat
    │
    ▼
Membuat Laporan
    │
    ▼
Lokasi + Deskripsi + Foto
    │
    ▼
Verifikasi
    │
    ▼
Penugasan / Tindak Lanjut
    │
    ▼
Update Status
    │
    ▼
Selesai
    │
    ▼
Monitoring melalui Dashboard & GIS
```

------------------------------------------------------------------------

## 2. Latar Belakang

Permasalahan masyarakat seperti jalan rusak, fasilitas umum, sampah,
penerangan, drainase, lingkungan, dan permasalahan lainnya membutuhkan
mekanisme pelaporan yang mudah, terdokumentasi, dan dapat dipantau.

Pelaporan secara manual dapat menyebabkan informasi sulit dihimpun,
lokasi kejadian kurang terdokumentasi, proses tindak lanjut sulit
dipantau, serta riwayat penanganan tidak tersusun secara terpusat.

Sistem ini dikembangkan sebagai sarana digital yang memungkinkan
masyarakat menyampaikan laporan secara terstruktur dengan menyertakan
lokasi permasalahan. Data laporan kemudian dapat divisualisasikan
melalui peta GIS sehingga membantu pengguna melihat persebaran
permasalahan berdasarkan lokasi, kategori, dan status.

------------------------------------------------------------------------

## 3. Tujuan

### 3.1 Tujuan Umum

Mengembangkan sistem pelaporan komunitas berbasis web dan GIS untuk
membantu proses pelaporan, pemantauan, dan pengelolaan permasalahan
masyarakat secara terstruktur.

### 3.2 Tujuan Khusus

1.  Menyediakan media pelaporan permasalahan masyarakat berbasis web.
2.  Mencatat lokasi laporan menggunakan koordinat/GPS.
3.  Menampilkan persebaran laporan dalam peta GIS.
4.  Membantu petugas melakukan verifikasi laporan.
5.  Mendukung proses tindak lanjut laporan.
6.  Menyediakan informasi status laporan kepada masyarakat.
7.  Menyediakan dashboard monitoring bagi admin/petugas.
8.  Menyimpan riwayat laporan dan tindak lanjut secara terstruktur.

------------------------------------------------------------------------

## 4. Sasaran Pengguna

### Masyarakat

Masyarakat dapat:

-   Registrasi dan login.
-   Membuat laporan.
-   Menentukan lokasi kejadian.
-   Mengunggah foto pendukung.
-   Melihat nomor tiket laporan.
-   Melihat status laporan.
-   Melihat riwayat laporan.

### Petugas

Petugas dapat:

-   Melihat laporan yang telah diverifikasi.
-   Melihat detail lokasi pada peta.
-   Melakukan tindak lanjut.
-   Mengubah status laporan.
-   Menambahkan catatan penanganan.
-   Mengunggah bukti tindak lanjut.
-   Melihat riwayat penanganan.

### Admin

Admin dapat:

-   Mengelola pengguna.
-   Mengelola kategori permasalahan.
-   Mengelola wilayah.
-   Mengelola laporan.
-   Memverifikasi laporan.
-   Mengelola petugas.
-   Memantau dashboard.
-   Melihat statistik.
-   Mengelola data GIS.

------------------------------------------------------------------------

# 5. Ruang Lingkup Sistem

## 5.1 Modul Publik

-   Beranda.
-   Informasi sistem.
-   Cara membuat laporan.
-   Daftar kategori permasalahan.
-   Peta permasalahan.
-   Statistik laporan.
-   Cek status laporan.
-   Informasi kontak.

## 5.2 Modul Masyarakat

-   Registrasi.
-   Login.
-   Profil.
-   Buat laporan.
-   Lokasi laporan.
-   Upload foto.
-   Riwayat laporan.
-   Detail laporan.
-   Monitoring status.
-   Nomor tiket laporan.

## 5.3 Modul Petugas

-   Dashboard petugas.
-   Daftar laporan.
-   Detail laporan.
-   Peta lokasi.
-   Verifikasi/tindak lanjut sesuai hak akses.
-   Update status.
-   Catatan penanganan.
-   Upload bukti penanganan.
-   Riwayat tindakan.

## 5.4 Modul Admin

-   Dashboard.
-   Manajemen pengguna.
-   Manajemen petugas.
-   Manajemen kategori.
-   Manajemen wilayah.
-   Manajemen laporan.
-   Verifikasi laporan.
-   Manajemen tindak lanjut.
-   Statistik.
-   Monitoring GIS.
-   Pengaturan sistem.

------------------------------------------------------------------------

# 6. Fitur Utama

## 6.1 Pelaporan Masyarakat

Form laporan minimal terdiri dari:

-   Judul laporan.
-   Kategori permasalahan.
-   Deskripsi.
-   Foto/video jika diperlukan.
-   Lokasi.
-   Koordinat latitude.
-   Koordinat longitude.
-   Wilayah.
-   Waktu laporan.

Setiap laporan memiliki **nomor tiket** sebagai identitas laporan.

## 6.2 Kategori Permasalahan

Kategori dapat dikembangkan sesuai kebutuhan penelitian, misalnya:

-   Jalan.
-   Sampah.
-   Drainase.
-   Penerangan.
-   Fasilitas umum.
-   Lingkungan.
-   Air.
-   Keamanan lingkungan.
-   Infrastruktur.
-   Lainnya.

Kategori bersifat dinamis dan dapat dikelola oleh admin.

## 6.3 Status Laporan

Status utama:

``` text
Dikirim
   ↓
Diverifikasi
   ↓
Diproses
   ↓
Ditindaklanjuti
   ↓
Selesai
```

Status tambahan yang dapat digunakan:

-   Ditolak.
-   Tidak valid.
-   Menunggu informasi.
-   Ditunda.

## 6.4 GIS / Peta Interaktif

Fitur GIS:

-   Peta interaktif.
-   Marker lokasi laporan.
-   Detail laporan pada marker.
-   Filter kategori.
-   Filter status.
-   Filter wilayah.
-   Pencarian lokasi.
-   Persebaran laporan.
-   Clustering marker jika data banyak.
-   Heatmap sebagai pengembangan lanjutan.

## 6.5 Dashboard Monitoring

Dashboard menampilkan:

-   Total laporan.
-   Laporan baru.
-   Laporan diverifikasi.
-   Laporan sedang diproses.
-   Laporan selesai.
-   Laporan berdasarkan kategori.
-   Laporan berdasarkan wilayah.
-   Grafik perkembangan laporan.
-   Peta persebaran laporan.

## 6.6 Tindak Lanjut

Setiap laporan yang telah diverifikasi dapat memiliki:

-   Petugas penanggung jawab.
-   Catatan tindak lanjut.
-   Tanggal tindak lanjut.
-   Status pekerjaan.
-   Bukti penanganan.
-   Catatan penyelesaian.
-   Riwayat perubahan status.

------------------------------------------------------------------------

# 7. Alur Sistem

``` text
Masyarakat
    │
    ├── Registrasi / Login
    │
    └── Membuat Laporan
             │
             ├── Kategori
             ├── Deskripsi
             ├── Foto
             └── Lokasi GPS
                     │
                     ▼
              Sistem membuat tiket
                     │
                     ▼
                 Verifikasi
                     │
             ┌───────┴────────┐
             │                │
          Valid            Tidak Valid
             │                │
             ▼                ▼
          Diproses          Ditolak
             │
             ▼
       Tindak Lanjut
             │
             ▼
       Update Status
             │
             ▼
          Selesai
             │
             ▼
       Monitoring GIS
```

------------------------------------------------------------------------

# 8. Status dan Prioritas Laporan

## Status

  Status            Keterangan
  ----------------- ---------------------------------------------------
  Dikirim           Laporan baru dikirim masyarakat
  Diverifikasi      Laporan telah diperiksa
  Diproses          Laporan sedang ditangani
  Ditindaklanjuti   Tindakan terhadap laporan sedang/ telah dilakukan
  Selesai           Permasalahan telah dinyatakan selesai
  Ditolak           Laporan tidak dapat diproses
  Tidak Valid       Data laporan tidak memenuhi ketentuan

## Prioritas

Untuk pengembangan sistem dapat digunakan:

-   Rendah.
-   Sedang.
-   Tinggi.
-   Darurat.

Prioritas digunakan untuk membantu petugas mengelompokkan laporan
berdasarkan tingkat kebutuhan penanganan.

------------------------------------------------------------------------

# 9. Struktur Data Utama

Entitas utama yang disarankan:

``` text
User
 ├── id
 ├── nama
 ├── email
 ├── password
 ├── role
 └── status

Category
 ├── id
 ├── nama
 └── deskripsi

Region
 ├── id
 ├── nama
 └── kode

Report
 ├── id
 ├── nomor_tiket
 ├── user_id
 ├── category_id
 ├── region_id
 ├── judul
 ├── deskripsi
 ├── latitude
 ├── longitude
 ├── alamat
 ├── status
 ├── prioritas
 └── created_at

ReportMedia
 ├── id
 ├── report_id
 ├── file
 └── tipe

FollowUp
 ├── id
 ├── report_id
 ├── officer_id
 ├── catatan
 ├── status
 ├── bukti
 └── created_at

Notification
 ├── id
 ├── user_id
 ├── report_id
 ├── pesan
 └── status
```

Struktur tersebut merupakan rancangan awal dan dapat disesuaikan setelah
analisis kebutuhan dan konsultasi dosen pembimbing.

------------------------------------------------------------------------

# 10. Hak Akses

  Fitur                       Masyarakat       Petugas        Admin
  -------------------------- ------------ ------------------ -------
  Lihat informasi publik          ✓               ✓             ✓
  Registrasi                      ✓               \-           \-
  Buat laporan                    ✓               \-            ✓
  Lihat laporan sendiri           ✓               \-            ✓
  Lihat laporan penanganan        \-              ✓             ✓
  Verifikasi laporan              \-       Sesuai hak akses     ✓
  Update tindak lanjut            \-              ✓             ✓
  Kelola kategori                 \-              \-            ✓
  Kelola wilayah                  \-              \-            ✓
  Kelola pengguna                 \-              \-            ✓
  Dashboard                   ✓ terbatas          ✓             ✓
  Monitoring GIS                  ✓               ✓             ✓

------------------------------------------------------------------------

# 11. Rencana Teknologi

Teknologi final ditentukan setelah konsultasi dan penyesuaian kebutuhan
penelitian.

Contoh stack:

  Komponen         Teknologi
  ---------------- ------------------------------
  Frontend         Next.js / React
  Backend          Next.js API / Node.js
  Database         MySQL
  ORM              Prisma
  Authentication   Auth.js / sistem autentikasi
  GIS              Leaflet / OpenStreetMap
  Styling          Tailwind CSS
  Validasi         Zod
  Storage          Local/Object Storage
  Deployment       VPS / Cloud Hosting

> Stack teknologi merupakan rancangan awal dan dapat berubah berdasarkan
> hasil konsultasi dosen pembimbing serta kebutuhan implementasi.

------------------------------------------------------------------------

# 12. Keamanan Sistem

Keamanan menjadi bagian dari pengembangan:

-   Password hashing.
-   Authentication.
-   Role-based access control.
-   Validasi input.
-   Validasi file upload.
-   Pembatasan ukuran file.
-   Pembatasan tipe file.
-   Proteksi endpoint.
-   Session security.
-   Logging aktivitas.
-   Validasi data sebelum disimpan.
-   Backup database.

Data pribadi pengguna harus dikelola sesuai kebutuhan sistem dan prinsip
keamanan informasi yang relevan.

------------------------------------------------------------------------

# 13. Rencana Pengujian

## Functional Testing

Menguji:

-   Registrasi.
-   Login.
-   Pembuatan laporan.
-   Upload foto.
-   Pengambilan lokasi.
-   Pembuatan nomor tiket.
-   Verifikasi.
-   Update status.
-   Tindak lanjut.
-   Dashboard.
-   Peta GIS.

## Role Testing

Memastikan setiap pengguna hanya dapat mengakses fitur sesuai hak akses.

## GIS Testing

Menguji:

-   Marker.
-   Koordinat.
-   Peta.
-   Filter.
-   Detail lokasi.
-   Persebaran laporan.

## User Acceptance Test

Pengujian dilakukan untuk memastikan sistem sesuai dengan kebutuhan
pengguna.

------------------------------------------------------------------------

# 14. Rencana Kerja Skripsi

Timeline mengikuti target yang telah ditetapkan:

## Juli 2026 --- Proposal & Calon Dosen Pembimbing

Target:

-   Membuat proposal.
-   Menentukan permasalahan.
-   Studi literatur awal.
-   Menentukan metode.
-   Analisis awal sistem.
-   Membuat rancangan fitur.
-   Mencari calon dosen pembimbing.

## Agustus 2026 --- Submit Proposal

Target:

-   Finalisasi proposal.
-   Finalisasi judul dan ruang lingkup.
-   Finalisasi rancangan awal.
-   Prototype UI/UX.
-   Rancangan database.
-   Rancangan GIS.
-   Submit proposal ke Thesis Apps.

## September 2026 --- Analisis Sistem

Target:

-   Konsultasi skripsi.
-   Analisis kebutuhan.
-   Identifikasi aktor.
-   Use Case.
-   Flowchart.
-   ERD.
-   Rancangan proses bisnis.
-   Finalisasi kebutuhan sistem.

## Oktober 2026 --- Pengembangan Sistem Dasar

Target:

-   Setup project.
-   Database.
-   Authentication.
-   Role pengguna.
-   Dashboard dasar.
-   Modul kategori.
-   Modul wilayah.

## November 2026 --- Pengembangan Modul Pelaporan

Target:

-   Form laporan.
-   Nomor tiket.
-   Upload foto.
-   Lokasi GPS.
-   Data koordinat.
-   Riwayat laporan.
-   Detail laporan.

## Desember 2026 --- GIS & Monitoring

Target:

-   Peta interaktif.
-   Marker laporan.
-   Filter GIS.
-   Dashboard statistik.
-   Grafik laporan.
-   Monitoring status.
-   Modul tindak lanjut.

## Januari 2027 --- Finalisasi & Submit Skripsi

Target:

-   Pengujian sistem.
-   Perbaikan bug.
-   Konsultasi akhir.
-   Dokumentasi.
-   Finalisasi aplikasi.
-   Finalisasi laporan skripsi.
-   Submit skripsi.

## Februari--Maret 2027 --- Sidang & Revisi

Target:

-   Persiapan presentasi.
-   Persiapan demo aplikasi.
-   Sidang skripsi.
-   Perbaikan hasil sidang.
-   Finalisasi revisi.

## April--Juli 2027 --- Penyempurnaan

Target:

-   Penyempurnaan sistem.
-   Maintenance.
-   Dokumentasi.
-   Persiapan administrasi kelulusan.

## Agustus 2027 --- Wisuda

Target:

-   Wisuda.

------------------------------------------------------------------------

# 15. Milestone Produk

``` text
JUL 2026
Proposal
   │
   ▼
AGT 2026
Submit Proposal
   │
   ▼
SEP 2026
Analisis Sistem
   │
   ▼
OKT 2026
Core System
   │
   ▼
NOV 2026
Modul Pelaporan
   │
   ▼
DES 2026
GIS + Dashboard
   │
   ▼
JAN 2027
Testing + Finalisasi + Submit
   │
   ▼
FEB–MAR 2027
Sidang + Revisi
   │
   ▼
AGT 2027
Wisuda
```

------------------------------------------------------------------------

# 16. Prioritas Pengembangan MVP Skripsi

Agar ruang lingkup skripsi tetap realistis, fitur utama yang wajib
selesai:

### Prioritas 1 --- Wajib

-   Login/register.
-   Role masyarakat, petugas, admin.
-   Form pelaporan.
-   Kategori laporan.
-   Upload foto.
-   Lokasi GPS.
-   Nomor tiket.
-   Status laporan.
-   Dashboard.
-   Peta GIS.
-   Verifikasi.
-   Tindak lanjut.
-   Riwayat laporan.
-   Testing.

### Prioritas 2 --- Pengembangan

-   Filter GIS.
-   Statistik wilayah.
-   Clustering.
-   Notifikasi.
-   Prioritas laporan.
-   Bukti penanganan.
-   Export laporan.

### Prioritas 3 --- Pengembangan Lanjutan

-   Heatmap.
-   Integrasi WhatsApp/Telegram.
-   AI klasifikasi laporan.
-   Analisis tren.
-   Mobile application.
-   Integrasi dengan sistem eksternal.

Fitur Prioritas 3 tidak menjadi ketergantungan utama untuk target submit
skripsi Januari 2027.

------------------------------------------------------------------------

# 17. Indikator Keberhasilan

Sistem dianggap memenuhi target apabila:

1.  Masyarakat dapat membuat laporan.
2.  Sistem dapat menyimpan lokasi laporan.
3.  Laporan memiliki nomor tiket.
4.  Petugas/admin dapat memverifikasi laporan.
5.  Petugas dapat melakukan tindak lanjut.
6.  Status laporan dapat diperbarui.
7.  Masyarakat dapat memantau laporan.
8.  Laporan dapat ditampilkan pada peta GIS.
9.  Dashboard dapat menampilkan statistik.
10. Sistem dapat diuji dan menghasilkan dokumentasi pengujian.
11. Sistem dapat digunakan sebagai objek implementasi dan demonstrasi
    pada sidang.

------------------------------------------------------------------------

# 18. Output yang Ditargetkan

## Output Akademik

-   Proposal skripsi.
-   Dokumen analisis kebutuhan.
-   Use Case Diagram.
-   Activity/Flow Diagram.
-   ERD.
-   Desain UI/UX.
-   Implementasi sistem.
-   Dokumentasi pengujian.
-   Laporan skripsi.
-   Materi presentasi sidang.

## Output Produk

-   Website pelaporan komunitas.
-   Dashboard admin.
-   Dashboard petugas.
-   Dashboard masyarakat.
-   Modul pelaporan.
-   Modul GIS.
-   Modul monitoring.
-   Modul tindak lanjut.
-   Database sistem.
-   Dokumentasi penggunaan.

------------------------------------------------------------------------

# 19. Dokumentasi Sistem

Dokumentasi yang disiapkan:

``` text
docs/
├── analisis-kebutuhan.md
├── use-case.md
├── flowchart.md
├── erd.md
├── ui-ux.md
├── database.md
├── gis.md
├── api.md
├── testing.md
├── deployment.md
├── user-guide.md
└── admin-guide.md
```

------------------------------------------------------------------------

# 20. Struktur Project

Contoh struktur aplikasi:

``` text
sistem-pelaporan-komunitas/
│
├── public/
│   ├── images/
│   └── uploads/
│
├── src/
│   ├── app/
│   │   ├── page
│   │   ├── laporan/
│   │   ├── peta/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── petugas/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── map/
│   │   ├── dashboard/
│   │   ├── laporan/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── database
│   │   ├── auth
│   │   ├── validation
│   │   └── gis
│   │
│   └── types/
│
├── prisma/
│   ├── schema.prisma
│   └── seed
│
├── docs/
│
├── .env.example
├── package.json
└── README.md
```

Struktur tersebut adalah rancangan dan dapat disesuaikan dengan
framework yang digunakan.

------------------------------------------------------------------------

# 21. Rencana Dashboard

## Dashboard Masyarakat

``` text
Halo, Pengguna

[ Total Laporan ]

[ Baru ] [ Diproses ] [ Selesai ]

Laporan Terbaru
────────────────────────────
TK-00001 | Jalan Rusak | Diproses
TK-00002 | Sampah     | Selesai
```

## Dashboard Petugas

``` text
Dashboard Petugas

Laporan Masuk     : 25
Perlu Diproses    : 12
Sedang Ditangani  : 8
Selesai           : 45

[ Peta Laporan ]

[ Daftar Laporan Prioritas ]
```

## Dashboard Admin

``` text
Dashboard Admin

Total Laporan     : 1.250
Laporan Baru      : 35
Diproses          : 120
Selesai           : 1.050

[ Grafik Laporan ]
[ Statistik Kategori ]
[ Statistik Wilayah ]
[ Peta Persebaran ]
```

------------------------------------------------------------------------

# 22. Pengembangan GIS

GIS merupakan komponen utama produk.

Data laporan yang memiliki koordinat dapat ditampilkan sebagai titik
pada peta.

Contoh:

``` text
                    PETA
┌────────────────────────────────────┐
│                                    │
│       ●                            │
│                 ●                  │
│                                    │
│   ●                  ●             │
│                    ●               │
│                                    │
└────────────────────────────────────┘
```

Setiap marker dapat memberikan informasi:

-   Nomor laporan.
-   Kategori.
-   Judul.
-   Status.
-   Prioritas.
-   Lokasi.
-   Tanggal laporan.

Filter peta:

``` text
Kategori
[ Semua ▼ ]

Status
[ Semua ▼ ]

Wilayah
[ Semua ▼ ]

Periode
[ Semua ▼ ]
```

------------------------------------------------------------------------

# 23. Laporan dan Statistik

Sistem dapat menyediakan laporan:

-   Laporan berdasarkan periode.
-   Laporan berdasarkan kategori.
-   Laporan berdasarkan wilayah.
-   Laporan berdasarkan status.
-   Laporan berdasarkan prioritas.
-   Laporan selesai.
-   Laporan belum selesai.

Output dapat dikembangkan menjadi:

-   Tabel.
-   Grafik.
-   Peta.
-   Export PDF.
-   Export Excel/CSV.

------------------------------------------------------------------------

# 24. Notifikasi

Notifikasi dapat dikembangkan untuk:

### Masyarakat

-   Laporan berhasil dikirim.
-   Laporan diverifikasi.
-   Laporan diproses.
-   Laporan ditindaklanjuti.
-   Laporan selesai.

### Petugas

-   Laporan baru.
-   Laporan ditugaskan.
-   Laporan prioritas tinggi.
-   Perubahan laporan.

### Admin

-   Laporan baru.
-   Laporan yang menunggu verifikasi.
-   Aktivitas tindak lanjut.

Notifikasi eksternal seperti WhatsApp atau Telegram dapat menjadi
pengembangan lanjutan.

------------------------------------------------------------------------

# 25. Deployment

Tahap deployment:

1.  Menyiapkan domain.
2.  Menyiapkan hosting/VPS.
3.  Menyiapkan database production.
4.  Mengatur environment variable.
5.  Build aplikasi.
6.  Menjalankan migration.
7.  Mengaktifkan HTTPS.
8.  Konfigurasi storage upload.
9.  Testing production.
10. Backup database.

------------------------------------------------------------------------

# 26. Backup & Maintenance

Backup:

-   Backup database berkala.
-   Backup file laporan.
-   Backup konfigurasi.
-   Penyimpanan backup pada lokasi terpisah.

Maintenance:

-   Monitoring server.
-   Monitoring database.
-   Perbaikan bug.
-   Update dependency.
-   Pemeriksaan keamanan.
-   Optimasi performa.
-   Pengembangan fitur.

------------------------------------------------------------------------

# 27. Roadmap Pengembangan Setelah Skripsi

Setelah versi skripsi selesai, sistem dapat dikembangkan menjadi
platform yang lebih besar:

### Tahap 1

-   Notifikasi WhatsApp.
-   Notifikasi Telegram.
-   Export laporan.
-   Heatmap.
-   Statistik lanjutan.

### Tahap 2

-   Mobile application.
-   Push notification.
-   Analisis wilayah.
-   Dashboard multi-instansi.

### Tahap 3

-   AI klasifikasi laporan.
-   Prioritas otomatis.
-   Analisis tren permasalahan.
-   Integrasi sistem eksternal.
-   API publik/terbatas.

------------------------------------------------------------------------

# 28. Prinsip Pengembangan

Pengembangan sistem menggunakan prinsip:

-   **Mudah digunakan** --- masyarakat dapat melapor dengan sederhana.
-   **Terukur** --- setiap laporan memiliki status dan riwayat.
-   **Berbasis lokasi** --- laporan dapat divisualisasikan melalui GIS.
-   **Transparan** --- status laporan dapat dipantau.
-   **Terstruktur** --- data laporan tersimpan dalam database.
-   **Aman** --- akses dan data pengguna dilindungi.
-   **Dapat dikembangkan** --- arsitektur memungkinkan penambahan fitur.

------------------------------------------------------------------------

# 29. Checklist Target Skripsi

## Proposal

-   [ ] Judul final
-   [ ] Latar belakang
-   [ ] Rumusan masalah
-   [ ] Tujuan
-   [ ] Manfaat
-   [ ] Studi literatur
-   [ ] Metodologi
-   [ ] Rancangan sistem
-   [ ] Referensi
-   [ ] Submit proposal

## Pengembangan

-   [ ] Database
-   [ ] Authentication
-   [ ] Role
-   [ ] Modul laporan
-   [ ] Upload foto
-   [ ] GPS
-   [ ] GIS
-   [ ] Dashboard
-   [ ] Verifikasi
-   [ ] Tindak lanjut
-   [ ] Status laporan
-   [ ] Testing

## Sebelum Submit Skripsi

-   [ ] Sistem dapat dijalankan
-   [ ] Semua fitur utama selesai
-   [ ] Data pengujian tersedia
-   [ ] Dokumentasi selesai
-   [ ] Laporan skripsi selesai
-   [ ] Konsultasi akhir
-   [ ] Submit Januari 2027

## Sidang

-   [ ] Slide presentasi
-   [ ] Demo sistem
-   [ ] Demo GIS
-   [ ] Hasil pengujian
-   [ ] Persiapan pertanyaan
-   [ ] Sidang
-   [ ] Revisi

------------------------------------------------------------------------

# 30. Kesimpulan

**Sistem Pelaporan Komunitas Berbasis Web dan GIS** diarahkan sebagai
sistem yang menghubungkan masyarakat, petugas, dan admin dalam satu
platform pelaporan dan monitoring.

Fokus utama versi skripsi adalah:

> **Pelaporan masyarakat → Lokasi GPS → GIS → Verifikasi → Tindak lanjut
> → Monitoring status.**

Dengan pembatasan ruang lingkup tersebut, pengembangan dapat diarahkan
untuk mencapai target:

**Proposal → Agustus 2026**\
**Konsultasi & Pengembangan → September 2026--Januari 2027**\
**Submit Skripsi → Januari 2027**\
**Sidang & Revisi → Februari--Maret 2027**\
**Wisuda → Agustus 2027**

------------------------------------------------------------------------

## Status Project

**Status:** Perencanaan / Pengembangan Skripsi

**Target MVP:** Januari 2027

**Target Sidang:** Februari--Maret 2027

**Target Wisuda:** Agustus 2027

------------------------------------------------------------------------

## Lisensi

Lisensi aplikasi ditentukan sesuai kebutuhan proyek dan ketentuan
institusi/penelitian.
