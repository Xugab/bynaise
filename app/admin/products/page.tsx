import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";

export default async function AdminProductsPage() {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[AdminProductsPage] Prisma query error:", err);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", margin: 0 }}>
          Kelola Produk
        </h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Tambah Produk
        </Link>
      </div>

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
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Produk</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Kategori</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Harga</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Stok</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Status</th>
                <th style={{ padding: "16px 24px", fontWeight: "700" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }} className="admin-tr-hover">
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        height: "48px",
                        width: "48px",
                        borderRadius: "var(--radius)",
                        overflow: "hidden",
                        background: "var(--surface-soft)",
                        border: "1px solid var(--border)",
                        position: "relative",
                        flexShrink: 0,
                      }}>
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                        )}
                      </div>
                      <div>
                        <p style={{ fontWeight: "700", color: "var(--text-heading)", margin: 0, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                          {product.type === "SERVICE" ? "Jasa Kreatif" : "Produk Fisik"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px", color: "var(--text-body)" }}>{product.category.name}</td>
                  <td style={{ padding: "16px 24px", fontWeight: "700", color: "var(--brand)" }}>{formatRupiah(product.price)}</td>
                  <td style={{ padding: "16px 24px" }}>
                    {product.type === "PHYSICAL" ? (
                      <span style={{ fontWeight: product.stock === 0 ? "700" : "500", color: product.stock === 0 ? "#d93838" : "var(--text-body)" }}>
                        {product.stock}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "99px",
                      fontSize: "11px",
                      fontWeight: "700",
                      background: product.isActive ? "#dcfce7" : "#fee2e2",
                      color: product.isActive ? "#15803d" : "#b91c1c",
                    }}>
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <Link href={`/products/${product.id}`} target="_blank" style={{ fontSize: "12px", fontWeight: "700", color: "var(--brand)" }}>
                      Lihat
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)" }}>
                    Belum ada produk
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
