"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export interface PackageInput {
  id?: string;
  name: string;
  type: "BIMBINGAN" | "PEMBUATAN";
  price: number;
  description?: string | null;
  duration?: string | null;
  features: string[];
  isActive: boolean;
}

export default function PackageForm({ initial }: { initial?: PackageInput }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<PackageInput["type"]>(initial?.type ?? "BIMBINGAN");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join("\n"));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const body = {
        name,
        type,
        price: Number(price),
        description,
        duration,
        features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
        isActive: initial?.isActive ?? true,
      };
      const res = await fetch(
        initial ? `/api/admin/packages/${initial.id}` : "/api/admin/packages",
        {
          method: initial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan paket");
      if (!initial) {
        setName("");
        setPrice("");
        setDescription("");
        setDuration("");
        setFeaturesText("");
        setType("BIMBINGAN");
      }
      setMessage(initial ? "Paket diperbarui." : "Paket berhasil dibuat.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="font-bold text-slate-900">{initial ? "Edit Paket" : "Tambah Paket Baru"}</h3>

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

      <label className="mt-3 block text-xs font-semibold text-slate-600">Nama Paket</label>
      <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600">Tipe</label>
          <select className="input mt-1" value={type} onChange={(e) => setType(e.target.value as PackageInput["type"])}>
            <option value="BIMBINGAN">Bimbingan</option>
            <option value="PEMBUATAN">Pembuatan</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600">Harga (Rp)</label>
          <input className="input mt-1" type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600">Durasi</label>
          <input className="input mt-1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="3 bulan" />
        </div>
      </div>

      <label className="mt-3 block text-xs font-semibold text-slate-600">Deskripsi</label>
      <textarea rows={2} className="input mt-1" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label className="mt-3 block text-xs font-semibold text-slate-600">
        Fitur (satu per baris)
      </label>
      <textarea rows={4} className="input mt-1" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />

      <button type="submit" disabled={loading} className="btn-primary mt-4">
        <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
        {loading ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Buat Paket"}
      </button>
    </form>
  );
}