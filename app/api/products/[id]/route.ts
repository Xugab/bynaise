import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/products/[id] — Update produk (Admin only)
const UpdateProductSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: { category: true },
    });

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("[PATCH /api/products/[id]]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Hapus produk (Admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.product.update({
      where: { id },
      data: { isActive: false }, // Soft delete
    });

    return NextResponse.json({ message: "Produk dihapus" });
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
