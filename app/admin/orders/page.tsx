import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[AdminOrdersPage] Prisma query error:", err);
  }

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-600",
  };

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "32px" }}>
        Kelola Pesanan
      </h1>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-premium)",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--border)", color: "var(--text-heading)" }}>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Pelanggan</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Produk</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Total</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Pembayaran</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Status</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }} className="admin-tr-hover">
                  <td style={{ padding: "16px 24px" }}>
                    <p style={{ fontWeight: "700", color: "var(--text-heading)", margin: 0 }}>{order.user.name ?? "—"}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0" }}>{order.user.email}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-body)", margin: "4px 0 0" }}>{order.recipientName} · {order.city}</p>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {order.items.map((item: any, i: number) => (
                        <p key={i} style={{ margin: 0, color: "var(--text-body)", fontSize: "12px" }}>
                          {item.product.name} <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>x{item.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px", fontWeight: "700", color: "var(--brand)" }}>
                    {formatRupiah(order.total)}
                  </td>
                  <td style={{ padding: "16px 24px", color: "var(--text-body)" }}>
                    {order.paymentMethod}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "99px",
                      fontSize: "11px",
                      fontWeight: "700",
                      background: order.status === "PENDING" ? "#fef9c3" : order.status === "DELIVERED" ? "#dcfce7" : order.status === "CANCELLED" ? "#fee2e2" : "var(--brand-light)",
                      color: order.status === "PENDING" ? "#854d0e" : order.status === "DELIVERED" ? "#15803d" : order.status === "CANCELLED" ? "#b91c1c" : "var(--brand)",
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", color: "var(--text-muted)" }}>
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)" }}>
                    Belum ada pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .admin-tr-hover:hover {
          background: var(--surface-soft);
        }
      `}</style>
    </div>
  );
}
