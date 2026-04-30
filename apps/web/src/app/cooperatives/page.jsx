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

function CreateCoopModal({ onClose, onCreated, userId }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal_amount: "",
    max_members: 20,
    deadline: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const regions = [
    "Centre",
    "Littoral",
    "Ouest",
    "Nord",
    "Adamaoua",
    "Est",
    "Sud-Ouest",
    "Nord-Ouest",
    "Sud",
    "Extrême-Nord",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cooperatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, created_by: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onCreated(data.cooperative);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: COLORS.darkCard,
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 500,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 20 }}>
            🌿 Créer une coopérative
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#64748B",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#FCA5A5",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {[
            {
              key: "name",
              label: "Nom de la coopérative",
              type: "text",
              placeholder: "Ex: Coop Solaire Yaoundé Centre",
            },
            {
              key: "description",
              label: "Description",
              type: "text",
              placeholder: "Objectif de la coopérative...",
            },
            {
              key: "goal_amount",
              label: "Objectif (FCFA)",
              type: "number",
              placeholder: "2500000",
            },
            {
              key: "max_members",
              label: "Membres max",
              type: "number",
              placeholder: "20",
            },
            {
              key: "deadline",
              label: "Date limite",
              type: "date",
              placeholder: "",
            },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                required
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.key]: e.target.value }))
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
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                color: "#94A3B8",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Région
            </label>
            <select
              value={form.region}
              onChange={(e) =>
                setForm((p) => ({ ...p, region: e.target.value }))
              }
              required
              style={{
                width: "100%",
                background: COLORS.dark,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "11px 14px",
                color: "#F1F5F9",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="">Sélectionner une région</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#94A3B8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                color: "#fff",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Création..." : "🌿 Créer la coopérative"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CooperativesPage() {
  const [user, setUser] = useState(null);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const u = requireAuth();
    if (!u) return;
    setUser(u);
    fetch("/api/cooperatives")
      .then((r) => r.json())
      .then((d) => {
        setCooperatives(d.cooperatives || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = cooperatives.filter(
    (c) => filter === "all" || c.status === filter,
  );

  const joinCoop = async (id) => {
    if (!user) return;
    await fetch(`/api/cooperatives/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
    alert("Demande d'adhésion envoyée !");
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
      <Sidebar active="/cooperatives" />
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {showCreate && (
          <CreateCoopModal
            onClose={() => setShowCreate(false)}
            userId={user?.id}
            onCreated={(c) => {
              setCooperatives((prev) => [c, ...prev]);
              setShowCreate(false);
            }}
          />
        )}

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
              🌿 Coopératives solaires
            </h1>
            <p style={{ color: "#64748B", fontSize: 14 }}>
              Rejoignez ou créez une coopérative dans votre région
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "12px 22px",
              background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: `0 4px 16px rgba(46,215,50,0.35)`,
            }}
          >
            + Créer une coopérative
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            ["all", "Toutes"],
            ["active", "Actives"],
            ["completed", "Complétées"],
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

        {/* Coops grid */}
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
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((coop) => {
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
                <div
                  key={coop.id}
                  style={{
                    background: COLORS.darkCard,
                    borderRadius: 16,
                    padding: 24,
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    flexDirection: "column",
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
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#F1F5F9",
                          marginBottom: 4,
                        }}
                      >
                        {coop.name}
                      </h3>
                      <div style={{ fontSize: 12, color: "#64748B" }}>
                        📍 {coop.region} • {coop.current_members}/
                        {coop.max_members} membres
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        background: `${statusColor}20`,
                        color: statusColor,
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        marginLeft: 10,
                      }}
                    >
                      {coop.status === "active"
                        ? "✅ Active"
                        : coop.status === "completed"
                          ? "🏆 Complétée"
                          : "❌ Annulée"}
                    </span>
                  </div>
                  {coop.description && (
                    <p
                      style={{
                        color: "#64748B",
                        fontSize: 13,
                        lineHeight: 1.6,
                        marginBottom: 16,
                      }}
                    >
                      {coop.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#94A3B8" }}>
                        Progression
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: COLORS.primary,
                          fontWeight: 700,
                        }}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 50,
                        height: 10,
                      }}
                    >
                      <div
                        style={{
                          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                          height: "100%",
                          borderRadius: 50,
                          width: `${progress}%`,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: COLORS.primary,
                          fontWeight: 600,
                        }}
                      >
                        {Number(coop.current_amount).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </span>
                      <span style={{ fontSize: 12, color: "#475569" }}>
                        / {Number(coop.goal_amount).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#64748B" }}>
                      🗓️ Échéance :{" "}
                      {new Date(coop.deadline).toLocaleDateString("fr-FR")}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: `${COLORS.blockchain}`,
                        background: `${COLORS.blockchain}15`,
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      ⛓️ On-chain
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                    <a
                      href={`/cooperatives/${coop.id}`}
                      style={{
                        flex: 2,
                        padding: "10px",
                        textAlign: "center",
                        background: `${COLORS.blockchain}20`,
                        border: `1px solid ${COLORS.blockchain}30`,
                        borderRadius: 10,
                        color: "#93C5FD",
                        fontWeight: 700,
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      Voir détails
                    </a>
                    {coop.status === "active" && (
                      <button
                        onClick={() => joinCoop(coop.id)}
                        style={{
                          flex: 2,
                          padding: "10px",
                          background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                          border: "none",
                          borderRadius: 10,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Rejoindre
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
            <p style={{ fontSize: 16, marginBottom: 12 }}>
              Aucune coopérative trouvée
            </p>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                padding: "12px 24px",
                background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Créer la première coopérative
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
