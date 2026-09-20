import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { createSnapTransaction } from "@/lib/midtrans";
import { generateOrderCode } from "@/lib/env";
import { notifyAdminNewOrder } from "@/bot/notify";

const schema = z.object({
  packageId: z.string().min(1),
  note: z.string().max(2000).optional(),
  detail: z.any().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const pkg = await prisma.package.findUnique({
    where: { id: parsed.data.packageId },
  });

  if (!pkg || !pkg.isActive) {
    return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const code = generateOrderCode();

  const order = await prisma.order.create({
    data: {
      code,
      userId: user.id,
      packageId: pkg.id,
      type: pkg.type,
      detail: parsed.data.detail ?? undefined,
      note: parsed.data.note,
      status: "PENDING",
    },
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      method: "MIDTRANS",
      status: "PENDING",
      amount: pkg.price,
    },
  });

  let redirectUrl: string | null = null;

  try {
    const tx = await createSnapTransaction({
      orderId: code,
      amount: pkg.price,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
    });
    redirectUrl = tx.redirect_url;
    await prisma.order.update({
      where: { id: order.id },
      data: {
        snapToken: tx.token,
        paymentLink: tx.redirect_url,
      },
    });
  } catch (err) {
    console.error("[Orders] Midtrans gagal, fallback manual:", err);
    await prisma.payment.update({
      where: { id: payment.id },
      data: { method: "TRANSFER_MANUAL" },
    });
    redirectUrl = `/dashboard?order=${order.id}&mode=manual`;
  }

  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { user: true, package: true, payments: true },
  });
  if (fullOrder) {
    await notifyAdminNewOrder(fullOrder);
  }

  return NextResponse.json({ code, orderId: order.id, redirectUrl });
}