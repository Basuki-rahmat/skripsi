import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  FileText,
  Ticket,
  ShieldCheck,
  Hammer,
  History,
  ArrowRight,
} from "lucide-react";
import LiveMap, { type LiveMapMarker } from "@/components/landing/live-map";
import {
  getPelaporanLive,
  PELAPORAN_STATUS_META,
  type PelaporanLive,
  type PelaporanStatusCount,
} from "@/lib/sistem-pelaporan";

export const metadata: Metadata = {
  title: "Produk Sistem Pelaporan Komunitas — SkripsiMentor",
};

const steps = [
  "Masyarakat",
  "Buat Laporan",
  "Verifikasi",
  "Tindak Lanjut",
  "Selesai",
  "Monitoring GIS",
];

const featuresList = [
  {
    icon: MapPin,
    title: "Lokasi GPS",
    desc: "Setiap laporan menyimpan koordinat latitude & longitude untuk menentukan titik persis kejadian.",
  },
  {
    icon: Ticket,
    title: "Nomor Tiket",
    desc: "Setiap laporan otomatis mendapat nomor tiket unik sebagai identitas & bahan penelusuran.",
  },
  {
    icon: FileText,
    title: "Upload Foto",
    desc: "Bukti visual dan dokumen pendukung untuk memperkuat laporan.",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi",
    desc: "Petugas/admin memverifikasi validitas laporan sebelum masuk antrean penanganan.",
  },
  {
    icon: Hammer,
    title: "Tindak Lanjut",
    desc: "Catatan penanganan, bukti tindakan, dan penanggung jawab terkelola rapi.",
  },
  {
    icon: History,
    title: "Riwayat Status",
    desc: "Perubahan status dan riwayat penanganan terdokumentasi secara transparan.",
  },
];

export default async function ProductPage() {
  const live = await getPelaporanLive();

  return (
    <div className="pb-20">
      <Hero live={live} />
      <Features />
      <Flow live={live} />
      <Cta />
    </div>
  );
}

function Hero({ live }: { live: PelaporanLive | null }) {
  const markers: LiveMapMarker[] =
    live && live.markers.length > 0
      ? live.markers
      : [
          { code: "TK-0021", title: "Jalan Rusak", status: "DIPROSES", lat: -6.20112, lng: 106.7923 },
          { code: "TK-0022", title: "Lampu Mati", status: "SELESAI", lat: -6.18549, lng: 106.8017 },
        ];
  return (
    <section className="bg-gradient-to-b from-violet-50 via-white to-white py-16">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="badge bg-violet-100 text-violet-700">Produk Unggulan</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Sistem Pelaporan Komunitas{" "}
            <span className="gradient-text">Berbasis Web & GIS</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Aplikasi lengkap untuk melaporkan, memantau, dan menindaklanjuti
            permasalahan masyarakat — dilengkapi peta interaktif, verifikasi,
            dan dashboard statistik.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontak" className="btn-primary">
              Pesan Sistem Ini <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/paket" className="btn-secondary">
              Lihat Harga Paket
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Next.js", "MySQL", "GIS / Leaflet", "OpenStreetMap", "Dashboard"].map((t) => (
              <span key={t} className="badge border border-slate-200 bg-white text-slate-600">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="card p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800">Peta Persebaran Laporan</div>
            <span className="badge bg-emerald-100 text-emerald-700">Live</span>
          </div>
          <div className="h-64 overflow-hidden rounded-xl">
            <LiveMap markers={markers} />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex flex-wrap gap-3 text-xs text-slate-600">
              {(live && live.statusCounts.length > 0
                ? live.statusCounts
                : [
                    { status: "DIPROSES", count: 0 },
                    { status: "SELESAI", count: 0 },
                  ]
              ).slice(0, 5).map((s: PelaporanStatusCount) => {
                const meta = PELAPORAN_STATUS_META[s.status] ?? {
                  label: s.status,
                  badge: "bg-slate-100 text-slate-600",
                  color: "#10b981",
                };
                return (
                  <span key={s.status} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
                    {meta.label} {s.count}
                  </span>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {live ? `${live.total} laporan` : "1.250 laporan"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="container-page pt-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-indigo-100 text-indigo-700">Fitur Utama</span>
        <h2 className="section-title mt-4">Satu Platform, Semua Proses</h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuresList.map((f) => (
          <div key={f.title} className="card card-hover p-6">
            <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Flow({ live }: { live: PelaporanLive | null }) {
  const statusKeys = ["MENUNGGU_VERIFIKASI", "DIPROSES", "DITINDAKLANJUTI", "SELESAI", "VERIFIKASI_DITOLAK"] as const;
  const countOf = (status: string): number | null => {
    const found = live?.statusCounts.find((s) => s.status === status);
    return found ? found.count : null;
  };

  return (
    <section className="container-page pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-fuchsia-100 text-fuchsia-700">Alur Sistem</span>
        <h2 className="section-title mt-4">Dari Laporan sampai Tuntas</h2>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((s, i) => (
          <div key={s} className="card p-4 text-center">
            <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              {i + 1}
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-800">{s}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Status Laporan</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {statusKeys.map((s) => {
              const meta = PELAPORAN_STATUS_META[s];
              const count = countOf(s);
              return (
                <span key={s} className="badge border border-slate-200 bg-slate-50 text-slate-600">
                  {meta?.label ?? s}
                  {count !== null && <span className="ml-1 font-bold text-slate-900">{count}</span>}
                </span>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Status tambahan: prioritas (rendah/sedang/tinggi/darurat) untuk membantu
            pengelompokan penanganan.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Fitur GIS</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {[
              "Peta interaktif berbasis OpenStreetMap",
              "Marker lokasi laporan + detail info",
              "Filter kategori, status, wilayah",
              "Pencarian lokasi & persebaran laporan",
              "Clustering marker (data banyak)",
              "Dashboard statistik & grafik",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="container-page pt-16">
      <div className="card overflow-hidden border-0 bg-gradient-to-br from-fuchsia-600 to-violet-700 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Ingin Sistem Seperti Ini untuk Instansimu?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-fuchsia-100">
          Konsultasikan kebutuhanmu — kelurahan, kampus, komunitas, atau tugas akhir.
          Gratis konsultasi awal, harga menyesuaikan spesifikasi.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/kontak" className="btn bg-white text-fuchsia-700 hover:bg-fuchsia-50">
            Konsultasi Gratis
          </Link>
          <Link href="/paket" className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20">
            Cek Paket Pembuatan
          </Link>
        </div>
      </div>
    </section>
  );
}