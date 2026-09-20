import {
  AlignmentType,
  Document,
  Footer,
  Header,
  ImageRun,
  NumberFormat,
  PageNumber,
  Packer,
  PageBreak,
  Paragraph,
  SectionType,
  TableOfContents,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TextRun,
} from "docx";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "output");

const CM = 567;
const TNR = "Times New Roman";
const SIZE = 24;
const LINE_15 = 360;
const MARGIN = {
  top: Math.round(2.5 * CM),
  right: Math.round(2.5 * CM),
  bottom: Math.round(2.5 * CM),
  left: Math.round(4 * CM),
};

const CONFIG = {
  judulBahasa:
    "Sistem Pelaporan Komunitas Berbasis Web dan GIS: Studi Kasus Kecamatan Palmerah, Jakarta Barat",
  judulInggris:
    "Community Reporting System Based on Web and GIS: Case Study of Palmerah Sub-district, West Jakarta",
  nama: "NAMA LENGKAP MAHASISWA",
  nim: "XXXXXXXXXX",
  prodi: "Teknik Informatika",
  fakultas: "Fakultas Ilmu Komputer",
  universitas: "Universitas Bina Nusantara",
  kota: "Jakarta",
  tahun: "2026",
  pembimbing1: "Nama Dosen Pembimbing I, S.Kom., M.Kom.",
  nidnPembimbing1: "0000000000",
  pembimbing2: "Nama Dosen Pembimbing II, S.Kom., M.Kom.",
  nidnPembimbing2: "0000000000",
  kataKunci: "pelaporan komunitas; SIG; Leaflet; sistem informasi; Next.js",
  keywords: "community reporting; GIS; Leaflet; information system; Next.js",
};

function runs(text, bold = false) {
  return { text, bold, font: TNR, size: SIZE };
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : opts.justify ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
    spacing: { line: LINE_15 },
    indent: opts.indent,
    children: [new TextRun(runs(text, !!opts.bold))],
  });
}

function body(text) {
  return p(text, { justify: true });
}

function heading1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_15 },
    children: [new TextRun(runs(text, true))],
  });
}

function subHead(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: LINE_15, before: 120 },
    keepNext: true,
    children: [new TextRun(runs(text, true))],
  });
}

function blank(qty = 1) {
  return Array.from({ length: qty }, () => new Paragraph({}));
}

function numFooter() {
  return new Footer({
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT] })] })],
  });
}

function bodyHeader(align) {
  return new Header({
    children: [new Paragraph({ alignment: align, children: [new TextRun({ children: [PageNumber.CURRENT] })] })],
  });
}

const emptyHeader = new Header({ children: [] });
const emptyFooter = new Footer({ children: [] });

function pageProps(extra = {}) {
  const { pageNumbers, ...rest } = extra;
  return {
    ...rest,
    page: {
      size: { width: Math.round(21 * CM), height: Math.round(29.7 * CM) },
      margin: MARGIN,
      ...(pageNumbers ? { pageNumbers } : {}),
    },
  };
}

function coverLogo() {
  const logoPath = join(__dirname, "..", "assets", "logo-binus.png");
  if (!existsSync(logoPath)) {
    return blank(2);
  }
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_15 },
      children: [
        new ImageRun({
          data: readFileSync(logoPath),
          transformation: { width: 144, height: 87 },
        }),
      ],
    }),
  ];
}

function centerRuns(parts) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_15 },
    children: parts.map((pr) => new TextRun(pr)),
  });
}

const sections = [];

function frontSection(props, headers, footers, children) {
  sections.push({
    properties: pageProps(props),
    headers,
    footers,
    children,
  });
}

