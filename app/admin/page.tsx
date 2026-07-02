import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default async function AdminDashboard() {
  let totalProducts = 0;
  let totalOrders = 0;
  let pendingOrders = 0;
  let recentOrders: any[] = [];
  let totalRevenueValue = 0;

  try {
    const [resProducts, resOrders, resPending, resRecentOrders, resRevenue] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    totalProducts = resProducts;
    totalOrders = resOrders;
    pendingOrders = resPending;
    recentOrders = resRecentOrders;
    totalRevenueValue = resRevenue._sum.total ?? 0;
  } catch (err) {
    console.error("[AdminDashboard] Prisma query error:", err);
  }

  const stats = [
    { label: "Total Produk", value: totalProducts, icon: Package, color: "text-brand bg-brand-light" },
    { label: "Total Pesanan", value: totalOrders, icon: ShoppingBag, color: "text-green-600 bg-green-50" },
    { label: "Pesanan Pending", value: pendingOrders, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "Total Pendapatan", value: formatRupiah(totalRevenueValue), icon: TrendingUp, color: "text-brand bg-brand-light" },
  ];

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "32px" }}>
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <div className={`inline-flex p-3 rounded-xl ${stat.color}`} style={{ marginBottom: "16px" }}>
              <stat.icon size={20} />
            </div>
            <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-heading)", margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pesanan Terbaru */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        boxShadow: "var(--shadow-premium)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-heading)", margin: 0 }}>Pesanan Terbaru</h2>
          <Link href="/admin/orders" style={{ fontSize: "13px", fontWeight: "700", color: "var(--brand)" }}>
            Lihat semua
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ paddingBottom: "12px", fontWeight: "700" }}>Pelanggan</th>
                <th style={{ paddingBottom: "12px", fontWeight: "700" }}>Total</th>
                <th style={{ paddingBottom: "12px", fontWeight: "700" }}>Status</th>
                <th style={{ paddingBottom: "12px", fontWeight: "700" }}>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }} className="admin-tr-hover">
                  <td style={{ padding: "12px 0", fontWeight: "600", color: "var(--text-heading)" }}>{order.user.name ?? order.user.email}</td>
                  <td style={{ padding: "12px 0", color: "var(--brand)", fontWeight: "700" }}>{formatRupiah(order.total)}</td>
                  <td style={{ padding: "12px 0" }}>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "99px",
                      fontSize: "11px",
                      fontWeight: "700",
                      background: order.status === "PENDING" ? "#fef9c3" : order.status === "DELIVERED" ? "#dcfce7" : order.status === "CANCELLED" ? "#fee2e2" : "var(--brand-light)",
                      color: order.status === "PENDING" ? "#854d0e" : order.status === "DELIVERED" ? "#15803d" : order.status === "CANCELLED" ? "#b91c1c" : "var(--brand)",
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 0", color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)" }}>
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
