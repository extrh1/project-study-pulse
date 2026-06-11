import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ChevronLeft, Loader2, BookOpen } from "lucide-react";

const EditSubject = ({ darkMode }) => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(248, 250, 252, 0.95)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    border: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    shadow: darkMode ? "0 25px 70px rgba(0,0,0,0.6)" : "0 20px 60px rgba(0,0,0,0.14)",
    gradient: darkMode 
      ? "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/subjects/${id}`)
      .then((res) => {
        setName(res.data.name || "");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/subjects/${id}`, { name: name.trim() });
      navigate("/subjects");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        background: theme.bg,
        color: theme.textSecondary,
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "56px 44px",
          background: theme.glass,
          backdropFilter: "blur(25px)",
          borderRadius: "32px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          maxWidth: "420px",
          width: "100%",
        }}>
          <Loader2 size={52} style={{ 
            color: theme.accent, 
            animation: "spin 1s linear infinite" 
          }} />
          <div style={{ 
            fontSize: "19px", 
            fontWeight: 600,
            color: theme.textPrimary,
          }}>
            Loading subject details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      padding: "80px 20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: theme.bg,
    }}>
      
      {/* MAIN FORM CARD */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        
        <form onSubmit={handleSubmit} style={{
          padding: "60px 44px",
          background: theme.glass,
          backdropFilter: "blur(30px)",
          borderRadius: "36px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          overflow: "hidden",
        }}>

          {/* HEADER */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "52px",
            paddingBottom: "36px",
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "24px",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 16px 40px rgba(14, 165, 233, 0.3)`,
            }}>
              <Save size={32} style={{ color: "#fff" }} />
            </div>
            
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: 800,
                lineHeight: "1.1",
                background: `linear-gradient(135deg, ${theme.textPrimary} 0%, ${theme.accent} 70%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}>
                Edit Subject
              </h1>
              <p style={{
                margin: "14px 0 0",
                fontSize: "16px",
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}>
                Update the subject name to keep your course organization clear and intuitive.
              </p>
            </div>
          </div>

          {/* SUBJECT NAME INPUT */}
          <div style={{ marginBottom: "64px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "24px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Subject Name
            </label>
            <div style={{ position: "relative" }}>
              <BookOpen 
                size={24} 
                style={{
                  position: "absolute",
                  left: "32px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textSecondary,
                  pointerEvents: "none",
                }} 
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "28px 32px 28px 84px",
                  borderRadius: "32px",
                  border: `1px solid ${theme.border}`,
                  background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                  color: theme.textPrimary,
                  fontSize: "20px",
                  fontWeight: 600,
                  backdropFilter: "blur(24px)",
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: `inset 0 2px 20px ${darkMode ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.14)"}`,
                  letterSpacing: "-0.015em",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.accent;
                  e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.3), inset 0 2px 20px ${darkMode ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.14)"}`;
                  e.target.style.transform = "scale(1.025)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border;
                  e.target.style.boxShadow = `inset 0 2px 20px ${darkMode ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.14)"}`;
                  e.target.style.transform = "scale(1)";
                }}
                placeholder="Enter a clear and descriptive subject name..."
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{
            display: "flex",
            gap: "28px",
            justifyContent: "flex-end",
            paddingTop: "40px",
            borderTop: `1px solid ${theme.border}`,
          }}>
            
            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                maxWidth: "220px",
                padding: "24px 40px",
                borderRadius: "32px",
                border: `1px solid ${theme.border}`,
                background: "transparent",
                color: theme.textSecondary,
                fontWeight: 700,
                fontSize: "17px",
                cursor: "pointer",
                backdropFilter: "blur(24px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = `0 16px 45px ${darkMode ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)"}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <ChevronLeft size={22} />
              Cancel
            </button>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                maxWidth: "260px",
                padding: "24px 40px",
                borderRadius: "32px",
                background: saving 
                  ? "rgba(148, 163, 184, 0.4)"
                  : `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "17px",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
                boxShadow: saving 
                  ? "none" 
                  : `0 24px 65px rgba(14, 165, 233, 0.55)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(-5px)";
                  e.target.style.boxShadow = `0 35px 80px rgba(14, 165, 233, 0.65)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 24px 65px rgba(14, 165, 233, 0.55)`;
                }
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={22} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubject;