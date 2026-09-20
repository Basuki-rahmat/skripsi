import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { listReports } from "@/lib/reports";
import ReportView from "@/components/app/report-view";
import { FollowUpForm } from "@/components/app/follow-up-form";
import { Card } from "@/components/ui";

export const metadata = { title: "Detail Laporan" };

export default async function PetugasReportDetailPage({
  params,
}: PageProps<"/app/petugas/laporan/[id]">) {
  const session = await auth();
  if (!session?.user) notFound();

  const { id } = await params;
  const report = (await listReports({ where: { id }, take: 1 }))[0];
  if (!report) notFound();

  return (
    <ReportView
      report={report}
      actions={
        report.status !== "SELESAI" && report.status !== "VERIFIKASI_DITOLAK" ? (
          <Card className="w-full max-w-sm p-4 lg:w-80">
            <FollowUpForm reportId={report.id} />
          </Card>
        ) : undefined
      }
    />
  );
}