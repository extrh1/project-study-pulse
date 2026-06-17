import React, { useMemo, useState, useEffect } from "react";
import {
  FiSave,
  FiX,
  FiTag,
  FiCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiFolder,
  FiCode,
  FiEye,
  FiLoader,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function EditCategory({ darkMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [originalName, setOriginalName] = useState("");

  const colors = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    bgGradient: darkMode ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    card: darkMode ? "#1e293b" : "#ffffff",
    cardAlt: darkMode ? "#283548" : "#f1f5f9",
    cardHover: darkMode ? "#334155" : "#e2e8f0",
    text: darkMode ? "#f1f5f9" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    textLight: darkMode ? "#cbd5e1" : "#475569",
    border: darkMode ? "#334155" : "#e2e8f0",
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  const canSubmit = useMemo(() => name.trim().length > 0 && slug.trim().length > 0, [name, slug]);

  const toSlug = (value) =>
    value.trim().toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const onNameChange = (v) => {
    setName(v);
    if (!slug || slug === toSlug(originalName)) setSlug(toSlug(v));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/admin/categories/${id}`);
        const cat = res.data.data || res.data;
        setName(cat.name);
        setSlug(cat.slug);
        setStatus(cat.status);
        setOriginalName(cat.name);
      } catch (err) {
        setError("Failed to load category");
      } finally {
        setFetching(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) { setError("Please fill in Name and Slug."); return; }
    try {
      setLoading(true);
      await api.put(`/admin/categories/${id}`, { name, slug, status });
      navigate("/admin/categories");
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (s) => {
    if (s === "active") return { bg: "#10b98115", color: colors.success, icon: <FiCheckCircle size={12} /> };
    return { bg: "#ef444415", color: colors.danger, icon: <FiX size={12} /> };
  };

  if (fetching) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: colors.bg }}>
      <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: "1.5rem", background: colors.bgGradient, minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: darkMode ? "radial-gradient(circle at 1px 1px, #334155 1px, transparent 1px)" : "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.3, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", padding: "0 0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryDark}20)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiTag size={24} color={colors.primary} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: colors.text }}>Edit Category</h1>
              <p style={{ fontSize: "0.9rem", marginTop: "0.25rem", color: colors.textMuted }}>Update category details</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/categories")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: 10, background: colors.card, border: "1px solid " + colors.border, color: colors.text, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.card}
          >
            <FiArrowLeft size={16} /> Back
          </button>
        </header>

        {/* FORM CARD */}
        <div style={{ maxWidth: 800, margin: "0 auto", background: colors.card, border: "1px solid " + colors.border, borderRadius: 16, overflow: "hidden", boxShadow: darkMode ? "0 20px 40px -15px rgba(0,0,0,0.3)" : "0 20px 40px -15px rgba(0,0,0,0.1)" }}>
          {error && (
            <div style={{ margin: "1.5rem 1.5rem 0", padding: "1rem", borderRadius: 12, background: `${colors.danger}15`, border: `1px solid ${colors.danger}30`, display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <FiAlertCircle size={18} color={colors.danger} />
              <span style={{ fontSize: "0.9rem", color: colors.danger, flex: 1 }}>{error}</span>
              <button onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", color: colors.danger }}><FiX size={16} /></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ padding: "1.5rem" }}>
              {/* Name */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, color: colors.text, marginBottom: "0.5rem" }}>
                  <FiTag size={16} color={colors.primary} /> Category Name <span style={{ color: colors.danger }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="e.g., Web Development"
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, background: colors.cardAlt, border: `2px solid ${name ? colors.success + "40" : colors.border}`, color: colors.text, fontSize: "0.95rem", outline: "none", transition: "all 0.2s" }}
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = name ? colors.success + "40" : colors.border}
                />
                {name && <span style={{ fontSize: "0.7rem", color: colors.success, display: "flex", alignItems: "center", gap: 4, marginTop: "0.5rem" }}><FiCheck size={12} /> Valid</span>}
              </div>

              {/* Slug */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, color: colors.text, marginBottom: "0.5rem" }}>
                  <FiCode size={16} color={colors.primary} /> Slug <span style={{ color: colors.danger }}>*</span>
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ padding: "0.75rem 1rem", background: colors.cardAlt, border: `1px solid ${colors.border}`, borderRadius: "10px 0 0 10px", color: colors.textMuted, fontSize: "0.85rem", fontFamily: "monospace" }}>/categories/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(toSlug(e.target.value))}
                    placeholder="web-development"
                    style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0 10px 10px 0", background: colors.cardAlt, border: `2px solid ${slug ? colors.success + "40" : colors.border}`, borderLeft: "none", color: colors.text, fontSize: "0.95rem", fontFamily: "monospace", outline: "none", transition: "all 0.2s" }}
                    disabled={loading}
                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                    onBlur={(e) => e.target.style.borderColor = slug ? colors.success + "40" : colors.border}
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "0.5rem" }}>URL-friendly version. Lowercase, numbers, and hyphens only.</p>
              </div>

              {/* Status */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, color: colors.text, marginBottom: "0.5rem" }}>
                  <FiEye size={16} color={colors.primary} /> Status
                </label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {["active", "inactive"].map((s) => (
                    <label key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: 10, background: status === s ? (s === "active" ? `${colors.success}15` : `${colors.danger}15`) : colors.cardAlt, border: `2px solid ${status === s ? (s === "active" ? colors.success : colors.danger) : colors.border}`, cursor: "pointer", transition: "all 0.2s", flex: 1 }}>
                      <input type="radio" value={s} checked={status === s} onChange={(e) => setStatus(e.target.value)} style={{ display: "none" }} />
                      {s === "active"
                        ? <FiCheckCircle size={18} color={status === s ? colors.success : colors.textMuted} />
                        : <FiX size={18} color={status === s ? colors.danger : colors.textMuted} />
                      }
                      <div>
                        <div style={{ fontWeight: 600, color: status === s ? (s === "active" ? colors.success : colors.danger) : colors.text, fontSize: "0.9rem", textTransform: "capitalize" }}>{s}</div>
                        <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>{s === "active" ? "Visible to users" : "Hidden from users"}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div style={{ padding: "1.25rem", borderRadius: 12, background: colors.cardAlt, border: `2px solid ${colors.border}`, marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiFolder size={18} color={colors.primary} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: colors.text }}>Live Preview</span>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize", background: getStatusStyle(status).bg, color: getStatusStyle(status).color }}>
                    {getStatusStyle(status).icon} {status}
                  </span>
                </div>
                <div style={{ padding: "1rem", background: colors.card, borderRadius: 8, border: `1px solid ${colors.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: `${colors.primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FiFolder size={18} color={colors.primary} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: colors.text, fontSize: "0.9rem" }}>{name || "Category Name"}</div>
                      <code style={{ fontSize: "0.7rem", color: colors.textMuted }}>/{slug || "category-slug"}</code>
                    </div>
                  </div>
                  <div style={{ paddingTop: "0.5rem", borderTop: `1px solid ${colors.border}` }}>
                    <p style={{ fontSize: "0.7rem", color: colors.textMuted, margin: 0 }}>URL: <strong style={{ color: colors.primary }}>/categories/{slug || "your-slug"}</strong></p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "1rem", borderTop: `2px solid ${colors.border}` }}>
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories")}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.2rem", borderRadius: 10, background: colors.cardAlt, border: `1px solid ${colors.border}`, color: colors.text, cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = colors.cardAlt}
                  disabled={loading}
                >
                  <FiX size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.8rem", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, color: "#fff", cursor: canSubmit && !loading ? "pointer" : "not-allowed", opacity: canSubmit ? 1 : 0.6, fontWeight: 600, transition: "all 0.2s", boxShadow: canSubmit ? `0 4px 12px ${colors.primary}40` : "none" }}
                  onMouseEnter={(e) => { if (canSubmit && !loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 16px ${colors.primary}60`; } }}
                  onMouseLeave={(e) => { if (canSubmit && !loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}40`; } }}
                >
                  {loading ? (
                    <><div style={{ width: 16, height: 16, border: "2px solid #ffffff30", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Saving...</>
                  ) : (
                    <><FiSave size={16} /> Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
