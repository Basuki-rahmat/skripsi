"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Alert, Button, Input, Label } from "@/components/ui";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    nik: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Pendaftaran gagal. Coba lagi.");
        return;
      }
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      router.push("/app");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert kind="error">{error}</Alert>}
      <div>
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          placeholder="Nama sesuai KTP"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="nik">NIK (16 digit)</Label>
          <Input
            id="nik"
            inputMode="numeric"
            placeholder="Nomor induk kependudukan"
            value={form.nik}
            onChange={(e) => set("nik", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">No. HP</Label>
          <Input
            id="phone"
            inputMode="tel"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Mendaftar..." : "Buat Akun"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <a href="/login" className="font-medium text-blue-600 hover:underline">
          Masuk di sini
        </a>
      </p>
    </form>
  );
}