"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

export default function MapView({
  center,
  popup,
  color = "#059669",
}: {
  center: [number, number];
  popup?: string;
  color?: string;
}) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      className="h-64 w-full"
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} icon={makeIcon(color)}>
        {popup && <Popup>{popup}</Popup>}
      </Marker>
    </MapContainer>
  );
}