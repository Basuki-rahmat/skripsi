import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3),
  type: z.enum(["BIMBINGAN", "PEMBUATAN"]),
  price: z.coerce.number().int().positive(),
  description: z.string().max(3000).optional(),
  duration: z.string().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const features = (parsed.data.features ?? []).map((f) => f.trim()).filter(Boolean);

  const pkg = await prisma.package.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      price: parsed.data.price,
      description: parsed.data.description,
      duration: parsed.data.duration,
      features,
      isActive: parsed.data.isActive ?? true,
    },
  });

  return NextResponse.json({ pkg }, { status: 201 });
}