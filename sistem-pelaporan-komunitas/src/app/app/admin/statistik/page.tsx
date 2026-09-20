import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStats } from "@/lib/stats";
import { StatsView } from "@/components/app/admin/stats-view";

export const metadata = { title: "Statistik" };

export default async function AdminStatsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const stats = await getStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistik Laporan</h1>
        <p className="text-sm text-slate-500">
          Ringkasan data untuk evaluasi dan bahan laporan.
        </p>
      </div>
      <StatsView stats={stats} />
    </div>
  );
}