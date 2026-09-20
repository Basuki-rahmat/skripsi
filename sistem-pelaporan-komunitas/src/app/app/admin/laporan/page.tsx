import { Suspense } from "react";
import { listReports } from "@/lib/reports";
import { ReportList } from "@/components/app/report-list";
import { Card, Select } from "@/components/ui";
import type { ReportStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Semua Laporan" };

export default async function AdminLaporanPage({
  searchParams,
}: PageProps<"/app/admin/laporan">) {
  const sp = await searchParams;
  const status = (sp.status as string) || "";

  const reports = await listReports({
    where: status ? { status: status as ReportStatus } : {},
    take: 200,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Semua Laporan</h1>
          <p className="text-sm text-slate-500">
            {reports.length} laporan ditemukan.
          </p>
        </div>
        <form method="get" className="flex items-end gap-2">
          <Select
            name="status"
            defaultValue={status}
            className="w-56"
          >
            <option value="">Semua Status</option>
            <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
            <option value="VERIFIKASI_DITOLAK">Verifikasi Ditolak</option>
            <option value="DIPROSES">Sedang Diproses</option>
            <option value="DITINDAKLANJUTI">Ditindaklanjuti</option>
            <option value="SELESAI">Selesai</option>
          </Select>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Terapkan
          </button>
        </form>
      </div>

      <Suspense fallback={<Card className="p-8 text-center text-slate-400">Memuat...</Card>}>
        <ReportList reports={reports} baseHref="/app/admin/laporan" />
      </Suspense>
    </div>
  );
}