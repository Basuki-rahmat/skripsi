"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Select } from "@/components/ui";
import { STATUS_LABEL } from "@/lib/constants";

const STATUS_COLOR: Record<string, string> = {
  MENUNGGU_VERIFIKASI: "#f59e0b",
  VERIFIKASI_DITOLAK: "#ef4444",
  DIPROSES: "#0ea5e9",
  DITINDAKLANJUTI: "#8b5cf6",
  SELESAI: "#16a34a",
};

type Point = {
  id: string;
  code: string;
  title: string;
  status: string;
  lat: number;
  lng: number;
  category: { name: string };
  region: { name: string };
  createdAt: string;
};

function iconFor(status: string) {
  const color = STATUS_COLOR[status] ?? "#334155";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"/></svg></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
}

function ClusterLayer({ points }: { points: Point[] }) {
  const map = useMap();

  useEffect(() => {
    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
    });

    for (const p of points) {
      const link = `/cek?code=${encodeURIComponent(p.code)}`;
      const popup = `
        <div style="min-width:200px;font-family:system-ui,sans-serif">
          <div style="font-size:11px;color:#64748b;font-weight:600">${p.code}</div>
          <div style="font-weight:700;margin:2px 0">${p.title}</div>
          <div style="font-size:12px;color:#334155">${p.category.name} · ${p.region.name}</div>
          <a href="${link}" style="display:inline-block;margin-top:6px;font-size:12px;color:#1d4ed8;font-weight:600">Lihat detail →</a>
        </div>`;
      const marker = L.marker([p.lat, p.lng], { icon: iconFor(p.status) }).bindPopup(popup);
      markers.addLayer(marker);
    }

    map.addLayer(markers);
    return () => {
      map.removeLayer(markers);
    };
  }, [map, points]);

  return null;
}

export default function PublicMap() {
  const [all, setAll] = useState<Point[]>([]);
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data: Point[]) => setAll(data))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Map(all.map((p) => [p.category.name, p.category.name])).values()],
    [all],
  );
  const regions = useMemo(
    () => [...new Map(all.map((p) => [p.region.name, p.region.name])).values()],
    [all],
  );

  const filtered = useMemo(
    () =>
      all.filter(
        (p) =>
          (category === "all" || p.category.name === category) &&
          (region === "all" || p.region.name === region) &&
          (status === "all" || p.status === status),
      ),
    [all, category, region, status],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48">
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select value={region} onChange={(e) => setRegion(e.target.value)} className="w-48">
          <option value="all">Semua Wilayah</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          <option value="all">Semua Status</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <span className="text-sm text-slate-500">
          {loading ? "Memuat..." : `${filtered.length} laporan`}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        {Object.entries(STATUS_LABEL).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[k] }}
            />
            {v}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={[-6.2085, 106.798]}
          zoom={12}
          className="h-[480px] w-full"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClusterLayer points={filtered} />
        </MapContainer>
      </div>
    </div>
  );
}