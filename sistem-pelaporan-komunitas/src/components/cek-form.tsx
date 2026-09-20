"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Alert, Button, Input, Label } from "@/components/ui";
import {
  StatusBadge,
  PriorityBadge,
  formatDate,
} from "@/components/app/report-list";

type Result = {
  code: string;
  title: string;
  status: string;
  priority: string;
  category: { name: string };
  region: { name: string };
  createdAt: string;
};

export function CekForm({ initialCode }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode ?? "");
  const [result, setResult] = useState<Result | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search() {
    setResult(null);
    setNotFound(false);
    setLoading(true);
    const res = await fetch(`/api/reports?code=${encodeURIComponent(code.trim())}`);
    const data: Result[] = await res.json().catch(() => []);
    setLoading(false);
    if (data.length === 0) {
      setNotFound(true);
      return;
    }
    setResult(data[0]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await search();
  }

  useEffect(() => {
    if (!initialCode) return;
    let cancelled = false;
    (async () => {
      const res = await fetch(
        `/api/reports?code=${encodeURIComponent(initialCode.trim())}`,
      );
      const data: Result[] = await res.json().catch(() => []);
      if (cancelled) return;
      setLoading(false);
      if (data.length === 0) {
        setNotFound(true);
        return;
      }
      setResult(data[0]);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialCode]);

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="code">Nomor Tiket</Label>
          <Input
            id="code"
            placeholder="Contoh: LAP-20260920-0001"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </div>
        <div className="self-end">
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4" /> {loading ? "Mencari..." : "Cari"}
          </Button>
        </div>
      </form>

      {notFound && (
        <Alert kind="error">
          Laporan dengan nomor tiket tersebut tidak ditemukan. Pastikan kode
          benar, mis. LAP-20260920-0001.
        </Alert>
      )}

      {result && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-600">
              {result.code}
            </span>
            <StatusBadge status={result.status as never} />
            <PriorityBadge priority={result.priority} />
          </div>
          <h3 className="mt-2 text-lg font-bold">{result.title}</h3>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <p>
              {result.category.name} &bull; {result.region.name}
            </p>
            <p className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Dilaporkan {formatDate(new Date(result.createdAt))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}