import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";
import api from "../api/api";

export default function EditProfile({ darkMode }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    avatar: null,
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const theme = {
    bg:            darkMode ? "#0a0a0f"                    : "#f8fafc",
    glass:         darkMode ? "rgba(26, 26, 46, 0.92)"    : "rgba(248, 250, 252, 0.92)",
    textPrimary:   darkMode ? "#f8fafc"                   : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa"                   : "#64748b",
    accent:        darkMode ? "#7dd3fc"                   : "#0ea5e9",
    border:        darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    input:         darkMode ? "#1a1a2e"                   : "#ffffff",
    error:         "#f87171",
    danger:        "#ef4444",
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res      = await api.get("/profile");
      const userData = res.data.user || res.data;

      setUser({
        name:     userData.name     || "",
        email:    userData.email    || "",
        username: userData.username || "",
        phone:    userData.phone    || "",
        avatar:   null,
      });

      // Always use avatar_url (full URL returned by the backend)
      setAvatarPreview(userData.avatar_url || null);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null); // clear error on any change
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setUser((prev) => ({ ...prev, avatar: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = async () => {
    if (!avatarPreview) return;
    setDeleting(true);
    setError(null);
    try {
      await api.delete("/profile/avatar");
      setAvatarPreview(null);
      setUser((prev) => ({ ...prev, avatar: null }));

      // Sync localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.avatar     = null;
      stored.avatar_url = null;
      localStorage.setItem("user", JSON.stringify(stored));
    } catch (err) {
      console.error("Error deleting avatar:", err);
      setError(err.response?.data?.message || "Failed to delete avatar.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1. Update text fields
      await api.put("/profile", {
        name:     user.name,
        email:    user.email,
        username: user.username,
        phone:    user.phone,
      });

      // 2. Upload avatar if a new file was selected
      if (user.avatar instanceof File) {
        const formData = new FormData();
        formData.append("avatar", user.avatar);
        await api.post("/profile/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 3. Refresh and persist updated user (with avatar_url) to localStorage
      const refreshed    = await api.get("/profile");
      const updatedUser  = refreshed.data.user || refreshed.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("user-updated"));
      // Ensure ProfileMenu reads the latest avatar_url from localStorage
      window.dispatchEvent(new Event("avatar-updated"));
      navigate(-1); // go back to wherever the user came from
    } catch (err) {

      console.error("Error saving profile:", err);
      setError(err.response?.data?.message || "Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "80px 20px 40px",
          background: theme.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: theme.textSecondary }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "80px 20px 40px", background: theme.bg }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <button
          onClick={() => navigate(-1)}
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
          Back
        </button>

        <h1
          className="text-primary"
          style={{ margin: "0 0 28px", fontSize: "3.25rem", fontWeight: 900, lineHeight: "1.1" }}
        >
          Edit Profile
        </h1>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(248, 113, 113, 0.1)",
              border: "1px solid rgba(248, 113, 113, 0.3)",
              color: theme.error,
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSave}
          style={{
            background: theme.glass,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "32px",
          }}
        >
          {/* ── Avatar Section ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <label
              style={{
                position: "relative",
                width: "160px",
                height: "160px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  background: darkMode
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(14, 165, 233, 0.15)",
                  border: `2px solid ${theme.accent}`,
                  backgroundImage: avatarPreview ? `url(${avatarPreview})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {!avatarPreview && (
                  <Camera size={48} style={{ color: theme.accent, opacity: 0.5 }} />
                )}
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: theme.accent,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  border: `3px solid ${theme.bg}`,
                }}
              >
                <Camera size={18} />
              </div>
            </label>

            <p style={{ color: theme.textSecondary, fontSize: "13px", textAlign: "center", margin: 0 }}>
              Click to upload an avatar
              <br />
              Maximum size: 2 MB
            </p>

            {/* Delete avatar button — only shown when an avatar exists */}
            {avatarPreview && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={deleting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: `1px solid rgba(239, 68, 68, 0.4)`,
                  background: "rgba(239, 68, 68, 0.08)",
                  color: theme.danger,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              >
                <Trash2 size={14} />
                {deleting ? "Removing…" : "Remove avatar"}
              </button>
            )}
          </div>

          {/* ── Form Fields ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "Name",     name: "name",     type: "text",  required: true  },
              { label: "Email",    name: "email",    type: "email", required: true  },
              { label: "Username", name: "username", type: "text",  required: false },
              { label: "Phone",    name: "phone",    type: "tel",   required: false },
            ].map(({ label, name, type, required }) => (
              <div key={name}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: theme.textPrimary,
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={user[name]}
                  onChange={handleChange}
                  required={required}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.input,
                    color: theme.textPrimary,
                    fontSize: "15px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: `${theme.accent}20`,
                  color: theme.accent,
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${theme.accent}30`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${theme.accent}20`; }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: `linear-gradient(135deg, ${theme.accent}, #0284c7)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}