import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ChevronLeft, Loader2, BookOpen, Sparkles } from "lucide-react";
import LessonSummary from "../../components/LessonSummary";

const EditLesson = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

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
    setError("");
    
    Promise.all([
      api.get(`/admin/lessons/${id}`),
      api.get("/admin/subjects")
    ]).then(([lessonRes, subjectsRes]) => {
      if (lessonRes?.data) {
        setTitle(lessonRes.data.title || "");
        setContent(lessonRes.data.content || "");
        setSubjectId(lessonRes.data.subject_id || "");
      }
      if (subjectsRes?.data) {
        setSubjects(subjectsRes.data);
      }
    })
    .catch((err) => {
      setError(err.response?.data?.message || "Failed to load lesson");
    })
    .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/admin/lessons/${id}`, {
        title,
        content,
        subject_id: subjectId,
      });
      navigate("/admin/lessons");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update lesson");
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
          padding: "60px 48px",
          background: theme.glass,
          backdropFilter: "blur(25px)",
          borderRadius: "32px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          maxWidth: "500px",
          width: "100%",
        }}>
          <Loader2 size={56} style={{ 
            color: theme.accent, 
            animation: "spin 1s linear infinite" 
          }} />
          <div style={{ 
            fontSize: "20px", 
            fontWeight: 600,
            color: theme.textPrimary,
          }}>
            Loading lesson details...
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
        maxWidth: "600px",
        margin: "0 auto",
      }}>
        
        <form onSubmit={handleSubmit} style={{
          padding: "56px 44px",
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
                fontSize: "38px",
                fontWeight: 800,
                lineHeight: "1.1",
                background: `linear-gradient(135deg, ${theme.textPrimary} 0%, ${theme.accent} 70%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}>
                Edit Lesson
              </h1>
              <p style={{
                margin: "14px 0 0",
                fontSize: "16px",
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}>
                Update lesson title, content, and subject assignment to keep your course perfectly organized.
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
          <div style={{ marginBottom: "40px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Lesson Title
            </label>
            <div style={{ position: "relative" }}>
              <BookOpen 
                size={22} 
                style={{
                  position: "absolute",
                  left: "28px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textSecondary,
                  pointerEvents: "none",
                }} 
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "24px 28px 24px 72px",
                  borderRadius: "28px",
                  border: `1px solid ${theme.border}`,
                  background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                  color: theme.textPrimary,
                  fontSize: "18px",
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
                placeholder="Enter a clear and engaging lesson title..."
              />
            </div>
          </div>

          {/* CONTENT TEXTAREA */}
          <div style={{ marginBottom: "40px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Lesson Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: "100%",
                height: "200px",
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
              placeholder="Write comprehensive lesson content that helps students master the topic..."
            />
          </div>

          {/* AI SUMMARY SECTION */}
          <div style={{ marginBottom: "40px" }}>
            <button
              type="button"
              onClick={() => setShowSummary(!showSummary)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                marginBottom: "20px",
                borderRadius: "12px",
                border: `1px solid ${theme.accent}`,
                background: showSummary ? `${theme.accent}20` : "transparent",
                color: theme.accent,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${theme.accent}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = showSummary ? `${theme.accent}20` : "transparent";
              }}
            >
              <Sparkles size={16} />
              {showSummary ? "Hide AI Summary" : "Generate AI Summary"}
            </button>
            
            {showSummary && (
              <div style={{
                padding: "20px",
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(167,139,250,0.05)" : "rgba(139,92,246,0.05)",
              }}>
                <LessonSummary lessonId={id} darkMode={darkMode} />
              </div>
            )}
          </div>

          {/* SUBJECT SELECT */}
          <div style={{ marginBottom: "56px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "20px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "24px 28px",
                borderRadius: "28px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 500,
                backdropFilter: "blur(20px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`,
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(theme.textSecondary)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 28px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "18px",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.25), inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 16px ${darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`;
              }}
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIONS */}
          <div style={{
            display: "flex",
            gap: "24px",
            justifyContent: "flex-end",
            paddingTop: "36px",
            borderTop: `1px solid ${theme.border}`,
          }}>
            
            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "22px 36px",
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
                padding: "22px 36px",
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
              <Save size={20} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditLesson;