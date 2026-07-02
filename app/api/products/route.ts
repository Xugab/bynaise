import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import { auth } from "@/lib/auth";

// ============================================
// GET /api/products — Ambil semua produk
// Query params: ?category=baju-thrift&featured=true&search=batik&page=1
// ============================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");

    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(featured === "true" && { isFeatured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { tags: { has: search } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ============================================
// POST /api/products — Tambah produk (Admin only)
// ============================================
const CreateProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().optional(),
  images: z.array(z.string().url()).min(1),
  stock: z.number().int().min(0),
  type: z.enum(["PHYSICAL", "SERVICE"]),
  categoryId: z.string(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, ...rest } = parsed.data;
    const slug = slugify(name);

    // Pastikan slug unik
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await prisma.product.create({
      data: { name, slug: finalSlug, tags: [], ...rest },
      include: { category: true },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
