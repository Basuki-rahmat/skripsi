"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Select } from "@/components/ui";

export function UserActions({
  userId,
  role,
  isActive,
}: {
  userId: string;
  role: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(data: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={role}
        disabled={busy}
        onChange={(e) => patch({ role: e.target.value })}
        className="w-40"
      >
        <option value="MASYARAKAT">Masyarakat</option>
        <option value="PETUGAS">Petugas</option>
        <option value="ADMIN">Admin</option>
      </Select>
      <Button
        variant={isActive ? "outline" : "secondary"}
        disabled={busy}
        onClick={() => patch({ isActive: !isActive })}
      >
        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </Button>
    </div>
  );
}