import React, { useEffect, useState } from "react";
import api from "../api/api";
import { PlusCircle, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Subjects = ({ darkMode }) => {
  const [subjects, setSubjects] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.9)" : "rgba(248, 250, 252, 0.92)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    cardShadow: darkMode ? "0 20px 55px rgba(0,0,0,0.45)" : "0 18px 50px rgba(0,0,0,0.13)",
  };

  useEffect(() => {
    api
      .get("/subjects")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const isDeleting = (id) => deletingId === id;

  return (
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

            <h1 className="text-primary" style={{
              margin: 0,
              fontSize: "3.25rem",
              fontWeight: 900,
              lineHeight: "1.1",
            }}>
              Subject
            </h1>

            <p style={{
              margin: "20px 0 0",
              fontSize: "17px",
              color: theme.textSecondary,
              lineHeight: "1.7",
              maxWidth: "600px",
            }}>
              Manage and organize your subjects easily.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-subject")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              padding: "22px 36px",
              borderRadius: "32px",
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              boxShadow: `0 20px 55px rgba(14, 165, 233, 0.45)`,
            }}
          >
            <PlusCircle size={22} />
            Add Subject
          </button>
        </div>

        {/* GRID */}
        <div style={{
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
                onEdit={() => navigate(`/edit-subject/${sub.id}`)}
              />
            ))
          ) : (
            <EmptyState theme={theme} onAdd={() => navigate("/add-subject")} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- SUBJECT CARD ---------------- */

const SubjectCard = ({ subject, darkMode, theme, onDelete, onEdit, isDeleting }) => {
  if (!subject) return null;

  return (
    <div style={{
      padding: "44px 36px",
      background: theme.glass,
      borderRadius: "36px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
    }}>

      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", gap: 16 }}>

        <button onClick={onEdit}>
          <Pencil size={20} />
        </button>

        <button onClick={() => onDelete(subject.id)} disabled={isDeleting}>
          {isDeleting ? <Loader2 size={18} /> : <Trash2 size={20} />}
        </button>

      </div>

      <h2 style={{ fontSize: "32px", fontWeight: 800 }}>
        {subject.name}
      </h2>

      <p style={{ color: theme.textSecondary }}>
        {subject.lessons_count || 0} lessons
      </p>

      <div style={{ height: 12, borderRadius: 20, overflow: "hidden" }}>
        <div style={{
          width: `${subject.progress || 0}%`,
          height: "100%",
          background: theme.accent,
        }} />
      </div>

      <span>{subject.progress || 0}%</span>
    </div>
  );
};

/* ---------------- EMPTY ---------------- */

const EmptyState = ({ theme, onAdd }) => {
  return (
    <div style={{
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "100px 60px",
      background: theme.glass,
      borderRadius: "36px",
      border: `1px solid ${theme.border}`,
    }}>
      <BookOpen size={72} style={{ opacity: 0.4 }} />

      <h3>No Subjects Yet</h3>

      <p>Start by creating your first subject.</p>
    </div>
  );
};

export default Subjects;