import { Bell, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/api";

// How often to poll (ms). 30 s is plenty — 3 s was hammering the server.
const POLL_INTERVAL = 30_000;

const Notification = ({ darkMode }) => {
  const [open, setOpen]                     = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [authError, setAuthError]           = useState(false); // stops polling on 401/403
  const intervalRef                         = useRef(null);

  const loadNotifications = useCallback(async () => {
    // Don't retry if we already know the user isn't logged in
    if (authError) return;

    try {
      const res = await api.get("/notifications");
      // API can return { data: [...] } or just [...]
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      setNotifications(list);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        // Not logged in — stop polling, clear list silently
        setAuthError(true);
        setNotifications([]);
        clearInterval(intervalRef.current);
      }
      // For 404 / network errors we just silently skip — no console spam
    }
  }, [authError]);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Polling — only while authenticated
  useEffect(() => {
    if (authError) return;

    intervalRef.current = setInterval(loadNotifications, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [loadNotifications, authError]);

  // Reset auth error when component re-mounts (e.g. after login)
  useEffect(() => {
    return () => { setAuthError(false); };
  }, []);

  const dismissNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silent
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* ── Styles ── */
  const badgeStyle = {
    position: "absolute",
    top: -6, right: -6,
    minWidth: 18, height: 18,
    borderRadius: "9999px",
    backgroundColor: "#ef4444",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    padding: "0 6px",
    boxShadow: "0 0 0 2px rgba(15, 23, 42, 0.9)",
  };

  const dropdownStyle = {
    position: "absolute",
    top: 40, right: 0,
    width: 320,
    maxHeight: 340,
    overflowY: "auto",
    borderRadius: 24,
    padding: 12,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.25)",
    backgroundColor: darkMode ? "rgba(15, 23, 42, 0.95)" : "white",
    border: darkMode
      ? "1px solid rgba(148, 163, 184, 0.16)"
      : "1px solid rgba(148, 163, 184, 0.24)",
    zIndex: 50,
  };

  const noteStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 18,
    backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.03)",
    color: darkMode ? "#f8fafc" : "#0f172a",
    marginBottom: 10,
    border: darkMode
      ? "1px solid rgba(148,163,184,0.12)"
      : "1px solid rgba(148,163,184,0.18)",
  };

  return (
    <div className="notif-wrapper" style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: darkMode ? "white" : "#0f172a",
          position: "relative",
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={dropdownStyle}>
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div key={note.id} style={noteStyle}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{note.title}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>{note.message}</div>
                </div>
                <button
                  onClick={() => dismissNotification(note.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ ...noteStyle, justifyContent: "center" }}>
              No notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;