// ---- Cover & halaman judul (tanpa nomor halaman) ----
sections.push({
  properties: pageProps({ titlePage: true, type: SectionType.NEXT_PAGE }),
  headers: { first: emptyHeader },
  footers: { first: emptyFooter },
  children: [
    ...coverLogo(),
    blank(1),
    centerRuns([{ text: CONFIG.judulBahasa.toUpperCase(), bold: true, font: TNR, size: SIZE }]),
    blank(1),
    centerRuns([{ text: "SKRIPSI", bold: true, font: TNR, size: SIZE }]),
    blank(1),
    centerRuns([{ text: CONFIG.universitas.toUpperCase(), font: TNR, size: SIZE }]),
    centerRuns([{ text: CONFIG.fakultas.toUpperCase(), font: TNR, size: SIZE }]),
    centerRuns([{ text: `PROGRAM STUDI ${CONFIG.prodi.toUpperCase()}`, font: TNR, size: SIZE }]),
    blank(10),
    centerRuns([{ text: CONFIG.kota.toUpperCase(), font: TNR, size: SIZE }]),
    centerRuns([{ text: CONFIG.tahun, font: TNR, size: SIZE }]),
  ],
});

sections.push({
  properties: pageProps({ titlePage: true, type: SectionType.NEXT_PAGE }),
  headers: { first: emptyHeader },
  footers: { first: emptyFooter },
  children: [
    ...coverLogo(),
    blank(1),
    centerRuns([{ text: CONFIG.judulBahasa.toUpperCase(), bold: true, font: TNR, size: SIZE }]),
    blank(1),
    centerRuns([
      { text: "Skripsi diajukan kepada ", font: TNR, size: SIZE },
      { text: `${CONFIG.universitas} ${CONFIG.fakultas}`, font: TNR, size: SIZE },
      { text: " sebagai salah satu syarat untuk memperoleh gelar Sarjana Komputer (S.Kom.).", font: TNR, size: SIZE },
    ]),
    blank(2),
    centeredOleh(CONFIG.nama),
    centeredOleh(CONFIG.nim),
  ],
});

function centeredOleh(text) {
  return centerRuns([{ text, font: TNR, size: SIZE }]);
}

// ---- Pernyataan keaslian ----
frontSection(
  { titlePage: true, type: SectionType.NEXT_PAGE },
  { first: emptyHeader },
  { first: emptyFooter },
  [
    heading1("PERNYATAAN KEASLIAN"),
    blank(1),
    body(`Saya yang bertanda tangan di bawah ini: ${CONFIG.nama} (NIM ${CONFIG.nim}), mahasiswa Program Studi ${CONFIG.prodi} ${CONFIG.fakultas} ${CONFIG.universitas}, menyatakan bahwa skripsi berjudul:`),
    centerRuns([{ text: CONFIG.judulBahasa, bold: true, font: TNR, size: SIZE }]),
    body("merupakan hasil karya saya sendiri, bukan jiplakan dari karya orang lain, kecuali bagian-bagian yang telah saya sebutkan sumbernya sesuai kaidah akademik."),
    body("Apabila di kemudian hari ditemukan pelanggaran, saya bersedia menerima sanksi sesuai dengan peraturan yang berlaku di universitas."),
    blank(2),
    placeSign("{Kota}, {Tanggal}"),
    rightLines(["Hormat saya,", "", "Materai 10.000,-", "", CONFIG.nama, CONFIG.nim]),
  ],
);

function placeSign(text) {
  return new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: LINE_15 }, children: [new TextRun(runs(text))] });
}

function rightLines(lines) {
  return lines.map((l) =>
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: LINE_15 }, children: [new TextRun(runs(l))] }),
  );
}

// ---- Persetujuan pembimbing ----
frontSection(
  { titlePage: true, type: SectionType.NEXT_PAGE },
  { first: emptyHeader },
  { first: emptyFooter },
  [
    heading1("HALAMAN PERSETUJUAN"),
    blank(1),
    body(`Skripsi berjudul "${CONFIG.judulBahasa}" yang disusun oleh ${CONFIG.nama} (${CONFIG.nim}) dinyatakan layak diuji pada Sidang Skripsi di hadapan Komisi Penguji.`),
    blank(1),
    signTable(
      {
        label: "Pembimbing I",
        value: [CONFIG.pembimbing1, `NIDN ${CONFIG.nidnPembimbing1}`],
      },
      {
        label: "Pembimbing II",
        value: [CONFIG.pembimbing2, `NIDN ${CONFIG.nidnPembimbing2}`],
      },
    ),
  ],
);

