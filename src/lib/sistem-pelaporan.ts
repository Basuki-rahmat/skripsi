import { createPool, type Pool } from "mariadb";

export * from "./pelaporan-meta";

export interface PelaporanReport {
  code: string;
  title: string;
  status: string;
}

export interface PelaporanMarker {
  code: string;
  title: string;
  status: string;
  lat: number;
  lng: number;
}

export interface PelaporanStatusCount {
  status: string;
  count: number;
}

export interface PelaporanLive {
  total: number;
  reports: PelaporanReport[];
  markers: PelaporanMarker[];
  statusCounts: PelaporanStatusCount[];
}

function pelaporanPoolUrl(): string {
  if (process.env.PELAPORAN_DATABASE_URL) return process.env.PELAPORAN_DATABASE_URL;
  const base = new URL(process.env.DATABASE_URL ?? "mysql://root:@localhost:3306/skripsi_db");
  base.pathname = "/pelaporan_db";
  return base.toString();
}

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (process.env.NEXT_RUNTIME === "edge") return null;
  if (!pool) {
    const url = new URL(pelaporanPoolUrl());
    pool = createPool({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password ?? ""),
      database: url.pathname.replace(/^\//, ""),
      connectionLimit: 2,
    });
  }
  return pool;
}

export async function getPelaporanLive(): Promise<PelaporanLive | null> {
  try {
    const p = getPool();
    if (!p) return null;
    const [rows, total, counts] = await Promise.all([
      p.query("SELECT code, title, status, lat, lng FROM Report ORDER BY createdAt DESC LIMIT 12"),
      p.query("SELECT COUNT(*) AS c FROM Report"),
      p.query("SELECT status, COUNT(*) AS c FROM Report GROUP BY status"),
    ]);
    const typed = rows as { code: string; title: string; status: string; lat: unknown; lng: unknown }[];
    return {
      total: Number(total[0]?.c ?? 0),
      reports: typed.slice(0, 3).map((r) => ({
        code: String(r.code),
        title: String(r.title),
        status: String(r.status),
      })),
      markers: typed.map((r) => ({
        code: String(r.code),
        title: String(r.title),
        status: String(r.status),
        lat: Number(r.lat),
        lng: Number(r.lng),
      })),
      statusCounts: (counts as { status: string; c: unknown }[]).map((r) => ({
        status: String(r.status),
        count: Number(r.c),
      })),
    };
  } catch (err) {
    console.error("[sistem-pelaporan] gagal ambil data live:", err);
    return null;
  }
}