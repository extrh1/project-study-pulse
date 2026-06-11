import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, PlusCircle, ChevronLeft, Loader2 } from "lucide-react";
import api from "../api/api";

const AddSubject = ({ darkMode }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(248, 250, 252, 0.95)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    danger: "#ef4444",
    border: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    shadow: darkMode ? "0 25px 60px rgba(0,0,0,0.6)" : "0 20px 50px rgba(0,0,0,0.12)",
    gradient: darkMode 
      ? "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!name.trim()) {
      setError("Subject name is required.");
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/subjects", { name: name.trim() });
      navigate("/subjects");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add subject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "80px 20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: theme.bg,
    }}>
      
      {/* MAIN CARD */}
      <div style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
      }}>
        
        <div style={{
          padding: "48px 40px",
          background: theme.glass,
          backdropFilter: "blur(30px)",
          borderRadius: "32px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          overflow: "hidden",
        }}>

          {/* HEADER */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "32px",
            marginBottom: "44px",
            paddingBottom: "28px",
            borderBottom: `1px solid ${theme.border}`,
          }}>
            
            {/* LEFT CONTENT */}
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 20px",
                background: `rgba(125, 211, 252, ${darkMode ? '0.2' : '0.15'})`,
                borderRadius: "20px",
                border: `1px solid ${theme.accent}`,
                fontSize: "13px",
                fontWeight: 600,
                color: theme.accent,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}>
                Subject builder
              </div>
              
              <h1 style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: 800,
                lineHeight: "1.2",
                background: `linear-gradient(135deg, ${theme.accent} 0%, #9de0fe 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}>
                Create a polished subject
              </h1>
              
              <p style={{
                margin: "20px 0 0",
                fontSize: "16px",
                color: theme.textSecondary,
                lineHeight: "1.7",
              }}>
                Add a subject to structure your lessons, improve course navigation, and keep learning organized for your students.
              </p>
            </div>

            {/* PRO TIP CARD */}
            <div style={{
              padding: "24px",
              borderRadius: "24px",
              border: `1px solid ${theme.accent}`,
              background: `rgba(125, 211, 252, ${darkMode ? '0.15' : '0.08'})`,
              boxShadow: `0 12px 32px rgba(14, 165, 233, 0.15)`,
            }}>
              <p style={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.accent,
                marginBottom: "12px",
              }}>
                Pro tip
              </p>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: theme.textSecondary,
                lineHeight: "1.5",
              }}>
                Use clear names like "Math Fundamentals" or "Web Development" for easier navigation.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* SUBJECT NAME INPUT */}
            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: theme.textPrimary,
                marginBottom: "16px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Subject Name
              </label>
              <div style={{
                position: "relative",
              }}>
                <BookOpen 
                  size={20} 
                  style={{
                    position: "absolute",
                    left: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: theme.textSecondary,
                    pointerEvents: "none",
                  }} 
                />
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "22px 24px 22px 64px",
                    borderRadius: "28px",
                    border: `1px solid ${theme.border}`,
                    background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                    color: theme.textPrimary,
                    fontSize: "17px",
                    fontWeight: 500,
                    backdropFilter: "blur(16px)",
                    outline: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.accent;
                    e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.25), inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border;
                    e.target.style.boxShadow = `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                  }}
                />
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div style={{
                padding: "20px 24px",
                borderRadius: "24px",
                border: `1px solid rgba(239, 68, 68, 0.3)`,
                background: darkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
                color: theme.danger,
                fontSize: "14px",
                lineHeight: "1.5",
                boxShadow: `0 8px 25px rgba(239, 68, 68, 0.2)`,
              }}>
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "22px 32px",
                borderRadius: "28px",
                background: submitting 
                  ? "rgba(148, 163, 184, 0.4)"
                  : `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "16px",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                boxShadow: submitting 
                  ? "none" 
                  : `0 16px 45px rgba(14, 165, 233, 0.45)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = `0 24px 55px rgba(14, 165, 233, 0.55)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 16px 45px rgba(14, 165, 233, 0.45)`;
                }
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                  Saving subject...
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Add Subject
                </>
              )}
            </button>

            {/* INFO BOX */}
            <div style={{
              padding: "24px",
              borderRadius: "24px",
              border: `1px solid ${theme.border}`,
              background: `rgba(125, 211, 252, ${darkMode ? '0.08' : '0.05'})`,
              backdropFilter: "blur(12px)",
            }}>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}>
                This subject will be available immediately in the course editor and can be reused for multiple lessons across your courses.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;