import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { notifyAdminPaymentReceived } from "@/bot/notify";

// Terima path relatif dari /api/upload (mis. "/uploads/xxx.png") atau URL http(s) absolut.
const isValidProofUrl = (v: string) =>
  v.startsWith("/uploads/") || /^https?:\/\/\S+$/.test(v);

const schema = z.object({
  orderId: z.string().min(1),
  proofUrl: z.string().min(1).refine(isValidProofUrl, {
    message: "URL bukti tidak valid (harus path /uploads/ atau URL http/https)",
  }),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { user: true, package: true, payments: true },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const payment = order.payments.at(-1);
  if (!payment) {
    return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      method: "TRANSFER_MANUAL",
      status: "PENDING",
      proofUrl: parsed.data.proofUrl,
    },
  });

  await notifyAdminPaymentReceived(order);

  return NextResponse.json({ ok: true });
}