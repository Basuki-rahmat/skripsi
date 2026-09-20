import type { ThesisStageStatus } from "@/generated/prisma/enums";

export type ThesisStageKey =
  | "persiapan"
  | "judul"
  | "bab1"
  | "bab2"
  | "bab3"
  | "bab4"
  | "bab5"
  | "sidang"
  | "revisi";

export interface ThesisStageTemplate {
  key: ThesisStageKey;
  title: string;
  description: string;
}

export const THESIS_STAGE_TEMPLATE: ThesisStageTemplate[] = [
  {
    key: "persiapan",
    title: "Persiapan Awal",
    description: "Memahami pedoman penulisan, memilih topik, dan menyiapkan referensi awal.",
  },
  {
    key: "judul",
    title: "Pengajuan Judul",
    description: "Pengajuan dan pengesahan judul skripsi beserta garis besar penelitian.",
  },
  {
    key: "bab1",
    title: "BAB 1 — Pendahuluan",
    description: "Latar belakang, rumusan masalah, tujuan, manfaat, dan sistematika penulisan.",
  },
  {
    key: "bab2",
    title: "BAB 2 — Kajian Pustaka",
    description: "Landasan teori, definisi operasional, dan penelitian yang relevan.",
  },
  {
    key: "bab3",
    title: "BAB 3 — Metode Penelitian",
    description: "Jenis penelitian, populasi dan sampel, teknik pengumpulan serta analisis data.",
  },
  {
    key: "bab4",
    title: "BAB 4 — Hasil & Pembahasan",
    description: "Penyajian data, hasil analisis, dan pembahasan terhadap rumusan masalah.",
  },
  {
    key: "bab5",
    title: "BAB 5 — Kesimpulan & Saran",
    description: "Kesimpulan penelitian, keterbatasan, dan saran untuk penelitian selanjutnya.",
  },
  {
    key: "sidang",
    title: "Sidang / Ujian Skripsi",
    description: "Pendaftaran seminar hasil, persiapan presentasi, dan ujian skripsi.",
  },
  {
    key: "revisi",
    title: "Revisi Akhir & Penjilidan",
    description: "Revisi pasca-sidang, pengesahan penguji, dan penjilidan final.",
  },
];

export const STAGE_STATUS_META: Record<
  ThesisStageStatus,
  { label: string; className: string; dotClassName: string }
> = {
  BELUM_DIMULAI: {
    label: "Belum Dimulai",
    className: "bg-slate-100 text-slate-600",
    dotClassName: "bg-slate-300",
  },
  DIKERJAKAN: {
    label: "Dikerjakan",
    className: "bg-sky-100 text-sky-700",
    dotClassName: "bg-sky-500",
  },
  REVISI: {
    label: "Revisi",
    className: "bg-amber-100 text-amber-700",
    dotClassName: "bg-amber-500",
  },
  SELESAI: {
    label: "Selesai",
    className: "bg-emerald-100 text-emerald-700",
    dotClassName: "bg-emerald-500",
  },
};

export const THESIS_STAGE_KEYS = THESIS_STAGE_TEMPLATE.map((s) => s.key) as [
  ThesisStageKey,
  ...ThesisStageKey[],
];