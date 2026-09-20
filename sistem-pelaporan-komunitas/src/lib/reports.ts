import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export const reportInclude = {
  category: { select: { id: true, name: true } },
  region: { select: { id: true, name: true, level: true, city: true } },
  media: { select: { id: true, url: true, type: true, caption: true } },
  followUps: {
    include: {
      officer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
  user: { select: { id: true, name: true, email: true, phone: true } },
} satisfies Prisma.ReportInclude;

export type ReportItem = Prisma.ReportGetPayload<{
  include: typeof reportInclude;
}>;

export function listReports(args: Prisma.ReportFindManyArgs = {}) {
  return prisma.report.findMany({
    ...args,
    include: reportInclude,
    orderBy: { createdAt: "desc" },
  }) as Promise<ReportItem[]>;
}