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

function PayModal({ cooperatives, user, onClose, onPaid }) {
  const [form, setForm] = useState({
    cooperative_id: "",
    amount: "",
    payment_method: "celo",
    notes: "",
  });
  const [step, setStep] = useState(1); // 1: form, 2: confirm, 3: success
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const selectedCoop = cooperatives.find(
    (c) => c.id === parseInt(form.cooperative_id),
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cotisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cooperative_id: parseInt(form.cooperative_id),
          user_id: user.id,
          amount: parseFloat(form.amount),
          payment_method: form.payment_method,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
      setStep(3);
      onPaid && onPaid(data);
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
          maxWidth: 480,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Steps indicator */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 28,
            alignItems: "center",
          }}
        >
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background:
                    step >= s
                      ? `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`
                      : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: step >= s ? "#fff" : "#475569",
                  transition: "all 0.3s",
                }}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    background:
                      step > s ? COLORS.primary : "rgba(255,255,255,0.08)",
                    transition: "all 0.3s",
                  }}
                />
              )}
            </div>
          ))}
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#64748B",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {step === 1 && (
          <>
            <h2
              style={{
                fontWeight: 800,
                color: "#F1F5F9",
                fontSize: 20,
                marginBottom: 6,
              }}
            >
              💳 Payer une cotisation
            </h2>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
              Votre paiement sera sécurisé sur la blockchain Celo
            </p>
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
                Coopérative
              </label>
              <select
                value={form.cooperative_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cooperative_id: e.target.value }))
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
                <option value="">Sélectionner une coopérative</option>
                {cooperatives.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedCoop && (
              <div
                style={{
                  padding: 12,
                  background: `${COLORS.primary}08`,
                  borderRadius: 10,
                  border: `1px solid ${COLORS.primary}20`,
                  marginBottom: 14,
                }}
              >
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  Progression actuelle
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {Number(selectedCoop.current_amount).toLocaleString(
                      "fr-FR",
                    )}{" "}
                    FCFA
                  </span>
                  <span style={{ color: "#475569", fontSize: 13 }}>
                    / {Number(selectedCoop.goal_amount).toLocaleString("fr-FR")}{" "}
                    FCFA
                  </span>
                </div>
              </div>
            )}
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
                Montant (FCFA)
              </label>
              <input
                type="number"
                placeholder="Ex: 50000"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
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
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Méthode de paiement
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { val: "celo", label: "⛓️ Celo", sub: "Wallet Celo" },
                  {
                    val: "mobile_money",
                    label: "📱 Mobile Money",
                    sub: "MTN/Orange",
                  },
                ].map((m) => (
                  <div
                    key={m.val}
                    onClick={() =>
                      setForm((f) => ({ ...f, payment_method: m.val }))
                    }
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 10,
                      border: `2px solid ${form.payment_method === m.val ? COLORS.primary : "rgba(255,255,255,0.08)"}`,
                      background:
                        form.payment_method === m.val
                          ? `${COLORS.primary}10`
                          : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color:
                          form.payment_method === m.val
                            ? COLORS.primary
                            : "#94A3B8",
                      }}
                    >
                      {m.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      {m.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              disabled={!form.cooperative_id || !form.amount}
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor:
                  !form.cooperative_id || !form.amount
                    ? "not-allowed"
                    : "pointer",
                opacity: !form.cooperative_id || !form.amount ? 0.5 : 1,
              }}
            >
              Continuer →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2
              style={{
                fontWeight: 800,
                color: "#F1F5F9",
                fontSize: 20,
                marginBottom: 6,
              }}
            >
              Confirmer le paiement
            </h2>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>
              Vérifiez les détails avant d'enregistrer sur la blockchain
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: 20,
                marginBottom: 20,
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                ["Coopérative", selectedCoop?.name || "—"],
                [
                  "Montant",
                  Number(form.amount).toLocaleString("fr-FR") + " FCFA",
                ],
                [
                  "Méthode",
                  form.payment_method === "celo"
                    ? "Wallet Celo"
                    : "Mobile Money",
                ],
                ["Réseau", "Celo Mainnet"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ color: "#64748B", fontSize: 14 }}>
                    {label}
                  </span>
                  <span
                    style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14 }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "12px 16px",
                background: `${COLORS.blockchain}12`,
                borderRadius: 10,
                border: `1px solid ${COLORS.blockchain}25`,
                marginBottom: 20,
              }}
            >
              <p style={{ color: "#93C5FD", fontSize: 12 }}>
                ⛓️ Cette transaction sera enregistrée de façon permanente sur la
                blockchain Celo et ne peut pas être annulée.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "#94A3B8",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retour
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "12px",
                  borderRadius: 12,
                  border: "none",
                  background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                  color: "#fff",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "⛓️ Enregistrement..." : "✅ Confirmer & Payer"}
              </button>
            </div>
          </>
        )}

        {step === 3 && result && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `${COLORS.primary}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                margin: "0 auto 20px",
              }}
            >
              ✅
            </div>
            <h2
              style={{
                fontWeight: 800,
                color: "#F1F5F9",
                fontSize: 22,
                marginBottom: 8,
              }}
            >
              Paiement confirmé !
            </h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>
              Votre cotisation a été enregistrée sur la blockchain Celo
            </p>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>
                Hash de transaction (Celo)
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#93C5FD",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {result.tx_hash}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
                Block #{result.block_number}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CotisationsPage() {
  const [user, setUser] = useState(null);
  const [cotisations, setCotisations] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPay, setShowPay] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const u = requireAuth();
    if (!u) return;
    setUser(u);
    Promise.all([
      fetch(`/api/cotisations?user_id=${u.id}`).then((r) => r.json()),
      fetch("/api/cooperatives").then((r) => r.json()),
    ])
      .then(([c, co]) => {
        setCotisations(c.cotisations || []);
        setCooperatives(co.cooperatives || []);
        const total = (c.cotisations || [])
          .filter((x) => x.status === "confirmed")
          .reduce((sum, x) => sum + parseFloat(x.amount || 0), 0);
        setTotalPaid(total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/cotisations" />
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {showPay && (
          <PayModal
            cooperatives={cooperatives}
            user={user}
            onClose={() => setShowPay(false)}
            onPaid={(data) => {
              setCotisations((prev) => [data.cotisation, ...prev]);
              setTotalPaid((t) => t + parseFloat(data.cotisation.amount));
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
              💳 Mes cotisations
            </h1>
            <p style={{ color: "#64748B", fontSize: 14 }}>
              Historique de vos paiements sur la blockchain Celo
            </p>
          </div>
          <button
            onClick={() => setShowPay(true)}
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
            + Payer une cotisation
          </button>
        </div>

        {/* Summary cards */}
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
              icon: "💰",
              label: "Total cotisé",
              value: totalPaid.toLocaleString("fr-FR") + " FCFA",
              color: COLORS.primary,
            },
            {
              icon: "✅",
              label: "Confirmées",
              value: cotisations.filter((c) => c.status === "confirmed").length,
              color: COLORS.primary,
            },
            {
              icon: "⏳",
              label: "En attente",
              value: cotisations.filter((c) => c.status === "pending").length,
              color: COLORS.secondary,
            },
            {
              icon: "⛓️",
              label: "Sur blockchain",
              value: cotisations.filter((c) => c.tx_hash).length,
              color: COLORS.blockchain,
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
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Transactions table */}
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
            ⛓️ Historique des transactions
          </h3>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: COLORS.primary,
              }}
            >
              ⚡ Chargement...
            </div>
          ) : cotisations.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
              <p style={{ color: "#475569" }}>
                Aucune cotisation pour le moment
              </p>
              <button
                onClick={() => setShowPay(true)}
                style={{
                  marginTop: 16,
                  padding: "10px 20px",
                  background: `${COLORS.primary}20`,
                  border: `1px solid ${COLORS.primary}40`,
                  borderRadius: 10,
                  color: COLORS.primary,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Payer ma première cotisation
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "Date",
                      "Coopérative",
                      "Montant",
                      "Méthode",
                      "Hash Tx (Celo)",
                      "Bloc",
                      "Statut",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "10px 14px",
                          color: "#475569",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cotisations.map((tx) => (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "#94A3B8",
                          fontSize: 13,
                        }}
                      >
                        {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "#E2E8F0",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {tx.cooperative_name}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: COLORS.primary,
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        {Number(tx.amount).toLocaleString("fr-FR")} FCFA
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            background:
                              tx.payment_method === "celo"
                                ? `${COLORS.blockchain}20`
                                : `${COLORS.secondary}20`,
                            color:
                              tx.payment_method === "celo"
                                ? "#93C5FD"
                                : COLORS.secondary,
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontWeight: 600,
                          }}
                        >
                          {tx.payment_method === "celo"
                            ? "⛓️ Celo"
                            : "📱 Mobile"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            color: "#64748B",
                            fontSize: 11,
                            fontFamily: "monospace",
                            background: "rgba(255,255,255,0.04)",
                            padding: "3px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {tx.tx_hash
                            ? tx.tx_hash.substring(0, 18) + "..."
                            : "—"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          color: "#475569",
                          fontSize: 12,
                        }}
                      >
                        #{tx.block_number || "—"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            background: `${COLORS.primary}15`,
                            color: COLORS.primary,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontWeight: 700,
                          }}
                        >
                          ✅ Confirmée
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
