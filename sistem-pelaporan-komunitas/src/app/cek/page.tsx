import { Suspense } from "react";
import PublicLayout from "@/components/public-layout";
import { CekForm } from "@/components/cek-form";
import { Card } from "@/components/ui";

export const metadata = { title: "Cek Status Laporan" };

export default async function CekPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-lg flex-col justify-center px-4 py-16">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Cek Status Laporan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Masukkan nomor tiket untuk memantau perkembangan pengaduan Anda.
          </p>
        </div>
        <Card className="p-6">
          <Suspense fallback={null}>
            <CekForm initialCode={code} />
          </Suspense>
        </Card>
      </div>
    </PublicLayout>
  );
}