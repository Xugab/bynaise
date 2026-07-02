"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { ShoppingBag, Search, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/products?category=baju-thrift", label: "Thrift" },
  { href: "/products?category=wig-styling", label: "Wig Styling" },
  { href: "/products?category=nail-art", label: "Nail Art" },
  { href: "/products?category=ilustrator", label: "Ilustrasi" },
  { href: "/products", label: "Semua Produk" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="announce-bar">
        <div className="announce-bar__inner">
          <span>✨ Gratis ongkir untuk pembelian di atas Rp 200.000</span>
          <span>·</span>
          <span>Baju thrift pilihan berkualitas</span>
          <span>·</span>
          <span>Layanan wig styling &amp; nail art profesional</span>
        </div>
      </div>

      {/* Main navbar */}
      <header className="navbar">
        <div className="container">
          <div className="navbar__top">
            {/* Logo */}
            <Link href="/" className="navbar__logo">
              by.naise
            </Link>

            {/* Search */}
            <div className="navbar__search" style={{ display: "none" } as React.CSSProperties}>
              <Search size={14} className="navbar__search-icon" />
              <input
                type="search"
                placeholder='Cari "kemeja flanel" atau "wig curly"…'
                aria-label="Search products"
              />
            </div>
            {/* Desktop search — show on md+ */}
            <style>{`@media (min-width: 768px) { .search-md { display: block !important; } }`}</style>
            <div className="navbar__search search-md" style={{ display: "none" } as React.CSSProperties}>
              <Search size={14} className="navbar__search-icon" />
              <input
                type="search"
                placeholder='Cari produk…'
                aria-label="Search products"
              />
            </div>

            {/* Actions */}
            <div className="navbar__actions">
              {session ? (
                <>
                  {(session.user as { role?: string }).role === "ADMIN" && (
                    <Link href="/admin" className="btn btn-sm btn-outline" style={{ display: "none" } as React.CSSProperties}>
                      <style>{`@media (min-width: 640px) { .admin-btn { display: inline-flex !important; } }`}</style>
                      <span className="admin-btn" style={{ display: "none" } as React.CSSProperties}>Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="icon-btn"
                    title="Sign out"
                  >
                    <User size={18} />
                  </button>
                </>
              ) : (
                <Link href="/login" className="icon-btn" title="Login">
                  <User size={18} />
                </Link>
              )}

              <button className="icon-btn" title="Wishlist" style={{ display: "none" } as React.CSSProperties}>
                <style>{`@media (min-width: 640px) { .wishlist-btn { display: flex !important; } }`}</style>
                <Heart size={18} className="wishlist-btn" style={{ display: "none" } as React.CSSProperties}/>
              </button>
              <Heart size={18} className="icon-btn wishlist-btn-show" style={{ display: "none" } as React.CSSProperties}/>

              <Link href="/cart" className="bag-btn">
                <ShoppingBag size={18} />
                <span className="bag-btn__label" style={{ display: "none" } as React.CSSProperties}>Bag</span>
                {totalItems > 0 && (
                  <span className="bag-btn__badge">{totalItems}</span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="icon-btn mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="navbar__nav desktop-nav" aria-label="Store">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href.split("?")[0]) && link.href !== "/products" ? "active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            borderBottom: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            zIndex: 100,
          }}>
            <div className="container" style={{ padding: "16px 24px" }}>
              <div style={{ marginBottom: "12px", position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="search"
                  placeholder="Cari produk…"
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                />
              </div>
              <nav style={{ display: "flex", flexDirection: "column" }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: "10px 0",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--text-heading)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {session ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    style={{ padding: "10px 0", textAlign: "left", fontSize: "14px", color: "var(--text-muted)" }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} style={{ padding: "10px 0", fontSize: "14px", color: "var(--brand)", fontWeight: 600 }}>
                    Login / Daftar
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none; }
          .search-md { display: block !important; }
          .bag-btn__label { display: inline !important; }
          .admin-btn, .admin-btn + * { display: inline-flex !important; }
        }
        @media (min-width: 640px) {
          .wishlist-btn { display: flex !important; }
        }
        .desktop-nav {
          display: none;
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .mobile-menu-btn { display: none; }
        }
      `}</style>
    </>
  );
}
