import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const content = body?.content?.trim();
  const rating = Number(body?.rating ?? 5);

  if (!content || content.length < 5) {
    return NextResponse.json({ error: "Testimoni minimal 5 karakter" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating 1-5" }, { status: 400 });
  }

  const existing = await prisma.testimonial.findFirst({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Kamu sudah pernah mengirim testimoni" },
      { status: 409 }
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      userId: session.user.id,
      content,
      rating,
      isApproved: false,
    },
  });

  return NextResponse.json({ testimonial }, { status: 201 });
}