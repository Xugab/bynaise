"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, CreditCard, MapPin } from "lucide-react";

const PROVINCES = [
  "Aceh","Bali","Banten","Bengkulu","DI Yogyakarta","DKI Jakarta",
  "Gorontalo","Jambi","Jawa Barat","Jawa Tengah","Jawa Timur","Kalimantan Barat",
  "Kalimantan Selatan","Kalimantan Tengah","Kalimantan Timur","Kalimantan Utara",
  "Kepulauan Bangka Belitung","Kepulauan Riau","Lampung","Maluku","Maluku Utara",
  "Nusa Tenggara Barat","Nusa Tenggara Timur","Papua","Papua Barat",
  "Riau","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tengah","Sulawesi Tenggara",
  "Sulawesi Utara","Sumatera Barat","Sumatera Selatan","Sumatera Utara",
];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState({
    recipientName: session?.user?.name ?? "",
    recipientPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "TRANSFER" as "TRANSFER" | "COD",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shippingCost = form.paymentMethod === "COD" ? 0 : 15000;
  const total = totalPrice() + shippingCost;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 16px", textAlign: "center" }}>
        <h1 className="font-serif" style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "8px" }}>
          Keranjangmu kosong 😅
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Silakan tambahkan produk atau jasa kreatif terlebih dahulu.</p>
        <Link href="/products" className="btn btn-primary">Kembali Belanja</Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container" style={{ padding: "80px 16px", textAlign: "center" }}>
        <h1 className="font-serif" style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "8px" }}>
          Silakan login dulu
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Kamu harus masuk ke akunmu untuk melanjutkan transaksi.</p>
        <Link href="/login?redirect=/checkout" className="btn btn-primary">
          Login Sekarang
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Terjadi kesalahan");
        return;
      }

      clearCart();
      router.push(`/orders/${json.data.id}?success=1`);
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "48px 24px" }}>
      <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "32px" }}>
        Checkout
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="checkout-grid-layout">
        {/* Shipping Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="checkout-form-column">
          {/* Address */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <MapPin size={18} style={{ color: "var(--brand)" }} /> Alamat Pengiriman
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="address-fields-grid">
              <div>
                <label className="form-label" htmlFor="recipientName">Nama Penerima *</label>
                <input id="recipientName" name="recipientName" value={form.recipientName} onChange={handleChange} required
                  className="form-input" placeholder="Nama penerima paket" />
              </div>
              <div>
                <label className="form-label" htmlFor="recipientPhone">No. HP Penerima *</label>
                <input id="recipientPhone" name="recipientPhone" value={form.recipientPhone} onChange={handleChange} required placeholder="08xxxxxxxxxx"
                  className="form-input" />
              </div>
              <div style={{ gridColumn: "span 1" }} className="span-all-field">
                <label className="form-label" htmlFor="addressLine1">Alamat Lengkap *</label>
                <input id="addressLine1" name="addressLine1" value={form.addressLine1} onChange={handleChange} required placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan"
                  className="form-input" />
              </div>
              <div>
                <label className="form-label" htmlFor="city">Kota / Kabupaten *</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} required
                  className="form-input" />
              </div>
              <div>
                <label className="form-label" htmlFor="province">Provinsi *</label>
                <select id="province" name="province" value={form.province} onChange={handleChange} required
                  className="form-input" style={{ background: "var(--surface)", cursor: "pointer" }}>
                  <option value="">Pilih Provinsi</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="postalCode">Kode Pos *</label>
                <input id="postalCode" name="postalCode" value={form.postalCode} onChange={handleChange} required placeholder="12345"
                  className="form-input" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <CreditCard size={18} style={{ color: "var(--brand)" }} /> Metode Pembayaran
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }} className="payment-options-grid">
              {[
                { value: "TRANSFER", label: "💳 Transfer Bank", desc: "Instruksi transfer via BCA / BNI / Mandiri akan diberikan setelah order dibuat" },
                { value: "COD", label: "🏠 COD (Bayar di Tempat)", desc: "Bayar tunai langsung ke kurir saat paket sampai di rumahmu" },
              ].map((opt) => {
                const isSelected = form.paymentMethod === opt.value;
                return (
                  <label key={opt.value} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    border: "1px solid",
                    borderColor: isSelected ? "var(--brand)" : "var(--border)",
                    borderRadius: "var(--radius-lg)",
                    background: isSelected ? "var(--brand-light)" : "var(--surface)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={isSelected}
                      onChange={handleChange}
                      style={{ accentColor: "var(--brand)", cursor: "pointer", width: "16px", height: "16px" }}
                    />
                    <div>
                      <p style={{ fontWeight: "700", fontSize: "13px", color: "var(--text-heading)", margin: 0 }}>{opt.label}</p>
                      <p style={{ textAlign: "left", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <label className="form-label" htmlFor="notes">Catatan Tambahan (opsional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Contoh: Titip ke satpam jika saya sedang keluar, atau detail request jasa..."
              className="form-input"
              style={{ resize: "none", height: "auto", padding: "12px 16px" }}
            />
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="checkout-summary-column">
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            boxShadow: "var(--shadow-premium)",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Package size={18} style={{ color: "var(--brand)" }} /> Rincian Order
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px", marginBottom: "16px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {item.name} <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>x{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: "700", color: "var(--text-heading)", marginLeft: "12px" }}>
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Subtotal Produk</span>
                <span>{formatRupiah(totalPrice())}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Ongkir</span>
                <span>{shippingCost === 0 ? "Gratis (COD)" : formatRupiah(shippingCost)}</span>
              </div>
              <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "800", color: "var(--text-heading)" }}>
                <span>Total Bayar</span>
                <span style={{ color: "var(--brand)" }}>{formatRupiah(total)}</span>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "8px 12px",
                borderRadius: "var(--radius)",
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: "12px",
                marginTop: "16px",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", height: "46px", marginTop: "24px", display: "inline-flex", justifyContent: "center" }}
            >
              {loading ? "Memproses..." : "Buat Pesanan Sekarang"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (min-width: 768px) {
          .address-fields-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .span-all-field {
            grid-column: span 2 !important;
          }
          .payment-options-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .checkout-grid-layout {
            grid-template-columns: 2fr 1fr !important;
          }
          .checkout-summary-column {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>
    </div>
  );
}
