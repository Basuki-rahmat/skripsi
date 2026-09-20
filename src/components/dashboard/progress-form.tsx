"use client";

import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProgressForm({
  orderId,
  initialPercent = 0,
}: {
  orderId: string;
  initialPercent?: number;
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [percent, setPercent] = useState(initialPercent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (percent <= initialPercent && initialPercent > 0 && !window.confirm(`Progres saat ini ${initialPercent}%. Lanjutkan?`)) {
      return;
    }
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, title, note, percent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal simpan progres");
      setDone(true);
      setTitle("");
      setNote("");
      setPercent(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 p-6">
      <h3 className="font-bold text-slate-900">Tambah Progres</h3>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {done && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Progres tersimpan & notifikasi terkirim.
        </div>
      )}

      <input
        className="input mt-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul tahapan, mis. Revisi Bab 3"
        required
        minLength={3}
      />
      <textarea
        rows={3}
        className="input mt-3"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Catatan untuk mahasiswa..."
      />
      <div className="mt-3">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Persentase</span>
          <span>{percent}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="mt-2 w-full accent-indigo-600"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary mt-4">
        <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
        {loading ? "Menyimpan..." : "Simpan Progres"}
      </button>
    </form>
  );
}