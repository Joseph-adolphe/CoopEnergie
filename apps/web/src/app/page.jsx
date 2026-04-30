"use client";
import { useState, useEffect } from "react";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

const stats = [
  { label: "Coopératives actives", value: "127", icon: "🌿" },
  { label: "Membres inscrits", value: "3 420", icon: "👥" },
  { label: "Fonds collectés (FCFA)", value: "485M", icon: "💰" },
  { label: "Transactions Celo", value: "8 900+", icon: "⛓️" },
];

const features = [
  {
    icon: "🌞",
    title: "Achat Groupé Solaire",
    desc: "Rejoignez une coopérative et achetez ensemble des équipements solaires à prix réduit grâce à la force du groupe.",
    color: COLORS.primary,
  },
  {
    icon: "⛓️",
    title: "Blockchain Celo",
    desc: "Toutes vos transactions et votes sont enregistrés de façon immuable sur la blockchain Celo pour une transparence totale.",
    color: COLORS.blockchain,
  },
  {
    icon: "🗳️",
    title: "Vote Décentralisé",
    desc: "Participez aux décisions d'achat collectif grâce à un système de vote sécurisé et transparent sur blockchain.",
    color: COLORS.tertiary,
  },
  {
    icon: "📊",
    title: "Suivi en Temps Réel",
    desc: "Suivez vos cotisations, la progression de votre coopérative et les livraisons d'équipements en temps réel.",
    color: COLORS.secondary,
  },
  {
    icon: "🔒",
    title: "Sécurité Maximale",
    desc: "Wallet Celo intégré, authentification forte, et protection avancée de vos données personnelles.",
    color: COLORS.primary,
  },
  {
    icon: "🤝",
    title: "Fournisseurs Vérifiés",
    desc: "Accédez à des offres groupées de fournisseurs certifiés, validées par la communauté et l'administration.",
    color: COLORS.tertiary,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Créez un compte",
    desc: "Inscrivez-vous et obtenez votre wallet Celo automatiquement.",
    icon: "👤",
  },
  {
    step: "02",
    title: "Rejoignez une coop",
    desc: "Créez ou rejoignez une coopérative dans votre région.",
    icon: "🤝",
  },
  {
    step: "03",
    title: "Cotisez",
    desc: "Effectuez vos cotisations sécurisées via Celo ou Mobile Money.",
    icon: "💳",
  },
  {
    step: "04",
    title: "Votez",
    desc: "Participez aux votes pour choisir les équipements et fournisseurs.",
    icon: "🗳️",
  },
  {
    step: "05",
    title: "Recevez",
    desc: "Votre équipement solaire est livré après validation collective.",
    icon: "📦",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: COLORS.dark,
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(46,215,50,0.4); } 50% { box-shadow: 0 0 0 16px rgba(46,215,50,0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .hero-badge { animation: pulse-glow 2.5s infinite; }
        .hero-float { animation: float 4s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.8s ease both; }
        .feature-card:hover { transform: translateY(-6px) scale(1.02); transition: all 0.3s ease; }
        .cta-btn:hover { transform: scale(1.05); transition: all 0.2s ease; }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(15,23,42,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(46,215,50,0.15)" : "none",
          transition: "all 0.3s ease",
          padding: "0 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.blockchain})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 22,
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CoopEnergie
          </span>
        </div>
        <div className="hidden md:flex" style={{ gap: 32, display: "flex" }}>
          {[
            "Accueil",
            "Fonctionnalités",
            "Comment ça marche",
            "Fournisseurs",
          ].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: "#CBD5E1",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.target.style.color = "#CBD5E1")}
            >
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href="/auth/login"
            style={{
              color: COLORS.primary,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              padding: "8px 16px",
              border: `1px solid ${COLORS.primary}`,
              borderRadius: 8,
            }}
          >
            Connexion
          </a>
          <a
            href="/auth/register"
            className="cta-btn"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              padding: "9px 20px",
              borderRadius: 8,
            }}
          >
            S'inscrire
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 5% 60px",
          background: `radial-gradient(ellipse at 50% 0%, rgba(46,215,50,0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(30,64,175,0.12) 0%, transparent 60%), ${COLORS.dark}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(46,215,50,0.05)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(30,64,175,0.08)",
            filter: "blur(60px)",
          }}
        />

        <div
          className="fade-in-up hero-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(46,215,50,0.1)",
            border: `1px solid rgba(46,215,50,0.3)`,
            borderRadius: 50,
            padding: "8px 20px",
            marginBottom: 28,
            fontSize: 13,
            color: COLORS.primary,
            fontWeight: 600,
          }}
        >
          <span>⛓️</span> Propulsé par la Blockchain Celo
        </div>

        <h1
          className="fade-in-up"
          style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 800,
          }}
        >
          L'Énergie Solaire <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pour Tous,
          </span>{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.tertiary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ensemble
          </span>
        </h1>

        <p
          className="fade-in-up"
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#94A3B8",
            maxWidth: 600,
            marginBottom: 40,
            lineHeight: 1.7,
          }}
        >
          Rejoignez des coopératives d'achat groupé d'équipements solaires au
          Cameroun, sécurisées et transparentes grâce à la blockchain Celo.
        </p>

        <div
          className="fade-in-up"
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="/auth/register"
            className="cta-btn"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: 12,
              boxShadow: `0 4px 24px rgba(46,215,50,0.35)`,
            }}
          >
            🚀 Rejoindre une coopérative
          </a>
          <a
            href="/auth/login"
            className="cta-btn"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            📊 Voir le tableau de bord
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 64,
            maxWidth: 800,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                padding: "16px 24px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: COLORS.primary,
                  marginTop: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 5%", background: COLORS.darkCard }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              color: COLORS.primary,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Pourquoi CoopEnergie ?
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Une plateforme complète pour vos coopératives
          </h2>
          <p style={{ color: "#64748B", maxWidth: 500, margin: "0 auto" }}>
            Tout ce dont vous avez besoin pour créer, gérer et prospérer dans
            votre coopérative solaire.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="feature-card"
              style={{
                background: COLORS.dark,
                borderRadius: 16,
                padding: 28,
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `${f.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  marginBottom: 18,
                  border: `1px solid ${f.color}30`,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 10,
                  color: "#F1F5F9",
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: 14 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 5%", background: COLORS.dark }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              color: COLORS.secondary,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Simple & Transparent
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800 }}>
            Comment ça marche ?
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {howItWorks.map((step, i) => (
            <div
              key={step.step}
              style={{ flex: "1 1 180px", maxWidth: 200, textAlign: "center" }}
            >
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.blockchain}22)`,
                    border: `2px solid ${COLORS.primary}50`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    margin: "0 auto",
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: "30%",
                    background: COLORS.primary,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    borderRadius: 6,
                    padding: "2px 6px",
                  }}
                >
                  {step.step}
                </div>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                {step.title}
              </h4>
              <p style={{ color: "#64748B", fontSize: 13 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blockchain section */}
      <section
        style={{
          padding: "80px 5%",
          background: `linear-gradient(135deg, ${COLORS.blockchain}15, ${COLORS.dark} 60%)`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⛓️</div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Sécurisé par la{" "}
            <span style={{ color: COLORS.blockchain }}>Blockchain Celo</span>
          </h2>
          <p
            style={{
              color: "#94A3B8",
              fontSize: 17,
              lineHeight: 1.8,
              marginBottom: 32,
            }}
          >
            Chaque cotisation, vote et transaction est enregistré de manière
            immuable sur la blockchain Celo. Accédez à un historique complet,
            transparent et infalsifiable de toutes les opérations de votre
            coopérative.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              "Transactions immuables",
              "Smart Contracts",
              "Votes on-chain",
              "Wallet intégré",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  background: `${COLORS.blockchain}22`,
                  border: `1px solid ${COLORS.blockchain}50`,
                  borderRadius: 50,
                  padding: "8px 18px",
                  fontSize: 13,
                  color: "#93C5FD",
                  fontWeight: 600,
                }}
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 5%",
          background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.darkCard})`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          Prêt à rejoindre la révolution solaire ?
        </h2>
        <p style={{ color: "#94A3B8", fontSize: 18, marginBottom: 40 }}>
          Rejoignez des milliers de Camerounais qui s'équipent en énergie
          solaire grâce à l'union.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/auth/register"
            className="cta-btn"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, #16a34a)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              textDecoration: "none",
              padding: "16px 40px",
              borderRadius: 12,
              boxShadow: `0 4px 32px rgba(46,215,50,0.4)`,
            }}
          >
            Commencer gratuitement →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: COLORS.darkCard,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 5%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.blockchain})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⚡
          </div>
          <span
            style={{ fontWeight: 800, fontSize: 18, color: COLORS.primary }}
          >
            CoopEnergie
          </span>
        </div>
        <p style={{ color: "#475569", fontSize: 13 }}>
          © 2026 CoopEnergie Cameroun — Plateforme de coopératives solaires sur
          blockchain Celo
        </p>
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          {[
            "Politique de confidentialité",
            "Conditions d'utilisation",
            "Contact",
          ].map((link) => (
            <a
              key={link}
              href="#"
              style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
