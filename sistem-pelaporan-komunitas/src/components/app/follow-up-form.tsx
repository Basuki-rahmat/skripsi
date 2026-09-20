"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { Alert, Button, Label, Select, Textarea } from "@/components/ui";

export function FollowUpForm({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [statusAfter, setStatusAfter] = useState<"DITINDAKLANJUTI" | "SELESAI">(
    "DITINDAKLANJUTI",
  );
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onPhoto(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setError("Gagal mengunggah foto.");
      return;
    }
    const data = await res.json();
    setPhotoUrl(data.url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/petugas/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, note, statusAfter, photoUrl }),
    });
    setLoading(false);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Gagal menyimpan tindak lanjut.");
      return;
    }
    setNote("");
    setPhotoUrl("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Tindak Lanjut
      </h2>
      {error && <Alert kind="error">{error}</Alert>}
      <div>
        <Label>Status Setelah Tindakan</Label>
        <Select
          value={statusAfter}
          onChange={(e) =>
            setStatusAfter(e.target.value as "DITINDAKLANJUTI" | "SELESAI")
          }
        >
          <option value="DITINDAKLANJUTI">Sedang Ditindaklanjuti</option>
          <option value="SELESAI">Selesai Ditangani</option>
        </Select>
      </div>
      <div>
        <Label>Catatan Tindakan</Label>
        <Textarea
          rows={3}
          placeholder="Jelaskan langkah yang sudah dilakukan (mis. sudah berkoordinasi dengan ... / sudah perbaikan ...)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          minLength={5}
          required
        />
      </div>
      <div>
        <Label>Foto Dokumentasi (opsional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPhoto(f);
            e.target.value = "";
          }}
        />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" /> Unggah Foto
          </Button>
          {photoUrl && (
            <span className="text-xs text-blue-600">Foto terunggah ✔</span>
          )}
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Tindak Lanjut"}
      </Button>
    </form>
  );
}