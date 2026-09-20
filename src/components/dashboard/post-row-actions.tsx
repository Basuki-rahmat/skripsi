"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostRowActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Hapus artikel ini?")) return;
    setBusy(true);
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggle} disabled={busy} className="text-xs font-semibold text-indigo-600 hover:underline">
        {published ? "Tarik" : "Terbitkan"}
      </button>
      <button onClick={remove} disabled={busy} className="text-xs font-semibold text-red-600 hover:underline">
        Hapus
      </button>
    </div>
  );
}