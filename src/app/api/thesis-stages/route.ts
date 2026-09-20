import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { ThesisStageStatus } from "@/generated/prisma/enums";
import {
  THESIS_STAGE_TEMPLATE,
  isThesisComplete,
} from "@/lib/thesis-stages";
import { notifyStudentOrderActive } from "@/bot/notify";

const schema = z.object({
  orderId: z.string().min(1),
  key: z.enum(THESIS_STAGE_TEMPLATE.map((s) => s.key) as [string, ...string[]]),
  status: z.nativeEnum(ThesisStageStatus),
  note: z.string().max(3000).optional().nullable(),
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
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { user: true, thesisStages: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }
  if (
    session.user.role === "MENTOR" &&
    order.mentorId !== session.user.id
  ) {
    return NextResponse.json({ error: "Anda bukan mentor yang ditugaskan" }, { status: 403 });
  }

  await prisma.thesisStage.upsert({
    where: { orderId_key: { orderId: order.id, key: parsed.data.key } },
    create: {
      orderId: order.id,
      key: parsed.data.key,
      title: THESIS_STAGE_TEMPLATE.find((s) => s.key === parsed.data.key)?.title ?? parsed.data.key,
      status: parsed.data.status,
      note: parsed.data.note ?? null,
      updatedById: session.user.id,
    },
    update: {
      status: parsed.data.status,
      note: parsed.data.note ?? null,
      updatedById: session.user.id,
    },
  });

  const stages = await prisma.thesisStage.findMany({ where: { orderId: order.id } });

  if (order.status === "PAID" && !isThesisComplete(stages)) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "IN_PROGRESS" },
    });
    if (order.user.telegramChatId) {
      await notifyStudentOrderActive(order.user.telegramChatId, order.code);
    }
  }

  if (isThesisComplete(stages)) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" },
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}