"use client";
import { useState } from "react";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de connexion");
      localStorage.setItem("ce_token", data.token);
      localStorage.setItem("ce_user", JSON.stringify(data.user));
      if (data.user.role === "superadmin") window.location.href = "/admin";
      else if (data.user.role === "fournisseur")
        window.location.href = "/supplier";
      else window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(46,215,50,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(30,64,175,0.1) 0%, transparent 60%)`,
        }}
      />
      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.blockchain})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              ⚡
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 24,
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CoopEnergie
            </span>
          </a>
        </div>

        <div
          style={{
            background: COLORS.darkCard,
            borderRadius: 20,
            padding: "36px 32px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: 26,
              color: "#F1F5F9",
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            Bienvenue !
          </h1>
          <p
            style={{
              color: "#64748B",
              textAlign: "center",
              marginBottom: 28,
              fontSize: 14,
            }}
          >
            Connectez-vous à votre espace CoopEnergie
          </p>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                color: "#FCA5A5",
                fontSize: 14,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  color: "#94A3B8",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Adresse email
              </label>
              <input
                type="email"
                required
                placeholder="votre@email.cm"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#F1F5F9",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  color: "#94A3B8",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#F1F5F9",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: loading
                  ? "#374151"
                  : `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 4px 20px rgba(46,215,50,0.35)`,
              }}
            >
              {loading ? "Connexion en cours..." : "Se connecter →"}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <span style={{ color: "#64748B", fontSize: 14 }}>
              Pas encore de compte ?{" "}
            </span>
            <a
              href="/auth/register"
              style={{
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              S'inscrire
            </a>
          </div>

          {/* Demo accounts */}
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: "rgba(46,215,50,0.05)",
              borderRadius: 10,
              border: "1px solid rgba(46,215,50,0.15)",
            }}
          >
            <p
              style={{
                color: "#64748B",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Comptes de démonstration
            </p>
            {[
              { role: "Superadmin", email: "admin@coopenergy.cm" },
              { role: "Utilisateur", email: "jean@example.cm" },
              { role: "Fournisseur", email: "contact@solarcam.cm" },
            ].map((acc) => (
              <div
                key={acc.role}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#94A3B8", fontSize: 12 }}>
                  {acc.role}
                </span>
                <button
                  onClick={() =>
                    setForm({ email: acc.email, password: "demo123" })
                  }
                  style={{
                    background: "rgba(46,215,50,0.1)",
                    border: "1px solid rgba(46,215,50,0.2)",
                    borderRadius: 6,
                    padding: "3px 10px",
                    color: COLORS.primary,
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Utiliser
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
