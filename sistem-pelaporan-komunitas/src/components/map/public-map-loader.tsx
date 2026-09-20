"use client";

import dynamic from "next/dynamic";

const PublicMap = dynamic(() => import("@/components/map/public-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
      Memuat peta...
    </div>
  ),
});

export default function PetaMapLoader() {
  return <PublicMap />;
}