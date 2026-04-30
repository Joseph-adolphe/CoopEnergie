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

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = requireAuth();
    if (!user) return;
    Promise.all([
      fetch("/api/cooperatives").then((r) => r.json()),
      fetch("/api/votes").then((r) => r.json()),
    ])
      .then(([co, vo]) => {
        setData({
          cooperatives: co.cooperatives || [],
          votes: vo.sessions || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalFunds =
    data?.cooperatives?.reduce(
      (sum, c) => sum + parseFloat(c.current_amount || 0),
      0,
    ) || 0;
  const totalGoal =
    data?.cooperatives?.reduce(
      (sum, c) => sum + parseFloat(c.goal_amount || 0),
      0,
    ) || 0;
  const avgProgress =
    totalGoal > 0 ? Math.round((totalFunds / totalGoal) * 100) : 0;

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
      <Sidebar active="/reports" />
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
            📈 Rapports & Transparence
          </h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            Vue financière globale — données blockchain Celo
          </p>
        </div>

        {/* Summary */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          {[
            {
              icon: "🌿",
              label: "Coopératives",
              value: data?.cooperatives?.length || 0,
              color: COLORS.primary,
            },
            {
              icon: "💰",
              label: "Fonds collectés (FCFA)",
              value: totalFunds.toLocaleString("fr-FR"),
              color: COLORS.secondary,
            },
            {
              icon: "🎯",
              label: "Objectif global (FCFA)",
              value: totalGoal.toLocaleString("fr-FR"),
              color: COLORS.tertiary,
            },
            {
              icon: "📊",
              label: "Progression moyenne",
              value: `${avgProgress}%`,
              color: COLORS.blockchain,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: "1 1 180px",
                background: COLORS.darkCard,
                borderRadius: 16,
                padding: 22,
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cooperatives breakdown */}
        <div
          style={{
            background: COLORS.darkCard,
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: "#F1F5F9",
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            🌿 Rapport par coopérative
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Coopérative",
                    "Région",
                    "Membres",
                    "Collecté (FCFA)",
                    "Objectif (FCFA)",
                    "Progression",
                    "Statut",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: "#475569",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.cooperatives?.map((coop) => {
                  const progress = Math.min(
                    Math.round((coop.current_amount / coop.goal_amount) * 100),
                    100,
                  );
                  const statusColor =
                    {
                      active: COLORS.primary,
                      completed: COLORS.secondary,
                      cancelled: "#EF4444",
                    }[coop.status] || COLORS.primary;
                  return (
                    <tr
                      key={coop.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#E2E8F0",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {coop.name}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#94A3B8",
                          fontSize: 13,
                        }}
                      >
                        {coop.region}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#94A3B8",
                          fontSize: 13,
                        }}
                      >
                        {coop.current_members}/{coop.max_members}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: COLORS.primary,
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {Number(coop.current_amount).toLocaleString("fr-FR")}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#64748B",
                          fontSize: 13,
                        }}
                      >
                        {Number(coop.goal_amount).toLocaleString("fr-FR")}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              borderRadius: 50,
                              height: 8,
                              flex: 1,
                              minWidth: 80,
                            }}
                          >
                            <div
                              style={{
                                background:
                                  progress >= 100
                                    ? COLORS.secondary
                                    : COLORS.primary,
                                height: "100%",
                                borderRadius: 50,
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: "#94A3B8",
                              fontSize: 12,
                              minWidth: 36,
                            }}
                          >
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            background: `${statusColor}15`,
                            color: statusColor,
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontWeight: 700,
                          }}
                        >
                          {coop.status === "active"
                            ? "✅ Active"
                            : coop.status === "completed"
                              ? "🏆 Complétée"
                              : "❌ Annulée"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Votes report */}
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
              marginBottom: 20,
            }}
          >
            🗳️ Rapport des votes Celo
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {data?.votes?.map((vote) => {
              const total = parseInt(vote.total_votes || 0);
              const pour = parseInt(vote.votes_pour || 0);
              const pct = total > 0 ? Math.round((pour / total) * 100) : 0;
              return (
                <div
                  key={vote.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 12,
                    padding: 16,
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#E2E8F0",
                      marginBottom: 8,
                    }}
                  >
                    {vote.title}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: COLORS.primary,
                        }}
                      >
                        {pour}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748B" }}>Pour</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#EF4444",
                        }}
                      >
                        {vote.votes_contre || 0}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748B" }}>
                        Contre
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#64748B",
                        }}
                      >
                        {total}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748B" }}>
                        Total
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 50,
                      height: 6,
                    }}
                  >
                    <div
                      style={{
                        background: COLORS.primary,
                        height: "100%",
                        borderRadius: 50,
                        width: `${pct}%`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color:
                          vote.status === "validated"
                            ? COLORS.primary
                            : vote.status === "rejected"
                              ? "#EF4444"
                              : "#64748B",
                      }}
                    >
                      {vote.status === "validated"
                        ? "✅ Approuvé"
                        : vote.status === "rejected"
                          ? "❌ Rejeté"
                          : vote.status === "active"
                            ? "🟢 En cours"
                            : "⚫ Clôturé"}
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.blockchain }}>
                      ⛓️ On-chain
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
