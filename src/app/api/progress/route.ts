import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import {
  notifyStudentProgress,
  notifyStudentOrderActive,
} from "@/bot/notify";

const progressSchema = z.object({
  orderId: z.string().min(1),
  title: z.string().min(3, "Judul tahapan minimal 3 karakter"),
  note: z.string().max(3000).optional(),
  percent: z.number().int().min(0).max(100),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }
  if (session.user.role !== "MENTOR" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { user: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const progress = await prisma.progress.create({
    data: {
      orderId: order.id,
      mentorId: session.user.id,
      title: parsed.data.title,
      note: parsed.data.note,
      percent: parsed.data.percent,
    },
  });

  if (order.status === "PAID") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "IN_PROGRESS" },
    });
    if (order.user.telegramChatId) {
      await notifyStudentOrderActive(order.user.telegramChatId, order.code);
    }
  }

  if (order.user.telegramChatId) {
    await notifyStudentProgress(
      order.user.telegramChatId,
      order.code,
      progress.title,
      progress.note,
      progress.percent
    );
  }

  if (progress.percent >= 100) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" },
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}