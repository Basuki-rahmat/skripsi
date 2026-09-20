import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import TestimonialRowActions from "@/components/dashboard/testimonial-row-actions";
import { formatDate } from "@/lib/env";

export const metadata: Metadata = { title: "Testimoni — Admin" };

export default async function AdminTestimonialsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const testimonials = await prisma.testimonial.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Testimoni</h1>
      <p className="mt-1 text-sm text-slate-500">
        Setujui testimoni sebelum tampil di halaman publik.
      </p>

      <div className="mt-6 space-y-3">
        {testimonials.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">Belum ada testimoni.</div>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className={`card p-5 ${t.isApproved ? "" : "border-l-4 border-l-amber-400"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{t.user.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-amber-400">{"★".repeat(t.rating)}</span>
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </div>
                <span className={`badge ${t.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {t.isApproved ? "Disetujui" : "Menunggu"}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700">“{t.content}”</p>
              <div className="mt-3">
                <TestimonialRowActions id={t.id} isApproved={t.isApproved} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}