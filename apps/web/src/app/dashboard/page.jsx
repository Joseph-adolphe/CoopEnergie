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
  card: "#243B53",
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <div
    style={{
      background: COLORS.darkCard,
      borderRadius: 16,
      padding: 24,
      border: "1px solid rgba(255,255,255,0.07)",
      flex: "1 1 180px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          border: `1px solid ${color}30`,
        }}
      >
        {icon}
      </div>
      <span style={{ color: "#64748B", fontSize: 13 }}>{label}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: color || "#F1F5F9" }}>
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{sub}</div>
    )}
  </div>
);

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const u = requireAuth(["user"]);
    if (!u) return;
    setUser(u);
    fetch(`/api/dashboard/stats?role=user&user_id=${u.id}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur chargement");
        setLoading(false);
      });
  }, []);

  const formatFCFA = (n) => Number(n || 0).toLocaleString("fr-FR") + " FCFA";

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
      <Sidebar active="/dashboard" />
      <main style={{ flex: 1, padding: "32px 32px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${COLORS.primary}33, ${COLORS.blockchain}33)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              👋
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9" }}>
                Bonjour, {user?.name?.split(" ")[0]} !
              </h1>
              <p style={{ color: "#64748B", fontSize: 14 }}>
                Voici l'état de votre espace CoopEnergie
              </p>
            </div>
          </div>
          {user?.wallet_address && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `${COLORS.blockchain}15`,
                border: `1px solid ${COLORS.blockchain}30`,
                borderRadius: 8,
                padding: "6px 12px",
                marginTop: 10,
              }}
            >
              <span style={{ fontSize: 13 }}>⛓️</span>
              <span
                style={{
                  color: "#93C5FD",
                  fontSize: 12,
                  fontFamily: "monospace",
                }}
              >
                {user.wallet_address.substring(0, 20)}...
              </span>
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#FCA5A5",
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <StatCard
            icon="🌿"
            label="Mes coopératives"
            value={data?.myCoops?.length || 0}
            sub="coopératives actives"
            color={COLORS.primary}
          />
          <StatCard
            icon="💰"
            label="Total cotisé"
            value={formatFCFA(data?.totalContrib?.total)}
            sub="transactions confirmées"
            color={COLORS.secondary}
          />
          <StatCard
            icon="🗳️"
            label="Votes en attente"
            value={
              data?.myVotes?.filter(
                (v) => !v.vote_value && v.status === "active",
              ).length || 0
            }
            sub="votes à effectuer"
            color={COLORS.tertiary}
          />
          <StatCard
            icon="📦"
            label="Livraisons"
            value="2"
            sub="en cours"
            color={COLORS.blockchain}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* My cooperatives */}
          <div
            style={{
              background: COLORS.darkCard,
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.07)",
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
                🌿 Mes coopératives
              </h3>
              <a
                href="/cooperatives"
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
            {data?.myCoops?.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: 24, color: "#475569" }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
                <p style={{ fontSize: 14 }}>Aucune coopérative rejointe</p>
                <a
                  href="/cooperatives"
                  style={{
                    color: COLORS.primary,
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  Rejoindre une coopérative →
                </a>
              </div>
            ) : (
              data?.myCoops?.map((coop) => {
                const progress = Math.round(
                  (coop.current_amount / coop.goal_amount) * 100,
                );
                return (
                  <div
                    key={coop.id}
                    style={{
                      marginBottom: 16,
                      padding: 14,
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#E2E8F0",
                          }}
                        >
                          {coop.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>
                          Ma contribution :{" "}
                          {Number(coop.total_contributed || 0).toLocaleString(
                            "fr-FR",
                          )}{" "}
                          FCFA
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          background: `${COLORS.primary}20`,
                          color: COLORS.primary,
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        {progress}%
                      </span>
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
                          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                          height: "100%",
                          borderRadius: 50,
                          width: `${Math.min(progress, 100)}%`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent votes */}
          <div
            style={{
              background: COLORS.darkCard,
              borderRadius: 16,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.07)",
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
                🗳️ Votes récents
              </h3>
              <a
                href="/votes"
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
            {!data?.myVotes || data.myVotes.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: 24, color: "#475569" }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>🗳️</div>
                <p style={{ fontSize: 14 }}>Aucun vote disponible</p>
              </div>
            ) : (
              data?.myVotes?.map((vote) => (
                <div
                  key={vote.id}
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#E2E8F0",
                        marginBottom: 2,
                      }}
                    >
                      {vote.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>
                      Expire :{" "}
                      {vote.end_date
                        ? new Date(vote.end_date).toLocaleDateString("fr-FR")
                        : "N/A"}
                    </div>
                  </div>
                  {vote.vote_value ? (
                    <span
                      style={{
                        fontSize: 11,
                        background:
                          vote.vote_value === "pour"
                            ? `${COLORS.primary}20`
                            : "rgba(239,68,68,0.1)",
                        color:
                          vote.vote_value === "pour"
                            ? COLORS.primary
                            : "#FCA5A5",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontWeight: 700,
                      }}
                    >
                      {vote.vote_value === "pour"
                        ? "✅ Pour"
                        : vote.vote_value === "contre"
                          ? "❌ Contre"
                          : "⚪ Abstention"}
                    </span>
                  ) : vote.status === "active" ? (
                    <a
                      href="/votes"
                      style={{
                        fontSize: 11,
                        background: `${COLORS.tertiary}20`,
                        color: COLORS.tertiary,
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Voter
                    </a>
                  ) : (
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      Clôturé
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div
          style={{
            background: COLORS.darkCard,
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.07)",
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
              ⛓️ Transactions récentes (Celo)
            </h3>
            <a
              href="/cotisations"
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
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "Coopérative", "Montant", "Hash Tx", "Statut"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          color: "#475569",
                          fontSize: 12,
                          fontWeight: 600,
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {!data?.recentTx || data.recentTx.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "20px 12px",
                        textAlign: "center",
                        color: "#475569",
                      }}
                    >
                      Aucune transaction
                    </td>
                  </tr>
                ) : (
                  data?.recentTx?.map((tx) => (
                    <tr key={tx.id}>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#94A3B8",
                          fontSize: 13,
                        }}
                      >
                        {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#E2E8F0",
                          fontSize: 13,
                        }}
                      >
                        {tx.cooperative_name}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: COLORS.primary,
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {Number(tx.amount).toLocaleString("fr-FR")} FCFA
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            color: "#64748B",
                            fontSize: 11,
                            fontFamily: "monospace",
                            background: "rgba(255,255,255,0.05)",
                            padding: "3px 7px",
                            borderRadius: 4,
                          }}
                        >
                          {tx.tx_hash
                            ? tx.tx_hash.substring(0, 16) + "..."
                            : "—"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            background: `${COLORS.primary}20`,
                            color: COLORS.primary,
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontWeight: 600,
                          }}
                        >
                          ✓ Confirmée
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div
          style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <a
            href="/cotisations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            💳 Payer une cotisation
          </a>
          <a
            href="/cooperatives"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: `linear-gradient(135deg, ${COLORS.blockchain}, #1d4ed8)`,
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            🌿 Rejoindre une coop
          </a>
          <a
            href="/votes"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: `linear-gradient(135deg, ${COLORS.tertiary}, #ea580c)`,
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            🗳️ Voter maintenant
          </a>
        </div>
      </main>
    </div>
  );
}
