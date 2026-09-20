import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  description: z.string().max(500).optional().default(""),
  icon: z.string().max(30).optional().default("more"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  const existing = await prisma.category.findUnique({
    where: { name: parsed.data.name },
  });
  if (existing) {
    return NextResponse.json(
      { error: `Kategori "${parsed.data.name}" sudah ada` },
      { status: 409 },
    );
  }

  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json({ id: category.id }, { status: 201 });
}