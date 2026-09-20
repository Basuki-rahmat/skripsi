import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/env";

export const metadata: Metadata = {
  title: "Testimoni — SkripsiMentor",
};

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-fuchsia-100 text-fuchsia-700">Testimoni</span>
        <h1 className="section-title mt-4">Kata Mereka yang Sudah Terbantu</h1>
        <p className="mt-3 text-slate-600">
          Cerita nyata dari mahasiswa yang menyelesaikan skripsi bersama kami.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <p className="mt-12 text-center text-slate-400">Belum ada testimoni.</p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="card card-hover flex flex-col p-6">
              <div className="text-amber-400">{"★".repeat(t.rating)}</div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                “{t.content}”
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-3 text-sm">
                <div className="font-semibold text-slate-800">{t.user.name}</div>
                <div className="text-xs text-slate-400">{formatDate(t.createdAt)}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/register" className="btn-primary">
          Mulai Perjalananmu
        </Link>
      </div>
    </div>
  );
}