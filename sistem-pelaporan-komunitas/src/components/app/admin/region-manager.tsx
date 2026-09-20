"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Input, Label, Select } from "@/components/ui";

type Region = {
  id: string;
  name: string;
  level: string;
  city: string;
  district: string | null;
  lat: number;
  lng: number;
  _count: { reports: number };
};

export function RegionManager({ regions }: { regions: Region[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    level: "KELURAHAN",
    province: "",
    city: "",
    district: "",
    lat: "",
    lng: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/admin/regions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        province: form.province || undefined,
        city: form.city || undefined,
        district: form.district || undefined,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
      }),
    });
    setBusy(false);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Gagal menyimpan.");
      return;
    }
    setForm({ name: "", level: "KELURAHAN", province: "", city: "", district: "", lat: "", lng: "" });
    router.refresh();
  }

  async function remove(r: Region) {
    if (!confirm(`Hapus wilayah "${r.name}"?`)) return;
    setError(null);
    const res = await fetch(`/api/admin/regions/${r.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => null);
    if (!res.ok) setError(data?.error ?? "Gagal menghapus.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {error && <Alert kind="error">{error}</Alert>}

      <form onSubmit={create} className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Tambah Wilayah
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Nama Wilayah</Label>
            <Input
              placeholder="Contoh: Palmerah"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Tingkat</Label>
            <Select
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
            >
              <option value="KECAMATAN">Kecamatan</option>
              <option value="KELURAHAN">Kelurahan</option>
              <option value="DESA">Desa</option>
            </Select>
          </div>
          <div>
            <Label>Kecamatan (untuk kelurahan/desa)</Label>
            <Input
              placeholder="Kecamatan induk"
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
            />
          </div>
          <div>
            <Label>Provinsi</Label>
            <Input
              placeholder="DKI Jakarta"
              value={form.province}
              onChange={(e) => set("province", e.target.value)}
            />
          </div>
          <div>
            <Label>Kota/Kabupaten</Label>
            <Input
              placeholder="Jakarta Barat"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Latitude</Label>
              <Input
                inputMode="decimal"
                placeholder="-6.2085"
                value={form.lat}
                onChange={(e) => set("lat", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                inputMode="decimal"
                placeholder="106.7980"
                value={form.lng}
                onChange={(e) => set("lng", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <Button type="submit" className="mt-3" disabled={busy}>
          <Plus className="h-4 w-4" /> Tambah Wilayah
        </Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Tingkat</th>
              <th className="px-4 py-2">Kecamatan</th>
              <th className="px-4 py-2">Kota</th>
              <th className="px-4 py-2">Koordinat</th>
              <th className="px-4 py-2">Laporan</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {regions.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2 font-semibold">{r.name}</td>
                <td className="px-4 py-2">{r.level}</td>
                <td className="px-4 py-2">{r.district ?? "-"}</td>
                <td className="px-4 py-2">{r.city}</td>
                <td className="px-4 py-2 font-mono text-xs">
                  {r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                </td>
                <td className="px-4 py-2">{r._count.reports}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="danger"
                    onClick={() => remove(r)}
                    disabled={r._count.reports > 0}
                    title={r._count.reports > 0 ? "Ada laporan terkait" : ""}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}