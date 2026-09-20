"use client";

import { useState } from "react";
import { Star, Send, AlertCircle } from "lucide-react";

export default function TestimonialForm() {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengirim");
      setMessage("Testimoni terkirim. Terima kasih!");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 p-6">
      <h2 className="font-bold text-slate-900">Bagikan Pengalaman Kamu</h2>
      <p className="mt-1 text-sm text-slate-500">
        Testimoni akan tampil setelah disetujui admin.
      </p>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {message && (
        <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="p-0.5"
            aria-label={`Rating ${n}`}
          >
            <Star
              className={`h-6 w-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
            />
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        className="input mt-3"
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 1000))}
        placeholder="Ceritakan pengalamanmu dibimbing..."
        required
      />

      <button type="submit" disabled={loading} className="btn-primary mt-4">
        <Send className="h-4 w-4" />
        {loading ? "Mengirim..." : "Kirim Testimoni"}
      </button>
    </form>
  );
}