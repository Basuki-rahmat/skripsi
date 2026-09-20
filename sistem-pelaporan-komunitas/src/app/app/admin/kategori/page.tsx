import { prisma } from "@/lib/db";
import { CategoryManager } from "@/components/app/admin/category-manager";

export const metadata = { title: "Kategori" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      _count: { select: { reports: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kategori Laporan</h1>
        <p className="text-sm text-slate-500">Kelola kategori pelaporan.</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}