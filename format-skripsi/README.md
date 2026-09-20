# Generator Template Skripsi BINUS

Menghasilkan `template-skripsi-binus.docx` sesuai **Pedoman Penulisan Skripsi Universitas Bina Nusantara** (School of Computer Science, Bachelor of Computer Science) dalam **Bahasa Indonesia**.

## Format yang diterapkan otomatis

- Kertas **A4** (21 × 29,7 cm), margin **kiri 4 cm**, atas/bawah/kanan **2,5 cm**.
- **Times New Roman 12 pt**, **spasi 1,5**, teks isi **rata kiri-kanan (justify)**.
- Judul bab `BAB I PENDAHULUAN` dst. — TNR 12 **bold** KAPITAL, rata tengah.
- Subbab (mis. `1.1 Latar Belakang`) — TNR 12 **bold**, rata kiri.
- Bagian awal memakai **nomor halaman romawi kecil (i, ii, …)** di tengah bawah; **cover & halaman judul tanpa nomor**.
- Bagian isi memakai **nomor halaman arab** di kanan-atas (halaman ganjil) dan kiri-atas (halaman genap) — `evenAndOddHeaders`.
- **Setiap bab dimulai dari halaman ganjil** (section `oddPage`); halaman pertama bab bernomor di tengah-bawah (`titlePg` + footer khusus).
- Rekap: Daftar Isi (field TOC otomatis), Daftar Tabel/Gambar/Lampiran, Daftar Pustaka (APA, hanging indent), Riwayat Hidup, Lampiran.
- ABSTRAK (Bahasa Indonesia) + ABSTRACT (English) + kata kunci.

## Struktur dokumen

1. Cover & Halaman Judul
2. Pernyataan Keaslian (dengan kolom materai)
3. Halaman Persetujuan Dewan Pembimbing
4. Halaman Pengesahan (Komisi Penguji)
5. ABSTRAK + ABSTRACT
6. Kata Pengantar
7. Daftar Isi / Tabel / Gambar / Lampiran
8. Bab I Pendahuluan → Bab V Simpulan dan Saran
9. Daftar Pustaka, Riwayat Hidup, Lampiran

## Cara pakai

```bash
cd format-skripsi
npm install
# 1) isi identitas di bagian CONFIG pada src/generate.mjs
# 2) (opsional) taruh logo BINUS di assets/logo-binus.png (3,8 x 2,3 cm → resolusi ~144x87px)
npm run generate
# hasil: output/template-skripsi-binus.docx
```

Buka hasil di **Microsoft Word**: tekan `Ctrl+A` lalu `F9` untuk memperbarui field Daftar Isi. Untuk pengumpulan Thesis Apps, **Save As/Export → PDF**.

## Checklist kelulusan (Thesis Apps + pedoman SoCS)

- [ ] Nama, NIM, judul (ID), judul/ABSTRACT (EN), prodi, pembimbing sudah diisi di `CONFIG`.
- [ ] Logo BINUS dari BinusMaya versi resmi terpasang (3,8 × 2,3 cm). Ganti placeholder bila tersedia.
- [ ] Jarak tepi kiri 4 cm terlihat jelas pada hasil cetak; seluruh isi TNR 12, spasi 1,5, justify.
- [ ] Setiap bab diawali halaman ganjil → saat cetak dua sisi, halaman baru berada di sisi kanan.
- [ ] Nomor romawi hanya pada bagian awal (setelah cover & halaman judul); isi dimulai angka 1.
- [ ] Tabel & gambar diberi nomor per bab (Tabel 3.1, Gambar 4.1) dan dirujuk pada teks; daftar tabel/gambar diperbarui.
- [ ] Daftar Pustaka menggunakan gaya APA dan hanya memuat sumber yang dirujuk.
- [ ] Dokumen dikonversi ke PDF dan diunggah melalui **Thesis Apps** bersama berkas lain yang dipersyaratkan.

## Materi untuk melengkapi (dari hasil pengembangan aplikasi)

- Bab III: skema basis data, use case, arsitektur, desain antarmuka → lampirkan tangkapan layar ke direktori bab.
- Bab IV: tabel matriks pengujian di `sistem-pelaporan-komunitas/docs/pengujian.md`, skenario demo di `docs/skenario-demo-sidang.md`.
- Lampiran B: hasil pengujian black-box + screenshots.