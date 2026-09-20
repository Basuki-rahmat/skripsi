import Link from "next/link";
import prisma from "@/lib/db";
import {
  ArrowRight,
  BookOpen,
  Map,
  FileCheck,
  MessageSquare,
  LineChart,
  Users,
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/env";
import { getPelaporanLive, PELAPORAN_STATUS_META, type PelaporanLive } from "@/lib/sistem-pelaporan";
import LiveMap, { type LiveMapMarker } from "@/components/landing/live-map";

function Hero({ live }: { live: PelaporanLive | null }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(99,102,241,.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(217,70,239,.15), transparent 45%)",
        }}
      />
      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="badge bg-indigo-100 text-indigo-700">
            ✦ Jasa Pembuatan Sistem & Bimbingan Skripsi
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Bimbingan Skripsi sampai{" "}
            <span className="gradient-text">Sambut Sidang</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Mentoring penulisan dari judul sampai sidang, plus jasa pembuatan
            aplikasi web seperti sistem pelaporan berbasis GIS. Satu tempat
            untuk menyelesaikan skripsimu tepat waktu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/paket" className="btn-primary">
              Lihat Paket <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/produk/sistem-pelaporan" className="btn-secondary">
              Lihat Produk Sistem
            </Link>
          </div>
          <ul className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[
              { value: "100+", label: "Mahasiswa terbantu" },
              { value: "4.9/5", label: "Rating kepuasan" },
              { value: "24/7", label: "Konsultasi via chat" },
            ].map((s) => (
              <li key={s.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                <div className="text-xl font-bold text-indigo-600">{s.value}</div>
                <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Sistem Pelaporan Komunitas
              </div>
              <span className="badge bg-violet-100 text-violet-700">GIS Web</span>
            </div>
            <div className="h-44 overflow-hidden rounded-xl">
              <LiveMap
                markers={
                  live && live.markers.length > 0
                    ? live.markers
                    : ([
                        { code: "TK-0021", title: "Jalan Rusak", status: "DIPROSES", lat: -6.20112, lng: 106.7923 },
                        { code: "TK-0022", title: "Lampu Mati", status: "SELESAI", lat: -6.18549, lng: 106.8017 },
                      ] satisfies LiveMapMarker[])
                }
              />
            </div>
            <div className="mt-4 space-y-2">
              {(live && live.reports.length > 0 ? live.reports : [
                { code: "TK-0021", title: "Jalan Rusak", status: "DIPROSES" },
                { code: "TK-0022", title: "Lampu Mati", status: "SELESAI" },
              ]).map((r) => {
                const meta = PELAPORAN_STATUS_META[r.status] ?? { label: r.status, badge: "bg-slate-100 text-slate-600" };
                return (
                  <div key={r.code} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                    <div>
                      <div className="font-mono text-xs text-slate-400">{r.code}</div>
                      <div className="font-medium text-slate-800">{r.title}</div>
                    </div>
                    <span className={`badge ${meta.badge}`}>{meta.label}</span>
                  </div>
                );
              })}
            </div>
            {live && (
              <div className="mt-3 text-center text-xs font-medium text-slate-500">
                {live.total} laporan terpantau langsung dari sistem
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: BookOpen,
    title: "Bimbingan Skripsi",
    desc: "Pendampingan dari judul, proposal, BAB 1-5, sampai persiapan sidang by mentor berpengalaman.",
    points: ["Review berkala", "Format & metode", "Sampai sidang"],
    href: "/paket",
    cta: "Lihat paket",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    icon: Map,
    title: "Jasa Pembuatan Sistem",
    desc: "Bangun aplikasi web sesuai kebutuhan: sistem pelaporan, dashboard, GIS/peta interaktif, dan lainnya.",
    points: ["Database + source code", "Dokumentasi", "Garansi bug"],
    href: "/produk/sistem-pelaporan",
    cta: "Lihat produk",
    accent: "from-fuchsia-500 to-pink-500",
  },
];

function Services() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-violet-100 text-violet-700">Layanan Kami</span>
        <h2 className="section-title mt-4">Dua Layanan, Satu Tujuan</h2>
        <p className="mt-3 text-slate-600">
          Butuh pendampingan menulis atau butuh aplikasi dibangunkan? Kami siap dua-duanya.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="card card-hover group p-7"
          >
            <span className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.accent} text-white`}>
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            <ul className="mt-4 space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {p}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2">
              {s.cta} <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Users, title: "Mentor Berpengalaman", desc: "Pernah melalui skripsi & aktif membimbing mahasiswa berbagai jurusan." },
  { icon: MessageSquare, title: "Konsultasi Fleksibel", desc: "Chat/WhatsApp/Telegram atau video call sesuai jadwal yang nyaman." },
  { icon: ShieldCheck, title: "Pembayaran Aman", desc: "Transaksi melalui Midtrans (kartu, bank, e-wallet, QRIS) terverifikasi." },
  { icon: LineChart, title: "Progres Terpantau", desc: "Setiap tahapan tercatat di dashboard + notifikasi otomatis ke Telegram." },
  { icon: FileCheck, title: "Review Terstruktur", desc: "Feedback jelas per BAB, bukan sekadar baca-baca tanpa arah." },
  { icon: BadgeCheck, title: "Sampai Selesai & Sidang", desc: "Timeline jelas dan dieksekusi, dari proposal sampai persiapan sidang." },
];

function Features() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-indigo-100 text-indigo-700">Kenapa SkripsiMentor</span>
          <h2 className="section-title mt-4">Bantu Kamu Lulus Tepat Waktu</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTeaser() {
  return (
    <section className="container-page py-16">
      <div className="card overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white sm:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="badge bg-white/15 text-white">Produk Unggulan</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
              Sistem Pelaporan Komunitas Berbasis Web & GIS
            </h2>
            <p className="mt-3 text-indigo-100">
              Aplikasi pelaporan permasalahan masyarakat dengan peta interaktif,
              nomor tiket, verifikasi, dan tindak lanjut. Cocok untuk kelurahan,
              kampus, komunitas, hingga tugas akhir.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/produk/sistem-pelaporan" className="btn bg-white text-indigo-700 hover:bg-indigo-50">
                Lihat Detail Produk <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Form laporan + foto + GPS",
              "Nomor tiket laporan",
              "Peta interaktif & filter",
              "Dashboard statistik",
              "Verifikasi & tindak lanjut",
              "Riwayat penanganan",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <section className="bg-slate-50 py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-fuchsia-100 text-fuchsia-700">Testimoni</span>
          <h2 className="section-title mt-4">Kata Mereka yang Sudah Terbantu</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="card card-hover flex flex-col p-6">
              <div className="flex text-amber-400">{"★".repeat(t.rating)}</div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                “{t.content}”
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-3 text-sm">
                <span className="font-semibold text-slate-800">{t.user.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/testimoni" className="btn-secondary">
            Lihat Semua Testimoni
          </Link>
        </div>
      </div>
    </section>
  );
}

async function BlogTeaser() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between">
        <div>
          <span className="badge bg-emerald-100 text-emerald-700">Blog</span>
          <h2 className="section-title mt-4">Tips Menyusun Skripsi</h2>
        </div>
        <Link href="/blog" className="btn-secondary hidden sm:inline-flex">
          Semua Artikel <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card card-hover flex flex-col p-6">
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">{p.title}</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{p.excerpt}</p>
            <span className="mt-4 text-xs text-slate-400">
              {p.publishedAt ? formatDate(p.publishedAt) : ""}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="container-page pb-20">
      <div className="card border-indigo-200 bg-indigo-50 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Siap Menyelesaikan Skripsimu?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Konsultasi awal gratis. Chat kami di WhatsApp atau daftar sekarang dan
          pilih paket yang paling pas.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary">Daftar Sekarang</Link>
          <Link href="/kontak" className="btn-secondary">Hubungi Kami</Link>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPage() {
  const live = await getPelaporanLive();

  return (
    <>
      <Hero live={live} />
      <Services />
      <Features />
      <ProductTeaser />
      <Testimonials />
      <BlogTeaser />
      <Cta />
    </>
  );
}