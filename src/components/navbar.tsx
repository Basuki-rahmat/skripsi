"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/paket", label: "Paket & Harga" },
  { href: "/produk/sistem-pelaporan", label: "Produk" },
  { href: "/blog", label: "Blog" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "text-indigo-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600">
            Masuk
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Daftar
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary">
                Masuk
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-primary">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}