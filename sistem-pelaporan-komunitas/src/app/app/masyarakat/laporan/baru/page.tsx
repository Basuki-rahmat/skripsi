import { prisma } from "@/lib/db";
import { Card } from "@/components/ui";
import { ReportForm } from "@/components/app/report-form";

export const metadata = { title: "Buat Laporan" };

export default async function NewReportPage() {
  const [categories, regions] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.region.findMany({
      where: { level: "KECAMATAN" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buat Laporan</h1>
        <p className="text-sm text-slate-500">
          Sampaikan masalah di lingkungan Anda. Lokasi dapat diisi otomatis lewat
          GPS atau dipilih langsung pada peta.
        </p>
      </div>
      <Card className="p-6">
        <ReportForm categories={categories} regions={regions} />
      </Card>
    </div>
  );
}