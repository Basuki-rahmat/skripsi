import Image from "next/image";
import { MapPin, User, Phone } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import {
  StatusBadge,
  PriorityBadge,
  formatDate,
} from "@/components/app/report-list";
import type { ReportItem } from "@/lib/reports";
import MapView from "@/components/map/view-wrapper";

export default function ReportView({
  report,
  actions,
}: {
  report: ReportItem;
  actions?: React.ReactNode;
}) {
  const statusColors: Record<string, string> = {
    MENUNGGU_VERIFIKASI: "#f59e0b",
    VERIFIKASI_DITOLAK: "#ef4444",
    DIPROSES: "#0ea5e9",
    DITINDAKLANJUTI: "#8b5cf6",
    SELESAI: "#10b981",
  };
  const color = statusColors[report.status] ?? "#059669";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-500">
              {report.code}
            </span>
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} />
          </div>
          <h1 className="mt-1 text-2xl font-bold">{report.title}</h1>
          <p className="mt-1 text-xs text-slate-500">
            Dilaporkan {formatDate(report.createdAt)}
            {" oleh "}
            <span className="font-medium text-slate-700">{report.user.name}</span>
          </p>
        </div>
        {actions}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Detail Masalah
            </h2>
            <div className="mb-3 flex flex-wrap gap-2 text-sm">
              <Badge className="bg-slate-100 text-slate-700">
                {report.category.name}
              </Badge>
              <Badge className="bg-slate-100 text-slate-700">
                {report.region.name}
              </Badge>
              {report.region.city && (
                <Badge className="bg-slate-100 text-slate-700">
                  {report.region.city}
                </Badge>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {report.description}
            </p>
            {report.address ? (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                {report.address}
              </p>
            ) : null}
          </Card>

          {report.media.length > 0 && (
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                Foto Bukti
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {report.media.map((m) => (
                  <a key={m.id} href={m.url} target="_blank" rel="noreferrer">
                    <Image
                      src={m.url}
                      alt={m.caption ?? "foto laporan"}
                      width={300}
                      height={200}
                      className="h-32 w-full rounded-lg border border-slate-200 object-cover"
                    />
                  </a>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Pelapor
            </h2>
            <div className="space-y-1 text-sm text-slate-700">
              <p className="flex items-center gap-2 font-semibold">
                <User className="h-4 w-4 text-slate-400" />
                {report.user.name}
              </p>
              {report.user.phone && (
                <p className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4" />
                  {report.user.phone}
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 p-5 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Lokasi
              </h2>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
              </p>
            </div>
            <MapView center={[report.lat, report.lng]} popup={report.title} color={color} />
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Riwayat Tindak Lanjut
        </h2>
        {report.followUps.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada tindak lanjut dari petugas.
          </p>
        ) : (
          <ol className="relative space-y-6 border-l border-slate-200 pl-6">
            {report.followUps.map((f) => (
              <li key={f.id} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">
                    {f.officer.name}
                  </span>
                  <StatusBadge status={f.statusAfter} />
                  <span className="text-xs text-slate-400">
                    {formatDate(f.createdAt)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {f.note}
                </p>
                {f.photoUrl && (
                  <a href={f.photoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block">
                    <Image
                      src={f.photoUrl}
                      alt="foto tindak lanjut"
                      width={260}
                      height={160}
                      className="h-28 w-48 rounded-lg border border-slate-200 object-cover"
                    />
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}