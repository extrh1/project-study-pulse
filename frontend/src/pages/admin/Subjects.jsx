import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { PlusCircle, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Subjects = ({ darkMode }) => {
  const [subjects, setSubjects] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    cardShadow: darkMode ? "0 20px 55px rgba(0,0,0,0.45)" : "0 18px 50px rgba(0,0,0,0.13)",
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await api.get("/admin/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/admin/subjects/${id}`);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete subject:", err);
      alert("Failed to delete subject. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const isDeleting = (id) => deletingId === id;

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .subjects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        padding: "80px 20px 40px",
        background: theme.bg,
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>

          {/* HEADER */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "56px" }}>
            
            <div>
              <span style={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "10px 22px",
                background: `rgba(125, 211, 252, 0.2)`,
                borderRadius: "24px",
                border: `1px solid ${theme.accent}`,
                marginBottom: "20px",
                display: "inline-block",
              }}>
                Manage Subjects
              </span>

              <h1 style={{
                margin: "20px 0 0",
                fontSize: "3.25rem",
                fontWeight: 900,
                lineHeight: "1.1",
                color: theme.textPrimary,
              }}>
                Subjects
              </h1>

              <p style={{
                margin: "16px 0 0",
                fontSize: "17px",
                color: theme.textSecondary,
                lineHeight: "1.7",
                maxWidth: "600px",
              }}>
                Manage and organize your subjects easily.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/addSubject")}
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                padding: "20px 34px",
                borderRadius: "32px",
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 20px 55px rgba(14, 165, 233, 0.45)`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 24px 60px rgba(14, 165, 233, 0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 20px 55px rgba(14, 165, 233, 0.45)";
              }}
            >
              <PlusCircle size={22} />
              Add Subject
            </button>
          </div>

          {/* GRID */}
          <div className="subjects-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "36px",
          }}>
            {subjects.length > 0 ? (
              subjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub}
                  darkMode={darkMode}
                  theme={theme}
                  onDelete={handleDelete}
                  isDeleting={isDeleting(sub.id)}
                  onEdit={() => navigate(`/admin/subjects/edit/${sub.id}`)}
                />
              ))
            ) : (
              <EmptyState theme={theme} onAdd={() => navigate("/admin/addSubject")} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------------- SUBJECT CARD ---------------- */

const SubjectCard = ({ subject, darkMode, theme, onDelete, onEdit, isDeleting }) => {
  if (!subject) return null;

  return (
    <div style={{
      position: "relative",
      padding: "40px 36px",
      background: theme.glass,
      backdropFilter: "blur(24px)",
      borderRadius: "36px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = darkMode 
        ? "0 30px 70px rgba(0,0,0,0.6)" 
        : "0 25px 60px rgba(0,0,0,0.18)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = theme.cardShadow;
    }}>
      {/* Gradient top bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentHover})`,
      }} />

      {/* Action Buttons */}
      <div style={{ 
        position: "absolute", 
        top: "24px", 
        right: "24px", 
        display: "flex", 
        gap: "10px",
        zIndex: 10,
      }}>
        {/* Edit Button */}
        <button 
          onClick={onEdit}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            color: "#3b82f6",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
            e.currentTarget.style.borderColor = theme.border;
          }}
        >
          <Pencil size={18} />
        </button>

        {/* Delete Button */}
        <button 
          onClick={() => onDelete(subject.id)} 
          disabled={isDeleting}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            color: "#ef4444",
            cursor: isDeleting ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isDeleting ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isDeleting) {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
              e.currentTarget.style.borderColor = "#ef4444";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDeleting) {
              e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = theme.border;
            }
          }}
        >
          {isDeleting ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={18} />}
        </button>
      </div>

      <div style={{ paddingRight: "80px" }}>
        <h2 style={{ 
          fontSize: "28px", 
          fontWeight: 800,
          color: theme.textPrimary,
          margin: "0 0 8px 0",
          lineHeight: "1.2",
        }}>
          {subject.name}
        </h2>

        <p style={{ 
          color: theme.textSecondary,
          fontSize: "15px",
          margin: "0 0 24px 0",
        }}>
          {subject.lessons_count || 0} {subject.lessons_count === 1 ? 'lesson' : 'lessons'}
        </p>

        {/* Progress Bar */}
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          <div style={{ 
            height: "8px", 
            borderRadius: "20px", 
            overflow: "hidden",
            background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
          }}>
            <div style={{
              width: `${subject.progress || 0}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentHover})`,
              borderRadius: "20px",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          </div>
          <span style={{
            fontSize: "14px",
            fontWeight: 600,
            color: theme.textSecondary,
          }}>
            {subject.progress || 0}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};

/* ---------------- EMPTY STATE ---------------- */

const EmptyState = ({ theme, onAdd }) => {
  return (
    <div style={{
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "100px 60px",
      background: theme.glass,
      backdropFilter: "blur(24px)",
      borderRadius: "36px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
    }}>
      <BookOpen 
        size={72} 
        style={{ 
          opacity: 0.4, 
          color: theme.textSecondary,
          marginBottom: "24px",
        }} 
      />

      <h3 style={{
        fontSize: "24px",
        fontWeight: 700,
        color: theme.textPrimary,
        margin: "0 0 12px 0",
      }}>
        No Subjects Yet
      </h3>

      <p style={{
        color: theme.textSecondary,
        fontSize: "16px",
        margin: "0 0 32px 0",
        maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        Start by creating your first subject to organize your courses.
      </p>

      <button
        onClick={onAdd}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px 32px",
          borderRadius: "28px",
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
          color: "#fff",
          border: "none",
          fontWeight: 600,
          fontSize: "15px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 20px 50px rgba(14, 165, 233, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <PlusCircle size={20} />
        Create First Subject
      </button>
    </div>
  );
};

export default Subjects;