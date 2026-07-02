import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "by.naise — Thrift, Wig Styling, Nail Art & Ilustrasi",
  description: "Toko online baju thrift pilihan, wig styling profesional, nail art, dan ilustrasi digital. Temukan koleksi terbaik kami.",
};

const CATEGORIES = [
  { slug: "baju-thrift",  label: "Baju Thrift",  icon: "/icon/cloth.svg", desc: "Koleksi kurasi" },
  { slug: "wig-styling",  label: "Wig Styling",  icon: "/icon/wig.svg", desc: "Styling profesional" },
  { slug: "nail-art",     label: "Nail Art",     icon: "/icon/nail.svg", desc: "Custom press-on" },
  { slug: "ilustrator",   label: "Ilustrasi",    icon: "/icon/graphic-tablet.svg", desc: "Art & portrait" },
];

const MARQUEE_ITEMS = [
  "Baju Thrift Pilihan", "Wig Styling Karakter", "Custom Nail Art", "Digital Portrait Illustration",
  "Gratis Ongkir Se-Indonesia", "Kualitas Kurasi Terbaik", "by.naise Studio",
];

export default async function HomePage() {
  // Graceful fallback if database is not connected
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let featuredProducts: Awaited<ReturnType<typeof prisma.product.findMany<{ include: { category: { select: { name: boolean; slug: boolean } } } }>>> = [];

  try {
    [categories, featuredProducts] = await Promise.all([
      prisma.category.findMany({ take: 4, orderBy: { name: "asc" } }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        take: 8,
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch {
    console.warn("[HomePage] Database not available, showing empty state");
  }

  return (
    <main id="main">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "center" }} className="hero-grid">
            
            <div style={{ paddingRight: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="hero-label">Drop Terbaru — Juli 2025</span>
                <span style={{ fontSize: "12px", padding: "2px 8px", background: "rgba(31, 67, 137, 0.1)", color: "var(--brand)", borderRadius: "99px", fontWeight: "700" }}>NEW</span>
              </div>
              
              <h1 className="hero-title">
                Objects &amp; Art <br />
                <span style={{ color: "var(--brand)", fontWeight: 400 }} className="font-serif italic">worth keeping</span> for years.
              </h1>
              
              <p className="hero-sub">
                by.naise menghadirkan kurasi baju thrift pilihan berkualitas tinggi, jasa wig styling profesional, nail art aesthetic, serta ilustrasi custom yang dirancang khusus untukmu.
              </p>
              
              {/* Cursive accent */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "28px" }}>
                <span className="script-text">Handmade with love</span>
                <span style={{ height: "1px", width: "60px", background: "var(--brand)", opacity: 0.3 }}></span>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/products" className="btn btn-primary">
                  Explore Catalog
                  <ArrowRight size={15} />
                </Link>
                <Link href="/products?category=baju-thrift" className="btn btn-secondary">
                  Browse Thrift Store
                </Link>
              </div>
            </div>

            {/* Visual illustration / grid layout using custom SVG icons */}
            <div className="hero-visual" style={{ display: "none" }} id="hero-visual">
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: "460px",
                aspectRatio: "1",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-premium)",
                padding: "32px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}>
                <div style={{
                  background: "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  <div style={{ position: "relative", width: "36px", height: "36px" }}>
                    <Image src="/icon/cloth.svg" alt="Thrift" fill style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand)" }}>Thrift Store</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Baju kurasi pilihan</p>
                  </div>
                </div>
                
                <div style={{
                  background: "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  <div style={{ position: "relative", width: "36px", height: "36px" }}>
                    <Image src="/icon/wig.svg" alt="Wig Styling" fill style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand)" }}>Wig Styling</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Hasil rapi &amp; detail</p>
                  </div>
                </div>

                <div style={{
                  background: "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  <div style={{ position: "relative", width: "36px", height: "36px" }}>
                    <Image src="/icon/nail.svg" alt="Nail Art" fill style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand)" }}>Nail Art</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Custom press-on</p>
                  </div>
                </div>

                <div style={{
                  background: "var(--surface-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  <div style={{ position: "relative", width: "36px", height: "36px" }}>
                    <Image src="/icon/graphic-tablet.svg" alt="Ilustrasi" fill style={{ objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand)" }}>Ilustrasi</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Kado &amp; kustom art</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <section className="section section--divider">
        <div className="container">
          <div className="section-head">
            <span className="section-head__label">Koleksi Kurasi</span>
            <h2 className="section-head__title">Explore Categories</h2>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }} className="cat-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="cat-card">
                <div style={{ position: "relative", width: "48px", height: "48px", marginBottom: "16px" }}>
                  <Image src={cat.icon} alt={cat.label} fill style={{ objectFit: "contain" }} />
                </div>
                <span className="cat-card__name">{cat.label}</span>
                <span className="cat-card__count">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section section--divider" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div className="section-head">
            <span className="section-head__label">Selected Pieces</span>
            <h2 className="section-head__title">Shop the Edit</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>{featuredProducts.length} pieces · updated weekly</p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-muted)",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius-xl)",
              background: "var(--surface-soft)",
            }}>
              <ShoppingBag size={40} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--brand)" }} />
              <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-heading)" }}>Produk segera hadir</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>Sedang menyiapkan koleksi terbaik untukmu! 🌸</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="section section--divider">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner__content">
              <span className="promo-banner__label">Weekend Offer</span>
              <h2 className="promo-banner__title">
                Layanan Wig Styling Custom — Mulai Rp 150K
              </h2>
              <p className="promo-banner__sub">
                Dapatkan hasil wig styling yang natural, tahan lama, dan presisi tinggi sesuai karakter favoritmu. Konsultasikan detailnya gratis!
              </p>
              <div style={{ marginTop: "8px" }}>
                <Link href="/products?category=wig-styling" className="btn btn-secondary promo-banner__btn">
                  Styling Now
                  <ArrowRight size={14} style={{ marginLeft: "6px" }} />
                </Link>
              </div>
            </div>
            <div className="promo-banner__visual" style={{ position: "relative", minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "120px", height: "120px" }}>
                <Image src="/icon/wig.svg" alt="Wig Icon" fill style={{ objectFit: "contain" }} />
              </div>
              <span style={{ position: "absolute", top: "40px", right: "80px", fontSize: "24px" }}>✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES LIST ===== */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div className="section-head">
            <span className="section-head__label">On-Demand Services</span>
            <h2 className="section-head__title">Jasa Kreatif &amp; Kustom</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "16px" }} className="service-grid">
            {[
              { icon: "/icon/nail.svg", name: "Nail Art Custom", desc: "Soft gradient, ombre, 3D custom design — tahan 2-3 minggu", slug: "nail-art", price: "Rp 60.000" },
              { icon: "/icon/graphic-tablet.svg", name: "Ilustrasi Digital", desc: "Portrait, karakter, wedding illustration — file PNG resolusi tinggi", slug: "ilustrator", price: "Rp 120.000" },
              { icon: "/icon/wig.svg", name: "Wig Styling Karakter", desc: "Trimming, blending, spike, baby hair, custom color", slug: "wig-styling", price: "Rp 80.000" },
            ].map((svc) => (
              <Link
                key={svc.slug}
                href={`/products?category=${svc.slug}`}
                className="service-card"
              >
                <div style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0 }}>
                  <Image src={svc.icon} alt={svc.name} fill style={{ objectFit: "contain" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="service-card__name">{svc.name}</h3>
                  <p className="service-card__desc">{svc.desc}</p>
                </div>
                <div className="service-card__price">
                  <span>Mulai {svc.price}</span>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    Detail <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
          #hero-visual { display: block !important; }
          .cat-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .service-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
