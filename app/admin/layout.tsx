import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Proteksi: hanya ADMIN yang bisa akses /admin/*
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/login?redirect=/admin");
  }

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 160px)", background: "var(--surface-soft)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "32px 16px",
        display: "flex",
        flexDirection: "column",
      }}>
        <p className="font-serif" style={{ fontSize: "20px", fontWeight: "800", color: "var(--brand)", marginBottom: "32px", paddingLeft: "8px" }}>
          ⚙️ Admin Panel
        </p>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { href: "/admin", label: "📊 Dashboard" },
            { href: "/admin/products", label: "📦 Produk" },
            { href: "/admin/products/new", label: "➕ Tambah Produk" },
            { href: "/admin/orders", label: "🛒 Pesanan" },
            { href: "/admin/categories", label: "🏷️ Kategori" },
            { href: "/", label: "← Ke Toko" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "10px 12px",
                borderRadius: "var(--radius)",
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--text-body)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--brand-light)";
                e.currentTarget.style.color = "var(--brand)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--text-body)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
