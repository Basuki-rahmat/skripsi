import { prisma } from "@/lib/db";
import { RegionManager } from "@/components/app/admin/region-manager";

export const metadata = { title: "Wilayah" };

export default async function AdminRegionsPage() {
  const regions = await prisma.region.findMany({
    select: {
      id: true,
      name: true,
      level: true,
      city: true,
      district: true,
      lat: true,
      lng: true,
      _count: { select: { reports: true } },
    },
    orderBy: [{ level: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wilayah</h1>
        <p className="text-sm text-slate-500">
          Kelola kecamatan dan kelurahan/desa untuk peta dan pelaporan.
        </p>
      </div>
      <RegionManager regions={regions} />
    </div>
  );
}