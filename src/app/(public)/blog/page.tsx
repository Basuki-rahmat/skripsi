import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/env";

export const metadata: Metadata = {
  title: "Blog Tips Skripsi — SkripsiMentor",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-emerald-100 text-emerald-700">Blog</span>
        <h1 className="section-title mt-4">Tips Menyusun Skripsi</h1>
        <p className="mt-3 text-slate-600">
          Artikel praktis dari mentor untuk membantumu melewati setiap tahap skripsi.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-slate-400">Belum ada artikel.</p>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="card card-hover block p-6"
            >
              <h2 className="text-xl font-bold text-slate-900">{p.title}</h2>
              {p.excerpt && (
                <p className="mt-2 line-clamp-2 text-slate-600">{p.excerpt}</p>
              )}
              <span className="mt-4 inline-block text-xs text-slate-400">
                {p.publishedAt ? formatDate(p.publishedAt) : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}