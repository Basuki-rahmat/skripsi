"use client";

import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { pelaporanStatusColor, pelaporanStatusLabel } from "@/lib/pelaporan-meta";

export interface LiveMapMarker {
  code: string;
  title: string;
  status: string;
  lat: number;
  lng: number;
}

const DEFAULT_CENTER: [number, number] = [-6.2, 106.816666];

export default function LiveMap({ markers }: { markers: LiveMapMarker[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef(markers);

  useEffect(() => {
    markersRef.current = markers;
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled) return;

      const el = containerRef.current;
      if (!el || mapRef.current) return;

      const pts = markersRef.current.filter(
        (m) => Number.isFinite(m.lat) && Number.isFinite(m.lng) && m.lat !== 0 && m.lng !== 0
      );

      const map = L.map(el, {
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const layer = L.layerGroup().addTo(map);
      layerRef.current = layer;

      if (pts.length > 0) {
        map.fitBounds(L.latLngBounds(pts.map((m) => [m.lat, m.lng] as [number, number])), {
          padding: [16, 16],
          maxZoom: 14,
        });
      } else {
        map.setView(DEFAULT_CENTER, 12);
      }

      mapRef.current = map;
      requestAnimationFrame(() => map.invalidateSize());
      renderMarkers(L, layer, markersRef.current);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      const layer = layerRef.current;
      if (!layer || !mapRef.current) return;
      renderMarkers(L, layer, markers);
    })();
  }, [markers]);

  return <div ref={containerRef} className="h-full w-full rounded-xl bg-slate-200" aria-label="Peta laporan komunitas" />;
}

async function renderMarkers(
  L: typeof import("leaflet"),
  layer: LayerGroup,
  markers: LiveMapMarker[]
) {
  layer.clearLayers();

  markers
    .filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng) && m.lat !== 0 && m.lng !== 0)
    .forEach((m) => {
      const color = pelaporanStatusColor(m.status);
      L.circleMarker([m.lat, m.lng], {
        radius: 7,
        color: "#ffffff",
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.85,
      })
        .bindPopup(
          `<div style="font-size:12px;line-height:1.4">
             <div style="font-weight:700;color:#0f172a">${m.title}</div>
             <div style="font-family:monospace;color:#64748b;font-size:11px">${m.code}</div>
             <span style="color:${color}">${pelaporanStatusLabel(m.status)}</span>
           </div>`
        )
        .addTo(layer);
    });
}