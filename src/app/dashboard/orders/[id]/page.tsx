import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status";
import UploadProof from "@/components/dashboard/upload-proof";
import ThesisRoadmap from "@/components/dashboard/thesis-roadmap";
import { formatIDR, formatDate } from "@/lib/env";
import {
  ensureThesisStages,
  sortStages,
  thesisStagesPercent,
} from "@/lib/thesis-stages";

export const metadata: Metadata = { title: "Detail Pesanan — SkripsiMentor" };

export default async function OrderDetailPage({
  params,
}: PageProps<"/dashboard/orders/[id]">) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      package: true,
      payments: true,
      progresses: {
        include: { mentor: true },
        orderBy: { createdAt: "asc" },
      },
      mentor: true,
      thesisStages: { include: { updatedBy: true } },
    },
  });

  if (!order || order.userId !== user.id) notFound();

  await ensureThesisStages(order.id);
  const loadedOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      package: true,
      payments: true,
      progresses: {
        include: { mentor: true },
        orderBy: { createdAt: "asc" },
      },
      mentor: true,
      thesisStages: { include: { updatedBy: true } },
    },
  });
  if (!loadedOrder) notFound();

  const pay = loadedOrder.payments.at(-1);
  const canUpload =
    pay && pay.status === "PENDING" && pay.method === "TRANSFER_MANUAL";
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
      <Link href="/dashboard/orders" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Kembali
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{loadedOrder.package.name}</h1>
        <OrderStatusBadge status={loadedOrder.status} />
      </div>
      <p className="font-mono text-xs text-slate-400">{loadedOrder.code}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ThesisRoadmap stages={stages} percent={stagePercent} />

          {loadedOrder.progresses.length > 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-900">Timeline Progres</h2>
              <ol className="mt-4 space-y-4">
                {loadedOrder.progresses.map((p) => (
                  <li key={p.id} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{p.title}</span>
                      <span className="text-xs font-bold text-indigo-600">{p.percent}%</span>
                      <span className="text-xs text-slate-400">{formatDate(p.createdAt)}</span>
                    </div>
                    {p.note && <p className="mt-1 text-sm text-slate-600">{p.note}</p>}
                    {p.mentor && (
                      <p className="mt-1 text-xs text-slate-400">oleh {p.mentor.name}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {canUpload && <UploadProof orderId={loadedOrder.id} />}

          {loadedOrder.status === "COMPLETED" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
              🎉 Pesanan selesai. Terima kasih sudah percaya pada kami!
            </div>
          )}
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-bold text-slate-900">Ringkasan</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Harga</dt><dd className="font-semibold text-slate-800">{formatIDR(loadedOrder.package.price)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Tipe</dt><dd className="capitalize">{loadedOrder.package.type.toLowerCase()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Durasi</dt><dd>{loadedOrder.package.duration ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Dibuat</dt><dd>{formatDate(loadedOrder.createdAt)}</dd></div>
            {loadedOrder.mentor && (
              <div className="flex justify-between"><dt className="text-slate-500">Mentor</dt><dd className="font-medium text-slate-800">{loadedOrder.mentor.name}</dd></div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Pembayaran</dt>
              <dd>{pay && <PaymentStatusBadge status={pay.status} />}</dd>
            </div>
            {pay?.method && (
              <div className="flex justify-between"><dt className="text-slate-500">Metode</dt><dd className="capitalize">{pay.method.toLowerCase()}</dd></div>
            )}
          </dl>
          {pay?.proofUrl && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500">Bukti Pembayaran</p>
              <a
                href={pay.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-slate-50"
              >
                Lihat bukti ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}