"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ThesisStageStatus } from "@/generated/prisma/enums";
import {
  THESIS_STAGE_TEMPLATE,
  STAGE_STATUS_META,
} from "@/lib/thesis-stages-template";

function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export interface ThesisStageView {
  id: string;
  key: string;
  title: string;
  status: ThesisStageStatus;
  note?: string | null;
  updatedBy?: string | null;
  updatedAt?: Date | string | null;
}

export default function ThesisRoadmap({
  orderId,
  stages,
  percent,
  editable = false,
}: {
  orderId?: string;
  stages: ThesisStageView[];
  percent: number;
  editable?: boolean;
}) {
  const templateIndex = new Map<string, number>(
    THESIS_STAGE_TEMPLATE.map((s, i) => [s.key, i])
  );
  const ordered = [...stages].sort(
    (a, b) => (templateIndex.get(a.key) ?? 99) - (templateIndex.get(b.key) ?? 99)
  );

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-slate-900">Roadmap Penyusunan Skripsi</h2>
        <span className="badge bg-violet-100 text-violet-700">{percent}%</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Tahapan penyusunan skripsi dari persiapan sampai selesai sesuai format baku.
      </p>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-6 space-y-5">
        {ordered.map((stage) => (
          <ThesisStageRow
            key={stage.id}
            orderId={orderId}
            stage={stage}
            editable={editable}
          />
        ))}
      </ol>
    </div>
  );
}

function ThesisStageRow({
  orderId,
  stage,
  editable,
}: {
  orderId?: string;
  stage: ThesisStageView;
  editable: boolean;
}) {
  const [open, setOpen] = useState(false);
  const meta = STAGE_STATUS_META[stage.status] ?? STAGE_STATUS_META.BELUM_DIMULAI;
  const template = THESIS_STAGE_TEMPLATE.find((s) => s.key === stage.key);

  return (
    <li className="relative pl-7">
      <span
        className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${meta.dotClassName}`}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">{stage.title}</span>
          <span className={`badge ${meta.className}`}>{meta.label}</span>
        </div>
        {editable && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Ubah status
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {template?.description && (
        <p className="mt-0.5 text-xs text-slate-400">{template.description}</p>
      )}

      {stage.note ? (
        <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {stage.note}
        </p>
      ) : (
        <p className="mt-1 text-xs italic text-slate-300">Belum ada catatan.</p>
      )}

      {(stage.updatedBy || stage.updatedAt) && (
        <p className="mt-1 text-[11px] text-slate-400">
          {stage.updatedBy ? `Diperbarui oleh ${stage.updatedBy}` : "Diperbarui"} 
          {stage.updatedAt ? ` · ${formatDate(stage.updatedAt)}` : ""}
        </p>
      )}

      {editable && open && orderId && (
        <StageEditor
          orderId={orderId}
          stageKey={stage.key}
          status={stage.status}
          note={stage.note ?? ""}
          onSaved={() => setOpen(false)}
        />
      )}
    </li>
  );
}

function StageEditor({
  orderId,
  stageKey,
  status,
  note,
  onSaved,
}: {
  orderId: string;
  stageKey: string;
  status: ThesisStageStatus;
  note: string;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(status);
  const [text, setText] = useState(note);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/thesis-stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, key: stageKey, status: value, note: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan tahapan");
      setDone(true);
      setTimeout(onSaved, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold text-slate-600">Status</label>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value as ThesisStageStatus)}
          className="input max-w-xs! py-1.5 text-sm"
        >
          {(Object.keys(ThesisStageStatus) as ThesisStageStatus[]).map((s) => (
            <option key={s} value={s}>
              {STAGE_STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Catatan untuk mahasiswa (opsional)..."
        className="input py-1.5 text-sm"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {done && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Tahapan tersimpan.
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onSaved} className="btn-ghost px-3 py-1.5 text-xs">
          Batal
        </button>
        <button type="submit" disabled={loading} className="btn-primary px-3 py-1.5 text-xs">
          <Loader2 className={`h-3.5 w-3.5 ${loading ? "animate-spin" : "hidden"}`} />
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}