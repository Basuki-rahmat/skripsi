"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function OrderAdminActions({
  orderId,
  currentStatus,
  currentMentorId,
  mentors,
}: {
  orderId: string;
  currentStatus: string;
  currentMentorId: string | null;
  mentors: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [mentorId, setMentorId] = useState(currentMentorId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const body: Record<string, unknown> = {};
      if (status !== currentStatus) body.status = status;
      if (mentorId !== (currentMentorId ?? "")) body.mentorId = mentorId || null;
      if (Object.keys(body).length === 0) {
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan");
      setMessage("Perubahan disimpan & notifikasi terkirim.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mt-8 p-6">
      <h3 className="font-bold text-slate-900">Kelola Status Pesanan</h3>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {message && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}

      <label className="mt-4 block text-xs font-semibold text-slate-600">Status</label>
      <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace("_", " ")}</option>
        ))}
      </select>

      <label className="mt-3 block text-xs font-semibold text-slate-600">Mentor (opsional)</label>
      <select className="input mt-1" value={mentorId} onChange={(e) => setMentorId(e.target.value)}>
        <option value="">— Belum ditugaskan —</option>
        {mentors.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="btn-primary mt-4"
      >
        <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}