"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Email atau password salah");
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  }

  return (
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
            Masuk ke akun
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: "var(--brand)", fontWeight: 600 }}>
              Daftar gratis
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
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="kamu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <a href="#" style={{ fontSize: 12, color: "var(--brand)" }}>Lupa password?</a>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
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
                Masuk...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                Masuk <ArrowRight size={15} />
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

        <Link href="/register" className="btn btn-outline" style={{ width: "100%", height: 44, fontSize: 14 }}>
          Buat akun baru
        </Link>
      </div>

      {/* Footer note */}
      <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
        Dengan masuk, kamu menyetujui{" "}
        <a href="#" style={{ color: "var(--brand)" }}>Terms of Service</a> dan{" "}
        <a href="#" style={{ color: "var(--brand)" }}>Privacy Policy</a> kami.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "calc(100vh - 160px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      background: "var(--surface-soft)",
    }}>
      <Suspense fallback={
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
          Loading...
        </div>
      }>
        <LoginForm />
      </Suspense>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