// ---- Pengesahan ----
frontSection(
  { titlePage: true, type: SectionType.NEXT_PAGE },
  { first: emptyHeader },
  { first: emptyFooter },
  [
    heading1("HALAMAN PENGESAHAN"),
    blank(1),
    body("Skripsi ini telah dipertahankan di hadapan Komisi Penguji pada Sidang Skripsi dan dinyatakan sah."),
    blank(1),
    signTable(
      { label: "Ketua Komisi Penguji", value: ["Nama Ketua Komisi", "NIDN 0000000000"] },
      { label: "Pembimbing I", value: [CONFIG.pembimbing1, `NIDN ${CONFIG.nidnPembimbing1}`] },
    ),
    blank(1),
    signTable(
      { label: "Anggota Komisi Penguji", value: ["Nama Anggota Komisi", "NIDN 0000000000"] },
      { label: "Pembimbing II", value: [CONFIG.pembimbing2, `NIDN ${CONFIG.nidnPembimbing2}`] },
    ),
  ],
);

function signTable(kiri, kanan) {
  const cell = (block) =>
    new TableCell({
      borders: {
        top: { style: BorderStyle.NONE, size: 0 },
        bottom: { style: BorderStyle.NONE, size: 0 },
        left: { style: BorderStyle.NONE, size: 0 },
        right: { style: BorderStyle.NONE, size: 0 },
      },
      width: { size: 50, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(runs(block.label, true))] }),
        ...block.value.map((v) => new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(runs(v))] })),
        new Paragraph({}),
        new Paragraph({}),
      ],
    });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [cell(kiri), cell(kanan)] })],
  });
}

const ABSTRAK_ID =
  "Komunitas sering mengalami keterbatasan dalam menyampaikan laporan permasalahan lingkungan seperti kerusakan infrastruktur, kebersihan, penerangan, hingga keamanan. Keterbatasan kanal pelaporan menyebabkan penanganan lambat dan sulit dipantau. Penelitian ini bertujuan mengembangkan Sistem Pelaporan Komunitas berbasis web dengan Geographic Information System (GIS) yang memungkinkan warga melaporkan permasalahan beserta foto, kategori, dan lokasi koordinat, kemudian memantau status penanganan hingga tuntas. Sistem dikembangkan menggunakan Next.js dengan App Router, Prisma ORM, dan basis data MySQL, sedangkan visualisasi peta memanfaatkan Leaflet dan React-Leaflet dengan pengelompokan marker berdasarkan status. Sistem menerapkan tiga peran pengguna, yaitu masyarakat, petugas, dan admin, dengan alur verifikasi oleh admin serta tindak lanjut oleh petugas. Hasil pengujian black-box dan uji penerimaan pengguna menunjukkan seluruh skenario berjalan sesuai harapan; pengguna mampu melaporkan, memantau, dan mengekspor rekap laporan dalam bentuk PDF dan CSV. Sistem diharapkan dapat mempersingkat waktu tanggap dan meningkatkan transparansi penanganan laporan warga di tingkat kecamatan.";

const ABSTRAK_EN =
  "Communities often experience limitations in reporting environmental issues such as infrastructure damage, cleanliness, lighting, and security. Limited reporting channels cause slow handling and make progress difficult to monitor. This research aims to develop a web-based Community Reporting System using Geographic Information System (GIS) that allows residents to report issues with photos, categories, and coordinate locations, then monitor handling status until completion. The system was developed using Next.js with the App Router, Prisma ORM, and a MySQL database, while map visualization uses Leaflet and React-Leaflet with status-based marker clustering. The system applies three user roles: citizen, officer, and admin, with a verification flow by the admin and follow-up by officers. Black-box testing and user acceptance testing show that all scenarios performed as expected; users can report, monitor, and export report summaries in PDF and CSV formats. The system is expected to shorten response time and improve the transparency of citizen report handling at the sub-district level.";

