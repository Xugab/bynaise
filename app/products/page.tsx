import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description: "Semua produk by.naise — baju thrift, wig styling, nail art, ilustrator",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    type?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const limit = 12;

  const where = {
    isActive: true,
    ...(params.category && { category: { slug: params.category } }),
    ...(params.type && { type: params.type as "PHYSICAL" | "SERVICE" }),
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: "insensitive" as const } },
        { description: { contains: params.search, mode: "insensitive" as const } },
      ],
    }),
  };

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let total = 0;
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];

  try {
    const [resProducts, resTotal, resCategories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    products = resProducts;
    total = resTotal;
    categories = resCategories;
  } catch {
    console.warn("[ProductsPage] Database not available, showing empty state");
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container" style={{ padding: "48px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-heading)" }}>
          {params.search ? `Hasil: "${params.search}"` : "Katalog Produk"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>{total} produk ditemukan</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }} className="products-layout-flex">
        {/* Filter Section */}
        <aside style={{ width: "100%" }} className="products-sidebar">
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <h2 style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", marginBottom: "12px" }}>Kategori</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              <Link
                href="/products"
                className={`filter-tab ${!params.category ? "active" : ""}`}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                Semua
              </Link>
              {categories.map((cat: typeof categories[0]) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`filter-tab ${params.category === cat.slug ? "active" : ""}`}
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "20px 0" }} />

            <h2 style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", marginBottom: "12px" }}>Tipe Produk</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <Link href="/products" className={`filter-tab ${!params.type ? "active" : ""}`} style={{ display: "inline-flex", alignItems: "center" }}>
                Semua
              </Link>
              <Link href="/products?type=PHYSICAL" className={`filter-tab ${params.type === "PHYSICAL" ? "active" : ""}`} style={{ display: "inline-flex", alignItems: "center" }}>
                🛍️ Produk Fisik
              </Link>
              <Link href="/products?type=SERVICE" className={`filter-tab ${params.type === "SERVICE" ? "active" : ""}`} style={{ display: "inline-flex", alignItems: "center" }}>
                ✨ Jasa
              </Link>
            </div>
          </div>
        </aside>

        {/* Grid Produk */}
        <div style={{ flex: 1 }}>
          {products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product: typeof products[0]) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link
                      key={i}
                      href={`/products?${new URLSearchParams({
                        ...(params.category ? { category: params.category } : {}),
                        ...(params.search ? { search: params.search } : {}),
                        page: String(i + 1),
                      })}`}
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        fontSize: "13px",
                        fontWeight: "700",
                        border: "1px solid var(--border)",
                        background: page === i + 1 ? "var(--brand)" : "var(--surface)",
                        color: page === i + 1 ? "var(--surface)" : "var(--text-heading)",
                        borderColor: page === i + 1 ? "var(--brand)" : "var(--border)",
                      }}
                      onMouseEnter={(e) => {
                        if (page !== i + 1) {
                          e.currentTarget.style.borderColor = "var(--brand)";
                          e.currentTarget.style.color = "var(--brand)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== i + 1) {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.color = "var(--text-heading)";
                        }
                      }}
                    >
                      {i + 1}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "80px 0",
              background: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius-lg)",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-heading)", marginBottom: "4px" }}>Produk tidak ditemukan</p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Coba kata kunci atau filter kategori lain.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .products-layout-flex {
            flex-direction: row !important;
          }
          .products-sidebar {
            width: 260px !important;
          }
        }
      `}</style>
    </div>
  );
}
