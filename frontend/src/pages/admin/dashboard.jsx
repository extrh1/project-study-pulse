import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  FiUsers,
  FiActivity,
  FiBookOpen,
  FiCheckCircle,
  FiTrendingUp,
  FiUserX,
  FiGrid,
  FiRefreshCw,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

const DEFAULT_DARK_MODE = false;

export default function AdminDashboard({ darkMode = DEFAULT_DARK_MODE }) {
  const resolvedDarkMode = darkMode ?? DEFAULT_DARK_MODE;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    bg: resolvedDarkMode ? "#0f172a" : "#f8fafc",
    card: resolvedDarkMode ? "#1e293b" : "#ffffff",
    cardHover: resolvedDarkMode ? "#283548" : "#f1f5f9",
    text: resolvedDarkMode ? "#f1f5f9" : "#1e293b",
    textMuted: resolvedDarkMode ? "#94a3b8" : "#64748b",
    border: resolvedDarkMode ? "#334155" : "#e2e8f0",
    primary: "#3b82f6",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/dashboard");

      console.log("DASHBOARD:", res.data);

      const data = res.data;

      setStats({
        totalUsers: data?.users?.total ?? 0,
        activeUsers: data?.users?.active ?? 0,
        inactiveUsers: data?.users?.inactive ?? 0,
        totalCourses: data?.courses?.total ?? 0,
        growth: data?.growth ?? 0,
      });

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={styles.loadingContainer(colors)}>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
        </div>
        <p style={styles.loadingText(colors)}>Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container(colors)}>
      {/* HEADER */}
      <header style={styles.header(colors)}>
        <div>
          <h1 style={styles.title(colors)}>Admin Dashboard</h1>
          <p style={styles.subtitle(colors)}>
            Welcome back, here's what's happening today.
          </p>
        </div>

        <button style={styles.refreshBtn(colors)} onClick={loadStats}>
          <FiRefreshCw size={16} /> Refresh
        </button>
      </header>

      {/* STATS GRID */}
      <div style={styles.grid}>
        <StatCard icon={<FiUsers />} label="Total Users" value={stats.totalUsers} colors={colors} />
        <StatCard icon={<FiCheckCircle />} label="Active Now" value={stats.activeUsers} colors={colors} />
        <StatCard icon={<FiUserX />} label="Inactive Users" value={stats.inactiveUsers} colors={colors} />
        <StatCard icon={<FiBookOpen />} label="Total Courses" value={stats.totalCourses} colors={colors} />
      </div>

      {/* TWO COLUMN SECTION */}
      <div style={styles.three}>
        {/* Quick Actions */}
        <section>
          <h3 style={styles.sectionTitle(colors)}>Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <ActionBtn
              icon={<FiUsers />}
              label="Manage Users"
              desc="Edit roles, permissions"
              color={colors.primary}
              colors={colors}
              onClick={() => (window.location.href = "/admin/users")}
            />
            <ActionBtn
              icon={<FiBookOpen />}
              label="Course Content"
              desc="Upload Course"
              color={colors.warning}
              colors={colors}
              onClick={() => (window.location.href = "/admin/courses")}
            />
            <ActionBtn
              icon={<FiGrid />}
              label="Categories"
              desc="View Categories"
              color={colors.danger}
              colors={colors}
              onClick={() => (window.location.href = "/admin/categories")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS (UNCHANGED STYLE) ================= */

const StatCard = ({ icon, label, value, colors }) => (
  <div style={styles.statCard(colors)}>
    <div style={styles.statHeader}>
      <div style={{ ...styles.iconWrapper, background: `${colors.primary}20`, color: colors.primary }}>
        {icon}
      </div>
    </div>
    <h3 style={styles.statValue(colors)}>{value}</h3>
    <p style={styles.statLabel(colors)}>{label}</p>
  </div>
);

const ActionBtn = ({ icon, label, desc, color, colors, onClick }) => (
  <div style={styles.actionBtn(colors)} onClick={onClick}>
    <div style={{ ...styles.actionIcon, background: `${color}15`, color }}>
      {icon}
    </div>
    <div>
      <h4 style={styles.actionTitle(colors)}>{label}</h4>
      <p style={styles.actionDesc(colors)}>{desc}</p>
    </div>
  </div>
);

/* ================= STYLES (UNCHANGED) ================= */

const styles = {
  container: (colors) => ({
    minHeight: "100vh",
    width: "100%",
    backgroundColor: colors.bg,
    color: colors.text,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    transition: "all 0.3s ease",
    padding: "2rem",
  }),

  loadingContainer: (colors) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: colors.bg,
    color: colors.textMuted,
  }),

  spinnerContainer: {
    marginBottom: "1rem",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: (colors) => ({
    fontSize: "0.95rem",
    color: colors.textMuted,
  }),

  header: (colors) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "2.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  }),

  title: (colors) => ({
    fontSize: "2rem",
    fontWeight: "700",
    margin: 0,
    color: colors.text,
  }),

  subtitle: (colors) => ({
    fontSize: "0.95rem",
    color: colors.textMuted,
    marginTop: "0.5rem",
  }),

  refreshBtn: (colors) => ({
    padding: "0.65rem 1.25rem",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    color: colors.text,
    cursor: "pointer",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  }),

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.25rem",
    marginBottom: "2.5rem",
  },

  statCard: (colors) => ({
    backgroundColor: colors.card,
    padding: "1.5rem",
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
  }),

  statHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  iconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: (colors) => ({
    fontSize: "1.85rem",
    fontWeight: "700",
    color: colors.text,
  }),

  statLabel: (colors) => ({
    fontSize: "0.85rem",
    color: colors.textMuted,
  }),

  three: {
    display: "grid",
    gap: "2rem",
  },

  sectionTitle: (colors) => ({
    fontSize: "1.15rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: colors.text,
  }),

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },

  actionBtn: (colors) => ({
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    borderRadius: "14px",
    padding: "1.1rem",
    display: "flex",
    gap: "0.85rem",
    cursor: "pointer",
  }),

  actionIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: (colors) => ({
    fontSize: "0.9rem",
    fontWeight: "600",
  }),

  actionDesc: (colors) => ({
    fontSize: "0.8rem",
    color: colors.textMuted,
  }),

  statusCard: (colors) => ({
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    borderRadius: "14px",
    padding: "1.25rem",
  }),

  statusItem: (colors) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.65rem 0",
  }),

  statusLabel: (colors) => ({
    flex: 1,
    color: colors.textMuted,
  }),

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },

  statusValue: (colors) => ({
    fontWeight: "500",
  }),
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);