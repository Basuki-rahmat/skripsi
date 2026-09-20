import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import UserRoleSelect from "@/components/dashboard/user-role-select";
import { formatDate } from "@/lib/env";

export const metadata: Metadata = { title: "Pengguna — Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Pengguna</h1>
      <p className="mt-1 text-sm text-slate-500">{users.length} akun terdaftar.</p>

      <div className="card mt-6 p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Pesanan</th>
                <th className="px-4 py-3">Telegram</th>
                <th className="px-4 py-3">Daftar</th>
                <th className="px-4 py-3">Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {u.name}
                    {u.id === session.user.id && <span className="ml-1 text-xs text-indigo-500">(kamu)</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{u.email}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{u._count.orders}</td>
                  <td className="px-4 py-3 text-xs">{u.telegramChatId ? "✅" : "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <UserRoleSelect id={u.id} currentRole={u.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}