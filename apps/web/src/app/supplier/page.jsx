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

function AddOfferModal({ supplierId, cooperatives, onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    equipment_type: "kit_complet",
    unit_price: "",
    min_quantity: 1,
    total_quantity: "",
    valid_until: "",
    cooperative_id: "",
  });
  const [loading, setLoading] = useState(false);

  const equipTypes = [
    { val: "kit_complet", label: "🌞 Kit Solaire Complet" },
    { val: "panneau_solaire", label: "☀️ Panneau Solaire" },
    { val: "batterie", label: "🔋 Batterie" },
    { val: "onduleur", label: "⚡ Onduleur" },
    { val: "autre", label: "📦 Autre" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, supplier_id: supplierId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onAdded(data.offer);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
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
          maxWidth: 520,
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
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
            📦 Nouvelle offre
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
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                color: "#94A3B8",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Type d'équipement
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {equipTypes.map((t) => (
                <div
                  key={t.val}
                  onClick={() =>
                    setForm((f) => ({ ...f, equipment_type: t.val }))
                  }
                  style={{
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: `1px solid ${form.equipment_type === t.val ? COLORS.secondary : "rgba(255,255,255,0.08)"}`,
                    background:
                      form.equipment_type === t.val
                        ? `${COLORS.secondary}15`
                        : "transparent",
                    color:
                      form.equipment_type === t.val
                        ? COLORS.secondary
                        : "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>
          {[
            {
              key: "title",
              label: "Titre de l'offre",
              type: "text",
              placeholder: "Ex: Kit Solaire 300W Complet",
            },
            {
              key: "description",
              label: "Description",
              type: "text",
              placeholder: "Détails de l'équipement...",
            },
            {
              key: "unit_price",
              label: "Prix unitaire (FCFA)",
              type: "number",
              placeholder: "185000",
            },
            {
              key: "min_quantity",
              label: "Quantité minimale",
              type: "number",
              placeholder: "10",
            },
            {
              key: "total_quantity",
              label: "Quantité totale disponible",
              type: "number",
              placeholder: "50",
            },
            {
              key: "valid_until",
              label: "Valide jusqu'au",
              type: "date",
              placeholder: "",
            },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 5,
                }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                required={f.key !== "total_quantity" && f.key !== "valid_until"}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.key]: e.target.value }))
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "10px 14px",
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
                marginBottom: 5,
              }}
            >
              Coopérative cible (optionnel)
            </label>
            <select
              value={form.cooperative_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, cooperative_id: e.target.value }))
              }
              style={{
                width: "100%",
                background: COLORS.dark,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#F1F5F9",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="">Toutes les coopératives</option>
              {cooperatives.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              padding: 12,
              background: `${COLORS.secondary}10`,
              borderRadius: 10,
              border: `1px solid ${COLORS.secondary}25`,
              marginBottom: 20,
            }}
          >
            <p style={{ color: COLORS.secondary, fontSize: 12 }}>
              ⚠️ Votre offre sera soumise à validation par l'administrateur avant
              d'être publiée.
            </p>
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
                background: `linear-gradient(135deg, ${COLORS.secondary}, #b45309)`,
                color: "#000",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Envoi..." : "📦 Soumettre l'offre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SupplierDashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOffer, setShowAddOffer] = useState(false);

  useEffect(() => {
    const u = requireAuth(["fournisseur"]);
    if (!u) return;
    setUser(u);
    Promise.all([
      fetch(`/api/dashboard/stats?role=fournisseur&user_id=${u.id}`).then((r) =>
        r.json(),
      ),
      fetch("/api/cooperatives").then((r) => r.json()),
    ])
      .then(([d, co]) => {
        setData(d);
        setOffers(d.recentOffers || []);
        setCooperatives(co.cooperatives || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const supplierId = data?.recentOffers?.[0]?.supplier_id;

  const statusConfig = {
    pending: { label: "⏳ En attente", color: COLORS.secondary },
    approved: { label: "✅ Approuvée", color: COLORS.primary },
    rejected: { label: "❌ Rejetée", color: "#EF4444" },
    active: { label: "🟢 Active", color: COLORS.primary },
    expired: { label: "⚫ Expirée", color: "#64748B" },
  };

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
      <Sidebar active="/supplier" />
      {showAddOffer && (
        <AddOfferModal
          supplierId={supplierId || 1}
          cooperatives={cooperatives}
          onClose={() => setShowAddOffer(false)}
          onAdded={(o) => {
            setOffers((prev) => [o, ...prev]);
            setShowAddOffer(false);
          }}
        />
      )}
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
              🏭 Espace Fournisseur
            </h1>
            <p style={{ color: "#64748B", fontSize: 14 }}>
              Gérez vos offres et suivez vos commandes
            </p>
          </div>
          <button
            onClick={() => setShowAddOffer(true)}
            style={{
              padding: "12px 22px",
              background: `linear-gradient(135deg, ${COLORS.secondary}, #b45309)`,
              border: "none",
              borderRadius: 12,
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            + Nouvelle offre
          </button>
        </div>

        {/* Stats */}
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
              icon: "📦",
              label: "Total offres",
              value: data?.myOffers?.count || 0,
              color: COLORS.secondary,
            },
            {
              icon: "⏳",
              label: "En attente",
              value: data?.pendingOffers?.count || 0,
              color: COLORS.tertiary,
            },
            {
              icon: "✅",
              label: "Approuvées",
              value: data?.approvedOffers?.count || 0,
              color: COLORS.primary,
            },
            {
              icon: "💰",
              label: "Revenus (FCFA)",
              value: Number(data?.revenue?.total || 0).toLocaleString("fr-FR"),
              color: COLORS.primary,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: "1 1 160px",
                background: COLORS.darkCard,
                borderRadius: 14,
                padding: 20,
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* My offers */}
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
            📦 Mes offres récentes
          </h3>
          {offers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p style={{ color: "#475569", marginBottom: 16 }}>
                Aucune offre soumise
              </p>
              <button
                onClick={() => setShowAddOffer(true)}
                style={{
                  padding: "10px 24px",
                  background: `${COLORS.secondary}20`,
                  border: `1px solid ${COLORS.secondary}40`,
                  borderRadius: 10,
                  color: COLORS.secondary,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Créer ma première offre
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {offers.map((offer) => {
                const sc = statusConfig[offer.status] || statusConfig.pending;
                return (
                  <div
                    key={offer.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 12,
                      padding: 18,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 10,
                      }}
                    >
                      <h4
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#E2E8F0",
                          flex: 1,
                          marginRight: 10,
                        }}
                      >
                        {offer.title}
                      </h4>
                      <span
                        style={{
                          fontSize: 11,
                          background: `${sc.color}15`,
                          color: sc.color,
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: COLORS.secondary,
                        marginBottom: 6,
                      }}
                    >
                      {Number(offer.unit_price).toLocaleString("fr-FR")} FCFA
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        marginBottom: 4,
                      }}
                    >
                      Min. {offer.min_quantity} unités
                    </div>
                    {offer.cooperative_name && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          marginBottom: 4,
                        }}
                      >
                        🌿 {offer.cooperative_name}
                      </div>
                    )}
                    {offer.valid_until && (
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        Valide jusqu'au{" "}
                        {new Date(offer.valid_until).toLocaleDateString(
                          "fr-FR",
                        )}
                      </div>
                    )}
                    {offer.status === "pending" && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 12px",
                          background: `${COLORS.secondary}10`,
                          borderRadius: 8,
                          fontSize: 11,
                          color: COLORS.secondary,
                        }}
                      >
                        ⏳ En attente de validation admin
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
