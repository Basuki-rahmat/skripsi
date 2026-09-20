import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getExportRows, parseExportParams, toCsv } from "@/lib/export-data";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const where = parseExportParams(new URL(req.url));
  const rows = await getExportRows(where);
  const csv = toCsv(rows);

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap-laporan-${date}.csv"`,
    },
  });
}