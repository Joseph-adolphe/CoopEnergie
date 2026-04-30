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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    requireAuth(["superadmin"]);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: !currentStatus } : u,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const roleConfig = {
    superadmin: { label: "👑 Admin", color: COLORS.tertiary },
    fournisseur: { label: "🏭 Fournisseur", color: COLORS.secondary },
    user: { label: "👤 Membre", color: COLORS.primary },
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.dark,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar active="/admin/users" />
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
            👥 Gestion des utilisateurs
          </h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            {users.length} utilisateurs inscrits sur la plateforme
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              background: COLORS.darkCard,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#F1F5F9",
              fontSize: 14,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {[
              ["all", "Tous"],
              ["user", "Membres"],
              ["fournisseur", "Fournisseurs"],
              ["superadmin", "Admins"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setRoleFilter(val)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: `1px solid ${roleFilter === val ? COLORS.primary : "rgba(255,255,255,0.1)"}`,
                  background:
                    roleFilter === val ? `${COLORS.primary}15` : "transparent",
                  color: roleFilter === val ? COLORS.primary : "#94A3B8",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Users table */}
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
                    "Utilisateur",
                    "Rôle",
                    "Téléphone",
                    "Wallet Celo",
                    "Statut",
                    "Inscrit le",
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
                      colSpan={7}
                      style={{
                        padding: "40px 16px",
                        textAlign: "center",
                        color: COLORS.primary,
                      }}
                    >
                      ⚡ Chargement...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "40px 16px",
                        textAlign: "center",
                        color: "#475569",
                      }}
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const rc = roleConfig[user.role] || roleConfig.user;
                    return (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#E2E8F0",
                            }}
                          >
                            {user.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748B" }}>
                            {user.email}
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              fontSize: 12,
                              background: `${rc.color}15`,
                              color: rc.color,
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontWeight: 700,
                            }}
                          >
                            {rc.label}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            color: "#94A3B8",
                            fontSize: 13,
                          }}
                        >
                          {user.phone || "—"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              color: "#64748B",
                              fontSize: 11,
                              fontFamily: "monospace",
                              background: `${COLORS.blockchain}10`,
                              padding: "3px 7px",
                              borderRadius: 4,
                            }}
                          >
                            {user.wallet_address
                              ? user.wallet_address.substring(0, 14) + "..."
                              : "—"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              fontSize: 12,
                              background: user.is_active
                                ? `${COLORS.primary}15`
                                : "rgba(239,68,68,0.1)",
                              color: user.is_active
                                ? COLORS.primary
                                : "#FCA5A5",
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontWeight: 700,
                            }}
                          >
                            {user.is_active ? "✅ Actif" : "❌ Inactif"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            color: "#64748B",
                            fontSize: 13,
                          }}
                        >
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                "fr-FR",
                              )
                            : "—"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button
                            onClick={() =>
                              toggleUserStatus(user.id, user.is_active)
                            }
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              border: `1px solid ${user.is_active ? "rgba(239,68,68,0.3)" : `${COLORS.primary}40`}`,
                              background: user.is_active
                                ? "rgba(239,68,68,0.08)"
                                : `${COLORS.primary}10`,
                              color: user.is_active
                                ? "#FCA5A5"
                                : COLORS.primary,
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            {user.is_active ? "Désactiver" : "Activer"}
                          </button>
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
