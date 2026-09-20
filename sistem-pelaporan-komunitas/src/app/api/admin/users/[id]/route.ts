import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  role: z.enum(["MASYARAKAT", "PETUGAS", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/admin/users/[id]">,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Tidak dapat mengubah akun sendiri" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  await prisma.user.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}