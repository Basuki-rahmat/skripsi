import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listReports } from "@/lib/reports";
import { ReportList } from "@/components/app/report-list";
import { Card } from "@/components/ui";
import type { ReportStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Dashboard Petugas" };

const ACTIVE_STATUSES: ReportStatus[] = ["DIPROSES", "DITINDAKLANJUTI"];

export default async function PetugasDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [queue, mine] = await Promise.all([
    listReports({
      where: { status: { in: ACTIVE_STATUSES } },
      take: 50,
    }),
    listReports({
      where: { assignedToId: session.user.id },
      take: 50,
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Halo, {session.user.name}</h1>
        <p className="text-sm text-slate-500">
          Kelola laporan yang menunggu tindak lanjut di lapangan.
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-bold">Antrean Laporan Aktif</h2>
        <ReportList reports={queue} baseHref="/app/petugas/laporan" />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">Laporan yang Saya Tangani</h2>
        {mine.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            Belum ada laporan yang ditugaskan kepada Anda.
          </Card>
        ) : (
          <ReportList reports={mine} baseHref="/app/petugas/laporan" />
        )}
      </section>
    </div>
  );
}