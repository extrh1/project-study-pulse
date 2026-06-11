import { useEffect, useState } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

const Toast = ({ message, type = "success", duration = 4000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "rgba(16, 185, 129, 0.1)",
    error: "rgba(239, 68, 68, 0.1)",
    warning: "rgba(245, 158, 11, 0.1)",
    info: "rgba(59, 130, 246, 0.1)",
  }[type];

  const borderColor = {
    success: "rgba(16, 185, 129, 0.3)",
    error: "rgba(239, 68, 68, 0.3)",
    warning: "rgba(245, 158, 11, 0.3)",
    info: "rgba(59, 130, 246, 0.3)",
  }[type];

  const textColor = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  }[type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "300px",
        zIndex: 9999,
        animation: isClosing ? "slideOut 0.3s ease-out forwards" : "slideIn 0.3s ease-out forwards",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `}</style>
      
      <Icon size={20} style={{ color: textColor, flexShrink: 0 }} />
      <span style={{ color: textColor, fontSize: "14px", fontWeight: 500 }}>
        {message}
      </span>
      <button
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: textColor,
          cursor: "pointer",
          padding: "4px",
          marginLeft: "auto",
          flexShrink: 0,
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
