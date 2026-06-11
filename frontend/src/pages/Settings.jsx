import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Moon, Shield, Star } from "lucide-react";
import api from "../api/api";

export default function Settings({ darkMode = false }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
  });
  const [preferences, setPreferences] = useState({
    notifications: true,
    privacy: "public",
    theme: "light",
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    input: darkMode ? "#1a1a2e" : "#ffffff",
  };

useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileResponse, preferencesResponse] = await Promise.all([
        api.get("/user/profile"),
        api.get("/settings/preferences"),
      ]);

      const userData = profileResponse.data.user || profileResponse.data;
      const preferencesData = preferencesResponse.data?.preferences || {};

      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || "",
        phone: userData.phone || "",
      });

      setPreferences((prev) => ({
        ...prev,
        ...preferencesData,
      }));
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to load profile or settings");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSavePreferences = async () => {
    try {
      const response = await api.put("/settings/preferences", preferences);

      if (response.data.status === "success") {
        setPreferences((prev) => ({
          ...prev,
          ...(response.data.preferences || {}),
        }));
        setStatusMessage("Preferences updated successfully");
        setMessageType("success");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Error saving preferences");
      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        padding: "80px 20px 40px",
        background: theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ color: theme.textSecondary }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "80px 20px 40px", background: theme.bg }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <p style={{ color: theme.textSecondary, fontSize: "13px", margin: "0 0 8px", textTransform: "uppercase", fontWeight: 600 }}>Settings</p>
            <h1 style={{
              fontSize: "44px",
              fontWeight: 800,
              color: theme.textPrimary,
              margin: 0,
              backgroundImage: `linear-gradient(135deg, ${theme.textPrimary} 0%, ${theme.accent} 70%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Account Settings
            </h1>
          </div>
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "transparent",
              border: "none",
              color: theme.accent,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {statusMessage && (
          <div style={{ background: messageType === "error" ? (darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.1)") : (darkMode ? "rgba(139, 92, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"), border: `1px solid ${messageType === "error" ? (darkMode ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.3)") : (darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(59, 130, 246, 0.3)")}`, borderRadius: "8px", padding: "16px", marginBottom: "24px", color: messageType === "error" ? "#ef4444" : theme.accent }}>
            {statusMessage}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", marginBottom: "32px" }}>
          {/* Account Section */}
          <div style={{ background: theme.glass, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: darkMode ? "rgba(125, 211, 252, 0.2)" : "rgba(14, 165, 233, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent }}>
                <Shield size={24} />
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "12px", color: theme.textSecondary, fontWeight: 600, textTransform: "uppercase" }}>Account</p>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: theme.textPrimary }}>Profile</h3>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p>Name: {profile.name || "Not set"}</p>
                <p>Email: {profile.email || "Not set"}</p>
                <p>Username: {profile.username || "Not set"}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(14, 165, 233, 0.08)", borderRadius: "12px", padding: "16px", marginTop: "12px" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "12px", color: theme.textSecondary, fontWeight: 600 }}>Plan</p>
                  <p style={{ margin: 0, color: theme.accent, fontSize: "14px", fontWeight: 700 }}>Pro</p>
                </div>
                <Star size={20} style={{ color: theme.accent }} />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <div style={{ background: theme.glass, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                  <h4 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700, color: theme.textPrimary }}>Preferences</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: theme.textSecondary }}>Notifications</p>
                </div>
                <span style={{ background: darkMode ? "rgba(125, 211, 252, 0.2)" : "rgba(14, 165, 233, 0.15)", color: theme.accent, padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>Preview</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: theme.textPrimary }}>
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={() => handleToggle("notifications")}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>Enable Notifications</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>Privacy</label>
                  <select
                    name="privacy"
                    value={preferences.privacy}
                    onChange={handlePreferenceChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${theme.border}`,
                      background: theme.input,
                      color: theme.textPrimary,
                      fontSize: "14px",
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends</option>
                  </select>
                </div>


                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>Theme</label>
                  <select
                    name="theme"
                    value={preferences.theme}
                    onChange={handlePreferenceChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${theme.border}`,
                      background: theme.input,
                      color: theme.textPrimary,
                      fontSize: "14px",
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
                <button
                  onClick={handleSavePreferences}
                  style={{
                    background: theme.accent,
                    color: "#000",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Security Section */}
            <div style={{ background: theme.glass, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700, color: theme.textPrimary }}>Security</h4>
              <p style={{ margin: "0 0 24px", fontSize: "13px", color: theme.textSecondary }}>Manage your account security settings</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <SecurityCard title="Password" subtitle="Update your password" icon={<Lock size={20} />} theme={theme} />
                <SecurityCard title="Two-Factor Authentication" subtitle="Manage two-factor authentication" icon={<Moon size={20} />} theme={theme} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SecurityCard = ({ title, subtitle, icon, theme }) => (
  <div style={{ background: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", padding: "16px", border: `1px solid ${theme.border}` }}>
    <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <h6 style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 700, color: theme.textPrimary }}>{title}</h6>
        <p style={{ margin: 0, fontSize: "12px", color: theme.textSecondary }}>{subtitle}</p>
      </div>
    </div>
    <button style={{ background: "transparent", border: `1px solid ${theme.accent}`, color: theme.accent, padding: "8px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
      Manage
    </button>
  </div>
);