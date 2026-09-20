import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { waLink, telegramLink } from "@/lib/env";

export const metadata: Metadata = {
  title: "Kontak — SkripsiMentor",
};

export default function ContactPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-indigo-100 text-indigo-700">Kontak</span>
        <h1 className="section-title mt-4">Mari Bicara Lebih Lanjut</h1>
        <p className="mt-3 text-slate-600">
          Konsultasi awal gratis. Balas cepat, Senin–Sabtu pukul 08.00–21.00 WIB.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <Link
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="card card-hover flex items-start gap-4 p-6"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
            <MessageCircle className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-bold text-slate-900">WhatsApp</h3>
            <p className="mt-1 text-sm text-slate-600">+62 812-3456-7890</p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">Klik untuk chat langsung</p>
          </div>
        </Link>

        <Link
          href={telegramLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="card card-hover flex items-start gap-4 p-6"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600">
            <Send className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-bold text-slate-900">Telegram</h3>
            <p className="mt-1 text-sm text-slate-600">@skripsimentor</p>
            <p className="mt-1 text-xs text-sky-600 font-semibold">Klik untuk chat langsung</p>
          </div>
        </Link>

        <div className="card flex items-start gap-4 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
            <Mail className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-bold text-slate-900">Email</h3>
            <p className="mt-1 text-sm text-slate-600">halo@skripsimentor.id</p>
          </div>
        </div>

        <div className="card flex items-start gap-4 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
            <Clock className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-bold text-slate-900">Jam Operasional</h3>
            <p className="mt-1 text-sm text-slate-600">Senin–Sabtu, 08.00–21.00 WIB</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-indigo-200 bg-indigo-50 p-8 text-center">
        <p className="flex items-center justify-center gap-2 text-slate-700">
          <MapPin className="h-5 w-5 text-indigo-600" /> Melayani online dari mana saja di Indonesia
        </p>
      </div>
    </div>
  );
}