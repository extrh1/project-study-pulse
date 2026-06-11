import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookPlus, ChevronLeft, Loader2 } from "lucide-react";
import api from "../api/api";

const AddCourse = ({ darkMode }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject_id, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
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
    input: darkMode ? "#1a1a2e" : "#ffffff",
    shadow: darkMode
      ? "0 25px 60px rgba(0,0,0,0.6)"
      : "0 20px 50px rgba(0,0,0,0.12)",
    danger: "#ef4444",
  };

  useEffect(() => {
    api
      .get("/subjects")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!subject_id) {
      setError("Please select a subject before creating the course.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/courses", {
        title,
        description,
        subject_id,
      });
      navigate("/courses", { state: { success: "Course created successfully!" } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    background: theme.input,
    color: theme.textPrimary,
    fontSize: "15px",
    fontFamily: "inherit",
    transition: "all 0.25s ease",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 40px",
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${darkMode ? '#0f0f23' : '#f1f5f9'} 100%)`,
      }}
    >
      <div style={{ width: "100%", maxWidth: "720px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "48px 40px",
            background: theme.glass,
            backdropFilter: "blur(30px)",
            borderRadius: "32px",
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                color: theme.accent,
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              <BookPlus size={18} />
              Create Course
            </div>

            <h2 style={{ color: theme.textPrimary, margin: 0, fontSize: "32px", fontWeight: 700 }}>
              Add a New Course
            </h2>
            <p style={{ color: theme.textSecondary, margin: "12px 0 0", fontSize: "15px" }}>
              Give your course a title and description, then assign it to a subject.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{
              marginBottom: "24px",
              padding: "14px 16px",
              background: `rgba(239, 68, 68, 0.15)`,
              border: `1px solid ${theme.danger}30`,
              borderRadius: "12px",
              color: theme.danger,
              fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {/* TITLE */}
          <input
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.background = theme.surface;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.background = theme.input;
            }}
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Add a short description for the course"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "120px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.background = theme.surface;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.background = theme.input;
            }}
          />

          {/* SUBJECT */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <select
              value={subject_id}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.textPrimary,
                fontSize: "15px",
                fontFamily: "inherit",
                transition: "all 0.25s ease",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${darkMode ? 'a1a1aa' : '64748b'}' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "20px",
                paddingRight: "40px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.background = theme.surface;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.background = theme.input;
              }}
            >
              <option value="" disabled hidden>
                Select a subject
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id} style={{ 
                  background: theme.surface, 
                  color: theme.textPrimary 
                }}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: "14px", marginTop: "32px" }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                padding: "14px 24px",
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                background: "transparent",
                color: theme.textPrimary,
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.glass;
                e.target.style.borderColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = theme.border;
              }}
            >
              <ChevronLeft size={18} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "14px 24px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                opacity: saving ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 12px 30px rgba(14, 165, 233, 0.3)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Creating...
                </>
              ) : (
                <>
                  <BookPlus size={18} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AddCourse;