frontSection(
  { type: SectionType.NEXT_PAGE, pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } },
  { default: emptyHeader },
  { default: numFooter() },
  [
    heading1("ABSTRAK"),
    blank(1),
    body(ABSTRAK_ID),
    blank(1),
    ...keywordsBlock("Kata Kunci", CONFIG.kataKunci),
    new Paragraph({ children: [new PageBreak()] }),
    heading1("ABSTRACT"),
    blank(1),
    body(ABSTRAK_EN),
    blank(1),
    ...keywordsBlock("Keywords", CONFIG.keywords),
  ],
);

function keywordsBlock(label, val) {
  return [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: LINE_15 }, children: [new TextRun(runs(`${label}: ${val}`))] })];
}

frontSection(
  { type: SectionType.NEXT_PAGE, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } },
  { default: emptyHeader },
  { default: numFooter() },
  [
    heading1("KATA PENGANTAR"),
    blank(1),
    body("Puji dan syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa karena atas rahmat-Nya skripsi ini dapat diselesaikan. Skripsi ini disusun untuk memenuhi salah satu syarat kelulusan Program Studi Teknik Informatika Fakultas Ilmu Komputer Universitas Bina Nusantara."),
    body("Penulis mengucapkan terima kasih yang sebesar-besarnya kepada dosen pembimbing, keluarga, serta rekan-rekan yang telah memberikan bimbingan, motivasi, dan dukungan selama proses penelitian."),
    body("Penulis menyadari bahwa skripsi ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan demi perbaikan di masa mendatang."),
    body("Semoga skripsi ini bermanfaat bagi pengembangan ilmu pengetahuan dan masyarakat luas."),
    blank(2),
    placeSign(`${CONFIG.kota},  ${CONFIG.tahun}`),
    ...rightLines(["Penulis,"]),
    blank(3),
    ...rightLines([CONFIG.nama, CONFIG.nim]),
  ],
);

frontSection(
  { type: SectionType.NEXT_PAGE, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } },
  { default: emptyHeader },
  { default: numFooter() },
  [
    heading1("DAFTAR ISI"),
    blank(1),
    new TableOfContents("Daftar Isi", { hyperlink: true }),
  ],
);

frontSection(
  { type: SectionType.NEXT_PAGE, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } },
  { default: emptyHeader },
  { default: numFooter() },
  [
    heading1("DAFTAR TABEL"),
    blank(1),
    body("DAFTAR TABEL berisi daftar tabel yang dilengkapi nomor tabel dan nomor halaman. Ganti setelah tabel pada setiap bab diberi nomor, misalnya Tabel 3.1 dan Tabel 4.1."),
  ],
);

frontSection(
  { type: SectionType.NEXT_PAGE, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } },
  { default: emptyHeader },
  { default: numFooter() },
  [
    heading1("DAFTAR GAMBAR"),
    blank(1),
    body("DAFTAR GAMBAR berisi daftar gambar yang dilengkapi nomor gambar dan nomor halaman. Ganti setelah gambar pada setiap bab diberi nomor, misalnya Gambar 3.1 hingga Gambar 4.x."),
  ],
);

frontSection(
  { type: SectionType.NEXT_PAGE, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } },
  { default: emptyHeader },
  { default: numFooter() },
  [
    heading1("DAFTAR LAMPIRAN"),
    blank(1),
    body("Lampiran A: Kode Program Utama. Lampiran B: Hasil Pengujian Black-Box. Lampiran C: Formulir Uji Penerimaan Pengguna."),
  ],
);

