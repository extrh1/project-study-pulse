import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCode,
  FiCalendar,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function ShowCategory({ darkMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  const colors = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "#ffffff",
    cardAlt: darkMode ? "#283548" : "#f1f5f9",
    cardHover: darkMode ? "#334155" : "#e2e8f0",
    text: darkMode ? "#f1f5f9" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/categories/${id}`);
        setCategory(res.data.data || res.data);
      } catch (err) {
        setError("Failed to load category");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleToggle = async () => {
    try {
      setToggling(true);
      await api.patch(`/admin/categories/${id}/toggle`);
      setCategory((prev) => ({ ...prev, status: prev.status === "active" ? "inactive" : "active" }));
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        navigate("/admin/categories");
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: colors.bg }}>
      <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !category) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: colors.bg, gap: "1rem" }}>
      <p style={{ color: colors.danger }}>{error || "Category not found"}</p>
      <button onClick={() => navigate("/admin/categories")} style={{ padding: "0.6rem 1.2rem", borderRadius: 10, background: colors.primary, border: "none", color: "#fff", cursor: "pointer" }}>Back to Categories</button>
    </div>
  );

  const isActive = category.status === "active";

  return (
    <div style={{ padding: "1.5rem", background: colors.bg, minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${colors.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiFolder size={24} color={colors.primary} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: colors.text }}>{category.name}</h1>
            <code style={{ fontSize: "0.85rem", color: colors.textMuted }}>/{category.slug}</code>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/admin/categories")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, background: colors.card, border: "1px solid " + colors.border, color: colors.text, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.card}
          >
            <FiArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleToggle}
            disabled={toggling}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, background: isActive ? `${colors.warning}15` : `${colors.success}15`, border: `1px solid ${isActive ? colors.warning : colors.success}`, color: isActive ? colors.warning : colors.success, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
          >
            {isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
            {isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => navigate(`/admin/categories/edit/${id}`)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, color: colors.primary, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
          >
            <FiEdit2 size={16} /> Edit
          </button>
          <button
            onClick={handleDelete}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, background: `${colors.danger}15`, border: `1px solid ${colors.danger}`, color: colors.danger, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
          >
            <FiTrash2 size={16} /> Delete
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>

        {/* LEFT — Stats + Courses */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "1.25rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border, display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiBookOpen size={20} color={colors.primary} />
              </div>
              <div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: colors.text }}>{category.courses_count ?? 0}</p>
                <p style={{ fontSize: "0.8rem", margin: 0, color: colors.textMuted }}>Courses</p>
              </div>
            </div>
            <div style={{ padding: "1.25rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border, display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${colors.warning}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiClock size={20} color={colors.warning} />
              </div>
              <div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: colors.text }}>{category.lessons_count ?? 0}</p>
                <p style={{ fontSize: "0.8rem", margin: 0, color: colors.textMuted }}>Lessons</p>
              </div>
            </div>
          </div>

          {/* Courses list */}
          <div style={{ background: colors.card, border: "1px solid " + colors.border, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid " + colors.border }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: colors.text }}>Courses in this category</h2>
            </div>
            {category.courses && category.courses.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid " + colors.border }}>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: colors.textMuted }}>Title</th>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: colors.textMuted }}>Status</th>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: colors.textMuted }}>Lessons</th>
                  </tr>
                </thead>
                <tbody>
                  {category.courses.map((course) => (
                    <tr key={course.id} style={{ borderBottom: "1px solid " + colors.border }}>
                      <td style={{ padding: "0.75rem 1.5rem", color: colors.text, fontWeight: 500 }}>{course.title}</td>
                      <td style={{ padding: "0.75rem 1.5rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, background: course.status === "published" ? "#10b98115" : "#f59e0b15", color: course.status === "published" ? colors.success : colors.warning }}>
                          {course.status === "published" ? <FiCheckCircle size={11} /> : <FiClock size={11} />} {course.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1.5rem", color: colors.textMuted }}>{course.lessons?.length ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "2rem", textAlign: "center", color: colors.textMuted }}>No courses in this category yet.</div>
            )}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Status */}
          <div style={{ padding: "1.25rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: colors.textMuted, margin: "0 0 0.75rem" }}>Status</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize", background: isActive ? "#10b98115" : "#ef444415", color: isActive ? colors.success : colors.danger }}>
              {isActive ? <FiCheckCircle size={14} /> : <FiXCircle size={14} />} {category.status}
            </span>
          </div>

          {/* Details */}
          <div style={{ padding: "1.25rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: colors.textMuted, margin: "0 0 1rem" }}>Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: colors.textMuted, margin: "0 0 0.25rem" }}>Slug</p>
                <code style={{ fontSize: "0.85rem", color: colors.text, background: colors.cardAlt, padding: "4px 8px", borderRadius: 6 }}>/{category.slug}</code>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: colors.textMuted, margin: "0 0 0.25rem" }}>Created</p>
                <p style={{ fontSize: "0.85rem", color: colors.text, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <FiCalendar size={13} /> {category.created_at ? new Date(category.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: colors.textMuted, margin: "0 0 0.25rem" }}>Last updated</p>
                <p style={{ fontSize: "0.85rem", color: colors.text, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <FiClock size={13} /> {category.updated_at ? new Date(category.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
