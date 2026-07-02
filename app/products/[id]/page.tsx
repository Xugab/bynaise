import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

// Generate metadata dari database (SEO-friendly)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  // Server Component → pass data ke Client Component
  return <ProductDetailClient product={product} />;
}
