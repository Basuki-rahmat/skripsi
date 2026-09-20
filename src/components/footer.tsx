import Link from "next/link";
import Logo from "@/components/brand";
import { MapPin, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-slate-600">
            Platform bimbingan skripsi & jasa pembuatan aplikasi web. Pendampingan
            sampai sidang, harga ramah mahasiswa.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Navigasi</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/paket" className="hover:text-indigo-600">Paket & Harga</Link></li>
            <li><Link href="/produk/sistem-pelaporan" className="hover:text-indigo-600">Produk Sistem Pelaporan</Link></li>
            <li><Link href="/blog" className="hover:text-indigo-600">Blog Tips Skripsi</Link></li>
            <li><Link href="/testimoni" className="hover:text-indigo-600">Testimoni</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Layanan</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Bimbingan Skripsi (Basic/Pro/Premium)</li>
            <li>Konsultasi Awal</li>
            <li>Pembuatan Website & Sistem</li>
            <li>Custom Request Aplikasi</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Kontak</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-500" /> Indonesia</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-500" /> halo@skripsimentor.id</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-500" /> Senin–Sabtu 08.00–21.00 WIB</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5">
        <p className="container-page text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SkripsiMentor. Dibuat dengan ❤️ untuk mahasiswa Indonesia.
        </p>
      </div>
    </footer>
  );
}