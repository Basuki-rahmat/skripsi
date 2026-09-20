"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { STATUS_LABEL, PRIORITY_LABEL } from "@/lib/constants";

const STATUS_LABEL_ANY = STATUS_LABEL as Record<string, string>;
const PRIORITY_LABEL_ANY = PRIORITY_LABEL as Record<string, string>;
const switchLabelPie = (props: PieLabelRenderProps) =>
  `${STATUS_LABEL_ANY[String(props.name)] ?? String(props.name)}: ${props.value}`;

const STATUS_COLOR: Record<string, string> = {
  MENUNGGU_VERIFIKASI: "#f59e0b",
  VERIFIKASI_DITOLAK: "#ef4444",
  DIPROSES: "#0ea5e9",
  DITINDAKLANJUTI: "#8b5cf6",
  SELESAI: "#16a34a",
};

const PRIORITY_COLOR: Record<string, string> = {
  RENDAH: "#94a3b8",
  SEDANG: "#f59e0b",
  TINGGI: "#f97316",
  URGENT: "#ef4444",
};

type Stats = {
  total: number;
  monthly: Array<{ label: string; count: number }>;
  statusCounts: Array<{ status: string; count: number }>;
  byCategory: Array<{ name: string; count: number }>;
  byRegion: Array<{ name: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
  avgResolutionDays: number;
};

export function StatsView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-slate-500">Total Laporan</div>
        </Card>
        {stats.statusCounts.map((s) => (
          <Card key={s.status} className="p-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[s.status] }}
              />
              <span className="text-2xl font-bold">{s.count}</span>
            </div>
            <div className="text-xs text-slate-500">{STATUS_LABEL_ANY[s.status] ?? s.status}</div>
          </Card>
        ))}
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.avgResolutionDays}</div>
          <div className="text-xs text-slate-500">Rata-rata penyelesaian (hari)</div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Laporan per Bulan (12 bulan terakhir)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Sebaran Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusCounts}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={85}
                  label={switchLabelPie}
                >
                  {stats.statusCounts.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLOR[s.status]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Laporan per Kategori
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Prioritas
          </h2>
          <div className="space-y-2">
            {stats.byPriority.map((p) => (
              <div
                key={p.priority}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
              >
                <Badge className="text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: PRIORITY_COLOR[p.priority] }}
                    />
                    {PRIORITY_LABEL_ANY[p.priority] ?? p.priority}
                  </span>
                </Badge>
                <span className="font-bold">{p.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-5 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Wilayah dengan Laporan Terbanyak
          </h2>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {stats.byRegion.map((r) => (
              <tr key={r.name}>
                <td className="px-5 py-2 font-semibold">{r.name}</td>
                <td className="px-5 py-2 text-right font-bold">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-wrap gap-3">
        <a href="/api/export/csv">
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4" /> Ekspor CSV
          </Button>
        </a>
        <a href="/api/export/pdf">
          <Button>
            <FileDown className="h-4 w-4" /> Ekspor PDF
          </Button>
        </a>
      </div>
    </div>
  );
}