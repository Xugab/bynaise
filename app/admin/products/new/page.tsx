"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "0",
    type: "PHYSICAL" as "PHYSICAL" | "SERVICE",
    categoryId: "",
    isFeatured: false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data ?? []))
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    setForm({ ...form, [e.target.name]: target.type === "checkbox" ? target.checked : e.target.value });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validImages = imageUrls.filter(Boolean);
    if (validImages.length === 0) {
      setError("Minimal satu URL gambar diperlukan");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
          stock: parseInt(form.stock),
          images: validImages,
          tags,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Gagal menyimpan");
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 className="font-serif" style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "32px" }}>
        Tambah Produk Baru
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Basic Info */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          boxShadow: "var(--shadow-premium)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", margin: "0 0 8px" }}>
            Informasi Dasar
          </h2>

          <div>
            <label className="form-label" htmlFor="name">Nama Produk *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required
              placeholder="Contoh: Kemeja Flanel Thrift Vintage" className="form-input" />
          </div>

          <div>
            <label className="form-label" htmlFor="description">Deskripsi *</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={4}
              placeholder="Ceritakan detail produk atau jasa yang ditawarkan..." className="form-input" style={{ resize: "none", height: "auto" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label className="form-label" htmlFor="price">Harga (Rp) *</label>
              <input id="price" name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                placeholder="150000" className="form-input" />
            </div>
            <div>
              <label className="form-label" htmlFor="comparePrice">Harga Coret (opsional)</label>
              <input id="comparePrice" name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} min="0"
                placeholder="200000" className="form-input" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label className="form-label" htmlFor="type">Tipe Produk *</label>
              <select id="type" name="type" value={form.type} onChange={handleChange} className="form-input" style={{ background: "var(--surface)" }}>
                <option value="PHYSICAL">🛍️ Produk Fisik (Baju, dll)</option>
                <option value="SERVICE">✨ Jasa (Wig, Nail Art, Ilustrator)</option>
              </select>
            </div>
            {form.type === "PHYSICAL" && (
              <div>
                <label className="form-label" htmlFor="stock">Stok *</label>
                <input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} min="0" className="form-input" />
              </div>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="categoryId">Kategori *</label>
            <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} required className="form-input" style={{ background: "var(--surface)" }}>
              <option value="">Pilih kategori</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "8px" }}>
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
              style={{ accentColor: "var(--brand)", width: "16px", height: "16px", cursor: "pointer" }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-body)" }}>⭐ Tampilkan sebagai produk unggulan di homepage</span>
          </label>
        </div>

        {/* Images */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          boxShadow: "var(--shadow-premium)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", margin: 0 }}>
            🖼️ Gambar Produk
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 8px" }}>Upload gambar ke Cloudinary dulu, lalu copy-paste URL gambarnya di bawah ini.</p>
          
          {imageUrls.map((url, idx) => (
            <div key={idx} style={{ display: "flex", gap: "8px" }}>
              <input value={url} onChange={(e) => {
                const newUrls = [...imageUrls];
                newUrls[idx] = e.target.value;
                setImageUrls(newUrls);
              }}
                placeholder="https://res.cloudinary.com/..." className="form-input" />
              {imageUrls.length > 1 && (
                <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                  style={{ color: "#d93838", padding: "0 8px" }}>
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setImageUrls([...imageUrls, ""])}
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700", color: "var(--brand)", alignSelf: "flex-start", marginTop: "4px" }}>
            <Plus size={16} /> Tambah Gambar
          </button>
        </div>

        {/* Tags */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          boxShadow: "var(--shadow-premium)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          <h2 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-heading)", margin: 0 }}>
            🏷️ Tags
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Contoh: vintage, kemeja, aesthetic" className="form-input" />
            <button type="button" onClick={addTag} className="btn btn-secondary" style={{ height: "44px" }}>
              Tambah
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {tags.map((tag) => (
              <span key={tag} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: "var(--brand-light)",
                color: "var(--brand)",
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(31, 67, 137, 0.1)",
              }}>
                #{tag}
                <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} style={{ display: "flex", color: "var(--brand)" }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "var(--radius)",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "13px",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "0 24px" }}>
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary" style={{ padding: "0 24px" }}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
