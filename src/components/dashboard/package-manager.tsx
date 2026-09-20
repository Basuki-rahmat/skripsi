"use client";

import { useState } from "react";
import PackageForm, { type PackageInput } from "@/components/dashboard/package-form";
import PackageRowActions from "@/components/dashboard/package-row-actions";

export interface PackageView {
  id: string;
  name: string;
  type: "BIMBINGAN" | "PEMBUATAN";
  price: number;
  description?: string | null;
  duration?: string | null;
  features: string[];
  isActive: boolean;
  orderCount: number;
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PackageManager({ packages }: { packages: PackageView[] }) {
  const [editing, setEditing] = useState<PackageInput | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Daftar Paket</h2>
        <div className="space-y-3">
          {packages.map((p) => (
            <div key={p.id} className={`card p-5 ${p.isActive ? "" : "opacity-70"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">
                    {formatIDR(p.price)} · {p.type === "BIMBINGAN" ? "Bimbingan" : "Pembuatan"}
                    {p.duration ? ` · ${p.duration}` : ""}
                  </div>
                </div>
                <span className={`badge ${p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {p.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              {p.features.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  {p.features.length} fitur · {p.orderCount} pesanan
                </p>
              )}
              <div className="mt-3">
                <PackageRowActions
                  id={p.id}
                  isActive={p.isActive}
                  onEdit={() =>
                    setEditing({
                      id: p.id,
                      name: p.name,
                      type: p.type,
                      price: p.price,
                      description: p.description ?? "",
                      duration: p.duration ?? "",
                      features: p.features,
                      isActive: p.isActive,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? "Edit Paket" : "Tambah Paket"}
          </h2>
          {editing && (
            <button
              onClick={() => setEditing(null)}
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              ← Kembali ke Tambah
            </button>
          )}
        </div>
        <PackageForm key={editing?.id ?? "new"} initial={editing ?? undefined} />
      </div>
    </div>
  );
}