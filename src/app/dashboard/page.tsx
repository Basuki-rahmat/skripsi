import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { FileText, Package, CircleCheck } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status";
import UploadProof from "@/components/dashboard/upload-proof";
import TestimonialForm from "@/components/dashboard/testimonial-form";
import { formatIDR, formatDate, telegramLink } from "@/lib/env";
import { makeTelegramLinkToken } from "@/lib/telegram-link";
import { thesisStagesPercent } from "@/lib/thesis-stages";

export const metadata: Metadata = { title: "Dashboard — SkripsiMentor" };

export default async function StudentDashboard({
  searchParams,
}: PageProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const { order: manualOrder, mode } = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { package: true, payments: true, progresses: { orderBy: { createdAt: "asc" } }, thesisStages: true },
    orderBy: { createdAt: "desc" },
  });

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ["PENDING", "PAID", "PROCESSING", "IN_PROGRESS"].includes(o.status)
  ).length;
  const doneOrders = orders.filter((o) => o.status === "COMPLETED").length;

  const latestProgress = orders
    .flatMap((o) => o.progresses)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  const stats = [
    { label: "Total Pesanan", value: totalOrders, icon: Package },
    { label: "Sedang Berjalan", value: activeOrders, icon: FileText },
    { label: "Selesai", value: doneOrders, icon: CircleCheck },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Halo, {user.name.split(" ")[0]} 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500">Pantau pesanan dan progres kamu di sini.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {latestProgress && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <span className="text-lg">📈</span>
          <div className="text-sm">
            <div className="font-semibold text-slate-900">Progres terbaru: {latestProgress.title}</div>
            <div className="mt-0.5 text-slate-600">{latestProgress.note}</div>
          </div>
        </div>
      )}

      {!user.telegramChatId && (() => {
        // Deep-link satu klik: bot otomatis menghubungkan akun ini.
        // Fallback ke link biasa jika NEXTAUTH_SECRET belum tersedia.
        let tgUrl = telegramLink();
        try {
          tgUrl = `${telegramLink()}?start=LINK:${makeTelegramLinkToken(user.id)}`;
        } catch {
          tgUrl = telegramLink();
        }
        return (
          <div className="card mt-6 flex flex-col items-start justify-between gap-3 border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-700">
              🔔 Hubungkan akun Telegram untuk menerima notifikasi status & progres:
            </p>
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm shrink-0"
            >
              Hubungkan Sekali Klik ✈️
            </a>
          </div>
        );
      })()}

      {mode === "manual" && manualOrder && (
        <div className="card mt-6 p-5">
          <UploadProof
            orderId={String(manualOrder)}
            currentUrl={orders.find((o) => o.id === manualOrder)?.payments.at(-1)?.proofUrl}
          />
        </div>
      )}

      <h2 className="mt-10 text-lg font-bold text-slate-900">Daftar Pesanan</h2>
      {orders.length === 0 ? (
        <div className="card mt-4 p-8 text-center">
          <p className="text-slate-500">Kamu belum punya pesanan.</p>
          <Link href="/paket" className="btn-primary mt-4">Lihat Paket</Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((o) => {
            const pay = o.payments.at(-1);
            const pct = Math.max(
              o.progresses.reduce((m, p) => Math.max(m, p.percent), 0),
              thesisStagesPercent(o.thesisStages)
            );
            const hasProgress = o.progresses.length > 0 || o.thesisStages.length > 0;
            return (
              <Link key={o.id} href={`/dashboard/orders/${o.id}`} className="card card-hover block p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-slate-400">{o.code}</div>
                    <div className="mt-0.5 font-semibold text-slate-900">{o.package.name}</div>
                    <div className="text-xs text-slate-500">
                      {formatIDR(o.package.price)} · {formatDate(o.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={o.status} />
                    {pay && <PaymentStatusBadge status={pay.status} />}
                  </div>
                </div>
                {hasProgress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progres</span><span>{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <TestimonialForm />
    </div>
  );
}