"use client";

import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 16px", textAlign: "center" }}>
        <ShoppingBag size={64} style={{ color: "var(--brand)", opacity: 0.3, margin: "0 auto 24px" }} />
        <h1 className="font-serif" style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "8px" }}>
          Keranjangmu kosong
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Yuk cari baju thrift pilihan atau kustom layanan kreatif kami!</p>
        <Link
          href="/products"
          className="btn btn-primary"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  const shippingCost = 15000;
  const total = totalPrice() + shippingCost;

  return (
    <div className="container" style={{ padding: "48px 24px" }}>
      <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "32px" }}>
        Keranjang Belanja
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="cart-grid-layout">
        {/* Item List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="cart-items-column">
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "16px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "16px",
                boxShadow: "var(--shadow-premium)",
              }}
            >
              <div style={{
                position: "relative",
                height: "96px",
                width: "96px",
                flexShrink: 0,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: "var(--surface-soft)",
                border: "1px solid var(--border)",
              }}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    background: "var(--brand-light)",
                  }}>
                    👗
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-heading)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </h3>
                  <p style={{ color: "var(--brand)", fontWeight: "800", fontSize: "14px", marginTop: "4px", marginBottom: 0 }}>
                    {formatRupiah(item.price)}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                  {item.type === "PHYSICAL" ? (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      background: "var(--surface-soft)",
                      height: "32px",
                      overflow: "hidden",
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: "32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ width: "32px", fontSize: "13px", fontWeight: "700", textAlign: "center" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: "32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      background: "var(--brand-light)",
                      color: "var(--brand)",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-sm)",
                    }}>
                      Jasa Kreatif
                    </span>
                  )}

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      color: "#d93838",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "var(--radius)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(217, 56, 56, 0.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    title="Hapus item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: "8px" }}>
                <p style={{ fontWeight: "800", fontSize: "15px", color: "var(--text-heading)", margin: 0 }}>
                  {formatRupiah(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="cart-summary-column">
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", marginBottom: "20px" }}>
              Ringkasan Belanja
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Subtotal</span>
                <span>{formatRupiah(totalPrice())}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Ongkos Kirim (estimasi)</span>
                <span>{formatRupiah(shippingCost)}</span>
              </div>
              <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "800", color: "var(--text-heading)" }}>
                <span>Total Bayar</span>
                <span style={{ color: "var(--brand)" }}>{formatRupiah(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn btn-primary"
              style={{ width: "100%", height: "46px", marginTop: "24px", display: "inline-flex", justifyContent: "center" }}
            >
              Checkout Sekarang
              <ArrowRight size={15} style={{ marginLeft: "8px" }} />
            </Link>

            <Link
              href="/products"
              style={{
                display: "block",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginTop: "16px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .cart-grid-layout {
            grid-template-columns: 2fr 1fr !important;
          }
          .cart-summary-column {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>
    </div>
  );
}
