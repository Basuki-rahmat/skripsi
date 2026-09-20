import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3).optional(),
  type: z.enum(["BIMBINGAN", "PEMBUATAN"]).optional(),
  price: z.coerce.number().int().positive().optional(),
  description: z.string().max(3000).nullable().optional(),
  duration: z.string().nullable().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/packages/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const data = { ...parsed.data } as Record<string, unknown>;
  if (data.features) {
    data.features = (parsed.data.features ?? []).map((f) => f.trim()).filter(Boolean);
  }

  const pkg = await prisma.package.update({ where: { id }, data });
  return NextResponse.json({ pkg });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/packages/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const count = await prisma.order.count({ where: { packageId: id } });
  if (count > 0) {
    await prisma.package.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ ok: true, deactivated: true });
  }

  await prisma.package.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}