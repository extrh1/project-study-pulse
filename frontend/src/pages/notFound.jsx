import { useEffect } from "react";
import { FiBookOpen , FiArrowLeft } from "react-icons/fi";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import "../styles/editProfile.css";

export default function NotFound({ darkMode }) {
  useEffect(() => {
    document.title = "Page Not Found - Study Pulse";
  }, []);

  const getColors = () => ({
    bg: darkMode 
      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)" 
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    text: darkMode ? "#f1f5f9" : "#0f172a",
    textSecondary: darkMode ? "#cbd5e1" : "#64748b",
    accent: darkMode ? "#667eea" : "#3b82f6",
    card: darkMode ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.9)",
    border: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
  });

  const colors = getColors();

  return (
    <Layout darkMode={darkMode} sidebar={<Sidebar darkMode={darkMode} />}>
      <div style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        padding: "2rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center"
        }}>
          
          {/* MAIN CONTENT */}
          <div style={{
            background: colors.card,
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: `1px solid ${colors.border}`,
            padding: "4rem 3rem",
            boxShadow: darkMode 
              ? "0 25px 80px rgba(0,0,0,0.6)" 
              : "0 20px 60px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden"
          }}>
            
            {/* BACKGROUND SHAPE */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "300px",
              height: "300px",
              background: `linear-gradient(135deg, ${colors.accent}22, transparent)`,
              borderRadius: "50%",
              zIndex: 0
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              
              {/* BIG NUMBER */}
              <div style={{
                fontSize: "8rem",
                fontWeight: "800",
                background: `linear-gradient(135deg, ${colors.accent} 0%, #764ba2 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: "1rem",
                letterSpacing: "-0.05em"
              }}>
                404
              </div>

              {/* TITLE */}
              <h1 style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                margin: "0 0 1rem 0",
                color: colors.text
              }}>
                Page Not Found
              </h1>

              {/* DESCRIPTION */}
              <p style={{
                fontSize: "1.2rem",
                lineHeight: 1.6,
                margin: "0 0 2.5rem 0",
                color: colors.textSecondary,
                maxWidth: "500px",
                marginLeft: "auto",
                marginRight: "auto"
              }}>
                The page you're looking for doesn't exist or has been moved.
              </p>

              {/* STUDY PULSE MESSAGE */}
              <div style={{
                background: `linear-gradient(135deg, ${colors.accent}15, transparent)`,
                border: `1px solid ${colors.accent}30`,
                borderRadius: "16px",
                padding: "1.5rem 2rem",
                marginBottom: "2.5rem"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}>
                  <FiBookOpen size={32} color={colors.accent} />
                  <div style={{ textAlign: "left" }}>
                    <h3 style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: colors.text
                    }}>
                      Keep Learning!
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: colors.textSecondary
                    }}>
                      Return to your dashboard to continue your study journey
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap"
              }}>

                <button
                  onClick={() => window.history.back()}
                  style={buttonStyles.secondary(colors, darkMode)}
                >
                  <FiArrowLeft style={{ marginRight: "0.5rem" }} />
                  Go Back
                </button>

              </div>

              {/* SEARCH BAR */}
              <div style={{
                marginTop: "3rem",
                padding: "1rem 1.5rem",
                background: darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <FiBookOpen size={20} color={colors.textSecondary} />
                  <input
                    type="text"
                    placeholder="Search courses or documentation..."
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: colors.text,
                      fontSize: "1rem"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        window.location.href = `/search?q=${e.target.value}`;
                      }
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

/* ================= BUTTON STYLES ================= */

const buttonStyles = {
  primary: (colors, darkMode) => ({
    padding: "14px 28px",
    background: `linear-gradient(135deg, ${colors.accent} 0%, #764ba2 100%)`,
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: `0 8px 25px ${colors.accent}40`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)"
  }),

  secondary: (colors, darkMode) => ({
    padding: "14px 24px",
    background: "transparent",
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease"
  })
};