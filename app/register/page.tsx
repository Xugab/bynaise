"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Registrasi gagal");
        return;
      }

      // Registrasi berhasil → ke login
      router.push("/login?registered=1");
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      background: "var(--surface-soft)",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Card */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "40px",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link href="/" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--brand)",
              display: "block",
              marginBottom: 8,
            }}>
              by.naise
            </Link>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Daftar akun baru
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
              Sudah punya akun?{" "}
              <Link href="/login" style={{ color: "var(--brand)", fontWeight: 600 }}>
                Masuk
              </Link>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: 13,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nama Lengkap</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Nama kamu"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="kamu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    display: "flex",
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", height: 44, marginTop: 8, fontSize: 14 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block"
                  }} />
                  Mendaftar...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Daftar Sekarang <ArrowRight size={15} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "24px 0",
            color: "var(--text-muted)",
            fontSize: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            atau
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <Link href="/login" className="btn btn-outline" style={{ width: "100%", height: 44, fontSize: 14 }}>
            Sudah punya akun
          </Link>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
          Dengan mendaftar, kamu menyetujui{" "}
          <a href="#" style={{ color: "var(--brand)" }}>Terms of Service</a> dan{" "}
          <a href="#" style={{ color: "var(--brand)" }}>Privacy Policy</a> kami.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
