import { ThesisStageStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import {
  THESIS_STAGE_TEMPLATE,
  type ThesisStageTemplate,
} from "@/lib/thesis-stages-template";

export { THESIS_STAGE_TEMPLATE };
export type { ThesisStageTemplate };

const STATUS_WEIGHT: Record<ThesisStageStatus, number> = {
  BELUM_DIMULAI: 0,
  DIKERJAKAN: 0.5,
  REVISI: 0.75,
  SELESAI: 1,
};

export async function ensureThesisStages(orderId: string): Promise<void> {
  const existing = await prisma.thesisStage.findMany({
    where: { orderId },
    select: { key: true },
  });
  const present = new Set(existing.map((s) => s.key));
  const missing = THESIS_STAGE_TEMPLATE.filter((t) => !present.has(t.key));
  if (missing.length > 0) {
    await prisma.thesisStage.createMany({
      data: missing.map((t) => ({ orderId, key: t.key, title: t.title })),
      skipDuplicates: true,
    });
  }
}

export function thesisStagesPercent(
  stages: { status: ThesisStageStatus }[]
): number {
  if (stages.length === 0) return 0;
  const total = stages.reduce((sum, s) => sum + (STATUS_WEIGHT[s.status] ?? 0), 0);
  return Math.round((total / stages.length) * 100);
}

export function isThesisComplete(
  stages: { status: ThesisStageStatus }[]
): boolean {
  return stages.length > 0 && stages.every((s) => s.status === ThesisStageStatus.SELESAI);
}

export function sortStages<T extends { key: string }>(stages: T[]): T[] {
  const order = new Map<string, number>(THESIS_STAGE_TEMPLATE.map((t, i) => [t.key, i]));
  return [...stages].sort((a, b) => (order.get(a.key) ?? 99) - (order.get(b.key) ?? 99));
}