import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { BookPlus, ChevronLeft, Loader2 } from "lucide-react";

const AddLesson = ({ darkMode }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const filteredCourses = courses.filter((course) => {
    const courseSubjectId = course.subject_id ?? course.subject?.id;
    return courseSubjectId != null && courseSubjectId.toString() === subjectId.toString();
  });

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(248, 250, 252, 0.95)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    border: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    shadow: darkMode ? "0 25px 60px rgba(0,0,0,0.6)" : "0 20px 50px rgba(0,0,0,0.12)",
    gradient: darkMode 
      ? "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 1) 100%)",
  };

  // 📥 load courses and subjects
  useEffect(() => {
    Promise.all([
      api.get("/courses"),
      api.get("/subjects"),
    ])
      .then(([coursesRes, subjectsRes]) => {
        if (coursesRes?.data) setCourses(coursesRes.data);
        if (subjectsRes?.data) setSubjects(subjectsRes.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 💾 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!subjectId) {
      setError("Please select a subject first.");
      return;
    }

    if (!courseId) {
      setError("Please select a course for the chosen subject.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/lessons", {
        course_id: courseId,
        title: title,
        content: content,
        subject_id: subjectId,
      });
      navigate("/lessons");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px 40px",
      background: theme.bg,
      position: "relative",
      overflow: "hidden",
    }}>
      
      {/* MAIN CARD */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto",
      }}>
        
        <form onSubmit={handleSubmit} style={{
          padding: "48px 36px",
          background: theme.glass,
          backdropFilter: "blur(30px)",
          borderRadius: "32px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          overflow: "hidden",
        }}>

          {/* HEADER */}
          <div style={{
            textAlign: "center",
            marginBottom: "44px",
            paddingBottom: "28px",
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <div style={{
              width: 72,
              height: 72,
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "24px",
              background: `rgba(125, 211, 252, ${darkMode ? '0.2' : '0.15'})`,
              border: `1px solid ${theme.accent}`,
              boxShadow: `0 12px 32px rgba(14, 165, 233, 0.2)`,
            }}>
              <BookPlus size={28} style={{ color: theme.accent }} />
            </div>

            <h1 style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
              lineHeight: "1.2",
              background: `linear-gradient(135deg, ${theme.accent} 0%, #9de0fe 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}>
              Add Lesson
            </h1>

            <p style={{
              fontSize: "15px",
              color: theme.textSecondary,
              lineHeight: "1.6",
              maxWidth: "400px",
              margin: "0 auto",
            }}>
              Create a lesson and assign it to a subject so learners can follow your structured course flow.
            </p>
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
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "12px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "20px 24px",
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "17px",
                fontWeight: 500,
                backdropFilter: "blur(16px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.2), inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
              }}
              placeholder="Enter a clear lesson title..."
            />
          </div>

          {/* CONTENT TEXTAREA */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "12px",
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
                height: "140px",
                padding: "24px",
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "16px",
                lineHeight: "1.6",
                fontFamily: "inherit",
                resize: "vertical",
                backdropFilter: "blur(16px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.2), inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
              }}
              placeholder="Write the lesson content here..."
            />
          </div>

          {/* COURSE SELECT */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "12px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              disabled={!subjectId}
              style={{
                width: "100%",
                padding: "20px 24px",
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "17px",
                fontWeight: 500,
                backdropFilter: "blur(16px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 20px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
                cursor: !subjectId ? "not-allowed" : "pointer",
              }}
            >
              {!subjectId ? (
                <option value="" disabled>
                  Select a subject first
                </option>
              ) : filteredCourses.length === 0 ? (
                <option value="" disabled>
                  No courses available for this subject
                </option>
              ) : (
                <option value="" disabled>
                  Select Course
                </option>
              )}
              {filteredCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT SELECT */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: "12px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setCourseId("");
              }}
              required
              style={{
                width: "100%",
                padding: "20px 24px",
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                background: darkMode ? "rgba(45, 55, 72, 0.8)" : "rgba(255, 255, 255, 0.9)",
                color: theme.textPrimary,
                fontSize: "17px",
                fontWeight: 500,
                backdropFilter: "blur(16px)",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 20px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 4px rgba(125, 211, 252, 0.2), inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = `inset 0 2px 12px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
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

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "20px 32px",
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
                : `0 16px 40px rgba(14, 165, 233, 0.4)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = `0 24px 50px rgba(14, 165, 233, 0.5)`;
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 16px 40px rgba(14, 165, 233, 0.4)`;
              }
            }}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Lesson...
              </>
            ) : (
              "Add Lesson"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;