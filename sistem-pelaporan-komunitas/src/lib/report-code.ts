import { prisma } from "@/lib/db";

export async function generateReportCode(): Promise<string> {
  const date = new Date();
  const yyyymmdd =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  return prisma.$transaction(async (tx) => {
    const counter = await tx.counter.upsert({
      where: { date: yyyymmdd },
      update: { seq: { increment: 1 } },
      create: { date: yyyymmdd, seq: 1 },
    });
    return `LAP-${yyyymmdd}-${String(counter.seq).padStart(4, "0")}`;
  });
}