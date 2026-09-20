"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, XCircle } from "lucide-react";
import { Alert, Button, Label, Select, Textarea } from "@/components/ui";
import type { ReportStatus, ReportPriority } from "@/generated/prisma/enums";

type Officer = { id: string; name: string };

export function AdminActions({
  reportId,
  status,
  priority,
  officers,
  assignedName,
}: {
  reportId: string;
  status: ReportStatus;
  priority: ReportPriority;
  officers: Officer[];
  assignedName?: string | null;
}) {
  const router = useRouter();
  const [officerId, setOfficerId] = useState("");
  const [note, setNote] = useState("");
  const [newPriority, setNewPriority] = useState<ReportPriority>(priority);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(action: string, payload: Record<string, unknown> = {}) {
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    setLoading(false);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Gagal menyimpan.");
      return;
    }
    router.refresh();
  }

  if (status === "MENUNGGU_VERIFIKASI") {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Verifikasi Laporan
        </h2>
        {error && <Alert kind="error">{error}</Alert>}

        <div>
          <Label>Teruskan ke Petugas (opsional)</Label>
          <Select value={officerId} onChange={(e) => setOfficerId(e.target.value)}>
            <option value="">Pilih petugas...</option>
            {officers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
        </div>

        <Button
          onClick={() => run("verify", { officerId })}
          disabled={loading}
          className="w-full"
        >
          <ShieldCheck className="h-4 w-4" /> Terima &amp; Verifikasi
        </Button>

        <div className="pt-3">
          <Label>Atau tolak verifikasi (wajib isi alasan)</Label>
          <Textarea
            rows={3}
            placeholder="Alasan penolakan, mis. data tidak jelas / lokasi di luar wilayah"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            variant="danger"
            className="mt-2 w-full"
            disabled={loading || note.trim().length < 3}
            onClick={() => run("reject", { verificationNote: note })}
          >
            <XCircle className="h-4 w-4" /> Tolak Verifikasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Atur Laporan
      </h2>
      {error && <Alert kind="error">{error}</Alert>}

      {assignedName && (
        <p className="text-sm text-slate-600">
          Ditugaskan ke: <span className="font-semibold">{assignedName}</span>
        </p>
      )}

      <div className="grid gap-3">
        <div>
          <Label>Prioritas</Label>
          <Select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as ReportPriority)}
          >
            <option value="RENDAH">Rendah</option>
            <option value="SEDANG">Sedang</option>
            <option value="TINGGI">Tinggi</option>
            <option value="URGENT">Urgent</option>
          </Select>
          <Button
            variant="outline"
            className="mt-2 w-full"
            disabled={loading || newPriority === priority}
            onClick={() => run("priority", { priority: newPriority })}
          >
            Simpan Prioritas
          </Button>
        </div>

        <div>
          <Label>Ganti/Menetapkan Petugas</Label>
          <Select value={officerId} onChange={(e) => setOfficerId(e.target.value)}>
            <option value="">Pilih petugas...</option>
            {officers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            className="mt-2 w-full"
            disabled={loading || !officerId}
            onClick={() => run("assign", { officerId })}
          >
            Simpan Penugasan
          </Button>
        </div>
      </div>

      {status !== "SELESAI" && status !== "VERIFIKASI_DITOLAK" && (
        <Button
          variant="secondary"
          className="w-full"
          disabled={loading}
          onClick={() => run("complete")}
        >
          Tandai Selesai
        </Button>
      )}
    </div>
  );
}