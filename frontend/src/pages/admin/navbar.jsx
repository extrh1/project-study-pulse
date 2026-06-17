import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiBell,
  FiMoon,
  FiSun,
  FiUser,
  FiLogOut,
  FiBook,
  FiMenu,
  FiChevronDown,
  FiHome,
  FiUserPlus,
  FiBookOpen,
  FiToggleRight,
  FiTrash2,
} from "react-icons/fi";
import logo from "../../assets/logo-removebg-preview2.png";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

// Icon per notification type
const NotifIcon = ({ type, color }) => {
  const size = 14;
  if (type === "new_user")       return <FiUserPlus size={size} color={color} />;
  if (type === "new_course")     return <FiBookOpen size={size} color={color} />;
  if (type === "course_deleted") return <FiTrash2 size={size} color={color} />;
  if (type === "course_status")  return <FiToggleRight size={size} color={color} />;
  return <FiBell size={size} color={color} />;
};

const typeColor = (type) => {
  if (type === "new_user")       return "#6366f1";
  if (type === "new_course")     return "#10b981";
  if (type === "course_deleted") return "#ef4444";
  if (type === "course_status")  return "#f59e0b";
  return "#6366f1";
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function Navbar({ darkMode = false, onToggleDarkMode, onToggleSidebar }) {
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifications, setNotifications] = useState([]);

  const notifMenuRef = useRef(null);
  const userMenuRef  = useRef(null);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/admin/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/admin/notifications/read-all");
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const colors = {
    bg:       darkMode ? "#0f172a" : "#ffffff",
    card:     darkMode ? "#1e293b" : "#ffffff",
    cardHover: darkMode ? "#334155" : "#f8fafc",
    text:     darkMode ? "#f1f5f9" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border:   darkMode ? "#334155" : "#e2e8f0",
    primary:  "#6366f1",
    danger:   "#ef4444",
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current  && !userMenuRef.current.contains(e.target))  setShowUserMenu(false);
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/admin/search?q=${searchValue}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ ...styles.navbar, backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
      {/* LEFT */}
      <div style={styles.leftSection}>
        <button style={{ ...styles.menuBtn, color: colors.textMuted }} onClick={onToggleSidebar}>
          <FiMenu size={20} />
        </button>
        <div style={styles.logoContainer}>
          <img src={logo} alt="logo" style={{ width: 26 }} />
          <span style={{ ...styles.logoText, color: colors.text }}>StudyPulse</span>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ ...styles.searchContainer, background: colors.cardHover, border: `1px solid ${colors.border}` }}>
        <FiSearch size={18} color={colors.textMuted} />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search courses, students..."
          style={{ ...styles.searchInput, color: colors.text }}
        />
      </div>

      {/* RIGHT */}
      <div style={styles.rightSection}>
        {/* DARK MODE */}
        <button style={{ ...styles.iconBtn, color: colors.textMuted }} onClick={onToggleDarkMode}>
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* NOTIFICATIONS */}
        <div ref={notifMenuRef} style={styles.notificationWrapper}>
          <button
            style={{ ...styles.iconBtn, color: colors.textMuted }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div style={{ ...styles.dropdown, background: colors.card, border: `1px solid ${colors.border}` }}>
              {/* Header */}
              <div style={{ ...styles.dropdownHeader, borderBottom: `1px solid ${colors.border}` }}>
                <div>
                  <span style={{ color: colors.text, fontWeight: "bold", fontSize: 14 }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 11, background: colors.primary, color: "#fff", borderRadius: 10, padding: "2px 7px" }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button style={{ ...styles.markAllBtn, color: colors.primary }} onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <p style={{ ...styles.emptyNotif, color: colors.textMuted }}>No notifications</p>
                ) : (
                  notifications.map((n) => {
                    const color   = typeColor(n.type);
                    const isUnread = !n.read_at;
                    return (
                      <div
                        key={n.id}
                        onClick={() => isUnread && markAsRead(n.id)}
                        style={{
                          ...styles.notifItem,
                          borderBottom: `1px solid ${colors.border}`,
                          background: isUnread
                            ? darkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)"
                            : "transparent",
                          cursor: isUnread ? "pointer" : "default",
                        }}
                      >
                        {/* Icon */}
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <NotifIcon type={n.type} color={color} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: colors.text, margin: 0, fontSize: 13, fontWeight: isUnread ? 600 : 400 }}>
                            {n.title}
                          </p>
                          <p style={{ color: colors.textMuted, margin: "2px 0 0", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {n.message}
                          </p>
                          <p style={{ color: colors.textMuted, margin: "2px 0 0", fontSize: 11 }}>
                            {timeAgo(n.created_at)}
                          </p>
                        </div>

                        {/* Unread dot + delete */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          {isUnread && (
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                          )}
                          <button
                            onClick={(e) => deleteNotif(e, n.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, padding: 2, opacity: 0.6 }}
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* USER MENU */}
        <div ref={userMenuRef} style={styles.userWrapper}>
          <button
            style={{ ...styles.userBtn, background: colors.cardHover, border: `1px solid ${colors.border}`, color: colors.text }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div style={{ ...styles.avatar, background: colors.primary }}>
              <FiUser size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 14 }}>Admin</span>
            <FiChevronDown size={14} color={colors.textMuted} />
          </button>

          {showUserMenu && (
            <div style={{ ...styles.userDropdown, background: colors.card, border: `1px solid ${colors.border}` }}>
              <button
                style={{ ...styles.dropdownItem, color: colors.text }}
                onClick={() => { navigate("/admin/dashboard"); setShowUserMenu(false); }}
              >
                <FiHome size={15} /> Dashboard
              </button>
              <button
                style={{ ...styles.dropdownItem, color: colors.text }}
                onClick={() => { navigate("/admin/courses"); setShowUserMenu(false); }}
              >
                <FiBook size={15} /> Courses
              </button>
              <button
                style={{ ...styles.dropdownItem, color: colors.danger, borderTop: `1px solid ${colors.border}` }}
                onClick={handleLogout}
              >
                <FiLogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar:            { position: "fixed", top: 0, left: 0, right: 0, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", zIndex: 1000 },
  leftSection:       { display: "flex", alignItems: "center", gap: 12 },
  menuBtn:           { width: 40, height: 40, border: "none", background: "transparent", cursor: "pointer" },
  logoContainer:     { display: "flex", alignItems: "center", gap: 10 },
  logoText:          { fontSize: 18, fontWeight: "bold" },
  searchContainer:   { display: "flex", alignItems: "center", padding: "0 12px", height: 40, width: 350, borderRadius: 10 },
  searchInput:       { flex: 1, border: "none", outline: "none", background: "transparent", marginLeft: 8 },
  rightSection:      { display: "flex", alignItems: "center", gap: 10 },
  iconBtn:           { width: 40, height: 40, border: "none", background: "transparent", cursor: "pointer", position: "relative" },
  badge:             { position: "absolute", top: 5, right: 5, background: "#ef4444", color: "#fff", fontSize: 10, borderRadius: 10, padding: "2px 5px" },
  notificationWrapper: { position: "relative" },
  dropdown:          { position: "absolute", right: 0, top: 45, width: 320, borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
  dropdownHeader:    { padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  markAllBtn:        { fontSize: 12, background: "none", border: "none", cursor: "pointer", fontWeight: "500" },
  emptyNotif:        { padding: "20px 14px", textAlign: "center", fontSize: 13, margin: 0 },
  notifItem:         { padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start", transition: "background 0.2s" },
  userWrapper:       { position: "relative" },
  userBtn:           { display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 10, cursor: "pointer" },
  avatar:            { width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" },
  userDropdown:      { position: "absolute", right: 0, top: 45, width: 200, borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" },
  dropdownItem:      { width: "100%", padding: "10px 14px", border: "none", background: "transparent", textAlign: "left", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 },
};