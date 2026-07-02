"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    category?: { name: string; slug: string } | null;
    isFeatured?: boolean;
    stock: number;
    type: string;
    tags?: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const isNew = product.isFeatured;
  const isSoldOut = product.type === "PHYSICAL" && product.stock === 0;
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (isSoldOut) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: 1,
      type: product.type as "PHYSICAL" | "SERVICE",
    });
  }

  return (
    <article className="product-card">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="product-card__img-wrap">
        {/* Badges */}
        {isSoldOut ? (
          <span className="product-card__badge">Habis</span>
        ) : isNew ? (
          <span className="product-card__badge product-card__badge--blue">Unggulan</span>
        ) : hasDiscount ? (
          <span className="product-card__badge product-card__badge--sale">-{discountPct}%</span>
        ) : null}

        {/* Wishlist */}
        <button className="product-card__wishlist" aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Photo */}
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="product-card__img"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--brand-soft)",
            fontSize: 40,
          }}>
            {product.category?.slug === "baju-thrift" ? "👗" :
             product.category?.slug === "wig-styling" ? "💇" :
             product.category?.slug === "nail-art" ? "💅" :
             product.category?.slug === "ilustrator" ? "🎨" : "📦"}
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="product-card__body">
        {product.category && (
          <p className="product-card__cat">{product.category.name}</p>
        )}
        <h3 className="product-card__name">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Rating placeholder */}
        <div className="product-card__rating">
          <Star size={11} fill="currentColor" style={{ color: "#f59e0b" }} />
          <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>4.9</span>
          <span>· {product.type === "SERVICE" ? "Jasa" : `Stok ${product.stock}`}</span>
        </div>

        {/* Price */}
        <div className="product-card__price-row">
          <span className="product-card__price">{formatRupiah(product.price)}</span>
          {hasDiscount && (
            <span className="product-card__compare">{formatRupiah(product.comparePrice!)}</span>
          )}
        </div>
      </div>

      {/* Add to cart */}
      <button
        className="product-card__btn"
        onClick={handleAddToCart}
        disabled={isSoldOut}
      >
        <ShoppingBag size={13} />
        {isSoldOut ? "Habis" : "Tambah ke Keranjang"}
      </button>
    </article>
  );
}