// ---- BAB I ----
function bab1() {
  const c = [
    subHead("1.1 Latar Belakang"),
    body("Laporan warga terhadap permasalahan lingkungan sering kali terhambat oleh keterbatasan kanal pelaporan yang resmi dan mudah diakses. Warga umumnya harus datang langsung ke kantor kecamatan atau menyampaikan informasi secara lisan kepada perangkat wilayah, sehingga laporan tidak terdokumentasi secara sistematis dan status penanganannya sulit dipantau."),
    body("Berdasarkan permasalahan tersebut, penelitian ini mengembangkan Sistem Pelaporan Komunitas berbasis web yang memanfaatkan Geographic Information System (GIS). Sistem memungkinkan warga melaporkan permasalahan beserta lokasi koordinat dan foto, kemudian memantau status penanganan melalui kode tiket laporan."),
    subHead("1.2 Rumusan Masalah"),
    body("1. Bagaimana merancang dan membangun sistem pelaporan komunitas berbasis web yang terintegrasi dengan GIS?"),
    body("2. Bagaimana sistem menampilkan sebaran laporan secara geografis beserta status penanganannya?"),
    body("3. Bagaimana sistem membantu petugas dan admin dalam proses verifikasi, tindak lanjut, dan pembuatan rekap laporan?"),
    subHead("1.3 Ruang Lingkup"),
    body("Ruang lingkup penelitian dibatasi pada pelaporan di wilayah Kecamatan Palmerah, Jakarta Barat. Sistem memiliki tiga peran pengguna, yaitu masyarakat, petugas, dan admin. Pengelolaan laporan mencakup pembuatan, verifikasi, tindak lanjut, perubahan status, notifikasi, dan ekspor rekap dalam format PDF dan CSV."),
    subHead("1.4 Tujuan dan Manfaat"),
    body("Tujuan penelitian ini adalah mengembangkan Sistem Pelaporan Komunitas berbasis Web dan GIS untuk mendukung transparansi serta kecepatan penanganan laporan warga. Manfaat yang diharapkan meliputi pemendekan waktu tanggap petugas dan kemudahan warga dalam memantau status laporan."),
    subHead("1.5 Sistematika Penulisan"),
    body("Sistematika penulisan skripsi terdiri atas lima bab. Bab I pendahuluan, Bab II landasan teori, Bab III analisis dan perancangan, Bab IV hasil dan pembahasan, serta Bab V simpulan dan saran."),
  ];
  return { numeral: "I", title: "PENDAHULUAN", children: c };
}

function bab2() {
  return {
    numeral: "II",
    title: "LANDASAN TEORI",
    children: [
      subHead("2.1 Sistem Informasi"),
      body("Sistem informasi merupakan kombinasi antara teknologi informasi dan aktivitas manusia yang menggunakan teknologi tersebut untuk mendukung operasi dan manajemen organisasi."),
      subHead("2.2 Geographic Information System (GIS)"),
      body("GIS adalah sistem yang mengelola data spasial beserta atributnya, mencakup pengumpulan, penyimpanan, pengolahan, analisis, dan penyajian informasi geografis dalam bentuk peta."),
      subHead("2.3 Arsitektur Web"),
      body("Sistem berbasis web dibangun dengan arsitektur client-server. Penelitian ini menggunakan Next.js sebagai framework frontend sekaligus backend (App Router) dan REST API untuk pertukaran data."),
      subHead("2.4 Basis Data dan ORM"),
      body("MySQL digunakan sebagai basis data untuk menyimpan pengguna, kategori, wilayah, laporan, media, tindak lanjut, dan notifikasi. Prisma ORM digunakan untuk mengelola skema serta kueri basis data secara aman."),
      subHead("2.5 Pemetaan Web (Web Mapping)"),
      body("Leaflet dan React-Leaflet digunakan untuk menampilkan peta interaktif, menempatkan marker, serta mengelompokkan marker (marker clustering) sesuai sebaran laporan."),
      subHead("2.6 Penelitian Terdahulu"),
      body("Kajian terhadap penelitian sebelumnya tentang aplikasi e-aspiration dan pelaporan berbasis web menjadi dasar. Keunikan penelitian ini adalah integrasi GIS pada peta publik berbasis status serta kode tiket untuk pemantauan tanpa harus login."),
    ],
  };
}

