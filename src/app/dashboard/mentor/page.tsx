import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { OrderStatusBadge } from "@/components/dashboard/status";
import { formatDate } from "@/lib/env";

export const metadata: Metadata = { title: "Klien Saya — SkripsiMentor" };

export default async function MentorOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "MENTOR") redirect("/");

  const orders = await prisma.order.findMany({
    where: { mentorId: user.id },
    include: { user: true, package: true, progresses: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  const active = orders.filter((o) => ["PAID", "PROCESSING", "IN_PROGRESS"].includes(o.status));
  const done = orders.filter((o) => o.status === "COMPLETED").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Klien Saya, {user.name.split(" ")[0]} 👋</h1>
      <p className="mt-1 text-sm text-slate-500">Pesanan yang ditugaskan kepadamu.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-slate-900">{orders.length}</div>
          <div className="text-xs text-slate-500">Total pesanan ditugaskan</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-indigo-600">{active.length}</div>
          <div className="text-xs text-slate-500">Sedang berjalan</div>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold text-slate-900">Daftar Klien</h2>
      {orders.length === 0 ? (
        <div className="card mt-4 p-8 text-center text-slate-500">
          Belum ada klien yang ditugaskan. Admin akan menugaskan setelah pembayaran masuk.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => {
            const pct = o.progresses.reduce((m, p) => Math.max(m, p.percent), 0);
            return (
              <Link
                key={o.id}
                href={`/dashboard/mentor/orders/${o.id}`}
                className="card card-hover block p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">{o.code} · {formatDate(o.createdAt)}</div>
                    <div className="mt-0.5 font-semibold text-slate-900">{o.user.name}</div>
                    <div className="text-xs text-slate-500">Skripsi {o.package.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pct > 0 && <span className="text-sm font-bold text-slate-700">{pct}%</span>}
                    <OrderStatusBadge status={o.status} />
                  </div>
                </div>
                {pct > 0 && (
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">Selesai: {done} pesanan.</p>
    </div>
  );
}