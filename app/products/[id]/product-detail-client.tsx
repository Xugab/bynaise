"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import type { ProductWithCategory } from "@/types";

interface ProductDetailClientProps {
  product: ProductWithCategory;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: qty,
      type: product.type,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="container" style={{ padding: "48px 24px" }}>
      {/* Back button */}
      <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", marginBottom: "32px", fontSize: "13px", fontWeight: "700" }}>
        <ArrowLeft size={16} /> KEMBALI KE KATALOG
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }} className="product-detail-grid">
        {/* Photo Gallery */}
        <div>
          <div style={{
            position: "relative",
            aspectRatio: "4/5",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-premium)",
            marginBottom: "16px",
          }}>
            <Image
              src={product.images[selectedImage] ?? "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {discountPercent && (
              <span className="product-card__badge product-card__badge--sale" style={{ position: "absolute", top: "16px", left: "16px" }}>
                -{discountPercent}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    flexShrink: 0,
                    width: "72px",
                    height: "72px",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor: selectedImage === idx ? "var(--brand)" : "transparent",
                    position: "relative",
                  }}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div>
          <p className="product-card__cat" style={{ fontSize: "12px" }}>{product.category.name}</p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "var(--text-heading)", marginTop: "8px", marginBottom: "16px" }}>
            {product.name}
          </h1>

          {/* Pricing */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--brand)" }}>
              {formatRupiah(product.price)}
            </span>
            {product.comparePrice && (
              <span style={{ fontSize: "16px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                {formatRupiah(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            marginBottom: "32px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <h3 style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", marginBottom: "8px" }}>Deskripsi</h3>
            <p style={{ color: "var(--text-body)", lineHeight: "1.7", whiteSpace: "pre-line", margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Stock state */}
          {product.type === "PHYSICAL" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              <span style={{
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                background: product.stock > 0 ? "#2e8b57" : "#d93838",
              }} />
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {product.stock > 0 ? `Stok tersedia: ${product.stock}` : "Stok habis"}
              </span>
            </div>
          )}

          {/* Quantity selector & Add to cart */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
            {product.type === "PHYSICAL" && product.stock > 0 && (
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                background: "var(--surface)",
                overflow: "hidden",
                height: "44px",
              }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: "40px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: "44px", textAlign: "center", fontWeight: "700" }}>{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  style={{ width: "40px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.type === "PHYSICAL" && product.stock === 0}
              className="btn btn-primary"
              style={{
                flex: 1,
                height: "44px",
                fontSize: "14px",
                background: added ? "#2e8b57" : (product.type === "PHYSICAL" && product.stock === 0) ? "var(--border-strong)" : "var(--brand)",
                borderColor: added ? "#2e8b57" : (product.type === "PHYSICAL" && product.stock === 0) ? "var(--border-strong)" : "var(--brand)",
                color: (product.type === "PHYSICAL" && product.stock === 0) ? "var(--text-muted)" : "var(--surface)",
                cursor: (product.type === "PHYSICAL" && product.stock === 0) ? "not-allowed" : "pointer",
              }}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>DITAMBAHKAN!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>{product.type === "SERVICE" ? "Pesan Jasa" : "Tambah ke Keranjang"}</span>
                </>
              )}
            </button>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "var(--brand-light)",
                    color: "var(--brand)",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid rgba(31, 67, 137, 0.1)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </div>
  );
}
