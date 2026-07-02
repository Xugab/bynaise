import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle2, Copy, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Detail Pesanan",
  description: "Status dan detail pesanan kamu di by.naise",
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  let order: any = null;

  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    });
  } catch (err) {
    console.error("[OrderDetailPage] Error fetching order:", err);
  }

  if (!order) {
    notFound();
  }

  const isTransfer = order.paymentMethod === "TRANSFER";
  const showSuccessBanner = true; // Diarahkan setelah checkout

  // Generate WA confirmation text
  const waMessage = encodeURIComponent(
    `Halo by.naise, saya ingin konfirmasi pembayaran untuk pesanan #${order.orderNumber}.\n\nTotal: ${formatRupiah(order.total)}\nMetode: Transfer Bank`
  );
  const waUrl = `https://wa.me/628123456789?text=${waMessage}`; // Ganti dengan nomor WA by.naise asli jika perlu

  return (
    <div className="container" style={{ padding: "48px 16px", maxWidth: "680px" }}>
      
      {/* Success banner if redirected from checkout */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "32px",
        textAlign: "center",
        boxShadow: "var(--shadow-premium)",
        marginBottom: "32px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", color: "#2e8b57", marginBottom: "16px" }}>
          <CheckCircle2 size={56} />
        </div>
        <h1 className="font-serif" style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-heading)", margin: "0 0 8px" }}>
          Pesanan Berhasil Dibuat!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 4px" }}>
          Nomor Pesanan: <strong style={{ color: "var(--text-heading)" }}>#{order.orderNumber}</strong>
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
          Status: <span style={{
            fontWeight: "700",
            color: order.status === "PENDING" ? "#854d0e" : "var(--brand)"
          }}>{order.status}</span>
        </p>
      </div>

      {/* Payment instructions */}
      {isTransfer && order.status === "PENDING" && (
        <div style={{
          background: "var(--brand-light)",
          border: "1px solid var(--brand)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "var(--shadow-premium)",
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--brand)", margin: "0 0 16px" }}>
            Pembayaran Transfer Bank
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: "1.6", margin: "0 0 16px" }}>
            Silakan transfer tepat sebesar nominal di bawah ini agar pesanan kamu dapat segera dikonfirmasi oleh admin:
          </p>
          
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "16px",
            marginBottom: "16px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 4px" }}>TOTAL YANG HARUS DITRANSFER</p>
            <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--brand)", margin: 0 }}>
              {formatRupiah(order.total)}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Bank Tujuan</span>
              <span style={{ fontWeight: "700", color: "var(--text-heading)" }}>Bank BCA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Nomor Rekening</span>
              <span style={{ fontWeight: "700", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "4px" }}>
                123-456-7890
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>Atas Nama</span>
              <span style={{ fontWeight: "700", color: "var(--text-heading)" }}>by.naise</span>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "20px 0" }} />

          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: "0 0 16px" }}>
            Setelah melakukan transfer, silakan klik tombol di bawah untuk mengirimkan bukti transfer ke WhatsApp admin kami.
          </p>

          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Konfirmasi Via WhatsApp
          </a>
        </div>
      )}

      {!isTransfer && (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "var(--shadow-premium)",
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", margin: "0 0 8px" }}>
            Metode Pembayaran: COD
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            Silakan siapkan uang tunai sebesar <strong style={{ color: "var(--brand)" }}>{formatRupiah(order.total)}</strong> untuk dibayarkan langsung kepada kurir saat paket sampai di alamat rumahmu.
          </p>
        </div>
      )}

      {/* Order details */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        boxShadow: "var(--shadow-premium)",
        marginBottom: "32px",
      }}>
        <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", margin: "0 0 16px" }}>
          Rincian Pesanan
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {order.items.map((item: any) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                <div style={{
                  position: "relative", width: "40px", height: "48px", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-soft)", border: "1px solid var(--border)", flexShrink: 0
                }}>
                  {item.product.images[0] && (
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <span style={{ color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.product.name} <strong style={{ color: "var(--text-muted)" }}>x{item.quantity}</strong>
                </span>
              </div>
              <span style={{ fontWeight: "700", color: "var(--text-heading)", marginLeft: "16px" }}>
                {formatRupiah(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Subtotal</span>
            <span>{formatRupiah(order.subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Ongkos Kirim</span>
            <span>{order.shippingCost === 0 ? "Gratis" : formatRupiah(order.shippingCost)}</span>
          </div>
          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "800", color: "var(--text-heading)" }}>
            <span>Total Bayar</span>
            <span style={{ color: "var(--brand)" }}>{formatRupiah(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        boxShadow: "var(--shadow-premium)",
        marginBottom: "32px",
      }}>
        <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", margin: "0 0 16px" }}>
          Alamat Pengiriman
        </h2>
        <div style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: "1.6" }}>
          <p style={{ fontWeight: "700", color: "var(--text-heading)", margin: "0 0 4px" }}>{order.recipientName}</p>
          <p style={{ color: "var(--text-muted)", margin: "0 0 8px" }}>{order.recipientPhone}</p>
          <p style={{ margin: 0 }}>
            {order.addressLine1}
            {order.addressLine2 ? `, ${order.addressLine2}` : ""}
            <br />
            {order.city}, {order.province}, {order.postalCode}
          </p>
        </div>
      </div>

      {/* Call to action links */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link href="/products" className="btn btn-secondary">
          Lanjut Belanja
        </Link>
        <Link href="/" className="btn btn-primary">
          Ke Homepage
          <ArrowRight size={14} style={{ marginLeft: "6px" }} />
        </Link>
      </div>

    </div>
  );
}
