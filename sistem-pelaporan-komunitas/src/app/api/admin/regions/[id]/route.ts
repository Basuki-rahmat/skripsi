import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  name: z.string().min(3).optional(),
  level: z.enum(["KECAMATAN", "KELURAHAN", "DESA"]).optional(),
  province: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  district: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/admin/regions/[id]">,
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

  await prisma.region.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/regions/[id]">,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const reportCount = await prisma.report.count({ where: { regionId: id } });
  if (reportCount > 0) {
    return NextResponse.json(
      { error: "Wilayah memiliki laporan dan tidak dapat dihapus." },
      { status: 409 },
    );
  }
  await prisma.region.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}