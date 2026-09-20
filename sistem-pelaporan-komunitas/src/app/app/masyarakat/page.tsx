import { redirect } from "next/navigation";
import Link from "next/link";
import { FilePlus2, CircleCheck, Clock4, LayoutList } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReportList } from "@/components/app/report-list";
import { NotificationsList } from "@/components/app/notifications";
import { Card, Button } from "@/components/ui";

export const metadata = { title: "Dashboard Masyarakat" };

export default async function MasyarakatDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [reports, total, ongoing, done, notifications] = await Promise.all([
    prisma.report.findMany({
      where: { userId },
      include: {
        category: { select: { name: true } },
        region: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.report.count({ where: { userId } }),
    prisma.report.count({
      where: {
        userId,
        status: { in: ["MENUNGGU_VERIFIKASI", "DIPROSES", "DITINDAKLANJUTI"] },
      },
    }),
    prisma.report.count({ where: { userId, status: "SELESAI" } }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  const stats = [
    { label: "Total Laporan", value: total, icon: LayoutList },
    { label: "Sedang Diproses", value: ongoing, icon: Clock4 },
    { label: "Selesai", value: done, icon: CircleCheck },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Halo, {session.user.name}</h1>
          <p className="text-sm text-slate-500">
            Pantau dan buat laporan masalah di lingkungan Anda.
          </p>
        </div>
        <Link href="/app/masyarakat/laporan/baru">
          <Button>
            <FilePlus2 className="h-4 w-4" /> Buat Laporan
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <s.icon className="h-5 w-5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-2 text-lg font-bold">Notifikasi</h2>
        <NotificationsList
          items={notifications}
          baseHref="/app/masyarakat/laporan"
        />
      </div>

      <div>
        <h2 className="mb-2 text-lg font-bold">Riwayat Laporan</h2>
        <ReportList
          reports={reports}
          baseHref="/app/masyarakat/laporan"
        />
      </div>
    </div>
  );
}