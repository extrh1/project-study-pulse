import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3, ChevronLeft, Loader2, Save } from "lucide-react";
import api from "../api/api";

const EditCourse = ({ darkMode }) => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject_id, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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
    Promise.all([
      api.get(`/courses/${id}`),
      api.get("/subjects")
    ])
    .then(([courseRes, subjectsRes]) => {
      setTitle(courseRes.data.title || "");
      setDescription(courseRes.data.description || "");
      setSubjectId(courseRes.data.subject_id || "");
      setSubjects(subjectsRes.data);
      setError("");
    })
    .catch((err) => {
      setError(err.response?.data?.message || "Failed to load course");
    })
    .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/courses/${id}`, { title, description, subject_id: subject_id || null });
      navigate("/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
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
          padding: "48px",
          background: theme.glass,
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: `1px solid ${theme.border}`,
        }}>
          <Loader2 size={48} style={{ 
            color: theme.accent, 
            animation: "spin 1s linear infinite" 
          }} />
          <div style={{ fontSize: "18px", fontWeight: 500 }}>
            Loading course details...
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
        maxWidth: "720px",
        margin: "0 auto",
      }}>
        
        <form onSubmit={handleSubmit} style={{
          padding: "56px 48px",
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
            gap: "20px",
            marginBottom: "48px",
            paddingBottom: "32px",
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 12px 32px rgba(14, 165, 233, 0.3)`,
            }}>
              <Edit3 size={28} style={{ color: "#fff" }} />
            </div>
            
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "40px",
                fontWeight: 800,
                lineHeight: "1.1",
                background: `linear-gradient(135deg, ${theme.textPrimary} 0%, ${theme.accent} 70%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}>
                Edit Course
              </h1>
              <p style={{
                margin: "12px 0 0",
                fontSize: "16px",
                color: theme.textSecondary,
              }}>
                Update title and description to keep your course information current.
              </p>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{
              marginBottom: "24px",
              padding: "16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
              borderRadius: "12px",
              color: "#ef4444",
              fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {/* TITLE INPUT */}
          <div style={{ marginBottom: "36px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "24px 28px",
                borderRadius: "28px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "19px",
                fontWeight: 600,
                backdropFilter: "blur(20px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`,
                letterSpacing: "-0.01em",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.25), inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                e.target.style.transform = "scale(1.02)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                e.target.style.transform = "scale(1)";
              }}
              placeholder="Enter a compelling course title..."
            />
          </div>

          {/* DESCRIPTION TEXTAREA */}
          <div style={{ marginBottom: "52px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Course Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                height: "180px",
                padding: "28px",
                borderRadius: "28px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "17px",
                lineHeight: "1.7",
                fontFamily: "inherit",
                resize: "vertical",
                backdropFilter: "blur(20px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.25), inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                e.target.style.transform = "scale(1.02)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                e.target.style.transform = "scale(1)";
              }}
              placeholder="Write a clear and engaging description that explains what students will learn and why they should enroll..."
            />
          </div>

          {/* SUBJECT SELECT */}
          <div style={{ marginBottom: "52px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Associated Subject (Optional)
            </label>
            <select
              value={subject_id}
              onChange={(e) => setSubjectId(e.target.value)}
              style={{
                width: "100%",
                padding: "24px 28px",
                borderRadius: "28px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "17px",
                fontWeight: 500,
                backdropFilter: "blur(20px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`,
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.25), inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                e.target.style.transform = "scale(1.02)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
                e.target.style.transform = "scale(1)";
              }}
            >
              <option value="">-- Select a subject --</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIONS */}
          <div style={{
            display: "flex",
            gap: "24px",
            justifyContent: "flex-end",
            paddingTop: "32px",
            borderTop: `1px solid ${theme.border}`,
          }}>
            
            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "22px 32px",
                borderRadius: "28px",
                border: `1px solid ${theme.border}`,
                background: "transparent",
                color: theme.textSecondary,
                fontWeight: 600,
                fontSize: "16px",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 12px 35px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)"}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <ChevronLeft size={20} />
              Cancel
            </button>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                maxWidth: "240px",
                padding: "22px 32px",
                borderRadius: "28px",
                background: saving 
                  ? "rgba(148, 163, 184, 0.4)"
                  : `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "16px",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                boxShadow: saving 
                  ? "none" 
                  : `0 20px 55px rgba(14, 165, 233, 0.5)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = `0 30px 70px rgba(14, 165, 233, 0.6)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 20px 55px rgba(14, 165, 233, 0.5)`;
                }
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;