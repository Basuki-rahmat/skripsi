import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  nik: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{16}$/.test(v), "NIK harus 16 angka"),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  const { name, email, password, nik, phone } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(nik ? [{ nik }] : [])] },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Email atau NIK sudah terdaftar" },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed, nik, phone, role: "MASYARAKAT" },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}