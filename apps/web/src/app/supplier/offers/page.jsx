"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { getUser, requireAuth } from "@/utils/auth";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

export default function SupplierOffersPage() {
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const u = requireAuth(["fournisseur"]);
    if (!u) return;
    setUser(u);
    fetch(`/api/offers?user_id=${u.id}`)
      .then(async (res) => {
        const suppliers = await fetch(
          `/api/dashboard/stats?role=fournisseur&user_id=${u.id}`,
        ).then((r) => r.json());
        const sid = suppliers?.recentOffers?.[0]?.supplier_id;
        if (sid)
          return fetch(`/api/offers?supplier_id=${sid}`).then((r) => r.json());
        return { offers: [] };
      })
      .then((d) => {
        setOffers(d.offers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const statusConfig = {
    pending: { label: "⏳ En attente", color: COLORS.secondary },
    approved: { label: "✅ Approuvée", color: COLORS.primary },
    rejected: { label: "❌ Rejetée", color: "#EF4444" },
    active: { label: "🟢 Active", color: COLORS.primary },
    expired: { label: "⚫ Expirée", color: "#64748B" },
  };

  const equipLabels = {
    kit_complet: "🌞 Kit Complet",
    panneau_solaire: "☀️ Panneau",
    batterie: "🔋 Batterie",
    onduleur: "⚡ Onduleur",
    autre: "📦 Autre",
  };

  const filtered =
    filter === "all" ? offers : offers.filter((o) => o.status === filter);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/supplier/offers" />
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#F1F5F9",
                marginBottom: 4,
              }}
            >
              📦 Mes offres
            </h1>
            <p style={{ color: "#64748B", fontSize: 14 }}>
              {offers.length} offres soumises
            </p>
          </div>
          <a
            href="/supplier"
            style={{
              padding: "12px 22px",
              background: `linear-gradient(135deg, ${COLORS.secondary}, #b45309)`,
              border: "none",
              borderRadius: 12,
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            + Nouvelle offre
          </a>
        </div>

        {/* Filter */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {[
            ["all", "Toutes"],
            ["pending", "En attente"],
            ["approved", "Approuvées"],
            ["rejected", "Rejetées"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: "8px 18px",
                borderRadius: 50,
                border: `1px solid ${filter === val ? COLORS.secondary : "rgba(255,255,255,0.1)"}`,
                background:
                  filter === val ? `${COLORS.secondary}15` : "transparent",
                color: filter === val ? COLORS.secondary : "#94A3B8",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Offers grid */}
        {loading ? (
          <div
            style={{ textAlign: "center", padding: 60, color: COLORS.primary }}
          >
            ⚡ Chargement...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((offer) => {
              const sc = statusConfig[offer.status] || statusConfig.pending;
              return (
                <div
                  key={offer.id}
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
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ flex: 1, marginRight: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          background: `${COLORS.blockchain}15`,
                          color: "#93C5FD",
                          padding: "3px 8px",
                          borderRadius: 5,
                          fontWeight: 600,
                        }}
                      >
                        {equipLabels[offer.equipment_type] || "📦"}
                      </span>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#F1F5F9",
                          marginTop: 8,
                        }}
                      >
                        {offer.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        background: `${sc.color}15`,
                        color: sc.color,
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  {offer.description && (
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: 13,
                        lineHeight: 1.6,
                        marginBottom: 14,
                      }}
                    >
                      {offer.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: COLORS.secondary,
                        }}
                      >
                        {Number(offer.unit_price).toLocaleString("fr-FR")} FCFA
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>
                        Prix unitaire
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#94A3B8",
                        }}
                      >
                        Min. {offer.min_quantity}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>
                        unités
                      </div>
                    </div>
                  </div>
                  {offer.valid_until && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        marginBottom: 8,
                      }}
                    >
                      🗓️ Valide jusqu'au{" "}
                      {new Date(offer.valid_until).toLocaleDateString("fr-FR")}
                    </div>
                  )}
                  {offer.cooperative_name && (
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.primary,
                        marginBottom: 8,
                      }}
                    >
                      🌿 Coop : {offer.cooperative_name}
                    </div>
                  )}
                  {offer.status === "pending" && (
                    <div
                      style={{
                        padding: "10px 14px",
                        background: `${COLORS.secondary}10`,
                        borderRadius: 10,
                        border: `1px solid ${COLORS.secondary}25`,
                      }}
                    >
                      <p style={{ color: COLORS.secondary, fontSize: 12 }}>
                        ⏳ En attente de validation par l'administrateur
                      </p>
                    </div>
                  )}
                  {offer.status === "rejected" && (
                    <div
                      style={{
                        padding: "10px 14px",
                        background: "rgba(239,68,68,0.08)",
                        borderRadius: 10,
                        border: "1px solid rgba(239,68,68,0.2)",
                      }}
                    >
                      <p style={{ color: "#FCA5A5", fontSize: 12 }}>
                        ❌ Offre rejetée — Veuillez soumettre une nouvelle offre
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p>Aucune offre dans cette catégorie</p>
          </div>
        )}
      </main>
    </div>
  );
}
