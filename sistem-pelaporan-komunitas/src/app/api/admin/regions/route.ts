import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(3, "Nama wilayah minimal 3 karakter"),
  level: z.enum(["KECAMATAN", "KELURAHAN", "DESA"]).default("KELURAHAN"),
  province: z.string().min(2),
  city: z.string().min(2),
  district: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
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

  const region = await prisma.region.create({ data: parsed.data });
  return NextResponse.json({ id: region.id }, { status: 201 });
}