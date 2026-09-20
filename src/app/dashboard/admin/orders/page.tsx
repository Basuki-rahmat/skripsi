import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status";
import { formatIDR, formatDate } from "@/lib/env";

export const metadata: Metadata = { title: "Pesanan — Admin" };

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const orders = await prisma.order.findMany({
    include: { user: true, package: true, payments: true, mentor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Semua Pesanan</h1>
      <p className="mt-1 text-sm text-slate-500">{orders.length} pesanan terdaftar.</p>

      <div className="card mt-6 p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Klien</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Mentor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bayar</th>
                <th className="px-4 py-3">Dibuat</th>
                <th className="px-4 py-3" />
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
                    <td className="px-4 py-3 text-xs text-slate-600">{o.mentor?.name ?? "—"}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">{pay && <PaymentStatusBadge status={pay.status} />}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/admin/orders/${o.id}`} className="text-xs font-semibold text-indigo-600 hover:underline">
                        Kelola →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="card mt-6 p-8 text-center text-slate-500">Belum ada pesanan.</div>
      )}
    </div>
  );
}