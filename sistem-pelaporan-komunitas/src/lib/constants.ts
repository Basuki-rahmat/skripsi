import type { ReportStatus, ReportPriority } from "@/generated/prisma/enums";

export const STATUS_LABEL: Record<ReportStatus, string> = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  VERIFIKASI_DITOLAK: "Verifikasi Ditolak",
  DIPROSES: "Sedang Diproses",
  DITINDAKLANJUTI: "Ditindaklanjuti",
  SELESAI: "Selesai",
};

export const STATUS_STYLE: Record<
  ReportStatus,
  { badge: string; dot: string }
> = {
  MENUNGGU_VERIFIKASI: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  VERIFIKASI_DITOLAK: {
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  DIPROSES: {
    badge: "bg-sky-100 text-sky-800",
    dot: "bg-sky-500",
  },
  DITINDAKLANJUTI: {
    badge: "bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
  },
  SELESAI: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

export const PRIORITY_LABEL: Record<ReportPriority, string> = {
  RENDAH: "Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
  URGENT: "Urgent",
};

export const PRIORITY_STYLE: Record<ReportPriority, string> = {
  RENDAH: "bg-slate-100 text-slate-600",
  SEDANG: "bg-amber-100 text-amber-800",
  TINGGI: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export const ROLE_LABEL: Record<string, string> = {
  MASYARAKAT: "Masyarakat",
  PETUGAS: "Petugas",
  ADMIN: "Admin",
};