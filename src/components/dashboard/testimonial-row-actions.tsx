"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestimonialRowActions({ id, isApproved }: { id: string; isApproved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !isApproved }),
    });
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Hapus testimoni ini?")) return;
    setBusy(true);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggle} disabled={busy} className="text-xs font-semibold text-indigo-600 hover:underline">
        {isApproved ? "Tarik" : "Setujui"}
      </button>
      <button onClick={remove} disabled={busy} className="text-xs font-semibold text-red-600 hover:underline">
        Hapus
      </button>
    </div>
  );
}