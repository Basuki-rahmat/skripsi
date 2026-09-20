import { prisma } from "@/lib/db";
import type { ReportStatus } from "@/generated/prisma/enums";

export async function getStats() {
  const now = new Date();

  const months: Array<{ label: string; start: Date; end: Date }> = [];
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({
      label: start.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
      start,
      end,
    });
  }

  const [statusCounts, categoryCounts, regionCounts, priorityCounts, reportsInRange, closed] =
    await Promise.all([
      prisma.report.groupBy({ by: ["status"], _count: true }),
      prisma.report.groupBy({ by: ["categoryId"], _count: true }),
      prisma.report.groupBy({ by: ["regionId"], _count: true }),
      prisma.report.groupBy({ by: ["priority"], _count: true }),
      prisma.report.findMany({
        where: {
          createdAt: { gte: months[0].start, lt: months[months.length - 1].end },
        },
        select: { createdAt: true },
      }),
      prisma.report.findMany({
        where: { closedAt: { not: null } },
        select: { createdAt: true, closedAt: true },
      }),
    ]);

  const monthly = months.map((m) => ({
    label: m.label,
    count: reportsInRange.filter((r) => r.createdAt >= m.start && r.createdAt < m.end).length,
  }));

  const statusSummary = statusCounts.map((s) => ({
    status: s.status,
    count: s._count,
  }));

  const topCategories = [...categoryCounts].sort((a, b) => b._count - a._count).slice(0, 10);
  const topRegions = [...regionCounts].sort((a, b) => b._count - a._count).slice(0, 10);

  const [categories, regions] = await Promise.all([
    prisma.category.findMany({
      where: { id: { in: topCategories.map((c) => c.categoryId) } },
      select: { id: true, name: true },
    }),
    prisma.region.findMany({
      where: { id: { in: topRegions.map((r) => r.regionId) } },
      select: { id: true, name: true },
    }),
  ]);

  const catName = new Map(categories.map((c) => [c.id, c.name]));
  const regionName = new Map(regions.map((r) => [r.id, r.name]));

  const avgResolutionDays =
    closed.length === 0
      ? 0
      : Math.round(
          (closed.reduce((acc, r) => {
            const start = r.createdAt.getTime();
            const end = r.closedAt!.getTime();
            return acc + Math.max(0, end - start);
          }, 0) /
            closed.length /
            (1000 * 60 * 60 * 24)) *
            10,
        ) / 10;

  return {
    total: statusSummary.reduce((a, s) => a + s.count, 0),
    monthly,
    statusCounts: statusSummary,
    byCategory: topCategories
      .map((c) => ({ name: catName.get(c.categoryId) ?? "Lainnya", count: c._count }))
      .filter((c) => c.name !== "Lainnya"),
    byRegion: topRegions.map((r) => ({ name: regionName.get(r.regionId) ?? "-", count: r._count })),
    byPriority: priorityCounts.map((p) => ({ priority: p.priority as ReportStatus, count: p._count })),
    avgResolutionDays,
  };
}