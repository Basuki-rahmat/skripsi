import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import PostForm from "@/components/dashboard/post-form";
import PostRowActions from "@/components/dashboard/post-row-actions";
import { formatDate } from "@/lib/env";

export const metadata: Metadata = { title: "Artikel Blog — Admin" };

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");

  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Artikel Blog</h1>
      <p className="mt-1 text-sm text-slate-500">Kelola konten tutorial dan artikel.</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Daftar Artikel ({posts.length})</h2>
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className={`card p-5 ${p.published ? "" : "opacity-70"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">{p.title}</div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <Link href={`/blog/${p.slug}`} className="font-mono text-indigo-500 hover:underline">/{p.slug}</Link>
                      <span>{formatDate(p.publishedAt ?? p.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`badge shrink-0 ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.published ? "Terbit" : "Draft"}
                  </span>
                </div>
                <div className="mt-3">
                  <PostRowActions id={p.id} published={p.published} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Tulis Artikel Baru</h2>
          <PostForm />
        </div>
      </div>
    </div>
  );
}