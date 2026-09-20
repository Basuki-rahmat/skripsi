"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const pickIcon = L.divIcon({
  className: "",
  html:
    '<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:#059669;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/></svg></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  center,
  onPick,
}: {
  center: [number, number];
  onPick: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      className="h-72 w-full"
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      <Marker position={center} icon={pickIcon} />
    </MapContainer>
  );
}