"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/components/app/report-list";

type Item = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
  reportId: string | null;
};

export function NotificationsList({
  items,
  baseHref,
}: {
  items: Item[];
  baseHref: string;
}) {
  const router = useRouter();
  const unread = items.filter((n) => !n.isRead).length;

  async function markRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Belum ada notifikasi.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="h-4 w-4 text-blue-600" />
          {unread > 0 ? `${unread} notifikasi belum dibaca` : "Semua sudah dibaca"}
        </span>
        {unread > 0 && (
          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={markRead}>
            Tandai dibaca
          </Button>
        )}
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((n) => (
          <li key={n.id} className="flex items-start gap-3 px-4 py-2">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? "bg-slate-200" : "bg-blue-500"}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700">{n.message}</p>
              <p className="text-xs text-slate-400">{formatDate(new Date(n.createdAt))}</p>
            </div>
            {n.reportId && (
              <a
                href={`${baseHref}/${n.reportId}`}
                className="whitespace-nowrap text-xs font-medium text-blue-600 hover:underline"
              >
                Buka
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}