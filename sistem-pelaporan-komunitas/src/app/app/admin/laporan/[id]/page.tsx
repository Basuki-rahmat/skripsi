import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listReports } from "@/lib/reports";
import ReportView from "@/components/app/report-view";
import { AdminActions } from "@/components/app/admin-actions";
import { Card } from "@/components/ui";

export const metadata = { title: "Detail Laporan" };

export default async function AdminReportDetailPage({
  params,
}: PageProps<"/app/admin/laporan/[id]">) {
  const session = await auth();
  if (!session?.user) notFound();

  const { id } = await params;
  const report = (await listReports({ where: { id }, take: 1 }))[0];
  if (!report) notFound();

  const [officers, assigned] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true, role: { in: ["PETUGAS", "ADMIN"] } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    report.assignedToId
      ? prisma.user.findUnique({
          where: { id: report.assignedToId },
          select: { name: true },
        })
      : null,
  ]);

  return (
    <ReportView
      report={report}
      actions={
        <Card className="w-full max-w-sm p-4 lg:w-80">
          <AdminActions
            reportId={report.id}
            status={report.status}
            priority={report.priority}
            officers={officers}
            assignedName={assigned?.name}
          />
        </Card>
      }
    />
  );
}