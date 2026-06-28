import { FiBell, FiX, FiCheck, FiAward, FiBookOpen, FiInfo } from "react-icons/fi";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/api";

const POLL_INTERVAL = 30000;
const MAX_NOTIFICATIONS = 50;

// Configuration objects are cleaner than multiple conditionals
const NOTIFICATION_TYPES = {
  badge: { icon: FiAward, color: "#f59e0b", bgOpacity: "20" },
  course: { icon: FiBookOpen, color: "#10b981", bgOpacity: "20" },
  default: { icon: FiInfo, color: "#6366f1", bgOpacity: "20" }
};

const getNotificationConfig = (type) => 
  NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.default;

const NotificationIcon = ({ type }) => {
  const config = getNotificationConfig(type);
  const Icon = config.icon;
  return <Icon size={14} color={config.color} />;
};

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <span className="notification-badge">
      {count > 99 ? "99+" : count}
    </span>
  );
};

const TimeAgo = ({ date }) => {
  if (!date) return null;
  
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    { seconds: 60, label: "s" },
    { seconds: 3600, label: "m" },
    { seconds: 86400, label: "h" },
    { seconds: Infinity, label: "d" }
  ];
  
  for (const interval of intervals) {
    if (diff < interval.seconds) {
      const value = Math.floor(diff / (interval.seconds / 60));
      return `${value}${interval.label} ago`;
    }
  }
  
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationItem = ({ notification, onMarkRead, onRemove, darkMode }) => {
  const config = getNotificationConfig(notification.type);
  const isUnread = !notification.is_read;
  
  return (
    <div 
      className={`notification-item ${isUnread ? 'unread' : ''}`}
      onClick={() => isUnread && onMarkRead(notification.id)}
      style={{
        background: isUnread 
          ? darkMode 
            ? "rgba(99,102,241,0.1)" 
            : "rgba(99,102,241,0.05)"
          : "transparent"
      }}
    >
      <div className="notification-icon-wrapper" style={{ background: `${config.color}20` }}>
        <NotificationIcon type={notification.type} />
      </div>
      
      <div className="notification-content">
        <div className="notification-title" style={{ fontWeight: isUnread ? 600 : 400 }}>
          {notification.title}
        </div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-time"><TimeAgo date={notification.created_at} /></div>
      </div>
      
      <button 
        onClick={(e) => onRemove(e, notification.id)}
        className="notification-dismiss"
      >
        <FiX size={14} />
      </button>
    </div>
  );
};

export default function Notification({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef();
  const buttonRef = useRef();

  const fetchNotifications = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await api.get("/notifications");
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      setNotifications(data.slice(0, MAX_NOTIFICATIONS));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // Assuming there's an endpoint for marking all as read
      // If not, you'd need to iterate over unread notifications
      await api.patch("/notifications/read-all");
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  const removeNotification = useCallback(async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to remove notification:", error);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll for notifications
  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="notification-toggle"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <FiBell size={19} />
        <NotificationBadge count={unreadCount} />
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span className="notification-title-text">Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="notification-mark-all"
                aria-label="Mark all as read"
              >
                <FiCheck size={15} />
              </button>
            )}
          </div>

          <div className="notification-list">
            {isLoading && notifications.length === 0 ? (
              <div className="notification-loading">
                <div className="spinner" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <FiInfo size={32} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={markAsRead}
                  onRemove={removeNotification}
                  darkMode={darkMode}
                />
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-container {
          position: relative;
        }
        
        .notification-toggle {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          position: relative;
          color: ${darkMode ? "#94a3b8" : "#64748b"};
          transition: color 0.2s;
        }
        
        .notification-toggle:hover {
          color: ${darkMode ? "#f1f5f9" : "#334155"};
        }
        
        .notification-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          border-radius: 10px;
          padding: 2px 5px;
          min-width: 18px;
          text-align: center;
          font-weight: 600;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .notification-dropdown {
          position: absolute;
          right: 0;
          top: 45px;
          width: 340px;
          max-height: 400px;
          background: ${darkMode ? "#1e293b" : "white"};
          border: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          z-index: 100;
          animation: slideDown 0.2s ease-out;
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
        
        .notification-header {
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
        }
        
        .notification-title-text {
          font-size: 14px;
          font-weight: 600;
          color: ${darkMode ? "white" : "#1e293b"};
        }
        
        .notification-mark-all {
          border: none;
          background: none;
          cursor: pointer;
          color: #6366f1;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .notification-mark-all:hover {
          background: rgba(99, 102, 241, 0.1);
        }
        
        .notification-list {
          max-height: 350px;
          overflow-y: auto;
        }
        
        .notification-list::-webkit-scrollbar {
          width: 4px;
        }
        
        .notification-list::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .notification-list::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#334155" : "#cbd5e1"};
          border-radius: 2px;
        }
        
        .notification-item {
          display: flex;
          gap: 10px;
          padding: 10px 14px;
          border-bottom: 1px solid ${darkMode ? "#334155" : "#e2e8f0"};
          cursor: pointer;
          transition: background 0.15s;
          align-items: flex-start;
        }
        
        .notification-item:hover {
          background: ${darkMode ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.03)"};
        }
        
        .notification-icon-wrapper {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
          min-width: 0;
        }
        
        .notification-title {
          font-size: 13px;
          color: ${darkMode ? "#f1f5f9" : "#1e293b"};
          margin-bottom: 2px;
        }
        
        .notification-message {
          font-size: 12px;
          color: ${darkMode ? "#94a3b8" : "#64748b"};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        
        .notification-time {
          font-size: 10px;
          color: #94a3b8;
        }
        
        .notification-dismiss {
          border: none;
          background: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 2px;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        
        .notification-dismiss:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .notification-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #94a3b8;
        }
        
        .notification-empty svg {
          opacity: 0.3;
          margin-bottom: 12px;
        }
        
        .notification-empty p {
          font-size: 13px;
          margin: 0;
        }
        
        .notification-loading {
          display: flex;
          justify-content: center;
          padding: 40px 20px;
        }
        
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid ${darkMode ? "#334155" : "#e2e8f0"};
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
          .notification-dropdown {
            width: 300px;
            right: -60px;
          }
        }
      `}</style>
    </div>
  );
}