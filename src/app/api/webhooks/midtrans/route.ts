import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { envVar } from "@/lib/env";
import { PaymentStatus } from "@/generated/prisma/enums";
import {
  notifyAdminPaymentReceived,
  notifyStudentPaymentStatus,
} from "@/bot/notify";

const SERVER_KEY = () => envVar("MIDTRANS_SERVER_KEY");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const {
    order_id,
    transaction_status,
    status_code,
    gross_amount,
    signature_key,
    transaction_id,
    fraud_status,
  } = body;

  const rawGross = String(gross_amount ?? "").split(".")[0];
  const expectedSignature = crypto
    .createHash("sha512")
    .update(`${SERVER_KEY()}${order_id}${status_code}${rawGross}`)
    .digest("hex");

  if (expectedSignature !== signature_key) {
    return NextResponse.json({ error: "invalid signature" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { code: order_id },
    include: { user: true, package: true, payments: true },
  });

  if (!order) {
    return NextResponse.json({ error: "order not found" }, { status: 404 });
  }

  const payment = order.payments.at(-1);
  if (!payment) {
    return NextResponse.json({ error: "payment not found" }, { status: 404 });
  }

  let paymentStatus = "PENDING";
  if (transaction_status === "capture" && fraud_status === "accept") {
    paymentStatus = "PAID";
  } else if (transaction_status === "settlement") {
    paymentStatus = "PAID";
  } else if (["deny", "cancel", "expire", "failure"].includes(transaction_status)) {
    paymentStatus = "FAILED";
  } else if (transaction_status === "expire") {
    paymentStatus = "EXPIRED";
  }

  const isPaid = paymentStatus === "PAID";

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: paymentStatus as PaymentStatus,
      transactionId: transaction_id,
      midtransResponse: body,
      paidAt: isPaid ? new Date() : null,
    },
  });

  if (isPaid && order.status === "PENDING") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });
    await notifyAdminPaymentReceived(order);
  } else if (order.status !== "PENDING" && isPaid) {
    await notifyAdminPaymentReceived(order);
  }

  if (order.user.telegramChatId && !isPaid) {
    await notifyStudentPaymentStatus(
      order.user.telegramChatId,
      order.code,
      transaction_status
    );
  }

  return NextResponse.json({ ok: true });
}