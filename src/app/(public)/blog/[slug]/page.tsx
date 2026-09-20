import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/env";
import { ArrowLeft } from "lucide-react";

function renderContent(content: string) {
  return content
    .split(/\n\n+/)
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="mt-8 text-2xl font-bold text-slate-900">
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }
      if (block.startsWith("# ")) {
        return (
          <h1 key={i} className="text-3xl font-extrabold text-slate-900">
            {block.replace(/^#\s+/, "")}
          </h1>
        );
      }
      return (
        <p key={i} className="mt-4 leading-relaxed text-slate-700">
          {block}
        </p>
      );
    });
}

export default async function PostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <article className="container-page max-w-3xl py-16">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
        <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
      </div>
      <div className="mt-8">{renderContent(post.content)}</div>

      <div className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-center">
        <p className="font-semibold text-slate-900">Butuh bantuan langsung untuk skripsimu?</p>
        <Link href="/kontak" className="btn-primary mt-4">
          Konsultasi Gratis
        </Link>
      </div>
    </article>
  );
}