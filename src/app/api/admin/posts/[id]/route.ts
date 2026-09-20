import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3).optional(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan dash")
    .optional(),
  excerpt: z.string().max(2000).nullable().optional(),
  content: z.string().min(10).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const data = { ...parsed.data } as Record<string, unknown>;
  if ("published" in data) {
    data.publishedAt = data.published ? new Date() : null;
  }

  const post = await prisma.post.update({ where: { id }, data });
  return NextResponse.json({ post });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/posts/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}