import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "by.naise — Thrift, Wig Styling, Nail Art & Ilustrasi",
    template: "%s | by.naise",
  },
  description:
    "Toko online aesthetic — baju bekas thrift pilihan, jasa wig styling, nail art, dan ilustrasi digital. Temukan gaya unikmu bersama by.naise!",
  keywords: ["thrift", "baju bekas", "wig styling", "nail art", "ilustrasi", "fashion", "aesthetic"],
  openGraph: {
    title: "by.naise",
    description: "Thrift · Wig Styling · Nail Art · Ilustrasi",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" style={{ height: "100%" }}>
      <body>
        <SessionProvider>
          <Navbar />

          {children}

          {/* Footer */}
          <footer className="footer">
            <div className="container">
              <div className="footer__grid">
                {/* Brand */}
                <div>
                  <p className="footer__logo">by.naise</p>
                  <p className="footer__desc">
                    Thrift store &amp; jasa kreatif aesthetic. Baju pilihan, wig styling, nail art, dan ilustrasi custom.
                  </p>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: 32, height: 32,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, color: "var(--text-muted)",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      title="Instagram"
                    >
                      📷
                    </a>
                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: 32, height: 32,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, color: "var(--text-muted)",
                      }}
                      title="WhatsApp"
                    >
                      💬
                    </a>
                  </div>
                </div>

                {/* Shop links */}
                <div>
                  <h2 className="footer__title">Belanja</h2>
                  <ul className="footer__links">
                    <li><Link href="/products?category=baju-thrift">Baju Thrift</Link></li>
                    <li><Link href="/products?category=wig-styling">Wig Styling</Link></li>
                    <li><Link href="/products?category=nail-art">Nail Art</Link></li>
                    <li><Link href="/products?category=ilustrator">Ilustrasi</Link></li>
                    <li><Link href="/products">Semua Produk</Link></li>
                  </ul>
                </div>

                {/* Info links */}
                <div>
                  <h2 className="footer__title">Informasi</h2>
                  <ul className="footer__links">
                    <li><Link href="/cart">Keranjang</Link></li>
                    <li><Link href="/checkout">Checkout</Link></li>
                    <li><Link href="/login">Login</Link></li>
                    <li><a href="mailto:admin@bynaise.com">Hubungi Kami</a></li>
                    <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                  </ul>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="footer__bottom">
                <span>© 2025 by.naise. All rights reserved.</span>
                <span style={{ display: "flex", gap: 16 }}>
                  <a href="#" style={{ color: "var(--text-muted)", fontSize: 12 }}>Privacy</a>
                  <a href="#" style={{ color: "var(--text-muted)", fontSize: 12 }}>Terms</a>
                </span>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
