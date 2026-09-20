"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/register/actions";
import { AlertCircle, UserPlus } from "lucide-react";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <div className="card w-full max-w-md p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Buat Akun</h1>
        <p className="mt-1 text-sm text-slate-500">
          Daftar gratis untuk mulai memesan layanan.
        </p>
      </div>

      {state?.error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <form action={action} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="label">Nama Lengkap</label>
          <input id="name" name="name" required className="input" placeholder="Nama kamu" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" required className="input" placeholder="nama@email.com" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="Minimal 6 karakter" />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          <UserPlus className="h-4 w-4" />
          {pending ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}