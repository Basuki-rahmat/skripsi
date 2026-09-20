"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MapPinned className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold leading-tight sm:text-base">
            Lapor Komunitas
            <span className="block text-[11px] font-normal text-slate-500">
              Pelaporan Berbasis Web &amp; GIS
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Beranda
          </Link>
          <Link href="/peta" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Peta Laporan
          </Link>
          <Link href="/cek" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Cek Laporan
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {status === "authenticated" && session.user ? (
            <div className="relative">
              <Button variant="outline" onClick={() => setOpen((v) => !v)}>
                {session.user.name ?? "Akun"}
              </Button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  <Link
                    href="/app"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    Buka Panel
                  </Link>
                  <button
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={async () => {
                      setOpen(false);
                      await signOut({ redirect: false });
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/daftar">
                <Button>Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}