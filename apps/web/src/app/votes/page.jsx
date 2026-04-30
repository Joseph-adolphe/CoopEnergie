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

function VoteCard({ session, user, onVoted }) {
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);

  const total = parseInt(session.total_votes || 0);
  const pour = parseInt(session.votes_pour || 0);
  const contre = parseInt(session.votes_contre || 0);
  const abstention = parseInt(session.votes_abstention || 0);
  const isActive =
    session.status === "active" && new Date(session.end_date) > new Date();
  const pctPour = total > 0 ? Math.round((pour / total) * 100) : 0;
  const pctContre = total > 0 ? Math.round((contre / total) * 100) : 0;

  const statusConfig = {
    active: { label: "🟢 En cours", color: COLORS.primary },
    closed: { label: "⚫ Clôturé", color: "#64748B" },
    validated: { label: "✅ Approuvé", color: COLORS.primary },
    rejected: { label: "❌ Rejeté", color: "#EF4444" },
  };
  const sc = statusConfig[session.status] || statusConfig.active;

  const handleVote = async (vote) => {
    if (!user || voting || hasVoted) return;
    setVoting(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vote_session_id: session.id,
          cooperative_id: session.cooperative_id,
          user_id: user.id,
          vote_value: vote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setHasVoted(true);
      setSelectedVote(vote);
      onVoted && onVoted(session.id, vote, data.tx_hash);
    } catch (err) {
      alert(err.message);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div
      style={{
        background: COLORS.darkCard,
        borderRadius: 16,
        padding: 24,
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 20 }}>🗳️</span>
            <h3 style={{ fontWeight: 800, fontSize: 17, color: "#F1F5F9" }}>
              {session.title}
            </h3>
          </div>
          {session.offer_title && (
            <div style={{ fontSize: 13, color: "#64748B" }}>
              📦 Offre : {session.offer_title}
            </div>
          )}
          {session.supplier_name && (
            <div style={{ fontSize: 13, color: "#64748B" }}>
              🏭 Fournisseur : {session.supplier_name}
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 12,
            color: sc.color,
            background: `${sc.color}15`,
            padding: "5px 12px",
            borderRadius: 8,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {sc.label}
        </span>
      </div>

      {session.description && (
        <p
          style={{
            color: "#94A3B8",
            fontSize: 14,
            lineHeight: 1.7,
            marginBottom: 18,
          }}
        >
          {session.description}
        </p>
      )}

      {/* Vote results */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 18,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
            Résultats ({total} votes)
          </span>
          <span style={{ fontSize: 12, color: "#64748B" }}>
            Quorum : {session.quorum_percentage}%
          </span>
        </div>
        {[
          {
            label: "✅ Pour",
            value: pour,
            pct: pctPour,
            color: COLORS.primary,
          },
          {
            label: "❌ Contre",
            value: contre,
            pct: pctContre,
            color: "#EF4444",
          },
          {
            label: "⚪ Abstention",
            value: abstention,
            pct: total > 0 ? Math.round((abstention / total) * 100) : 0,
            color: "#64748B",
          },
        ].map((r) => (
          <div key={r.label} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 13, color: r.color, fontWeight: 600 }}>
                {r.label}
              </span>
              <span style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 700 }}>
                {r.value} ({r.pct}%)
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
                  background: r.color,
                  height: "100%",
                  borderRadius: 50,
                  width: `${r.pct}%`,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Blockchain info */}
      {session.tx_hash && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            background: `${COLORS.blockchain}10`,
            borderRadius: 10,
            border: `1px solid ${COLORS.blockchain}25`,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 14 }}>⛓️</span>
          <div>
            <div style={{ fontSize: 11, color: "#93C5FD", fontWeight: 600 }}>
              Vote enregistré sur Celo
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                fontFamily: "monospace",
              }}
            >
              {session.tx_hash.substring(0, 30)}...
            </div>
          </div>
        </div>
      )}

      {/* Vote actions */}
      {isActive && !hasVoted && (
        <div>
          <p
            style={{
              color: "#94A3B8",
              fontSize: 13,
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            Votre vote sera enregistré de façon immuable sur la blockchain Celo
            :
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => handleVote("pour")}
              disabled={voting}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "13px 20px",
                borderRadius: 12,
                border: `2px solid ${COLORS.primary}`,
                background: `${COLORS.primary}15`,
                color: COLORS.primary,
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ✅ POUR
            </button>
            <button
              onClick={() => handleVote("contre")}
              disabled={voting}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "13px 20px",
                borderRadius: 12,
                border: "2px solid #EF4444",
                background: "rgba(239,68,68,0.1)",
                color: "#FCA5A5",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ❌ CONTRE
            </button>
            <button
              onClick={() => handleVote("abstention")}
              disabled={voting}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "13px 20px",
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
                color: "#64748B",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ⚪ ABSTENTION
            </button>
          </div>
          {voting && (
            <div
              style={{
                color: COLORS.primary,
                fontSize: 13,
                textAlign: "center",
                marginTop: 10,
              }}
            >
              ⛓️ Enregistrement sur la blockchain Celo...
            </div>
          )}
        </div>
      )}

      {(hasVoted || (!isActive && session.status !== "active")) && (
        <div
          style={{
            padding: "12px 16px",
            background: hasVoted
              ? `${COLORS.primary}10`
              : "rgba(255,255,255,0.04)",
            borderRadius: 10,
            border: `1px solid ${hasVoted ? COLORS.primary : "rgba(255,255,255,0.08)"}30`,
          }}
        >
          <p
            style={{
              color: hasVoted ? COLORS.primary : "#64748B",
              fontSize: 13,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {hasVoted
              ? `✅ Vote "${selectedVote}" enregistré sur la blockchain Celo`
              : "⏱️ Session de vote terminée"}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ fontSize: 12, color: "#475569" }}>
          🗓️ Expire : {new Date(session.end_date).toLocaleString("fr-FR")}
        </div>
      </div>
    </div>
  );
}

export default function VotesPage() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    const u = requireAuth();
    if (!u) return;
    setUser(u);
    fetch("/api/votes")
      .then((r) => r.json())
      .then((d) => {
        setSessions(d.sessions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const activeVotes = sessions.filter((s) => s.status === "active");
  const closedVotes = sessions.filter((s) => s.status !== "active");
  const displayed = tab === "active" ? activeVotes : closedVotes;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/votes" />
      <main style={{ flex: 1, padding: 32, overflowY: "auto", maxWidth: 900 }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#F1F5F9",
              marginBottom: 4,
            }}
          >
            🗳️ Votes décentralisés
          </h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            Participez aux décisions de vos coopératives — chaque vote est
            enregistré sur la blockchain Celo
          </p>
        </div>

        {/* Blockchain banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 20px",
            background: `${COLORS.blockchain}12`,
            borderRadius: 12,
            border: `1px solid ${COLORS.blockchain}25`,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 28 }}>⛓️</div>
          <div>
            <div style={{ color: "#93C5FD", fontWeight: 700, fontSize: 14 }}>
              Votes sécurisés par la Blockchain Celo
            </div>
            <div style={{ color: "#475569", fontSize: 12 }}>
              Chaque vote est immuable, transparent et vérifiable par tous les
              membres
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ color: COLORS.primary, fontWeight: 800, fontSize: 18 }}
              >
                {activeVotes.length}
              </div>
              <div style={{ color: "#475569", fontSize: 11 }}>Actifs</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: COLORS.secondary,
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {closedVotes.length}
              </div>
              <div style={{ color: "#475569", fontSize: 11 }}>Clôturés</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            ["active", `🟢 Votes actifs (${activeVotes.length})`],
            ["closed", `⚫ Historique (${closedVotes.length})`],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{
                padding: "9px 20px",
                borderRadius: 50,
                border: `1px solid ${tab === val ? COLORS.primary : "rgba(255,255,255,0.1)"}`,
                background: tab === val ? `${COLORS.primary}15` : "transparent",
                color: tab === val ? COLORS.primary : "#94A3B8",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: 60, color: COLORS.primary }}
          >
            ⚡ Chargement des votes...
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗳️</div>
            <p>
              Aucun vote {tab === "active" ? "actif" : "dans l'historique"} pour
              le moment
            </p>
          </div>
        ) : (
          displayed.map((session) => (
            <VoteCard
              key={session.id}
              session={session}
              user={user}
              onVoted={(id, v, txHash) => {
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === id
                      ? {
                          ...s,
                          total_votes: parseInt(s.total_votes || 0) + 1,
                          ["votes_" + v]: parseInt(s["votes_" + v] || 0) + 1,
                          my_vote: v,
                        }
                      : s,
                  ),
                );
              }}
            />
          ))
        )}
      </main>
    </div>
  );
}
