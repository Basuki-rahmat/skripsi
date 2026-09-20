import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { listReports } from "@/lib/reports";
import ReportView from "@/components/app/report-view";

export const metadata = { title: "Detail Laporan" };

export default async function MasyarakatReportDetailPage({
  params,
}: PageProps<"/app/masyarakat/laporan/[id]">) {
  const session = await auth();
  if (!session?.user) notFound();

  const { id } = await params;
  const report = (await listReports({ where: { id }, take: 1 }))[0];

  if (!report || report.userId !== session.user.id) notFound();

  return <ReportView report={report} />;
}