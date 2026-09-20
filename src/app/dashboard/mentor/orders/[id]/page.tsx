import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status";
import ProgressForm from "@/components/dashboard/progress-form";
import ThesisRoadmap from "@/components/dashboard/thesis-roadmap";
import { formatIDR, formatDate } from "@/lib/env";
import {
  ensureThesisStages,
  sortStages,
  thesisStagesPercent,
} from "@/lib/thesis-stages";

export const metadata: Metadata = { title: "Detail Klien — Mentor" };

export default async function MentorOrderDetailPage({
  params,
}: PageProps<"/dashboard/mentor/orders/[id]">) {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "MENTOR") redirect("/");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      package: true,
      payments: true,
      progresses: { include: { mentor: true }, orderBy: { createdAt: "asc" } },
      thesisStages: { include: { updatedBy: true } },
    },
  });

  if (!order || order.mentorId !== user.id) notFound();

  await ensureThesisStages(order.id);
  const loadedOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      package: true,
      payments: true,
      progresses: { include: { mentor: true }, orderBy: { createdAt: "asc" } },
      thesisStages: { include: { updatedBy: true } },
    },
  });
  if (!loadedOrder) notFound();

  const pay = loadedOrder.payments.at(-1);
  const lastPercent = loadedOrder.progresses.reduce((m, p) => Math.max(m, p.percent), 0);
  const stages = sortStages(
    loadedOrder.thesisStages.map((s) => ({
      id: s.id,
      key: s.key,
      title: s.title,
      status: s.status,
      note: s.note,
      updatedBy: s.updatedBy?.name,
      updatedAt: s.updatedAt,
    }))
  );
  const stagePercent = thesisStagesPercent(stages);

  return (
    <div>
      <Link href="/dashboard/mentor" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Kembali
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{loadedOrder.user.name}</h1>
        <OrderStatusBadge status={loadedOrder.status} />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="font-mono">{loadedOrder.code}</span>
        <span>{loadedOrder.user.email}</span>
        {loadedOrder.user.telegramChatId && <span>🔗 Telegram terhubung</span>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ThesisRoadmap
            orderId={loadedOrder.id}
            stages={stages}
            percent={stagePercent}
            editable
          />

          <div className="card p-6">
            <h2 className="font-bold text-slate-900">Progres ({lastPercent}%)</h2>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${lastPercent}%` }}
              />
            </div>
            {loadedOrder.progresses.length > 0 ? (
              <ol className="mt-5 space-y-4">
                {loadedOrder.progresses.map((p) => (
                  <li key={p.id} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{p.title}</span>
                      <span className="text-xs font-bold text-indigo-600">{p.percent}%</span>
                      <span className="text-xs text-slate-400">{formatDate(p.createdAt)}</span>
                    </div>
                    {p.note && <p className="mt-1 text-sm text-slate-600">{p.note}</p>}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Belum ada progres.</p>
            )}
          </div>

          <ProgressForm orderId={loadedOrder.id} initialPercent={lastPercent} />
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-bold text-slate-900">Info Pesanan</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Paket</dt><dd className="font-medium text-slate-800">{loadedOrder.package.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Harga</dt><dd>{formatIDR(loadedOrder.package.price)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Tipe</dt><dd className="capitalize">{loadedOrder.package.type.toLowerCase()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Durasi</dt><dd>{loadedOrder.package.duration ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Dimulai</dt><dd>{formatDate(loadedOrder.createdAt)}</dd></div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Status Bayar</dt>
              <dd>{pay && <PaymentStatusBadge status={pay.status} />}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}