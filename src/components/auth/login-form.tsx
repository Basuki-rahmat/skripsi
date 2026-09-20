"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/login/actions";
import { AlertCircle, LogIn } from "lucide-react";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="card w-full max-w-md p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
        <p className="mt-1 text-sm text-slate-500">
          Selamat datang kembali di SkripsiMentor.
        </p>
      </div>

      {state?.error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <form action={action} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" required className="input" placeholder="nama@email.com" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          <LogIn className="h-4 w-4" />
          {pending ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
          Daftar gratis
        </Link>
      </p>
    </div>
  );
}