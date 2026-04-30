"use client";
import { useState } from "react";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
      localStorage.setItem("ce_token", data.token);
      localStorage.setItem("ce_user", JSON.stringify(data.user));
      if (data.user.role === "fournisseur") window.location.href = "/supplier";
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
          background: `radial-gradient(ellipse at 70% 20%, rgba(255,215,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(46,215,50,0.1) 0%, transparent 60%)`,
        }}
      />
      <div style={{ width: "100%", maxWidth: 480, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
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
                width: 40,
                height: 40,
                borderRadius: 11,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.blockchain})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              ⚡
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 22,
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
            padding: "32px 28px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: 24,
              color: "#F1F5F9",
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            Créer votre compte
          </h1>
          <p
            style={{
              color: "#64748B",
              textAlign: "center",
              marginBottom: 24,
              fontSize: 13,
            }}
          >
            Rejoignez la révolution de l'énergie solaire
          </p>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 16,
                color: "#FCA5A5",
                fontSize: 13,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Role selection */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                color: "#94A3B8",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Je suis un(e) :
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  value: "user",
                  label: "🏠 Membre",
                  desc: "Rejoindre des coopératives",
                },
                {
                  value: "fournisseur",
                  label: "🏭 Fournisseur",
                  desc: "Proposer des équipements",
                },
              ].map((r) => (
                <div
                  key={r.value}
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "center",
                    border: `2px solid ${form.role === r.value ? COLORS.primary : "rgba(255,255,255,0.08)"}`,
                    background:
                      form.role === r.value
                        ? `rgba(46,215,50,0.08)`
                        : "rgba(255,255,255,0.03)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>
                    {r.label.split(" ")[0]}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: form.role === r.value ? COLORS.primary : "#CBD5E1",
                    }}
                  >
                    {r.label.split(" ").slice(1).join(" ")}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                    {r.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              {
                key: "name",
                label: "Nom complet",
                type: "text",
                placeholder:
                  form.role === "fournisseur"
                    ? "Nom de l'entreprise"
                    : "Jean Mbarga",
              },
              {
                key: "email",
                label: "Email",
                type: "email",
                placeholder: "email@example.cm",
              },
              {
                key: "phone",
                label: "Téléphone",
                type: "tel",
                placeholder: "+237 6XX XXX XXX",
              },
              {
                key: "password",
                label: "Mot de passe",
                type: "password",
                placeholder: "••••••••",
              },
              {
                key: "confirmPassword",
                label: "Confirmer le mot de passe",
                type: "password",
                placeholder: "••••••••",
              },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required={field.key !== "phone"}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: "11px 14px",
                    color: "#F1F5F9",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                marginTop: 8,
                background: loading
                  ? "#374151"
                  : `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 4px 20px rgba(46,215,50,0.35)`,
              }}
            >
              {loading ? "Création en cours..." : "Créer mon compte → "}
            </button>
          </form>

          {/* Wallet notice */}
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: `${COLORS.blockchain}15`,
              borderRadius: 8,
              border: `1px solid ${COLORS.blockchain}30`,
            }}
          >
            <p style={{ color: "#93C5FD", fontSize: 11, textAlign: "center" }}>
              ⛓️ Un wallet Celo vous sera automatiquement créé lors de
              l'inscription
            </p>
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span style={{ color: "#64748B", fontSize: 13 }}>
              Déjà inscrit ?{" "}
            </span>
            <a
              href="/auth/login"
              style={{
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
