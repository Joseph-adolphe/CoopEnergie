"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { requireAuth } from "@/utils/auth";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireAuth(["superadmin"]);
    fetch("/api/admin/suppliers")
      .then((r) => r.json())
      .then((d) => {
        setSuppliers(d.suppliers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleVerified = async (id, current) => {
    await fetch("/api/admin/suppliers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_verified: !current }),
    });
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_verified: !current } : s)),
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/admin/suppliers" />
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#F1F5F9",
              marginBottom: 4,
            }}
          >
            🏭 Gestion des fournisseurs
          </h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            {suppliers.length} fournisseurs enregistrés
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {loading ? (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: 60,
                color: COLORS.primary,
              }}
            >
              ⚡ Chargement...
            </div>
          ) : (
            suppliers.map((s) => (
              <div
                key={s.id}
                style={{
                  background: COLORS.darkCard,
                  borderRadius: 16,
                  padding: 22,
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#F1F5F9",
                        marginBottom: 4,
                      }}
                    >
                      {s.company_name}
                    </h3>
                    <div style={{ fontSize: 13, color: "#64748B" }}>
                      {s.user_email}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      background: s.is_verified
                        ? `${COLORS.primary}20`
                        : `${COLORS.tertiary}20`,
                      color: s.is_verified ? COLORS.primary : COLORS.tertiary,
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontWeight: 700,
                    }}
                  >
                    {s.is_verified ? "✅ Vérifié" : "⏳ Non vérifié"}
                  </span>
                </div>
                {s.description && (
                  <p
                    style={{
                      color: "#64748B",
                      fontSize: 13,
                      marginBottom: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {s.description}
                  </p>
                )}
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: COLORS.secondary,
                      }}
                    >
                      ⭐ {Number(s.rating || 0).toFixed(1)}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>Note</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: COLORS.primary,
                      }}
                    >
                      {s.total_orders}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>
                      Commandes
                    </div>
                  </div>
                  {s.region && (
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#94A3B8",
                        }}
                      >
                        {s.region}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>
                        Région
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleVerified(s.id, s.is_verified)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 10,
                    border: `1px solid ${s.is_verified ? "rgba(239,68,68,0.3)" : `${COLORS.primary}40`}`,
                    background: s.is_verified
                      ? "rgba(239,68,68,0.08)"
                      : `${COLORS.primary}10`,
                    color: s.is_verified ? "#FCA5A5" : COLORS.primary,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {s.is_verified
                    ? "Révoquer la vérification"
                    : "✅ Vérifier ce fournisseur"}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
