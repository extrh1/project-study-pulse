import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFolder,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function Categories({ darkMode }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const colors = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "#ffffff",
    cardAlt: darkMode ? "#283548" : "#f1f5f9",
    text: darkMode ? "#f1f5f9" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    primary: "#6366f1",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const totalCourses = categories.reduce((sum, c) => sum + (c.courses_count || 0), 0);

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/categories?search=${search}&page=${page}`);
      setCategories(res.data.data);
      setLastPage(res.data.last_page || 1);
      console.log("API RESPONSE:", res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        fetchCategories();
      } catch (err) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/categories/${id}/toggle`);
      fetchCategories();
    } catch (err) {
      setCategories(categories.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
    }
  };

  const getStatusStyle = (status) => {
    if (status === "active") return { bg: "#10b98115", color: "#10b981", icon: <FiCheckCircle size={12} /> };
    if (status === "inactive") return { bg: "#ef444415", color: "#ef4444", icon: <FiXCircle size={12} /> };
    return { bg: "#64748b15", color: "#64748b", icon: null };
  };

  return (
    <div style={{ padding: "1.5rem", background: colors.bg, minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: colors.text }}>Categories</h1>
          <p style={{ fontSize: "0.9rem", marginTop: "0.35rem", color: colors.textMuted }}>Organize your courses with categories</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, background: colors.card, border: "1px solid " + colors.border, color: colors.text, cursor: "pointer" }}>
            <FiDownload size={16} /> Export
          </button>
          <button
            onClick={() => navigate("/admin/addCategory")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer" }}
          >
            <FiPlus size={16} /> Add Category
          </button>
        </div>
      </header>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#6366f115", color: "#6366f1" }}>
            <FiFolder size={20} />
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: colors.text }}>{totalCategories}</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: colors.textMuted }}>Total Categories</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#10b98115", color: "#10b981" }}>
            <FiCheckCircle size={20} />
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: colors.text }}>{activeCategories}</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: colors.textMuted }}>Active</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#f59e0b15", color: "#f59e0b" }}>
            <FiBookOpen size={20} />
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: colors.text }}>{totalCourses}</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: colors.textMuted }}>Total Courses</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: "1rem", padding: "1rem", borderRadius: 12, marginBottom: "1.25rem", background: colors.card, border: "1px solid " + colors.border, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1rem", height: 42, flex: 1, maxWidth: 400, borderRadius: 10, background: colors.cardAlt, border: "1px solid " + colors.border }}>
          <FiSearch size={18} color={colors.textMuted} />
          <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "0.9rem", color: colors.text }} />
        </div>
        <button onClick={handleSearch} style={{ padding: "0.6rem 1.25rem", borderRadius: 10, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer" }}>Search</button>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gridColumn: "1 / -1" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          </div>
        ) : (
          categories.map((category) => {
            const statusStyle = getStatusStyle(category.status);
            return (
              <div key={category.id} style={{ padding: "1.5rem", borderRadius: 16, background: colors.card, border: "1px solid " + colors.border }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: category.color + "20", color: category.color }}>
                    <FiFolder size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: colors.text }}>{category.name}</h3>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: colors.textMuted, fontFamily: "monospace" }}>/{category.slug}</p>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize", background: statusStyle.bg, color: statusStyle.color }}>
                    {statusStyle.icon} {category.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid " + colors.border, fontSize: "0.9rem", color: colors.textMuted }}>
                  <span><FiBookOpen size={14} /> {category.courses_count} courses</span>
                  <span><FiClock size={14} /> {category.lessons_count} lessons</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <button
                    onClick={() => navigate(`/admin/categories/${category.id}`)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      color: colors.textMuted,
                      cursor: "pointer",
                    }}
                  >
                    <FiEye size={16} />
                  </button>

                  <button
                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      color: colors.textMuted,
                      cursor: "pointer",
                    }}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => toggleStatus(category.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", color: category.status === "active" ? colors.warning : colors.success, cursor: "pointer" }}>
                    {category.status === "active" ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
                  </button>
                  <button onClick={() => handleDelete(category.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", color: colors.danger, cursor: "pointer" }}><FiTrash2 size={16} /></button>
                </div>
                <div style={{ paddingTop: "0.75rem", borderTop: "1px solid " + colors.border }}>
                  <span style={{ fontSize: "0.8rem", color: colors.textMuted }}>Created {category.created_at ? new Date(category.created_at).toLocaleDateString() : "—"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: colors.card, border: "1px solid " + colors.border, borderRadius: 12 }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: "0.5rem 1rem", borderRadius: 8, background: colors.cardAlt, border: "1px solid " + colors.border, color: colors.text, cursor: "pointer" }}>Previous</button>
        <span style={{ color: colors.textMuted }}>Page {page} of {lastPage}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === lastPage} style={{ padding: "0.5rem 1rem", borderRadius: 8, background: colors.cardAlt, border: "1px solid " + colors.border, color: colors.text, cursor: "pointer" }}>Next</button>
      </div>
    </div>
  );
}