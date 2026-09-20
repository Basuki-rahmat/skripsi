import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ReportStatus, ReportPriority } from "@/generated/prisma/enums";

const patchSchema = z.object({
  action: z.enum(["verify", "reject", "assign", "priority", "complete"]),
  officerId: z.string().optional(),
  verificationNote: z.string().max(1000).optional(),
  priority: z.enum(["RENDAH", "SEDANG", "TINGGI", "URGENT"]).optional(),
});

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/admin/reports/[id]">,
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

  const { action, officerId, verificationNote, priority } = parsed.data;

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }

  if (action === "assign" || action === "verify") {
    if (officerId) {
      const officer = await prisma.user.findFirst({
        where: { id: officerId, role: { in: ["PETUGAS", "ADMIN"] } },
      });
      if (!officer) {
        return NextResponse.json({ error: "Petugas tidak ditemukan" }, { status: 400 });
      }
    }
  }

  let status: ReportStatus | undefined;
  let verifiedAt: Date | undefined;
  let assignedAt: Date | undefined;
  let closedAt: Date | undefined;

  if (action === "verify") {
    status = "DIPROSES";
    verifiedAt = new Date();
  }
  if (action === "reject") {
    status = "VERIFIKASI_DITOLAK";
  }
  if (action === "assign") {
    status = "DIPROSES";
    assignedAt = new Date();
  }
  if (action === "complete") {
    status = "SELESAI";
    closedAt = new Date();
  }

  const updated = await prisma.$transaction(async (tx) => {
    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (verifiedAt) {
      data.verifiedAt = verifiedAt;
      data.verifiedById = session.user.id;
    }
    if (assignedAt) {
      data.assignedAt = assignedAt;
      data.assignedToId = officerId ?? undefined;
    }
    if (closedAt) data.closedAt = closedAt;
    if (action === "reject" && verificationNote !== undefined) {
      data.verificationNote = verificationNote;
    }
    if (priority) data.priority = priority as ReportPriority;

    const updatedReport = await tx.report.update({
      where: { id },
      data,
    });

    if (status && status !== report.status) {
      const message =
        status === "VERIFIKASI_DITOLAK"
          ? `Laporan ${report.code} ditolak verifikasi. ${verificationNote ? `Alasan: ${verificationNote}` : ""}`
          : status === "SELESAI"
            ? `Laporan ${report.code} telah selesai ditindaklanjuti.`
            : status === "DIPROSES"
              ? `Laporan ${report.code} telah diverifikasi dan sedang diproses petugas.`
              : `Laporan ${report.code} berubah status menjadi diproses.`;

      await tx.notification.create({
        data: {
          userId: report.userId,
          reportId: id,
          message,
        },
      });
    }

    return updatedReport;
  });

  return NextResponse.json({ ok: true, status: updated.status });
}