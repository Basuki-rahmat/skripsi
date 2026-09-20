import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ReportStatus } from "@/generated/prisma/enums";

const followUpSchema = z.object({
  reportId: z.string().min(1),
  note: z.string().min(5, "Catatan minimal 5 karakter"),
  photoUrl: z.string().optional().default(""),
  statusAfter: z.enum(["DITINDAKLANJUTI", "SELESAI"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }
  if (!["PETUGAS", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = followUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  const { reportId, note, photoUrl, statusAfter } = parsed.data;

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) {
    return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }
  if (report.status === "SELESAI") {
    return NextResponse.json(
      { error: "Laporan sudah selesai ditindaklanjuti" },
      { status: 409 },
    );
  }

  const status: ReportStatus = statusAfter;

  await prisma.$transaction(async (tx) => {
    await tx.followUp.create({
      data: {
        reportId,
        officerId: session.user.id,
        note,
        photoUrl: photoUrl || undefined,
        statusAfter: status,
      },
    });

    await tx.report.update({
      where: { id: reportId },
      data: {
        status,
        assignedToId: report.assignedToId ?? session.user.id,
        assignedAt: report.assignedAt ?? new Date(),
        closedAt: status === "SELESAI" ? new Date() : undefined,
      },
    });

    await tx.notification.create({
      data: {
        userId: report.userId,
        reportId,
        message:
          status === "SELESAI"
            ? `Laporan ${report.code} telah selesai ditindaklanjuti. Terima kasih atas laporannya.`
            : `Laporan ${report.code} sedang ditindaklanjuti.`,
      },
    });
  });

  return NextResponse.json({ ok: true });
}