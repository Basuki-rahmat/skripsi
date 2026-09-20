export interface PelaporanStatusMeta {
  label: string;
  badge: string;
  color: string;
}

export const PELAPORAN_STATUS_META: Record<string, PelaporanStatusMeta> = {
  MENUNGGU_VERIFIKASI: { label: "Menunggu Verifikasi", badge: "bg-slate-100 text-slate-600", color: "#64748b" },
  VERIFIKASI_DITOLAK: { label: "Ditolak", badge: "bg-red-100 text-red-700", color: "#ef4444" },
  DIPROSES: { label: "Diproses", badge: "bg-amber-100 text-amber-700", color: "#f59e0b" },
  DITINDAKLANJUTI: { label: "Ditindaklanjuti", badge: "bg-sky-100 text-sky-700", color: "#0ea5e9" },
  SELESAI: { label: "Selesai", badge: "bg-emerald-100 text-emerald-700", color: "#10b981" },
};

export function pelaporanStatusLabel(status: string): string {
  return PELAPORAN_STATUS_META[status]?.label ?? status;
}

export function pelaporanStatusColor(status: string): string {
  return PELAPORAN_STATUS_META[status]?.color ?? "#10b981";
}