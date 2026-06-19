import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

import profileImg from "../assets/profile.jpg";

const ProfileMenu = ({ darkMode, onLogout }) => {
  const [openProfile,   setOpenProfile]   = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [userSnapshot, setUserSnapshot] = useState({});

  const profileRef = useRef(null);
  const navigate   = useNavigate();

  // Refresh the snapshot whenever the dropdown is opened
  useEffect(() => {
    if (openProfile) {
      try {
        setUserSnapshot(JSON.parse(localStorage.getItem("user")) || {});
      } catch {
        setUserSnapshot({});
      }
    }
  }, [openProfile]);

  // Initial load
  useEffect(() => {
    try {
      setUserSnapshot(JSON.parse(localStorage.getItem("user")) || {});
    } catch {
      setUserSnapshot({});
    }
  }, []);

  useEffect(() => {
  const refreshUser = () => {
    try {
      setUserSnapshot(JSON.parse(localStorage.getItem("user")) || {});
    } catch {
      setUserSnapshot({});
    }
  };

  window.addEventListener("avatar-updated", refreshUser);
  window.addEventListener("user-updated", refreshUser);

  return () => {
    window.removeEventListener("avatar-updated", refreshUser);
    window.removeEventListener("user-updated", refreshUser);
  };
}, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarSrc = userSnapshot?.avatar_url || profileImg;

  const handleLogout = () => {
    setOpenProfile(false);
    setConfirmLogout(true);
  };

  const confirmYes = () => {
    setConfirmLogout(false);
    onLogout();
    navigate("/");
  };

  const confirmNo = () => setConfirmLogout(false);

  const menuItems = [
    { icon: <User size={20} />,        label: "Edit Profile",  to: "/edit-profile" },
    { icon: <HelpCircle size={20} />,  label: "Help & Support",to: "/support"      },
  ];

  const theme = {
    bg:           darkMode ? "#0a0a0f"                                        : "#ffffff",
    surface:      darkMode ? "#1a1a2e"                                        : "#f8fafc",
    glass:        darkMode ? "rgba(26, 26, 46, 0.95)"                        : "rgba(248, 250, 252, 0.95)",
    textPrimary:  darkMode ? "#f8fafc"                                        : "#0f172a",
    textSecondary:darkMode ? "#a1a1aa"                                        : "#64748b",
    accent:       darkMode ? "#7dd3fc"                                        : "#0ea5e9",
    accentHover:  darkMode ? "#9de0fe"                                        : "#0284c7",
    danger:       "#ef4444",
    border:       darkMode ? "rgba(255, 255, 255, 0.1)"                      : "rgba(0, 0, 0, 0.08)",
    shadow:       darkMode ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)"         : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    gradient:     darkMode
      ? "linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(10, 10, 15, 0.9) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
  };

  return (
    <div className="profile-wrapper" ref={profileRef} style={{ position: "relative" }}>

      <div
        onClick={() => setOpenProfile(!openProfile)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "20px",
          background: theme.gradient,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.border}`,
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: theme.shadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = theme.glass;
          e.currentTarget.style.boxShadow   = "0 8px 32px rgba(0,0,0,0.15)";
          e.currentTarget.style.transform   = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = theme.gradient;
          e.currentTarget.style.boxShadow   = theme.shadow;
          e.currentTarget.style.transform   = "translateY(0)";
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${theme.accent}`,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
            flexShrink: 0,
          }}
        >
          <img
            src={avatarSrc}
            alt="profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              console.log("IMAGE ERROR:", avatarSrc);
              e.currentTarget.src = profileImg;
            }}
          />
        </div>
        <ChevronDown
          size={16}
          style={{
            transition: "transform 0.3s ease",
            transform: openProfile ? "rotate(180deg)" : "rotate(0deg)",
            color: theme.textSecondary,
          }}
        />
      </div>

      {/* ── Dropdown ── */}
      {openProfile && (
        <div
          className="profile-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            minWidth: "320px",
            maxWidth: "360px",
            background: theme.glass,
            backdropFilter: "blur(30px)",
            borderRadius: "24px",
            border: `1px solid ${theme.border}`,
            overflow: "hidden",
            zIndex: 1000,
            boxShadow: theme.shadow,
          }}
        >
          {/* User header */}
          <div
            style={{
              padding: "28px 24px 24px",
              background: theme.gradient,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `3px solid ${theme.accent}`,
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
                  boxShadow: `0 8px 32px rgba(14, 165, 233, ${darkMode ? "0.3" : "0.4"})`,
                  flexShrink: 0,
                }}
              >
                <img
                  src={avatarSrc}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.src = profileImg; }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    color: theme.textPrimary,
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: "1.3",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userSnapshot?.name || "User"}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#10b981",
                      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: theme.textSecondary, fontWeight: 500 }}>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "4px 0" }}>
            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                onClick={() => setOpenProfile(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 24px",
                  textDecoration: "none",
                  color: theme.textPrimary,
                  fontWeight: 500,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderBottom: i < menuItems.length - 1 ? `1px solid ${theme.border}` : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background   = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.paddingLeft  = "28px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background   = "transparent";
                  e.currentTarget.style.paddingLeft  = "24px";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: `rgba(125, 211, 252, ${darkMode ? "0.2" : "0.15"})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "20px 24px",
              border: "none",
              background: "transparent",
              color: theme.danger,
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "16px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              borderTop: `1px solid ${theme.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.paddingLeft = "28px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = "transparent";
              e.currentTarget.style.paddingLeft = "24px";
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LogOut size={20} />
            </div>
            Logout
          </button>
        </div>
      )}

      {/* ── Confirm logout modal ── */}
      {confirmLogout && (
        <div
          onClick={confirmNo}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.glass,
              backdropFilter: "blur(30px)",
              padding: "36px",
              borderRadius: "28px",
              width: "min(90vw, 420px)",
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${theme.danger}, #dc2626)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)",
              }}
            >
              <LogOut size={32} color="#fff" />
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                fontSize: "24px",
                fontWeight: 700,
                color: theme.textPrimary,
                textAlign: "center",
              }}
            >
              Confirm Logout
            </h3>

            <p
              style={{
                margin: "0 0 32px",
                color: theme.textSecondary,
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              Are you sure you want to log out? You'll need to sign in again.
            </p>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={confirmNo}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  borderRadius: "16px",
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.textPrimary,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "15px",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background  = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform   = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = "transparent";
                  e.currentTarget.style.transform   = "translateY(0)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmYes}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  borderRadius: "16px",
                  border: "none",
                  background: `linear-gradient(135deg, ${theme.danger}, #dc2626)`,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "15px",
                  boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform  = "translateY(-2px)";
                  e.currentTarget.style.boxShadow  = "0 12px 35px rgba(239, 68, 68, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform  = "translateY(0)";
                  e.currentTarget.style.boxShadow  = "0 8px 25px rgba(239, 68, 68, 0.4)";
                }}
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;