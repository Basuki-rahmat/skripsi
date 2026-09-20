import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className={`grid place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow ${className}`}>
        <GraduationCap className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        Skripsi<span className="gradient-text">Mentor</span>
      </span>
    </Link>
  );
}