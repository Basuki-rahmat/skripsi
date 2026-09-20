"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";

type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  _count: { reports: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("more");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, icon }),
    });
    setBusy(false);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Gagal menyimpan.");
      return;
    }
    setName("");
    setDescription("");
    router.refresh();
  }

  async function toggle(c: Category) {
    await fetch(`/api/admin/categories/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    router.refresh();
  }

  async function remove(c: Category) {
    if (!confirm(`Hapus kategori "${c.name}"?`)) return;
    setError(null);
    const res = await fetch(`/api/admin/categories/${c.id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) setError(data?.error ?? "Gagal menghapus.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {error && <Alert kind="error">{error}</Alert>}

      <form onSubmit={create} className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Tambah Kategori
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Nama Kategori</Label>
            <Input
              placeholder="Contoh: Drainase dan Saluran Air"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              required
            />
          </div>
          <div>
            <Label>Ikon (opsional)</Label>
            <Input
              placeholder="pilih: road, zap, trash, bus, shield, dsb."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>Deskripsi (opsional)</Label>
          <Textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit" className="mt-3" disabled={busy}>
          <Plus className="h-4 w-4" /> Tambah Kategori
        </Button>
      </form>

      <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{c.name}</span>
                {!c.isActive && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                    Nonaktif
                  </span>
                )}
              </div>
              {c.description && (
                <p className="truncate text-xs text-slate-500">{c.description}</p>
              )}
              <span className="text-xs text-slate-400">
                {c._count.reports} laporan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => toggle(c)}>
                {c.isActive ? "Nonaktifkan" : "Aktifkan"}
              </Button>
              <Button
                variant="danger"
                onClick={() => remove(c)}
                disabled={c._count.reports > 0}
                title={c._count.reports > 0 ? "Tidak bisa dihapus, ada laporan" : ""}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}