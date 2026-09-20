"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map/view"), {
  ssr: false,
});

export default function MapViewWrapper({
  center,
  popup,
  color,
}: {
  center: [number, number];
  popup?: string;
  color?: string;
}) {
  return <MapView center={center} popup={popup} color={color} />;
}