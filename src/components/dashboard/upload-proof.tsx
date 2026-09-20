"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";

export default function UploadProof({
  orderId,
  currentUrl,
}: {
  orderId: string;
  currentUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(currentUrl ? true : false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal");

      const proofRes = await fetch("/api/payments/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, proofUrl: data.url }),
      });
      const proofData = await proofRes.json();
      if (!proofRes.ok) throw new Error(proofData.error ?? "Gagal simpan bukti");

      setPreview(data.url);
      setDone(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-5">
      <div className="text-sm font-semibold text-slate-800">
        Upload Bukti Pembayaran (transfer manual)
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Unggah screenshot bukti transfer. Admin akan mengonfirmasi maksimal 1x24 jam.
      </p>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={loading || done}
        onClick={() => inputRef.current?.click()}
        className="btn-secondary mt-4 text-sm disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Mengunggah...
          </>
        ) : (
          <>
            <UploadCloud className="h-4 w-4" />
            {done ? "Bukti Terunggah" : "Pilih File"}
          </>
        )}
      </button>

      {preview && !loading && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Bukti terkirim, menunggu konfirmasi admin.
        </div>
      )}
    </div>
  );
}