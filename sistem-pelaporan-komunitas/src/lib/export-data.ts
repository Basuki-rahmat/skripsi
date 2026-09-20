import { prisma } from "@/lib/db";
import { STATUS_LABEL, PRIORITY_LABEL } from "@/lib/constants";
import type { Prisma } from "@/generated/prisma/client";

export type ExportRow = {
  code: string;
  title: string;
  category: string;
  region: string;
  status: string;
  priority: string;
  reporter: string;
  address: string | null;
  createdAt: Date;
  closedAt: Date | null;
};

export async function getExportRows(where: Prisma.ReportWhereInput = {}) {
  const reports = await prisma.report.findMany({
    where,
    include: {
      category: { select: { name: true } },
      region: { select: { name: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reports.map<ExportRow>((r) => ({
    code: r.code,
    title: r.title,
    category: r.category.name,
    region: r.region.name,
    status: STATUS_LABEL[r.status],
    priority: PRIORITY_LABEL[r.priority],
    reporter: r.user.name,
    address: r.address,
    createdAt: r.createdAt,
    closedAt: r.closedAt,
  }));
}

export function parseExportParams(url: URL): Prisma.ReportWhereInput {
  const status = url.searchParams.get("status");
  const regionId = url.searchParams.get("regionId");
  const categoryId = url.searchParams.get("categoryId");
  return {
    ...(status ? { status: status as never } : {}),
    ...(regionId ? { regionId } : {}),
    ...(categoryId ? { categoryId } : {}),
  };
}

export const EXPORT_HEADERS = [
  "No",
  "No. Tiket",
  "Judul",
  "Kategori",
  "Wilayah",
  "Status",
  "Prioritas",
  "Pelapor",
  "Alamat",
  "Dibuat",
  "Selesai",
];

export function toCsv(rows: ExportRow[]): string {
  const esc = (v: string | number | null | undefined) =>
    `"${String(v ?? "").replaceAll('"', '""')}"`;
  const lines = [EXPORT_HEADERS.map(esc).join(";")];
  rows.forEach((r, i) => {
    lines.push(
      [
        i + 1,
        r.code,
        r.title,
        r.category,
        r.region,
        r.status,
        r.priority,
        r.reporter,
        r.address,
        r.createdAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
        r.closedAt
          ? r.closedAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
          : "",
      ]
        .map(esc)
        .join(";"),
    );
  });
  return "\uFEFF" + lines.join("\r\n");
}