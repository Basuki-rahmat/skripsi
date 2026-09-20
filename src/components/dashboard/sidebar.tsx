"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  MessageSquareQuote,
  Gift,
  LogOut,
} from "lucide-react";
import type { Role } from "@/generated/prisma/enums";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <item.icon className="h-4 w-4" /> {item.label}
    </Link>
  );
}

function navFor(role: Role): NavItem[] {
  switch (role) {
    case "ADMIN":
      return [
        { href: "/dashboard/admin", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/dashboard/admin/orders", label: "Pesanan", icon: Package },
        { href: "/dashboard/admin/packages", label: "Paket & Harga", icon: Gift },
        { href: "/dashboard/admin/users", label: "Pengguna", icon: Users },
        { href: "/dashboard/admin/posts", label: "Artikel Blog", icon: FileText },
        { href: "/dashboard/admin/testimonials", label: "Testimoni", icon: MessageSquareQuote },
      ];
    case "MENTOR":
      return [
        { href: "/dashboard/mentor", label: "Klien Saya", icon: LayoutDashboard },
        { href: "/dashboard/mentor/orders", label: "Pesanan", icon: Package },
      ];
    default:
      return [
        { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
        { href: "/dashboard/orders", label: "Pesanan Saya", icon: Package },
      ];
  }
}

export default function DashboardShell({
  name,
  role,
  children,
}: {
  name: string;
  role: Role;
  children: React.ReactNode;
}) {
  const items = navFor(role);

  return (
    <div className="flex min-h-[80vh]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50 px-4 py-6 md:flex">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <div className="text-sm font-bold text-slate-900">{name}</div>
          <div className="text-xs capitalize text-slate-500">{role.toLowerCase()}</div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </form>
      </aside>

      <div className="flex-1 px-6 py-8 md:px-10">
        <nav className="mb-6 flex gap-1 overflow-x-auto md:hidden">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </form>
        </nav>
        {children}
      </div>
    </div>
  );
}