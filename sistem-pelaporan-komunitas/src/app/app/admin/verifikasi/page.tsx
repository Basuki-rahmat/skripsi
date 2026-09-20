import { prisma } from "@/lib/db";
import { listReports } from "@/lib/reports";
import { ReportList } from "@/components/app/report-list";
import { Card } from "@/components/ui";

export const metadata = { title: "Verifikasi Laporan" };

export default async function AdminVerifikasiPage() {
  const [pending, rejectedCount] = await Promise.all([
    listReports({
      where: { status: "MENUNGGU_VERIFIKASI" },
      take: 100,
    }),
    prisma.report.count({ where: { status: "VERIFIKASI_DITOLAK" } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verifikasi Laporan</h1>
        <p className="text-sm text-slate-500">
          {pending.length} laporan menunggu verifikasi.{" "}
          {rejectedCount > 0 && (
            <span className="text-red-600">{rejectedCount} laporan ditolak.</span>
          )}
        </p>
      </div>

      {pending.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">
          Tidak ada laporan yang menunggu verifikasi.
        </Card>
      ) : (
        <ReportList reports={pending} baseHref="/app/admin/laporan" />
      )}
    </div>
  );
}