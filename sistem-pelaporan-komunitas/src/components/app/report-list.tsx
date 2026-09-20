import Link from "next/link";
import { Badge } from "@/components/ui";
import {
  PRIORITY_LABEL,
  PRIORITY_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
} from "@/lib/constants";
import type { ReportStatus } from "@/generated/prisma/enums";

export function StatusBadge({
  status,
  showLabel = true,
}: {
  status: ReportStatus;
  showLabel?: boolean;
}) {
  const s = STATUS_STYLE[status];
  return (
    <Badge className={s.badge}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {showLabel && STATUS_LABEL[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const p = priority as keyof typeof PRIORITY_STYLE;
  return <Badge className={PRIORITY_STYLE[p]}>{PRIORITY_LABEL[p]}</Badge>;
}

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function ReportList({
  reports,
  baseHref,
}: {
  reports: Array<{
    id: string;
    code: string;
    title: string;
    status: ReportStatus;
    createdAt: Date;
    category: { name: string };
    region: { name: string };
  }>;
  baseHref: string;
}) {
  if (reports.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Belum ada laporan.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <ul className="divide-y divide-slate-200">
        {reports.map((r) => (
          <li key={r.id}>
            <Link
              href={`${baseHref}/${r.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {r.code}
                  </span>
                  <StatusBadge status={r.status} showLabel={false} />
                </div>
                <div className="mt-1 truncate text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-slate-500">
                  {r.category.name} &bull; {r.region.name} &bull;{" "}
                  {formatDate(r.createdAt)}
                </div>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}