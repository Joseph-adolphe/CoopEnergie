"use client";
import { useState, useEffect } from "react";
import { getUser, logout } from "@/utils/auth";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

const menusByRole = {
  superadmin: [
    { icon: "📊", label: "Tableau de bord", href: "/admin" },
    { icon: "👥", label: "Utilisateurs", href: "/admin/users" },
    { icon: "🌿", label: "Coopératives", href: "/admin/cooperatives" },
    { icon: "🏭", label: "Fournisseurs", href: "/admin/suppliers" },
    { icon: "📦", label: "Offres & Commandes", href: "/admin/offers" },
    { icon: "📈", label: "Rapports", href: "/admin/reports" },
    { icon: "⚙️", label: "Configuration", href: "/admin/settings" },
  ],
  fournisseur: [
    { icon: "📊", label: "Tableau de bord", href: "/supplier" },
    { icon: "📦", label: "Mes offres", href: "/supplier/offers" },
    { icon: "🛒", label: "Commandes", href: "/supplier/orders" },
    { icon: "💰", label: "Paiements", href: "/supplier/payments" },
    { icon: "👤", label: "Mon profil", href: "/supplier/profile" },
  ],
  user: [
    { icon: "📊", label: "Tableau de bord", href: "/dashboard" },
    { icon: "🌿", label: "Mes coopératives", href: "/cooperatives" },
    { icon: "💳", label: "Mes cotisations", href: "/cotisations" },
    { icon: "🗳️", label: "Votes", href: "/votes" },
    { icon: "📋", label: "Rapports", href: "/reports" },
    { icon: "👤", label: "Mon profil", href: "/profile" },
  ],
};

export default function Sidebar({ active }) {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  if (!user) return null;

  const menus = menusByRole[user.role] || menusByRole.user;
  const roleLabel = {
    superadmin: "Super Admin",
    fournisseur: "Fournisseur",
    user: "Membre",
  }[user.role];
  const roleColor = {
    superadmin: COLORS.tertiary,
    fournisseur: COLORS.secondary,
    user: COLORS.primary,
  }[user.role];

  return (
    <div
      style={{
        width: collapsed ? 70 : 240,
        minHeight: "100vh",
        background: COLORS.darkCard,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "20px 12px" : "20px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.blockchain})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ⚡
        </div>
        {!collapsed && (
          <span
            style={{
              fontWeight: 800,
              fontSize: 17,
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CoopEnergie
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#64748B",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
          }}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${roleColor}44, ${roleColor}22)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                border: `2px solid ${roleColor}50`,
              }}
            >
              {user.role === "superadmin"
                ? "👑"
                : user.role === "fournisseur"
                  ? "🏭"
                  : "👤"}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#F1F5F9",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 140,
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: roleColor, fontWeight: 600 }}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? "10px 6px" : "10px 10px",
          overflowY: "auto",
        }}
      >
        {menus.map((item) => {
          const isActive =
            active === item.href ||
            (typeof window !== "undefined" &&
              window.location.pathname === item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "11px" : "11px 12px",
                borderRadius: 10,
                marginBottom: 2,
                textDecoration: "none",
                background: isActive ? `${COLORS.primary}18` : "transparent",
                border: isActive
                  ? `1px solid ${COLORS.primary}30`
                  : "1px solid transparent",
                color: isActive ? COLORS.primary : "#94A3B8",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#F1F5F9";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94A3B8";
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Blockchain badge */}
      {!collapsed && (
        <div
          style={{
            margin: "0 10px 12px",
            padding: "10px 12px",
            background: `${COLORS.blockchain}15`,
            borderRadius: 10,
            border: `1px solid ${COLORS.blockchain}30`,
          }}
        >
          <div style={{ fontSize: 11, color: "#93C5FD", fontWeight: 600 }}>
            ⛓️ Blockchain Celo
          </div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
            Réseau: Mainnet
          </div>
        </div>
      )}

      {/* Logout */}
      <div
        style={{
          padding: collapsed ? "12px 6px" : "12px 10px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: collapsed ? "10px" : "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.07)",
            color: "#FCA5A5",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <span>🚪</span>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
