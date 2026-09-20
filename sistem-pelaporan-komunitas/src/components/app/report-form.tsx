"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { LocateFixed, ImagePlus, X } from "lucide-react";
import { Alert, Button, Input, Label, Textarea, Select } from "@/components/ui";

const MapPicker = dynamic(() => import("@/components/map/picker"), {
  ssr: false,
});

const DEFAULT_CENTER: [number, number] = [-6.2085, 106.798];

type Category = { id: string; name: string };
type Region = { id: string; name: string };

export function ReportForm({
  categories,
  regions,
}: {
  categories: Category[];
  regions: Region[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    categoryId: "",
    regionId: "",
    title: "",
    description: "",
    address: "",
  });
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolokasi. Pilih titik pada peta.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter([lat, lng]);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const data = await res.json();
          const addr = [data?.address?.road, data?.address?.suburb, data?.address?.city]
            .filter(Boolean)
            .join(", ");
          if (addr) set("address", addr);
        } catch {
          // reverse geocode gagal, abaikan
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("Gagal mengambil lokasi. Periksa izin lokasi atau gunakan peta.");
      },
      { enableHighAccuracy: true },
    );
  }

  function onPickFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).slice(0, 3 - files.length);
    setFiles((f) => [...f, ...next].slice(0, 3));
    setPreviews((p) => [
      ...p,
      ...next.map((f) => URL.createObjectURL(f)),
    ].slice(0, 3));
  }

  function removeFile(index: number) {
    setFiles((f) => f.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.categoryId) return setError("Pilih kategori laporan.");
    if (!form.regionId) return setError("Pilih wilayah kecamatan.");

    // upload foto
    let media: string[] = [];
    if (files.length > 0) {
      const urls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          return setError("Gagal mengunggah foto. Coba lagi.");
        }
        const data = await res.json();
        urls.push(data.url);
      }
      media = urls;
    }

    setLoading(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        lat: center[0],
        lng: center[1],
        media,
      }),
    });
    setLoading(false);

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Gagal menyimpan laporan.");
      return;
    }
    router.push(`/app/masyarakat/laporan/${data.id}`);
    router.refresh();
  }

  const map = useMemo(() => <MapPicker center={center} onPick={(lat, lng) => setCenter([lat, lng])} />, [center]);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <Alert kind="error">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Kategori</Label>
          <Select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            required
          >
            <option value="">-- Pilih kategori --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Wilayah (Kecamatan)</Label>
          <Select
            value={form.regionId}
            onChange={(e) => set("regionId", e.target.value)}
            required
          >
            <option value="">-- Pilih kecamatan --</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label>Judul Laporan</Label>
        <Input
          placeholder="Contoh: Jalan berlubang di Jl. Kemanggisan Raya"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          maxLength={150}
          required
        />
      </div>

      <div>
        <Label>Deskripsi Masalah</Label>
        <Textarea
          rows={4}
          placeholder="Jelaskan kondisi, kapan mulai terjadi, dan dampaknya bagi warga."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          minLength={10}
          required
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label>Lokasi Masalah</Label>
          <span className="text-xs text-slate-500">
            Tentukan titik dengan peta atau tombol lokasi
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">{map}</div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <Button type="button" variant="outline" onClick={useMyLocation} disabled={locating}>
            <LocateFixed className="h-4 w-4" />
            {locating ? "Mencari lokasi..." : "Gunakan Lokasi Saya (GPS)"}
          </Button>
          <code className="rounded bg-slate-100 px-2 py-1 text-xs">
            {center[0].toFixed(6)}, {center[1].toFixed(6)}
          </code>
        </div>
      </div>

      <div>
        <Label>Alamat (opsional)</Label>
        <Input
          placeholder="Alamat / nama jalan terdekat"
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          maxLength={500}
        />
      </div>

      <div>
        <Label>Foto Bukti (maks. 3)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => onPickFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white py-6 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer"
        >
          <ImagePlus className="h-6 w-6" />
          Klik untuk memilih foto
        </button>
        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={src} className="relative">
                <Image
                  src={src}
                  alt={`foto-${i + 1}`}
                  width={120}
                  height={90}
                  className="h-24 w-32 rounded-lg border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  aria-label="Hapus foto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Kirim Laporan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}