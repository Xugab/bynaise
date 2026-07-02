import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Daftar riwayat pesanan kamu di by.naise",
};

export default async function OrdersPage() {
  const session = await auth();

  // Proteksi: harus login untuk melihat riwayat pesanan
  if (!session || !session.user?.id) {
    redirect("/login?redirect=/orders");
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[OrdersPage] Error fetching customer orders:", err);
  }

  return (
    <div className="container" style={{ padding: "48px 24px", maxWidth: "800px" }}>
      <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "32px" }}>
        Riwayat Pesanan
      </h1>

      {orders.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "24px",
                boxShadow: "var(--shadow-premium)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Header card */}
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", margin: 0 }}>NOMOR PESANAN</p>
                  <p style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-heading)", margin: "4px 0 0" }}>#{order.orderNumber}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", margin: 0 }}>TANGGAL</p>
                  <p style={{ fontSize: "13px", color: "var(--text-body)", margin: "4px 0 0" }}>
                    {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Product preview list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {order.items.slice(0, 2).map((item: any, i: number) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{
                      position: "relative", width: "36px", height: "42px", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-soft)", border: "1px solid var(--border)", flexShrink: 0
                    }}>
                      {item.product.images[0] && (
                        <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--text-body)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
                      {item.product.name} <strong style={{ color: "var(--text-muted)" }}>x{item.quantity}</strong>
                    </span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                    dan {order.items.length - 2} produk lainnya...
                  </p>
                )}
              </div>

              {/* Total & Action */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "4px" }}>
                <div>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "99px",
                    fontSize: "11px",
                    fontWeight: "700",
                    background: order.status === "PENDING" ? "#fef9c3" : order.status === "DELIVERED" ? "#dcfce7" : order.status === "CANCELLED" ? "#fee2e2" : "var(--brand-light)",
                    color: order.status === "PENDING" ? "#854d0e" : order.status === "DELIVERED" ? "#15803d" : order.status === "CANCELLED" ? "#b91c1c" : "var(--brand)",
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>TOTAL BELANJA</p>
                    <p style={{ fontWeight: "800", fontSize: "16px", color: "var(--brand)", margin: "2px 0 0" }}>{formatRupiah(order.total)}</p>
                  </div>
                  <Link href={`/orders/${order.id}`} className="btn btn-secondary" style={{ height: "36px", padding: "0 12px", fontSize: "12px" }}>
                    Detail <ArrowRight size={12} style={{ marginLeft: "4px" }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "80px 0",
          background: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-premium)",
        }}>
          <ShoppingBag size={48} style={{ color: "var(--brand)", opacity: 0.3, margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-heading)", marginBottom: "4px" }}>Belum ada transaksi</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "24px" }}>Kamu belum memiliki riwayat pembelian produk atau pemesanan jasa.</p>
          <Link href="/products" className="btn btn-primary">Kembali Belanja</Link>
        </div>
      )}
    </div>
  );
}
