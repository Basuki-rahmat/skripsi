"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PackageRowActions({
  id,
  isActive,
  onEdit,
}: {
  id: string;
  isActive: boolean;
  onEdit?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Hapus paket ini? (paket yang sudah dipesan hanya dilindungi)")) return;
    setBusy(true);
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button onClick={onEdit} disabled={busy} className="text-xs font-semibold text-slate-600 hover:underline">
          Edit
        </button>
      )}
      <button onClick={toggle} disabled={busy} className="text-xs font-semibold text-indigo-600 hover:underline">
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </button>
      <button onClick={remove} disabled={busy} className="text-xs font-semibold text-red-600 hover:underline">
        Hapus
      </button>
    </div>
  );
}