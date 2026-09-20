import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui";
import { UserActions } from "@/components/app/admin/user-actions";
import { ROLE_LABEL } from "@/lib/constants";

export const metadata = { title: "Kelola Pengguna" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      _count: { select: { reports: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
        <p className="text-sm text-slate-500">
          Ubah peran atau aktif/nonaktifkan akun pengguna.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Peran</th>
              <th className="px-4 py-2">Laporan</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 font-semibold">{u.name}</td>
                <td className="px-4 py-2 text-slate-500">{u.email}</td>
                <td className="px-4 py-2">
                  <Badge className="bg-emerald-50 text-emerald-700">
                    {ROLE_LABEL[u.role]}
                  </Badge>
                </td>
                <td className="px-4 py-2">{u._count.reports}</td>
                <td className="px-4 py-2">
                  <Badge
                    className={
                      u.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {u.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  <UserActions
                    userId={u.id}
                    role={u.role}
                    isActive={u.isActive}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}