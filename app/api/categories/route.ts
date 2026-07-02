import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: { where: { isActive: true } } } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const CreateCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, ...rest } = parsed.data;
    const slug = slugify(name);

    const category = await prisma.category.create({
      data: { name, slug, ...rest },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/categories]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
