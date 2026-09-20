import Link from "next/link";
import {
  MapPinned,
  Camera,
  Ticket,
  Bell,
  ClipboardCheck,
  BarChart3,
  FileDown,
  ArrowRight,
} from "lucide-react";
import PublicLayout from "@/components/public-layout";
import { Button, Card } from "@/components/ui";

const steps = [
  {
    icon: Camera,
    title: "Laporkan",
    desc: "Foto masalahnya, lokasi otomatis terdeteksi dari GPS atau klik titik pada peta.",
  },
  {
    icon: Ticket,
    title: "Dapatkan Nomor Tiket",
    desc: "Terima kode LAP-xxxxxxxx-0001 untuk memantau status pengaduan Anda.",
  },
  {
    icon: ClipboardCheck,
    title: "Diproses Petugas",
    desc: "Admin verifikasi, petugas menindaklanjuti, dan Anda tahu perkembangan tiap langkah.",
  },
];

const features = [
  {
    icon: MapPinned,
    title: "Peta Interaktif (GIS)",
    desc: "Semua laporan tampil sebagai titik di peta dengan filter kategori, status, prioritas, dan wilayah.",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    desc: "Setiap perubahan status laporan langsung masuk ke panel pengguna.",
  },
  {
    icon: Camera,
    title: "Bukti Foto",
    desc: "Lampirkan foto dan dokumentasi tindak lanjut agar proses transparan.",
  },
  {
    icon: Ticket,
    title: "Nomor Tiket",
    desc: "Pelacakan pengaduan mudah memakai kode laporan yang unik per hari.",
  },
  {
    icon: BarChart3,
    title: "Statistik",
    desc: "Admin mendapat grafik tren laporan bulanan dan sebaran per kategori/wilayah.",
  },
  {
    icon: FileDown,
    title: "Ekspor Laporan",
    desc: "Rekap data dalam format PDF dan CSV untuk arsip maupun publikasi.",
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-blue-100 to-slate-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Partisipasi Masyarakat &bull; Web + GIS
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Laporkan masalah lingkungan, <span className="text-blue-700">pantau sampai tuntas.</span>
            </h1>
            <p className="mt-4 max-w-xl text-slate-700">
              Aplikasi pelaporan berbasis web dan sistem informasi geografis yang
              menghubungkan masyarakat, petugas, dan pemerintah desa/kecamatan
              dalam satu alur verifikasi dan tindak lanjut yang transparan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/daftar">
                <Button className="text-base">
                  Mulai Laporkan <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/peta">
                <Button variant="outline" className="text-base">
                  Lihat Peta
                </Button>
              </Link>
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="flex h-64 items-center justify-center bg-slate-800">
              <MapPinned className="h-24 w-24 text-blue-400" />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <span className="text-sm font-semibold">LAP-20260920-0001</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Sedang Diproses
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold">LAP-20260919-0007</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Selesai
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold">LAP-20260919-0005</span>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                  Sedang Diproses
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Cara Kerja</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-700">
          Tiga langkah sederhana untuk menyalurkan aspirasi Anda.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="relative p-6">
              <span className="absolute right-4 top-4 text-4xl font-bold text-slate-400">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Fitur Unggulan</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Siap berkontribusi untuk komunitas Anda?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-blue-100">
            Daftar sekarang, laporkan masalah di sekitar Anda, dan pantau hingga
            tuntas.
          </p>
          <Link href="/daftar" className="mt-6 inline-block">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 text-base">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}