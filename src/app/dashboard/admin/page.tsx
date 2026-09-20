import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  Package,
  ShoppingBag,
  Users,
  FileText,
  MessageSquareQuote,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status";
import { formatIDR, formatDate } from "@/lib/env";

export const metadata: Metadata = { title: "Ringkasan Admin — SkripsiMentor" };

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const [orderCount, userCount, packageCount, postCount, testiCount, pendingPayments, orders] =
    await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.package.count(),
      prisma.post.count(),
      prisma.testimonial.count({ where: { isApproved: false } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        include: { user: true, package: true, payments: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const stats = [
    { label: "Pesanan", value: orderCount, icon: ShoppingBag, href: "/dashboard/admin/orders" },
    { label: "Pengguna", value: userCount, icon: Users, href: "/dashboard/admin/users" },
    { label: "Paket", value: packageCount, icon: Package, href: "/dashboard/admin/packages" },
    { label: "Artikel", value: postCount, icon: FileText, href: "/dashboard/admin/posts" },
    { label: "Testimoni (menunggu)", value: testiCount, icon: MessageSquareQuote, href: "/dashboard/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Ringkasan Admin</h1>
      <p className="mt-1 text-sm text-slate-500">Pantau seluruh operasional layanan.</p>

      {pendingPayments > 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-slate-700">
            Ada <strong>{pendingPayments}</strong> pembayaran menunggu konfirmasi.
            <Link href="/dashboard/admin/orders" className="ml-1 font-semibold text-amber-700 underline">
              Proses sekarang
            </Link>
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Pesanan Terbaru</h2>
      <div className="card mt-4 p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Klien</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bayar</th>
                <th className="px-4 py-3">Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((o) => {
                const pay = o.payments.at(-1);
                return (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{o.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{o.user.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{o.package.name}</td>
                    <td className="px-4 py-3">{formatIDR(o.package.price)}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">{pay && <PaymentStatusBadge status={pay.status} />}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(o.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {orderCount > 0 && (
        <Link href="/dashboard/admin/orders" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
          <CheckCircle2 className="h-4 w-4" /> Lihat semua pesanan →
        </Link>
      )}
    </div>
  );
}