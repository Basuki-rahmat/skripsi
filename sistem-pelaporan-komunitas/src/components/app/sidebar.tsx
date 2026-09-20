import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPinned, LogOut, LayoutDashboard, FilePlus2, ListChecks, ShieldCheck, Users, Tags, Map, BarChart3, Inbox } from "lucide-react";
import { auth, signOut } from "@/lib/auth";

const NAV = {
  MASYARAKAT: [
    { href: "/app/masyarakat", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/masyarakat/laporan/baru", label: "Buat Laporan", icon: FilePlus2 },
    { href: "/app/masyarakat", label: "Riwayat Laporan", icon: ListChecks },
  ],
  PETUGAS: [
    { href: "/app/petugas", label: "Antrean Laporan", icon: Inbox },
    { href: "/app/petugas", label: "Laporan Saya", icon: ListChecks },
  ],
  ADMIN: [
    { href: "/app/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/admin/verifikasi", label: "Verifikasi", icon: ShieldCheck },
    { href: "/app/admin/laporan", label: "Laporan", icon: ListChecks },
    { href: "/app/admin/statistik", label: "Statistik", icon: BarChart3 },
    { href: "/app/admin/pengguna", label: "Pengguna", icon: Users },
    { href: "/app/admin/kategori", label: "Kategori", icon: Tags },
    { href: "/app/admin/wilayah", label: "Wilayah", icon: Map },
  ],
} as const;

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const nav = NAV[role] ?? NAV.MASYARAKAT;

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link href="/" className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MapPinned className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold">Lapor Komunitas</div>
            <div className="text-[11px] text-slate-500">Panel {roleLabel(role)}</div>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item, i) => {
            const key = item.href + item.label + i;
            return (
              <Link
                key={key}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                <item.icon className="h-4 w-4 text-slate-400" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="mb-2 px-2">
            <div className="truncate text-sm font-semibold">{session.user.name}</div>
            <div className="truncate text-xs text-slate-500">{session.user.email}</div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <MapPinned className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold">Lapor Komunitas</span>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="cursor-pointer text-sm text-red-600">Keluar</button>
            </form>
          </div>
          <nav className="mt-2 flex gap-1 overflow-x-auto">
            {nav.map((item, i) => {
              const key = item.href + item.label + i;
              return (
                <Link
                  key={key}
                  href={item.href}
                  className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function roleLabel(role: string) {
  return (
    {
      MASYARAKAT: "Masyarakat",
      PETUGAS: "Petugas",
      ADMIN: "Admin",
    }[role] ?? role
  );
}