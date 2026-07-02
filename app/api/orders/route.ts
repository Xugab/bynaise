import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// ============================================
// POST /api/orders — Buat pesanan baru
// ============================================
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  recipientName: z.string().min(2),
  recipientPhone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().min(5),
  paymentMethod: z.enum(["TRANSFER", "COD"]),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { items, ...shippingData } = parsed.data;

    // Ambil data produk untuk validasi stok dan harga
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Beberapa produk tidak ditemukan atau tidak aktif" }, { status: 400 });
    }

    // Validasi stok
    for (const item of items) {
      const product = products.find((p: typeof products[0]) => p.id === item.productId)!;
      if (product.type === "PHYSICAL" && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stok ${product.name} tidak cukup (tersisa ${product.stock})` },
          { status: 400 }
        );
      }
    }

    // Hitung total
    const subtotal = items.reduce((acc: number, item: typeof items[0]) => {
      const product = products.find((p: typeof products[0]) => p.id === item.productId)!;
      return acc + product.price * item.quantity;
    }, 0);

    const shippingCost = shippingData.paymentMethod === "COD" ? 0 : 15000;
    const total = subtotal + shippingCost;

    // Buat order dalam satu transaksi
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user!.id!,
          subtotal,
          shippingCost,
          total,
          ...shippingData,
          items: {
            create: items.map((item: typeof items[0]) => {
              const product = products.find((p: typeof products[0]) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Kurangi stok untuk produk fisik
      for (const item of items) {
        const product = products.find((p: typeof products[0]) => p.id === item.productId)!;
        if (product.type === "PHYSICAL") {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json({ data: order, message: "Pesanan berhasil dibuat!" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/orders — Riwayat pesanan user yang login
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as { role?: string }).role === "ADMIN";

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: orders });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
