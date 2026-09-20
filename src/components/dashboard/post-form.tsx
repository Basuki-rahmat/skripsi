"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PostForm({ initial }: { initial?: { id: string; title: string; slug: string; excerpt?: string | null; content: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(initial ? `/api/admin/posts/${initial.id}` : "/api/admin/posts", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan artikel");
      if (!initial) {
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent("");
      }
      setMessage(initial ? "Artikel diperbarui." : "Artikel berhasil dibuat.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  function makeSlug() {
    setSlug(
      title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="font-bold text-slate-900">{initial ? "Edit Artikel" : "Tulis Artikel Baru"}</h3>

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

      <label className="mt-3 block text-xs font-semibold text-slate-600">Judul</label>
      <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />

      <div className="mt-3 flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600">Slug</label>
          <input className="input mt-1" value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9-]+" />
        </div>
        <button type="button" onClick={makeSlug} className="btn-secondary text-xs">Buat dari judul</button>
      </div>

      <label className="mt-3 block text-xs font-semibold text-slate-600">Ringkasan (excerpt)</label>
      <input className="input mt-1" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

      <label className="mt-3 block text-xs font-semibold text-slate-600">Isi (Markdown)</label>
      <textarea rows={12} className="input mt-1 font-mono text-xs" value={content} onChange={(e) => setContent(e.target.value)} required minLength={10} />

      <button type="submit" disabled={loading} className="btn-primary mt-4">
        <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
        {loading ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Terbitkan Artikel"}
      </button>
    </form>
  );
}