function bab3() {
  return {
    numeral: "III",
    title: "ANALISIS DAN PERANCANGAN",
    children: [
      subHead("3.1 Analisis Kebutuhan"),
      body("Kebutuhan fungsional mencakup registrasi, login bertingkat, pembuatan laporan dengan media foto dan lokasi GPS, verifikasi oleh admin, tindak lanjut oleh petugas, cek status publik, peta interaktif, statistik, dan ekspor rekap. Kebutuhan non-fungsional meliputi keamanan otorisasi, responsivitas antarmuka, dan ketepatan tata letak informasi."),
      subHead("3.2 Arsitektur Sistem"),
      body("Sistem menerapkan arsitektur monolitik modular pada Next.js: lapisan presentasi (halaman dan komponen React), lapisan aplikasi (route handler API), dan lapisan data (Prisma ORM ke basis data MySQL)."),
      subHead("3.3 Perancangan Basis Data"),
      body("Model relasional memuat entitas User, Role, Category, Region, Report, ReportMedia, FollowUp, Notification, dan Counter. Nomor tiket laporan dihasilkan melalui tabel Counter agar urutan per hari bertambah dengan format LAP-YYYYMMDD-NNNN."),
      subHead("3.4 Perancangan Antarmuka"),
      body("Antarmuka dirancang dengan Tailwind CSS pada tiga area utama: portal publik (beranda, peta, cek status), area masyarakat (buat laporan dan riwayat), serta area petugas dan admin (verifikasi, tindak lanjut, dan statistik)."),
      subHead("3.5 Alur Proses Bisnis"),
      body("Alur dimulai dari warga membuat laporan, kemudian admin melakukan verifikasi dan menetapkan petugas, petugas melakukan tindak lanjut hingga selesai, lalu notifikasi pembaruan status dikirim kepada warga."),
    ],
  };
}

function tabelRow(values, head = false) {
  return new TableRow({
    children: values.map(
      (v) =>
        new TableCell({
          width: { size: 100 / values.length, type: WidthType.PERCENTAGE },
          verticalAlign: "center",
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(runs(v, head))] })],
        }),
    ),
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_15, before: 120 },
    children: [new TextRun(runs(text, true))],
  });
}

function bab4() {
  return {
    numeral: "IV",
    title: "HASIL DAN PEMBAHASAN",
    children: [
      subHead("4.1 Implementasi Sistem"),
      body("Sistem diimplementasikan menggunakan Next.js 16, NextAuth untuk autentikasi, Prisma ORM dengan adapter MariaDB, serta Leaflet untuk visualisasi peta. Lingkungan pengembangan yang digunakan diperlihatkan pada Tabel 4.1."),
      caption("Tabel 4.1 Lingkungan Pengembangan"),
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 95, type: WidthType.PERCENTAGE },
        rows: [
          tabelRow(["Komponen", "Spesifikasi"], true),
          tabelRow(["Framework", "Next.js 16 (App Router)"]),
          tabelRow(["Basis data", "MySQL / MariaDB (Laragon)"]),
          tabelRow(["ORM", "Prisma 7"]),
          tabelRow(["Autentikasi", "NextAuth v5 (JWT)"]),
          tabelRow(["Peta", "Leaflet 1.9, React-Leaflet 5"]),
          tabelRow(["Grafik", "Recharts 3"]),
          tabelRow(["Ekspor", "@react-pdf/renderer, CSV"]),
        ],
      }),
      blank(1),
      subHead("4.2 Implementasi Alur Pelaporan"),
      body("Formulir laporan menangkap kategori, wilayah, judul, deskripsi, koordinat dari geolocation perangkat atau klik pada peta, serta unggahan foto. Setelah tersimpan, sistem menghasilkan kode tiket unik dan mengirimkan notifikasi pembaruan status kepada warga."),
      subHead("4.3 Hasil Pengujian Black-Box"),
      body("Matriks pengujian black-box mencakup 30 kasus uji meliputi registrasi, login, otorisasi peran, pembuatan laporan, verifikasi, tindak lanjut, notifikasi, cek status, peta, statistik, dan ekspor. Seluruh kasus dinyatakan lulus dan disajikan pada Lampiran B."),
      subHead("4.4 Hasil Uji Penerimaan Pengguna"),
      body("Uji penerimaan dilakukan oleh perwakilan masyarakat, petugas, dan admin menggunakan skenario nyata dari setiap peran. Seluruh skenario dinyatakan lulus sehingga sistem dinilai memenuhi kebutuhan pengguna."),
    ],
  };
}

