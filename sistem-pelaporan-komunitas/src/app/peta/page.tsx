import PublicLayout from "@/components/public-layout";
import PetaMapLoader from "@/components/map/public-map-loader";
import { Card } from "@/components/ui";

export const metadata = { title: "Peta Laporan" };

export default function PetaPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Peta Laporan Komunitas</h1>
          <p className="mt-1 text-slate-600">
            Sebaran laporan warga berdasarkan kategori, status, dan wilayah.
            Klik marker untuk melihat detail.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Marker diberi warna sesuai status laporan; klik untuk melihat ringkasan.
          </p>
        </div>
        <Card className="p-4">
          <PetaMapLoader />
        </Card>
      </div>
    </PublicLayout>
  );
}