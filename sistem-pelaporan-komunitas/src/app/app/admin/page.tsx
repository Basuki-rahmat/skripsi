import { Link2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listReports } from "@/lib/reports";
import { ReportList } from "@/components/app/report-list";
import { Card } from "@/components/ui";

export const metadata = { title: "Dashboard Admin" };

const ACTIVE_STATUSES = ["DIPROSES", "DITINDAKLANJUTI"];

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [reports, users, recent] = await Promise.all([
    prisma.report.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.user.count(),
    listReports({ take: 10 }),
  ]);

  const countOf = (s: string) =>
    reports.find((r) => r.status === s)?._count?._all ?? 0;

  const pending = countOf("MENUNGGU_VERIFIKASI");
  const active = ACTIVE_STATUSES.reduce((acc, s) => acc + countOf(s), 0);
  const done = countOf("SELESAI");
  const total = reports.reduce((acc, r) => acc + r._count._all, 0);

  const stats = [
    { label: "Total Laporan", value: total, href: "/app/admin/laporan" },
    { label: "Menunggu Verifikasi", value: pending, href: "/app/admin/verifikasi", highlight: pending > 0 },
    { label: "Sedang Ditangani", value: active, href: "/app/admin/laporan" },
    { label: "Selesai", value: done, href: "/app/admin/laporan" },
    { label: "Pengguna Terdaftar", value: users, href: "/app/admin/pengguna" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-sm text-slate-500">Ringkasan laporan dan pengguna.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card
              className={`p-4 transition-shadow hover:shadow-md ${s.highlight ? "border-amber-300 bg-amber-50" : ""}`}
            >
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600">
                <Link2 className="h-3 w-3" /> buka
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold">Laporan Terbaru</h2>
          <Link href="/app/admin/laporan" className="text-sm text-blue-600 hover:underline">
            Lihat semua
          </Link>
        </div>
        <ReportList reports={recent} baseHref="/app/admin/laporan" />
      </div>
    </div>
  );
}