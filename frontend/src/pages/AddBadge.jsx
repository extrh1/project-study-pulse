import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/api";

const AddBadge = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "🏅",
    required_xp: 0,
    required_lessons: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#fbbf24" : "#f59e0b",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    input: darkMode ? "#1a1a2e" : "#ffffff",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("required") ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/badges", formData);
      navigate("/badges");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating badge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "80px 20px 40px",
        background: theme.bg,
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/badges")}
          style={{
            background: "transparent",
            border: "none",
            color: theme.accent,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={18} />
          Back to Badges
        </button>

        <h1
          style={{
            fontSize: "44px",
            fontWeight: 800,
            color: theme.textPrimary,
            marginBottom: "32px",
          }}
        >
          Create New Badge
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            background: theme.glass,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <label
              style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}
            >
              Badge Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Quick Learner"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.textPrimary,
                fontSize: "15px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div>
            <label style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Badge description..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.textPrimary,
                fontSize: "15px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}>
              Icon Emoji
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              maxLength="2"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.input,
                color: theme.textPrimary,
                fontSize: "24px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Required XP
              </label>
              <input
                type="number"
                name="required_xp"
                value={formData.required_xp}
                onChange={handleChange}
                min="0"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  background: theme.input,
                  color: theme.textPrimary,
                  fontSize: "15px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Required Lessons
              </label>
              <input
                type="number"
                name="required_lessons"
                value={formData.required_lessons}
                onChange={handleChange}
                min="0"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  background: theme.input,
                  color: theme.textPrimary,
                  fontSize: "15px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 28px",
              background: `linear-gradient(135deg, ${theme.accent}, #fbbf24)`,
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
            }}
          >
            {loading ? "Creating..." : "Create Badge"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBadge;
