import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiLogOut,
  FiGrid,
  FiAward,
  FiBook,
  FiList,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function AdminSidebar({ darkMode, isOpen = true, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Colors - StudyPulse theme
  const colors = {
    bg: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#94a3b8" : "#64748b",
    textActive: darkMode ? "#f1f5f9" : "#1e293b",
    border: darkMode ? "#334155" : "#e2e8f0",
    hover: darkMode ? "#334155" : "#f1f5f9",
    primary: "#6366f1", // Indigo
    secondary: "#8b5cf6", // Purple
    danger: "#ef4444",
  };

const menu = [
  { name: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },

  { name: "Users", icon: <FiUsers />, path: "/admin/users" },

  { name: "Courses", icon: <FiBookOpen />, path: "/admin/courses" },

  { name: "Subjects", icon: <FiBook />, path: "/admin/subjects" },

  { name: "Lessons", icon: <FiList />, path: "/admin/lessons" },

  { name: "Badges", icon: <FiAward />, path: "/admin/badges" },

  { name: "Categories", icon: <FiGrid />, path: "/admin/categories" },
];

  const toggleSidebar = () => setIsOpen && setIsOpen(!isOpen);

  return (
    <aside style={{
      ...styles.sidebar,
      background: darkMode ? "#1e293b" : "#ffffff",
      borderRight: `1px solid ${colors.border}`,
      width: isOpen ? "260px" : "80px",
    }}>
      
      {/* LOGO SECTION */}
      <div style={styles.logoSection}>
      </div>

      {/* TOGGLE BUTTON */}
      {setIsOpen && (
        <button 
          style={{
            ...styles.toggleBtn,
            background: darkMode ? "#334155" : "#ffffff",
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }} 
          onClick={toggleSidebar}
        >
          {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </button>
      )}

      {/* MENU */}
      <nav style={styles.nav}>
        {menu.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.item(isOpen),
              background: location.pathname === item.path
                ? `${colors.primary}15`
                : "transparent",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = colors.hover;
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span style={{
              ...styles.itemIcon,
              color: location.pathname === item.path
                ? colors.primary
                : colors.text,
            }}>
              {item.icon}
            </span>
            {isOpen && (
              <span style={{
                ...styles.itemLabel,
                color: location.pathname === item.path
                  ? colors.textActive
                  : colors.text,
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}>
                {item.name}
              </span>
            )}
            {location.pathname === item.path && (
              <div style={{
                ...styles.activeIndicator,
                background: colors.primary,
              }}></div>
            )}
          </div>
        ))}
      </nav>

      {/* LOGOUT */}
      <div style={styles.bottomSection}>
        <button 
          style={styles.logoutBtn(isOpen)}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          <FiLogOut size={20} style={{ color: colors.danger }} />
          {isOpen && (
            <span style={{
              ...styles.itemLabel,
              color: colors.danger,
            }}>
              Logout
            </span>
          )}
        </button>
      </div>

    </aside>
  );
}

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 0.75rem",
    zIndex: 100,
    transition: "width 0.3s ease",
    overflow: "hidden",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0 0.75rem",
    marginBottom: "2rem",
    minHeight: "40px",
  },

  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  logoText: {
    fontSize: "1.35rem",
    fontWeight: "700",
    whiteSpace: "nowrap",
    letterSpacing: "-0.02em",
  },

  toggleBtn: {
    position: "absolute",
    top: "24px",
    right: "-14px",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    zIndex: 101,
  },

  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    overflowY: "auto",
  },

  item: (isOpen) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    padding: isOpen ? "0.85rem 1rem" : "0.85rem 0.85rem",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    justifyContent: isOpen ? "flex-start" : "center",
    whiteSpace: "nowrap",
  }),

  itemIcon: {
    flexShrink: 0,
    fontSize: "1.15rem",
  },

  itemLabel: {
    fontSize: "0.9rem",
    transition: "color 0.2s ease",
  },

  activeIndicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "20px",
    borderRadius: "0 4px 4px 0",
  },

  bottomSection: {
    paddingTop: "1rem",
    borderTop: "1px solid rgba(148,163,184,0.2)",
    marginTop: "auto",
  },

  logoutBtn: (isOpen) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    width: "100%",
    padding: isOpen ? "0.85rem 1rem" : "0.85rem 0.85rem",
    borderRadius: "12px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    justifyContent: isOpen ? "flex-start" : "center",
    transition: "all 0.2s ease",
  }),
};