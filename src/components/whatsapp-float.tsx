import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/env";

export default function WhatsAppFloat() {
  return (
    <Link
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-105 hover:bg-emerald-600"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}