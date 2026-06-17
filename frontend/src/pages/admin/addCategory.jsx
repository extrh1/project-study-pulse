import React, { useMemo, useState } from "react";
import {
  FiPlus,
  FiSave,
  FiX,
  FiGrid,
  FiTag,
  FiCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiFolder,
  FiHelpCircle,
  FiEye,
  FiCode,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AddCategory({ darkMode }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

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
    borderLight: darkMode ? "#475569" : "#cbd5e1",
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    primaryLight: "#818cf8",
    success: "#10b981",
    successDark: "#059669",
    danger: "#ef4444",
    dangerDark: "#dc2626",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && slug.trim().length > 0;
  }, [name, slug]);

  const toSlug = (value) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const onNameChange = (v) => {
    setName(v);
    if (!slug || slug === toSlug(name)) setSlug(toSlug(v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please fill in Name and Slug.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/categories", {
        name,
        slug,
        status,
      });
      navigate("/admin/categories");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create category";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (statusValue) => {
    if (statusValue === "active") 
      return { bg: "#10b98115", color: colors.success, icon: <FiCheckCircle size={12} /> };
    return { bg: "#ef444415", color: colors.danger, icon: <FiX size={12} /> };
  };

  return (
    <div style={{ 
      padding: "1.5rem", 
      background: colors.bgGradient,
      minHeight: "100vh",
      position: "relative",
    }}>
      {/* Background Pattern */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: darkMode 
          ? "radial-gradient(circle at 1px 1px, #334155 1px, transparent 1px)"
          : "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.3,
        pointerEvents: "none",
      }} />

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-end", 
          flexWrap: "wrap", 
          gap: "1rem", 
          marginBottom: "2rem",
          padding: "0 0.5rem",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryDark}20)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <FiPlus size={24} color={colors.primary} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: colors.text }}>
                  Add Category
                </h1>
                <p style={{ fontSize: "0.9rem", marginTop: "0.25rem", color: colors.textMuted }}>
                  Create a new category for organizing courses
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setShowHelp(!showHelp)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                padding: "0.6rem 1rem", 
                borderRadius: 10, 
                background: colors.card, 
                border: "1px solid " + colors.border, 
                color: colors.text, 
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.card}
            >
              <FiHelpCircle size={16} /> Help
            </button>
            <button
              onClick={() => navigate("/admin/categories")}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                padding: "0.6rem 1rem", 
                borderRadius: 10, 
                background: colors.card, 
                border: "1px solid " + colors.border, 
                color: colors.text, 
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.card}
              disabled={loading}
            >
              <FiArrowLeft size={16} /> Back
            </button>
          </div>
        </header>

        {/* Help Panel */}
        {showHelp && (
          <div style={{
            maxWidth: 800,
            margin: "0 auto 1.5rem",
            padding: "1rem 1.5rem",
            background: colors.card,
            border: "1px solid " + colors.border,
            borderRadius: 12,
            animation: "slideDown 0.3s ease-out",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <FiHelpCircle size={18} color={colors.info} />
              <h3 style={{ margin: 0, fontSize: "1rem", color: colors.text }}>Category Guidelines</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: colors.textLight, fontSize: "0.85rem" }}>
              <li>Category names should be descriptive and unique</li>
              <li>Slugs are automatically generated from the name</li>
              <li>Active categories will be visible to users</li>
              <li>Inactive categories are hidden but preserve their data</li>
              <li>Slug should be URL-friendly (lowercase, hyphens instead of spaces)</li>
            </ul>
          </div>
        )}

        {/* FORM CARD */}
        <div style={{ 
          maxWidth: 800, 
          margin: "0 auto",
          background: colors.card, 
          border: "1px solid " + colors.border, 
          borderRadius: 16, 
          overflow: "hidden",
          boxShadow: darkMode 
            ? "0 20px 40px -15px rgba(0,0,0,0.3)"
            : "0 20px 40px -15px rgba(0,0,0,0.1)",
          transition: "all 0.3s",
        }}>
          {/* Error Alert */}
          {error && (
            <div style={{ 
              margin: "1.5rem 1.5rem 0", 
              padding: "1rem", 
              borderRadius: 12, 
              background: `${colors.danger}15`, 
              border: `1px solid ${colors.danger}30`,
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem",
              animation: "shake 0.3s ease-out",
            }}>
              <FiAlertCircle size={18} color={colors.danger} />
              <span style={{ fontSize: "0.9rem", color: colors.danger, flex: 1 }}>{error}</span>
              <button 
                onClick={() => setError("")} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: colors.danger,
                  padding: "4px",
                  borderRadius: 4,
                }}
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ padding: "1.5rem" }}>
              {/* Name Field */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  fontSize: "0.9rem", 
                  fontWeight: 600, 
                  color: colors.text, 
                  marginBottom: "0.5rem" 
                }}>
                  <FiTag size={16} color={colors.primary} />
                  Category Name <span style={{ color: colors.danger }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="e.g., Web Development, Data Science, Design"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: 10,
                    background: colors.cardAlt,
                    border: `2px solid ${name ? colors.success + '40' : colors.border}`,
                    color: colors.text,
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  disabled={loading}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = name ? colors.success + '40' : colors.border}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                  <p style={{ fontSize: "0.75rem", color: colors.textMuted, margin: 0 }}>
                    This is how it will appear in the admin panel and store
                  </p>
                  {name && (
                    <span style={{ fontSize: "0.7rem", color: colors.success, display: "flex", alignItems: "center", gap: "4px" }}>
                      <FiCheck size={12} /> Valid
                    </span>
                  )}
                </div>
              </div>

              {/* Slug Field */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  fontSize: "0.9rem", 
                  fontWeight: 600, 
                  color: colors.text, 
                  marginBottom: "0.5rem" 
                }}>
                  <FiCode size={16} color={colors.primary} />
                  Slug <span style={{ color: colors.danger }}>*</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    padding: "0.75rem 1rem",
                    background: colors.cardAlt,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "10px 0 0 10px",
                    color: colors.textMuted,
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}>
                    /categories/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(toSlug(e.target.value))}
                    placeholder="web-development"
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      borderRadius: "0 10px 10px 0",
                      background: colors.cardAlt,
                      border: `2px solid ${slug ? colors.success + '40' : colors.border}`,
                      borderLeft: "none",
                      color: colors.text,
                      fontSize: "0.95rem",
                      fontFamily: "monospace",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    disabled={loading}
                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                    onBlur={(e) => e.target.style.borderColor = slug ? colors.success + '40' : colors.border}
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: "0.5rem" }}>
                  URL-friendly version. Use lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              {/* Status Field */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  fontSize: "0.9rem", 
                  fontWeight: 600, 
                  color: colors.text, 
                  marginBottom: "0.5rem" 
                }}>
                  <FiEye size={16} color={colors.primary} />
                  Status
                </label>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1rem",
                    borderRadius: 10,
                    background: status === "active" ? `${colors.success}15` : colors.cardAlt,
                    border: `2px solid ${status === "active" ? colors.success : colors.border}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flex: 1,
                  }}>
                    <input
                      type="radio"
                      value="active"
                      checked={status === "active"}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <FiCheckCircle size={18} color={status === "active" ? colors.success : colors.textMuted} />
                    <div>
                      <div style={{ fontWeight: 600, color: status === "active" ? colors.success : colors.text, fontSize: "0.9rem" }}>
                        Active
                      </div>
                      <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>Visible to users</div>
                    </div>
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1rem",
                    borderRadius: 10,
                    background: status === "inactive" ? `${colors.danger}15` : colors.cardAlt,
                    border: `2px solid ${status === "inactive" ? colors.danger : colors.border}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    flex: 1,
                  }}>
                    <input
                      type="radio"
                      value="inactive"
                      checked={status === "inactive"}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <FiX size={18} color={status === "inactive" ? colors.danger : colors.textMuted} />
                    <div>
                      <div style={{ fontWeight: 600, color: status === "inactive" ? colors.danger : colors.text, fontSize: "0.9rem" }}>
                        Inactive
                      </div>
                      <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>Hidden from users</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Section */}
              <div style={{ 
                padding: "1.25rem", 
                borderRadius: 12, 
                background: colors.cardAlt, 
                border: `2px solid ${colors.border}`,
                marginBottom: "1.5rem",
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiFolder size={18} color={colors.primary} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: colors.text }}>Live Preview</span>
                  </div>
                  <span style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: 6, 
                    padding: "4px 12px", 
                    borderRadius: 20, 
                    fontSize: "0.75rem", 
                    fontWeight: 600, 
                    textTransform: "capitalize", 
                    background: getStatusStyle(status).bg, 
                    color: getStatusStyle(status).color,
                    animation: "pulse 2s infinite",
                  }}>
                    {getStatusStyle(status).icon} {status}
                  </span>
                </div>
                <div style={{
                  padding: "1rem",
                  background: colors.card,
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <p style={{ fontSize: "0.7rem", color: colors.textMuted, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Category Card Preview
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryDark}20)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <FiFolder size={18} color={colors.primary} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: colors.text, fontSize: "0.9rem" }}>
                          {name || "Category Name"}
                        </div>
                        <code style={{ fontSize: "0.7rem", color: colors.textMuted }}>
                          /{slug || "category-slug"}
                        </code>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingTop: "0.5rem", borderTop: `1px solid ${colors.border}` }}>
                    <p style={{ fontSize: "0.7rem", color: colors.textMuted, margin: 0 }}>
                      URL: <strong style={{ color: colors.primary }}>/categories/{slug || "your-slug"}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                gap: "1rem", 
                paddingTop: "1rem", 
                borderTop: `2px solid ${colors.border}`,
                flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${colors.warning}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <FiHelpCircle size={14} color={colors.warning} />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: colors.textMuted, margin: 0 }}>
                    All fields marked with <span style={{ color: colors.danger }}>*</span> are required
                  </p>
                </div>
                
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setName("");
                      setSlug("");
                      setStatus("active");
                      setError("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.7rem 1.2rem",
                      borderRadius: 10,
                      background: colors.cardAlt,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.cardHover}
                    onMouseLeave={(e) => e.currentTarget.style.background = colors.cardAlt}
                    disabled={loading}
                  >
                    <FiX size={16} />
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.7rem 1.8rem",
                      borderRadius: 10,
                      border: "none",
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      color: "#fff",
                      cursor: canSubmit && !loading ? "pointer" : "not-allowed",
                      opacity: canSubmit ? 1 : 0.6,
                      fontWeight: 600,
                      transition: "all 0.2s",
                      boxShadow: canSubmit ? `0 4px 12px ${colors.primary}40` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (canSubmit && !loading) {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = `0 6px 16px ${colors.primary}60`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (canSubmit && !loading) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}40`;
                      }
                    }}
                    disabled={loading || !canSubmit}
                  >
                    {loading ? (
                      <>
                        <div style={{ 
                          width: 16, 
                          height: 16, 
                          border: "2px solid #ffffff30", 
                          borderTop: "2px solid #ffffff", 
                          borderRadius: "50%", 
                          animation: "spin 1s linear infinite" 
                        }} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Create Category
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          * {
            animation: fadeIn 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
}