import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatIDR } from "@/lib/env";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — SkripsiMentor",
};

export default async function CheckoutPage({
  params,
}: PageProps<"/checkout/[packageId]">) {
  const session = await auth();
  if (!session?.user) {
    const url = `/login?callbackUrl=${encodeURIComponent(`/checkout/${(await params).packageId}`)}`;
    redirect(url);
  }

  const { packageId } = await params;
  const pkg = await prisma.package.findUnique({ where: { id: packageId } });

  if (!pkg || !pkg.isActive) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Paket tidak ditemukan</h1>
        <Link href="/paket" className="btn-primary mt-6">Lihat Paket</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-1 text-sm text-slate-500">
          Lengkapi detail pesanan di bawah ini.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <CheckoutForm pkg={pkg} />
          </div>
          <aside className="md:col-span-2">
            <div className="card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Ringkasan Pesanan
              </h2>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Paket</span>
                  <span className="font-semibold text-slate-900">{pkg.name}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-600">Jenis Layanan</span>
                  <span className="font-semibold text-slate-900">
                    {pkg.type === "BIMBINGAN" ? "Bimbingan Skripsi" : "Pembuatan Sistem"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-600">Durasi</span>
                  <span className="font-semibold text-slate-900">{pkg.duration}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-extrabold text-indigo-600">
                  {formatIDR(pkg.price)}
                </span>
              </div>
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                Pembayaran aman melalui Midtrans: kartu kredit/debit, transfer bank,
                e-wallet, dan QRIS.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}