import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums";
import {
  notifyAdminPaymentConfirmed,
  notifyStudentOrderActive,
  notifyStudentPaymentStatus,
} from "@/bot/notify";

const schema = z.object({
  status: z
    .enum(["PENDING", "PAID", "PROCESSING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  mentorId: z.string().optional().nullable(),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, package: true, payments: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const data: { status?: OrderStatus; mentorId?: string | null } = {};
  if (parsed.data.status) data.status = parsed.data.status as OrderStatus;
  if (parsed.data.mentorId !== undefined) data.mentorId = parsed.data.mentorId;

  const updated = await prisma.order.update({
    where: { id },
    data,
    include: { user: true, package: true, payments: true },
  });

  const newStatus = parsed.data.status;

  if (newStatus === "PAID" && order.status === "PENDING") {
    await prisma.payment.update({
      where: { id: order.payments.at(-1)?.id ?? "" },
      data: { status: "PAID", paidAt: new Date() },
    }).catch(() => {});
    await notifyAdminPaymentConfirmed(updated);
    if (order.user.telegramChatId) {
      await notifyStudentOrderActive(order.user.telegramChatId, order.code);
    }
  }

  if (order.user.telegramChatId && newStatus) {
    await notifyStudentPaymentStatus(order.user.telegramChatId, order.code, newStatus);
  }

  return NextResponse.json({ ok: true, order: updated });
}