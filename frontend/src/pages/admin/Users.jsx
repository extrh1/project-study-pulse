import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiArrowLeft,
  FiArrowRight,
  FiUsers
} from "react-icons/fi";

export default function Users({ darkMode }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // FETCH USERS (fixed params issue)
  const fetchUsers = async (pageToUse = page, searchToUse = search) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/admin/users?search=${searchToUse}&page=${pageToUse}`
      );

      setUsers(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error("Users load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // LOAD ON PAGE CHANGE
  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  // SEARCH
  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, search);
  };

  const handleReset = () => {
    setSearch("");
    setPage(1);
    fetchUsers(1, "");
  };

  // TOGGLE STATUS (optimistic update)
  const toggleStatus = async (id) => {
    try {
      // optimistic UI update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: !u.is_active } : u
        )
      );

      await api.patch(`/admin/users/${id}/toggle-status`);
    } catch (err) {
      console.error(err);
      fetchUsers(page, search); // fallback
    }
  };

  // COLORS
  const colors = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#f1f5f9" : "#1e293b",
    subText: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    primary: "#3b82f6",
    danger: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  };

  return (
    <div style={{ ...styles.container, background: colors.bg, color: colors.text }}>
      <style>{`
        * { font-family: 'Inter', sans-serif; }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        input::placeholder { color: ${colors.subText}; }
      `}</style>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={{ ...styles.iconBox, background: darkMode ? "rgba(59,130,246,0.2)" : "#dbeafe" }}>
            <FiUsers size={24} />
          </div>
          <div>
            <h1 style={styles.title}>Users Management</h1>
            <p style={{ color: colors.subText, fontSize: 14 }}>
              Manage user access and roles
            </p>
          </div>
        </div>

        <button onClick={() => fetchUsers(page, search)} style={styles.refreshBtn}>
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ ...styles.toolbar, background: colors.card, borderColor: colors.border }}>
        <div style={styles.searchWrapper}>
          <FiSearch color={colors.subText} />
          <input
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ ...styles.input, color: colors.text }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
          <button onClick={handleReset} style={{ ...styles.searchBtn, background: colors.danger }}>
            Reset
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ ...styles.tableCard, background: colors.card, borderColor: colors.border }}>
        {loading ? (
          <div style={styles.loadingState}>Loading...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>{user.role}</td>

                    <td style={{ color: user.is_active ? colors.success : colors.danger }}>
                      {user.is_active ? "Active" : "Disabled"}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        style={{
                          ...styles.toggleBtn,
                          background: user.is_active ? "#fee2e2" : "#dcfce7",
                          color: user.is_active ? colors.danger : colors.success
                        }}
                      >
                        {user.is_active ? <FiUserX /> : <FiUserCheck />}
                        {user.is_active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 30 }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <FiArrowLeft /> Prev
        </button>

        <span>
          Page {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
        >
          Next <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: { padding: 24, minHeight: "100vh" },

  header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },

  headerLeft: { display: "flex", gap: 12, alignItems: "center" },

  iconBox: { width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },

  title: { fontSize: 22, fontWeight: "bold", margin: 0 },

  refreshBtn: { padding: "8px 14px", borderRadius: 8, cursor: "pointer" },

  toolbar: { display: "flex", justifyContent: "space-between", padding: 12, borderRadius: 10, marginBottom: 15 },

  searchWrapper: { display: "flex", alignItems: "center", gap: 10 },

  input: { border: "none", outline: "none", background: "transparent" },

  searchBtn: { padding: "8px 14px", borderRadius: 8, background: "#3b82f6", color: "white", border: "none", cursor: "pointer" },

  tableCard: { borderRadius: 12, padding: 10, border: "1px solid #ccc" },

  table: { width: "100%", borderCollapse: "collapse" },

  toggleBtn: { display: "flex", gap: 6, alignItems: "center", padding: "6px 10px", border: "none", borderRadius: 6, cursor: "pointer" },

  loadingState: { padding: 40, textAlign: "center" },

  pagination: { display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }
};