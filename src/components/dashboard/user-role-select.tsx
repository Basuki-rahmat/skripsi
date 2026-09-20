"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "@/generated/prisma/enums";

export default function UserRoleSelect({
  id,
  currentRole,
}: {
  id: string;
  currentRole: Role;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(currentRole);

  async function change(next: Role) {
    if (next === currentRole) return;
    setRole(next);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    router.refresh();
  }

  return (
    <select
      className="input text-xs"
      value={role}
      onChange={(e) => change(e.target.value as Role)}
    >
      <option value="MAHASISWA">Mahasiswa</option>
      <option value="MENTOR">Mentor</option>
      <option value="ADMIN">Admin</option>
    </select>
  );
}