import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

const orderStyles: Record<OrderStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  PAID: "bg-emerald-100 text-emerald-700",
  PROCESSING: "bg-sky-100 text-sky-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-600 text-white",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-slate-100 text-slate-500",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-100 text-slate-500",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`badge ${orderStyles[status]}`}>{status.replace("_", " ")}</span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`badge ${paymentStyles[status]}`}>{status.replace("_", " ")}</span>
  );
}