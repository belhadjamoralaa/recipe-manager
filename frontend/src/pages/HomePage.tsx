import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 900 : false;

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    padding: "0",
    margin: "0",
    background:
      "linear-gradient(135deg, #f9fafb 0%, #e0f2fe 35%, #fef9c3 100%)",
    color: "#0f172a",
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const shellStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
    padding: isMobile ? "2.5rem 1.25rem" : "3.5rem 1.75rem",
    boxSizing: "border-box",
    gap: isMobile ? "2.5rem" : "3rem",
  };

  const leftStyle: React.CSSProperties = {
    flex: "1 1 50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: isMobile ? 0 : "1.5rem",
  };

  const rightStyle: React.CSSProperties = {
    flex: "1 1 50%",
    display: "flex",
    alignItems: "center",
    justifyContent: isMobile ? "center" : "flex-end",
    paddingLeft: isMobile ? 0 : "1.5rem",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.25rem 0.85rem",
    borderRadius: "999px",
    background: "rgba(59, 130, 246, 0.08)",
    color: "#1d4ed8",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "1rem",
    border: "1px solid rgba(59, 130, 246, 0.15)",
  };

  const glowDot: React.CSSProperties = {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#22c55e",
    boxShadow: "0 0 10px rgba(34, 197, 94, 0.7)",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? "2.1rem" : "2.8rem",
    lineHeight: 1.1,
    fontWeight: 800,
    margin: 0,
    marginBottom: "0.9rem",
    color: "#0f172a",
  };

  const gradientWord: React.CSSProperties = {
    background:
      "linear-gradient(120deg, #2563eb, #7c3aed, #db2777, #ea580c)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    paddingLeft: "0.35rem",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "0.98rem",
    color: "#4b5563",
    maxWidth: "500px",
    marginBottom: "1.7rem",
  };

  const ctaRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.8rem",
    marginBottom: "2rem",
  };

  const primaryBtn: React.CSSProperties = {
    padding: "0.7rem 1.7rem",
    borderRadius: "999px",
    border: "none",
    outline: "none",
    background:
      "linear-gradient(120deg, #2563eb, #4f46e5, #0ea5e9)",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 16px 35px rgba(37, 99, 235, 0.35)",
    transition: "transform 0.12s ease, box-shadow 0.12s ease",
  };

  const ghostBtn: React.CSSProperties = {
    padding: "0.7rem 1.4rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.7)",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#111827",
    fontWeight: 500,
    fontSize: "0.9rem",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    transition: "background 0.12s ease, transform 0.12s ease",
  };

  const metaRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    fontSize: "0.86rem",
    color: "#6b7280",
  };

  const metaBlock: React.CSSProperties = {
    minWidth: "160px",
  };

  const metaTitle: React.CSSProperties = {
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "0.3rem",
    color: "#9ca3af",
  };

  const metaValue: React.CSSProperties = {
    fontSize: "0.95rem",
    color: "#111827",
    fontWeight: 500,
  };

  // Right side "device" mockup
  const phoneShell: React.CSSProperties = {
    width: isMobile ? "260px" : "290px",
    height: isMobile ? "480px" : "520px",
    borderRadius: "34px",
    padding: "0.9rem",
    background: "#f9fafb",
    border: "1px solid rgba(148, 163, 184, 0.5)",
    boxShadow:
      "0 20px 45px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(148, 163, 184, 0.3)",
    position: "relative",
    overflow: "hidden",
  };

  const phoneInner: React.CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: "26px",
    background:
      "linear-gradient(145deg, #eff6ff 0%, #eef2ff 40%, #f9fafb 100%)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  };

  const phoneHeader: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.8rem",
  };

  const pill: React.CSSProperties = {
    width: "70px",
    height: "6px",
    borderRadius: "999px",
    background: "#e5e7eb",
    position: "absolute",
    top: "0.65rem",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const phoneTitle: React.CSSProperties = {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#111827",
  };

  const phoneSubtitle: React.CSSProperties = {
    fontSize: "0.7rem",
    color: "#6b7280",
  };

  const phoneBadge: React.CSSProperties = {
    fontSize: "0.7rem",
    padding: "0.15rem 0.55rem",
    borderRadius: "999px",
    background: "rgba(22, 163, 74, 0.12)",
    color: "#16a34a",
    fontWeight: 500,
  };

  const cardList: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    marginTop: "0.5rem",
  };

  const recipeCard: React.CSSProperties = {
    borderRadius: "14px",
    padding: "0.7rem",
    background:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(255, 255, 255, 0.95))",
    border: "1px solid rgba(129, 140, 248, 0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "0.5rem",
  };

  const recipeInfo: React.CSSProperties = {
    maxWidth: "70%",
  };

  const recipeTitle: React.CSSProperties = {
    fontSize: "0.85rem",
    fontWeight: 600,
    marginBottom: "0.15rem",
    color: "#111827",
  };

  const recipeMeta: React.CSSProperties = {
    fontSize: "0.7rem",
    color: "#6b7280",
  };

  const recipeTag: React.CSSProperties = {
    fontSize: "0.7rem",
    padding: "0.12rem 0.45rem",
    borderRadius: "999px",
    background: "rgba(56, 189, 248, 0.16)",
    color: "#0369a1",
    display: "inline-block",
    marginTop: "0.2rem",
    fontWeight: 500,
  };

  const heartBadge: React.CSSProperties = {
    fontSize: "0.8rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.15rem",
    color: "#f97316",
    fontWeight: 500,
  };

  const bottomBar: React.CSSProperties = {
    marginTop: "auto",
    paddingTop: "0.8rem",
    borderTop: "1px solid rgba(209, 213, 219, 0.9)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.74rem",
    color: "#6b7280",
  };

  const bottomChip: React.CSSProperties = {
    padding: "0.2rem 0.55rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.6)",
    background: "#f9fafb",
    fontWeight: 500,
    color: "#374151",
  };

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        {/* Right: phone preview (en haut sur mobile) */}
        <div style={rightStyle}>
          <div style={phoneShell}>
            <div style={pill} />
            <div style={phoneInner}>
              <div style={phoneHeader}>
                <div>
                  <div style={phoneTitle}>Tonight’s picks</div>
                  <small style={phoneSubtitle}>
                    Curated from your favorites
                  </small>
                </div>
                <div style={phoneBadge}>Online</div>
              </div>

              <div style={cardList}>
                <div style={recipeCard}>
                  <div style={recipeInfo}>
                    <div style={recipeTitle}>Creamy Garlic Pasta</div>
                    <div style={recipeMeta}>⏱️ 20 min • 3 steps</div>
                    <span style={recipeTag}>Quick dinner</span>
                  </div>
                  <div style={heartBadge}>
                    <span>⭐</span>
                    <span>124</span>
                  </div>
                </div>

                <div
                  style={{
                    ...recipeCard,
                    background:
                      "linear-gradient(135deg, rgba(244, 114, 182, 0.15), rgba(255, 255, 255, 0.98))",
                    border: "1px solid rgba(236, 72, 153, 0.45)",
                  }}
                >
                  <div style={recipeInfo}>
                    <div style={recipeTitle}>Spicy Mango Salad</div>
                    <div style={recipeMeta}>⏱️ 10 min • 2 steps</div>
                    <span style={recipeTag}>Fresh & light</span>
                  </div>
                  <div style={{ ...heartBadge, color: "#ec4899" }}>
                    <span>⭐</span>
                    <span>89</span>
                  </div>
                </div>

                <div
                  style={{
                    ...recipeCard,
                    background:
                      "linear-gradient(135deg, rgba(52, 211, 153, 0.18), rgba(255, 255, 255, 0.98))",
                    border: "1px solid rgba(52, 211, 153, 0.5)",
                  }}
                >
                  <div style={recipeInfo}>
                    <div style={recipeTitle}>One-Pan Chicken</div>
                    <div style={recipeMeta}>⏱️ 30 min • 4 steps</div>
                    <span style={recipeTag}>Family favorite</span>
                  </div>
                  <div style={{ ...heartBadge, color: "#16a34a" }}>
                    <span>⭐</span>
                    <span>203</span>
                  </div>
                </div>
              </div>

              <div style={bottomBar}>
                <span>Tap any card to view details</span>
                <span style={bottomChip}>Saved recipes · 32</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left: hero text */}
        <div style={leftStyle}>
          <div style={badgeStyle}>
            <span style={glowDot} />
            <span>Recipes app · MPGL2 project</span>
          </div>
          <h1 style={titleStyle}>
            Your personal
            <span style={gradientWord}> recipe hub</span> in the cloud.
          </h1>
          <p style={subtitleStyle}>
            Collect your best dishes, search instantly, and star your go-to
            meals. A simple full-stack app to manage recipes, favorites, and
            comments — built for learning, but ready to shine in demos.
          </p>

          <div style={ctaRow}>
            <Link to="/recipes" style={{ textDecoration: "none" }}>
              <button
                style={primaryBtn}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Start browsing recipes
              </button>
            </Link>

            <Link to="/register" style={{ textDecoration: "none" }}>
              <button
                style={ghostBtn}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Create an account
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={ghostBtn}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                I already have one
              </button>
            </Link>
          </div>

          <div style={metaRow}>
            <div style={metaBlock}>
              <div style={metaTitle}>Full-stack</div>
              <div style={metaValue}>Node, Express, MongoDB, React, Vite</div>
            </div>
            <div style={metaBlock}>
              <div style={metaTitle}>Features</div>
              <div style={metaValue}>
                Auth, favorites, comments, search, CRUD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
