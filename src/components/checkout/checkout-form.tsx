"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import type { Package } from "@/generated/prisma/client";

export default function CheckoutForm({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProject = pkg.type === "PEMBUATAN";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat pesanan");

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {isProject && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
          Paket <b>{pkg.name}</b> adalah layanan pembuatan sistem per proyek.
          Tim kami akan menghubungi Anda untuk konsultasi kebutuhan setelah
          pembayaran.
        </div>
      )}

      <div>
        <label htmlFor="note" className="label">
          Catatan / Deskripsi kebutuhan {isProject ? "(opsional)" : "(opsional)"}
        </label>
        <textarea
          id="note"
          rows={4}
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 2000))}
          placeholder={
            isProject
              ? "Contoh: sistem pelaporan untuk kelurahan, fitur peta GIS, 3 role user..."
              : "Contoh: sedang di semester 7, sudah ada judul, butuh bimbingan BAB 2-3..."
          }
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Menyiapkan pembayaran...
          </>
        ) : (
          "Lanjut ke Pembayaran"
        )}
      </button>
      <p className="text-center text-xs text-slate-400">
        Anda akan diarahkan ke halaman pembayaran Midtrans setelah pesanan dibuat.
      </p>
    </form>
  );
}