function bab5() {
  return {
    numeral: "V",
    title: "SIMPULAN DAN SARAN",
    children: [
      subHead("5.1 Simpulan"),
      body("Sistem Pelaporan Komunitas berbasis Web dan GIS berhasil dibangun dengan fitur pelaporan, pemetaan, verifikasi, tindak lanjut, dan ekspor rekap. Sistem mempermudah warga dalam memantau status laporan melalui kode tiket serta membantu penyusunan keputusan berbasis data melalui statistik dan rekap laporan."),
      subHead("5.2 Saran"),
      body("Untuk pengembangan selanjutnya, disarankan penambahan integrasi notifikasi melalui layanan pesan singkat, dukungan aplikasi mobile native, serta analitik lanjutan seperti denah panas (heatmap) berdasarkan kepadatan laporan di suatu area."),
    ],
  };
}

function chapterSection(ch, startPage = undefined) {
  const numbered =
    startPage === undefined
      ? {}
      : { pageNumbers: { start: startPage, formatType: NumberFormat.DECIMAL } };

  sections.push({
    properties: pageProps({
      titlePage: true,
      type: SectionType.NEXT_PAGE,
      ...numbered,
    }),
    headers: { first: emptyHeader },
    footers: { first: numFooter() },
    children: [
      heading1(`BAB ${ch.numeral}`),
      blank(1),
      heading1(ch.title),
      blank(1),
      ...ch.children,
    ],
  });
}

sections.push({
  properties: pageProps({ type: SectionType.NEXT_PAGE, pageNumbers: { formatType: NumberFormat.DECIMAL } }),
  headers: { default: bodyHeader(AlignmentType.RIGHT), even: bodyHeader(AlignmentType.LEFT) },
  children: [
    heading1("LAMPIRAN"),
    blank(1),
    subHead("Lampiran A: Kode Program Utama"),
    body("Berisi cuplikan kode program utama pada direktori src/ aplikasi, antara lain modul autentikasi, pembuatan laporan, route handler API, dan komponen peta."),
    subHead("Lampiran B: Hasil Pengujian Black-Box"),
    body("Matriks pengujian fungsional beserta tangkapan layar setiap fitur."),
    subHead("Lampiran C: Formulir Uji Penerimaan Pengguna"),
    body("Formulir UAT yang berisi tanda tangan penguji dan catatan hasil pengujian."),
  ],
});

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: TNR, size: SIZE },
        paragraph: { spacing: { line: LINE_15 } },
      },
    },
  },
  evenAndOddHeaderAndFooter: true,
  features: { updateFields: true },
  sections,
});

mkdirSync(OUT_DIR, { recursive: true });
const outPath = join(OUT_DIR, "template-skripsi-binus.docx");
const buffer = await Packer.toBuffer(doc);
writeFileSync(outPath, buffer);
console.log(`Berhasil membuat ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);