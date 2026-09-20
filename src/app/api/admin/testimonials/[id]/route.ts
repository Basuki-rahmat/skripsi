import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/testimonials/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  await prisma.testimonial.update({
    where: { id },
    data: { isApproved: Boolean(body?.isApproved) },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/testimonials/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}