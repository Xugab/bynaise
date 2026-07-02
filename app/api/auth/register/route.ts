import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Cek apakah email sudah dipakai
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Admin pertama kalau email sesuai ADMIN_EMAIL di .env
    const isAdmin = email === process.env.ADMIN_EMAIL;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: isAdmin ? "ADMIN" : "USER",
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ data: user, message: "Registrasi berhasil!" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
