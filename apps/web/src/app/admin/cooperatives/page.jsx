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

export default function AdminCooperativesPage() {
  const [coops, setCoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    requireAuth(["superadmin"]);
    fetch("/api/cooperatives")
      .then((r) => r.json())
      .then((d) => {
        setCoops(d.cooperatives || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/cooperatives/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCoops((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const filtered =
    filter === "all" ? coops : coops.filter((c) => c.status === filter);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/admin/cooperatives" />
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
            🌿 Gestion des coopératives
          </h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            {coops.length} coopératives sur la plateforme
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            ["all", "Toutes"],
            ["active", "Actives"],
            ["completed", "Complétées"],
            ["cancelled", "Annulées"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: "8px 18px",
                borderRadius: 50,
                border: `1px solid ${filter === val ? COLORS.primary : "rgba(255,255,255,0.1)"}`,
                background:
                  filter === val ? `${COLORS.primary}15` : "transparent",
                color: filter === val ? COLORS.primary : "#94A3B8",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          style={{
            background: COLORS.darkCard,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[
                    "Coopérative",
                    "Région",
                    "Créateur",
                    "Membres",
                    "Collecté",
                    "Objectif",
                    "%",
                    "Statut",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        color: "#475569",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: "40px 16px",
                        textAlign: "center",
                        color: COLORS.primary,
                      }}
                    >
                      ⚡ Chargement...
                    </td>
                  </tr>
                ) : (
                  filtered.map((coop) => {
                    const progress = Math.min(
                      Math.round(
                        (coop.current_amount / coop.goal_amount) * 100,
                      ),
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
                        <td style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#E2E8F0",
                            }}
                          >
                            {coop.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#475569" }}>
                            ⛓️ {coop.contract_address?.substring(0, 14)}...
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#94A3B8",
                            fontSize: 13,
                          }}
                        >
                          {coop.region}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#94A3B8",
                            fontSize: 13,
                          }}
                        >
                          {coop.creator_name}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#94A3B8",
                            fontSize: 13,
                          }}
                        >
                          {coop.current_members}/{coop.max_members}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: COLORS.primary,
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {Number(coop.current_amount).toLocaleString("fr-FR")}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#64748B",
                            fontSize: 13,
                          }}
                        >
                          {Number(coop.goal_amount).toLocaleString("fr-FR")}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                borderRadius: 50,
                                height: 6,
                                width: 60,
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
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>
                              {progress}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
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
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {coop.status === "active" && (
                              <button
                                onClick={() =>
                                  updateStatus(coop.id, "completed")
                                }
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: 6,
                                  border: `1px solid ${COLORS.secondary}40`,
                                  background: `${COLORS.secondary}10`,
                                  color: COLORS.secondary,
                                  fontSize: 11,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                Compléter
                              </button>
                            )}
                            {coop.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  updateStatus(coop.id, "cancelled")
                                }
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: 6,
                                  border: "1px solid rgba(239,68,68,0.3)",
                                  background: "rgba(239,68,68,0.08)",
                                  color: "#FCA5A5",
                                  fontSize: 11,
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                Annuler
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
