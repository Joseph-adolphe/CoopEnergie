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

const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <div
    style={{
      background: COLORS.darkCard,
      borderRadius: 16,
      padding: 22,
      border: "1px solid rgba(255,255,255,0.07)",
      flex: "1 1 160px",
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
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          border: `1px solid ${color}30`,
        }}
      >
        {icon}
      </div>
      {trend && (
        <span
          style={{
            fontSize: 11,
            color: COLORS.primary,
            background: `${COLORS.primary}15`,
            padding: "3px 8px",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          ↑ {trend}
        </span>
      )}
    </div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color: "#F1F5F9",
        marginBottom: 4,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 12, color: "#64748B" }}>{label}</div>
    {sub && (
      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{sub}</div>
    )}
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireAuth(["superadmin"]);
    fetch("/api/dashboard/stats?role=superadmin")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatValue = (arr, role) => {
    if (!arr) return 0;
    const found = arr.find((r) => r.role === role);
    return found ? found.count : 0;
  };

  const getCoopCount = (arr, status) => {
    if (!arr) return 0;
    const found = arr.find((r) => r.status === status);
    return found ? found.count : 0;
  };

  const totalUsers =
    data?.users?.reduce((sum, r) => sum + parseInt(r.count || 0), 0) || 0;
  const totalCoops =
    data?.coops?.reduce((sum, r) => sum + parseInt(r.count || 0), 0) || 0;

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.dark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.primary,
          fontFamily: "Inter, sans-serif",
          fontSize: 18,
        }}
      >
        ⚡ Chargement...
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/admin" />
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
                👑 Tableau de bord Admin
              </h1>
              <p style={{ color: "#64748B", fontSize: 14 }}>
                Vue d'ensemble de la plateforme CoopEnergie
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="/admin/reports"
                style={{
                  padding: "10px 18px",
                  background: `${COLORS.blockchain}20`,
                  border: `1px solid ${COLORS.blockchain}40`,
                  borderRadius: 10,
                  color: "#93C5FD",
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                📈 Rapports
              </a>
              <a
                href="/admin/users"
                style={{
                  padding: "10px 18px",
                  background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                  borderRadius: 10,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                + Ajouter
              </a>
            </div>
          </div>
        </div>

        {/* Stats row 1 */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <StatCard
            icon="👥"
            label="Utilisateurs"
            value={totalUsers}
            sub={`dont ${getStatValue(data?.users, "user")} membres`}
            color={COLORS.primary}
            trend="+12 ce mois"
          />
          <StatCard
            icon="🌿"
            label="Coopératives"
            value={totalCoops}
            sub={`${getCoopCount(data?.coops, "active")} actives`}
            color={COLORS.secondary}
            trend="+3 ce mois"
          />
          <StatCard
            icon="🏭"
            label="Fournisseurs vérifiés"
            value={data?.suppliers?.[0]?.count || 0}
            sub="certifiés Celo"
            color={COLORS.tertiary}
          />
          <StatCard
            icon="💰"
            label="Total collecté (FCFA)"
            value={Number(data?.transactions?.[0]?.total || 0).toLocaleString(
              "fr-FR",
            )}
            sub="sur blockchain"
            color={COLORS.blockchain}
          />
          <StatCard
            icon="📦"
            label="Offres en attente"
            value={
              data?.offers?.find((o) => o.status === "pending")?.count || 0
            }
            sub="à valider"
            color={COLORS.tertiary}
            trend="!"
          />
          <StatCard
            icon="🗳️"
            label="Votes actifs"
            value={data?.votes?.[0]?.count || 0}
            sub="sessions ouvertes"
            color={COLORS.primary}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* User breakdown */}
          <div
            style={{
              background: COLORS.darkCard,
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                color: "#F1F5F9",
                fontSize: 16,
                marginBottom: 18,
              }}
            >
              👥 Répartition des utilisateurs
            </h3>
            {[
              {
                role: "user",
                label: "Membres",
                color: COLORS.primary,
                icon: "👤",
              },
              {
                role: "fournisseur",
                label: "Fournisseurs",
                color: COLORS.secondary,
                icon: "🏭",
              },
              {
                role: "superadmin",
                label: "Admins",
                color: COLORS.tertiary,
                icon: "👑",
              },
            ].map((r) => {
              const count = getStatValue(data?.users, r.role);
              const pct =
                totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              return (
                <div key={r.role} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: "#94A3B8", fontSize: 13 }}>
                      {r.icon} {r.label}
                    </span>
                    <span
                      style={{
                        color: "#F1F5F9",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 50,
                      height: 8,
                    }}
                  >
                    <div
                      style={{
                        background: `linear-gradient(90deg, ${r.color}, ${r.color}99)`,
                        height: "100%",
                        borderRadius: 50,
                        width: `${pct}%`,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coops status */}
          <div
            style={{
              background: COLORS.darkCard,
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                color: "#F1F5F9",
                fontSize: 16,
                marginBottom: 18,
              }}
            >
              🌿 État des coopératives
            </h3>
            {[
              {
                status: "active",
                label: "Actives",
                color: COLORS.primary,
                icon: "✅",
              },
              {
                status: "completed",
                label: "Complétées",
                color: COLORS.secondary,
                icon: "🏆",
              },
              {
                status: "cancelled",
                label: "Annulées",
                color: "#EF4444",
                icon: "❌",
              },
            ].map((s) => {
              const count = getCoopCount(data?.coops, s.status);
              const pct =
                totalCoops > 0 ? Math.round((count / totalCoops) * 100) : 0;
              return (
                <div key={s.status} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: "#94A3B8", fontSize: 13 }}>
                      {s.icon} {s.label}
                    </span>
                    <span
                      style={{
                        color: "#F1F5F9",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 50,
                      height: 8,
                    }}
                  >
                    <div
                      style={{
                        background: s.color,
                        height: "100%",
                        borderRadius: 50,
                        width: `${pct}%`,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offers to validate */}
        <div
          style={{
            background: COLORS.darkCard,
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h3 style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 16 }}>
              📦 Offres à valider
            </h3>
            <a
              href="/admin/offers"
              style={{
                color: COLORS.primary,
                fontSize: 13,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Voir tout →
            </a>
          </div>
          <OffersToValidate />
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            {
              label: "👥 Gérer les utilisateurs",
              href: "/admin/users",
              color: COLORS.primary,
            },
            {
              label: "🌿 Gérer les coopératives",
              href: "/admin/cooperatives",
              color: COLORS.secondary,
            },
            {
              label: "🏭 Gérer les fournisseurs",
              href: "/admin/suppliers",
              color: COLORS.tertiary,
            },
            {
              label: "📈 Voir les rapports",
              href: "/admin/reports",
              color: COLORS.blockchain,
            },
          ].map((a) => (
            <a
              key={a.href}
              href={a.href}
              style={{
                padding: "12px 20px",
                background: `${a.color}15`,
                border: `1px solid ${a.color}30`,
                borderRadius: 10,
                color: a.color,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              {a.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

function OffersToValidate() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers?status=pending")
      .then((r) => r.json())
      .then((d) => {
        setOffers(d.offers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleValidate = async (id, status) => {
    await fetch("/api/offers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  if (loading)
    return <div style={{ color: "#64748B", fontSize: 14 }}>Chargement...</div>;
  if (offers.length === 0)
    return (
      <div style={{ color: "#475569", textAlign: "center", padding: 20 }}>
        ✅ Aucune offre en attente de validation
      </div>
    );

  return (
    <div>
      {offers.map((offer) => (
        <div
          key={offer.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: "#E2E8F0", fontSize: 14 }}>
              {offer.title}
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>
              {offer.company_name} —{" "}
              {Number(offer.unit_price).toLocaleString("fr-FR")} FCFA
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleValidate(offer.id, "approved")}
              style={{
                padding: "7px 14px",
                background: `${COLORS.primary}20`,
                border: `1px solid ${COLORS.primary}40`,
                borderRadius: 8,
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ✅ Approuver
            </button>
            <button
              onClick={() => handleValidate(offer.id, "rejected")}
              style={{
                padding: "7px 14px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                color: "#FCA5A5",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ❌ Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
