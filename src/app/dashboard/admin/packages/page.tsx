import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import PackageManager from "@/components/dashboard/package-manager";

export const metadata: Metadata = { title: "Paket & Harga — Admin" };

export default async function AdminPackagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const packages = await prisma.package.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { price: "asc" },
  });

  const views = packages.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    price: p.price,
    description: p.description,
    duration: p.duration,
    features: Array.isArray(p.features)
      ? p.features.filter((f): f is string => typeof f === "string")
      : [],
    isActive: p.isActive,
    orderCount: p._count.orders,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Paket & Harga</h1>
      <p className="mt-1 text-sm text-slate-500">
        Kelola paket bimbingan dan pembuatan skripsi — tambah, edit, maupun hapus.
      </p>

      <div className="mt-6">
        <PackageManager packages={views} />
      </div>
    </div>
  );
}