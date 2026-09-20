import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { Check, Sparkles } from "lucide-react";
import { formatIDR } from "@/lib/env";

export const metadata: Metadata = {
  title: "Paket & Harga — SkripsiMentor",
};

export default async function PackagesPage() {
  const [bimbingan, pembuatan] = await Promise.all([
    prisma.package.findMany({
      where: { isActive: true, type: "BIMBINGAN" },
      orderBy: { price: "asc" },
    }),
    prisma.package.findMany({
      where: { isActive: true, type: "PEMBUATAN" },
      orderBy: { price: "asc" },
    }),
  ]);

  const PaketCard = ({
    pkg,
    featured = false,
  }: {
    pkg: (typeof bimbingan)[number];
    featured?: boolean;
  }) => (
    <div
      className={`card card-hover relative flex flex-col p-7 ${
        featured ? "border-indigo-400 ring-2 ring-indigo-200" : ""
      }`}
    >
      {featured && (
        <span className="badge absolute -top-3 right-6 bg-indigo-600 text-white">
          <Sparkles className="h-3 w-3" /> Paling Laris
        </span>
      )}
      <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
      <p className="mt-1 text-sm text-slate-500">{pkg.duration}</p>
      <div className="mt-4 text-3xl font-extrabold text-slate-900">
        {formatIDR(pkg.price)}
      </div>
      <p className="mt-3 text-sm text-slate-600">{pkg.description}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {(pkg.features as string[]).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/checkout/${pkg.id}`}
        className={`mt-6 w-full ${featured ? "btn-primary" : "btn-secondary"}`}
      >
        Pilih Paket Ini
      </Link>
    </div>
  );

  return (
    <div className="pb-20">
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 text-center">
        <div className="container-page">
          <span className="badge bg-indigo-100 text-indigo-700">Paket & Harga</span>
          <h1 className="section-title mx-auto mt-4 max-w-2xl">
            Harga Ramah <span className="gradient-text">Mahasiswa</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Pilih paket bimbingan atau layanan pembuatan sistem. Konsultasi awal selalu gratis.
          </p>
        </div>
      </section>

      <section className="container-page pt-14">
        <h2 className="text-2xl font-bold text-slate-900">📚 Bimbingan Skripsi</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {bimbingan.map((pkg, i) => (
            <PaketCard key={pkg.id} pkg={pkg} featured={i === 2} />
          ))}
        </div>
      </section>

      <section className="container-page pt-16">
        <h2 className="text-2xl font-bold text-slate-900">🛠️ Pembuatan Sistem (Per Proyek)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Harga mulai — harga final menyesuaikan spesifikasi & kebutuhan proyek.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pembuatan.map((pkg, i) => (
            <PaketCard key={pkg.id} pkg={pkg} featured={i === 1} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Butuh penawaran khusus?{" "}
          <Link href="/kontak" className="font-semibold text-indigo-600 hover:underline">
            Hubungi kami
          </Link>{" "}
          untuk konsultasi gratis.
        </p>
      </section>
    </div>
  );
}