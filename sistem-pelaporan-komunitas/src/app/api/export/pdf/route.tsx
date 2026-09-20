import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getExportRows, parseExportParams } from "@/lib/export-data";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    textAlign: "center",
    color: "#555555",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#059669",
    color: "#ffffff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
  },
  cellCenter: { textAlign: "center" },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#888888",
  },
});

const COLS = [
  { w: "3%", key: "no" },
  { w: "11%", key: "code" },
  { w: "26%", key: "title" },
  { w: "11%", key: "category" },
  { w: "9%", key: "region" },
  { w: "10%", key: "status" },
  { w: "7%", key: "priority" },
  { w: "11%", key: "reporter" },
  { w: "12%", key: "createdAt" },
] as const;

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const where = parseExportParams(new URL(req.url));
  const rows = await getExportRows(where);

  const date = new Date().toLocaleDateString("id-ID", {
    dateStyle: "long",
  });
  const time = new Date().toLocaleString("id-ID", {
    timeStyle: "short",
  });

  const doc = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>REKAP LAPORAN MASYARAKAT</Text>
        <Text style={styles.subtitle}>
          {`Sistem Pelaporan Komunitas | ${rows.length} laporan | Diekspor ${date} ${time}`}
        </Text>

        <View fixed style={styles.headerRow}>
          {COLS.map((c) => (
            <Text key={c.key} style={[styles.cell, { width: c.w, flexGrow: 0 }]}>
              {HEADER[c.key]}
            </Text>
          ))}
        </View>

        {rows.map((r, i) => (
          <View key={r.code} style={[styles.row, i % 2 === 1 ? { backgroundColor: "#f8fafc" } : {}]}>
            <Text style={[styles.cell, { width: COLS[0].w }, styles.cellCenter]}>{i + 1}</Text>
            <Text style={[styles.cell, { width: COLS[1].w }]}>{r.code}</Text>
            <Text style={[styles.cell, { width: COLS[2].w }]}>{r.title}</Text>
            <Text style={[styles.cell, { width: COLS[3].w }]}>{r.category}</Text>
            <Text style={[styles.cell, { width: COLS[4].w }]}>{r.region}</Text>
            <Text style={[styles.cell, { width: COLS[5].w }]}>{r.status}</Text>
            <Text style={[styles.cell, { width: COLS[6].w }]}>{r.priority}</Text>
            <Text style={[styles.cell, { width: COLS[7].w }]}>{r.reporter}</Text>
            <Text style={[styles.cell, { width: COLS[8].w }]}>
              {r.createdAt.toLocaleDateString("id-ID")}
            </Text>
          </View>
        ))}

        <View fixed style={styles.footer}>
          <Text>Sistem Pelaporan Komunitas Berbasis Web dan GIS</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  const dateFile = new Date().toISOString().slice(0, 10);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rekap-laporan-${dateFile}.pdf"`,
    },
  });
}

const HEADER: Record<string, string> = {
  no: "No",
  code: "No. Tiket",
  title: "Judul",
  category: "Kategori",
  region: "Wilayah",
  status: "Status",
  priority: "Prioritas",
  reporter: "Pelapor",
  createdAt: "Tanggal",
};