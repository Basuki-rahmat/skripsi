import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateReportCode } from "@/lib/report-code";
import type { ReportStatus } from "@/generated/prisma/enums";

const createSchema = z.object({
  categoryId: z.string().min(1, "Pilih kategori"),
  regionId: z.string().min(1, "Pilih wilayah"),
  title: z.string().min(5, "Judul minimal 5 karakter").max(150),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  address: z.string().max(500).optional().default(""),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  media: z.array(z.string()).max(3).optional().default([]),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const regionId = searchParams.get("regionId");
  const code = searchParams.get("code");

  const where = {
    ...(status ? { status: status as ReportStatus } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(regionId ? { regionId } : {}),
    ...(code ? { code } : {}),
  };

  const reports = await prisma.report.findMany({
    where,
    select: {
      id: true,
      code: true,
      title: true,
      status: true,
      priority: true,
      lat: true,
      lng: true,
      createdAt: true,
      category: { select: { id: true, name: true } },
      region: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  return NextResponse.json(reports);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }
  if (session.user.role !== "MASYARAKAT") {
    return NextResponse.json({ error: "Hanya untuk masyarakat" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  const { categoryId, regionId, title, description, address, lat, lng, media } =
    parsed.data;

  const [category, kecamatan] = await Promise.all([
    prisma.category.findFirst({ where: { id: categoryId, isActive: true } }),
    prisma.region.findFirst({ where: { id: regionId, level: "KECAMATAN" } }),
  ]);

  if (!category) {
    return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 400 });
  }
  if (!kecamatan) {
    return NextResponse.json(
      { error: "Wilayah kecamatan tidak ditemukan" },
      { status: 400 },
    );
  }

  const code = await generateReportCode();

  const report = await prisma.$transaction(async (tx) => {
    const created = await tx.report.create({
      data: {
        code,
        userId: session.user.id,
        categoryId,
        regionId,
        title,
        description,
        address,
        lat,
        lng,
        media: {
          create: media.map((url) => ({ url, type: "IMAGE" })),
        },
      },
    });

    await tx.notification.create({
      data: {
        userId: session.user.id,
        reportId: created.id,
        message: `Laporan ${created.code} diterima dan menunggu verifikasi.`,
      },
    });

    return created;
  });

  return NextResponse.json(
    { id: report.id, code: report.code },
    { status: 201 },
  );
}