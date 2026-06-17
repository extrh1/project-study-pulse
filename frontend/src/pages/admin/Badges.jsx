import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PlusCircle,
  Trash2,
  Award,
  Loader2,
  Search,
  CheckCircle2,
  Edit3,
  AlertCircle,
} from "lucide-react";
import api from "../../api/api";

// hex → rgb helper
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
};

const Badges = ({ darkMode }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useMemo(
    () => ({
      bg: darkMode ? "#0a0a0f" : "#f8fafc",
      glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(255,255,255,0.98)",
      textPrimary: darkMode ? "#f8fafc" : "#0f172a",
      textSecondary: darkMode ? "#a1a1aa" : "#64748b",
      accent: darkMode ? "#fbbf24" : "#f59e0b",
      accentHover: darkMode ? "#fcd34d" : "#f97316",
      success: "#10b981",
      danger: "#ef4444",
      border: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
      cardShadow: darkMode
        ? "0 20px 55px rgba(0,0,0,0.45)"
        : "0 18px 50px rgba(0,0,0,0.13)",
      inputBg: darkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)",
    }),
    [darkMode]
  );

  // Load badges
  const loadBadges = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/badges");
      setBadges(res.data || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load badges.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Success message from navigation
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  }, [location.state]);

  // Initial load
  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  // Filter badges
  const filteredBadges = useMemo(() => {
    if (!searchQuery) return badges;
    
    const query = searchQuery.toLowerCase();
    return badges.filter((badge) => {
      const name = badge.name?.toLowerCase() || "";
      const description = badge.description?.toLowerCase() || "";
      return name.includes(query) || description.includes(query);
    });
  }, [badges, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this badge?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/admin/badges/${id}`);
      setBadges((prev) => prev.filter((b) => b.id !== id));
      setSuccessMessage("Badge deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      console.error(e);
      setError("Failed to delete badge.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setError("");
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 100,
          background: theme.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Loader2 className="animate-spin" size={48} style={{ color: theme.textSecondary }} />
          <div style={{ color: theme.textSecondary }}>Loading badges...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 100, background: theme.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Messages */}
        {(successMessage || error) && (
          <div style={{ marginBottom: 24 }}>
            {successMessage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  background: `rgba(16, 185, 129, 0.1)`,
                  border: `1px solid ${theme.success}`,
                  borderRadius: 12,
                  color: theme.success,
                }}
              >
                <CheckCircle2 size={20} />
                {successMessage}
              </div>
            )}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  background: `rgba(239, 68, 68, 0.1)`,
                  border: `1px solid ${theme.danger}`,
                  borderRadius: 12,
                  color: theme.danger,
                }}
              >
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ 
              color: theme.textPrimary, 
              fontSize: 40, 
              fontWeight: 700,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <Award size={44} />
              Badges
            </h1>
            <div style={{ color: theme.textSecondary, fontSize: 16, marginTop: 4 }}>
              Showing {filteredBadges.length} of {badges.length} badges
            </div>
          </div>
        </div>

        {/* Search & Add */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search 
              size={20} 
              style={{ 
                position: "absolute", 
                left: 16, 
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.textSecondary,
                pointerEvents: "none"
              }} 
            />
            <input
              type="text"
              placeholder="Search badges"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: "100%",
                padding: "14px 16px 14px 48px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: 16,
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.accent;
                e.target.style.boxShadow = `0 0 0 3px rgba(${hexToRgb(theme.accent)}, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            onClick={() => navigate("/admin/addBadge")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: `0 4px 14px rgba(${hexToRgb(theme.accent)}, 0.3)`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 8px 25px rgba(${hexToRgb(theme.accent)},0.4)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = `0 4px 14px rgba(${hexToRgb(theme.accent)},0.3)`;
            }}
          >
            <PlusCircle size={20} />
            Add Badge
          </button>
        </div>

        {/* Badges Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {filteredBadges.length > 0 ? (
            filteredBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                theme={theme}
                darkMode={darkMode}
                onDelete={handleDelete}
                isDeleting={deletingId === badge.id}
                navigate={navigate}
              />
            ))
          ) : (
            <EmptyState theme={theme} searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
};

/* Badge Card Component */
const BadgeCard = ({ badge, theme, darkMode, onDelete, isDeleting, navigate }) => {
  const handleCardClick = (e) => {
    // Prevent navigation if clicking buttons
    if (e.target.closest('button')) return;
    navigate(`/admin/badges/edit/${badge.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        padding: 24,
        borderRadius: 20,
        background: theme.glass,
        border: `1px solid ${theme.border}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: theme.cardShadow,
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = darkMode 
          ? "0 25px 65px rgba(0,0,0,0.55)"
          : "0 25px 65px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.cardShadow;
      }}
    >
      <h3 style={{
        color: theme.textPrimary,
        fontSize: 24,
        fontWeight: 700,
        margin: "0 0 8px 0",
        lineHeight: 1.3,
      }}>
        {badge.name}
      </h3>
      
      <p style={{
        color: theme.textSecondary,
        fontSize: 16,
        lineHeight: 1.6,
        margin: "0 0 20px 0",
      }}>
        {badge.description}
      </p>

      <div style={{ 
        display: "flex", 
        justifyContent: "flex-end", 
        gap: 12 
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/badges/edit/${badge.id}`);
          }}
          style={{
            padding: "8px",
            border: "none",
            borderRadius: 8,
            background: "rgba(251, 191, 36, 0.1)",
            color: theme.accent,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(251, 191, 36, 0.2)";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(251, 191, 36, 0.1)";
            e.target.style.transform = "scale(1)";
          }}
          title="Edit badge"
          aria-label="Edit badge"
        >
          <Edit3 size={18} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(badge.id);
          }}
          disabled={isDeleting}
          style={{
            padding: "8px",
            border: "none",
            borderRadius: 8,
            background: "rgba(239, 68, 68, 0.1)",
            color: theme.danger,
            cursor: isDeleting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            opacity: isDeleting ? 0.6 : 1,
          }}
          title="Delete badge"
          aria-label="Delete badge"
        >
          {isDeleting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

/* Empty State */
const EmptyState = ({ theme, searchQuery }) => (
  <div style={{
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "80px 40px",
    color: theme.textSecondary,
  }}>
    <Award size={64} style={{ margin: "0 auto 24px", opacity: 0.5 }} />
    <h3 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 8px 0" }}>
      No badges found
    </h3>
    <p style={{ fontSize: 16, margin: 0, maxWidth: 400, margin: "0 auto" }}>
      {searchQuery ? "Try another search term." : "Create badges to reward progress and achievements."}
    </p>
    {!searchQuery && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          marginTop: 24,
          padding: "12px 24px",
          background: theme.accent,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Create Your First Badge
      </button>
    )}
  </div>
);

export default Badges;