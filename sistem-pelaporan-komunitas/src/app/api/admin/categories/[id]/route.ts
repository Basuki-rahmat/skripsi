import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(30).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/admin/categories/[id]">,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  if (parsed.data.name) {
    const existing = await prisma.category.findUnique({
      where: { name: parsed.data.name },
    });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Nama kategori sudah dipakai" }, { status: 409 });
    }
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/categories/[id]">,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const reportCount = await prisma.report.count({ where: { categoryId: id } });
  if (reportCount > 0) {
    return NextResponse.json(
      { error: "Kategori memiliki laporan dan tidak dapat dihapus. Nonaktifkan saja." },
      { status: 409 },
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}