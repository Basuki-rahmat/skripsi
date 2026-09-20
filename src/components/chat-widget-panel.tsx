"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function ChatWidgetPanel({
  waUrl,
  tgUrl,
}: {
  waUrl: string;
  tgUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Pilih mode chat"
          className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="flex items-start justify-between bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
            <div>
              <div className="text-sm font-bold">Butuh Bantuan? 👋</div>
              <div className="mt-0.5 text-xs text-indigo-100">Pilih mode chat favoritmu</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-indigo-100 transition hover:bg-white/15 hover:text-white"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 p-3">
            {/* Mode 1 — WhatsApp (manual) */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 transition hover:bg-emerald-100"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  WhatsApp <span className="text-xs font-normal text-slate-500">(manual)</span>
                </span>
                <span className="block text-xs text-slate-600">
                  Dibalas admin · 08.00–21.00 WIB
                </span>
              </span>
            </a>

            {/* Mode 2 — Telegram Bot (otomatis) */}
            {tgUrl ? (
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 transition hover:bg-sky-100"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-500 text-white">
                  <Send className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Telegram Bot{" "}
                    <span className="rounded bg-sky-200 px-1 text-[10px] font-bold text-sky-700">
                      AUTO
                    </span>
                  </span>
                  <span className="block text-xs text-slate-600">
                    Balasan otomatis 24/7 oleh bot
                  </span>
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 opacity-70">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-300 text-white">
                  <Send className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Telegram Bot</span>
                  <span className="block text-xs text-slate-500">
                    Belum aktif — isi NEXT_PUBLIC_TELEGRAM_BOT_USERNAME di .env
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2 text-center text-[11px] text-slate-400">
            Konsultasi awal gratis · Senin–Sabtu
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Tutup menu chat" : "Buka menu chat"}
        className="grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 transition hover:scale-105 hover:bg-indigo-700"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
