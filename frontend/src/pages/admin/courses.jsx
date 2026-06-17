import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiBookOpen,
  FiUsers,
  FiPlay,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiUpload,
  FiGlobe,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AdminCourses({ darkMode }) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filter, setFilter] = useState("all");

  const colors = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "#ffffff",
    cardAlt: darkMode ? "#283548" : "#f1f5f9",
    text: darkMode ? "#f1f5f9" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    primary: "#6366f1",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
  };

    const stats = React.useMemo(() => ({
        totalCourses: courses.length || 0,
        published: courses?.filter(c => c.status === "published").length || 0,
        draft: courses?.filter(c => c.status === "draft").length || 0,
    }), [courses]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchCourses();
    }, 600);

    return () => clearTimeout(timer);
  }, [search, filter, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/admin/courses`, { 
        params: {
            search,
            page,
            status: filter !== "all" ? filter : undefined,
        },
     });

      const data = res.data;

      setCourses(data.data || data.courses || []);
      setLastPage(data.last_page || 1);

    } catch (err) {
      console.error("Fetch courses error:", err);

      setCourses([]);

      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/admin/courses/${id}`);
        fetchCourses();
      } catch (err) {
        console.error("Delete error:", err);
        alert(err.response?.data?.message || "Failed to delete course");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/courses/${id}/toggle`);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return {
          bg: "#10b98115",
          color: "#10b981",
          icon: <FiCheckCircle size={12} />,
        };
      case "draft":
        return {
          bg: "#f59e0b15",
          color: "#f59e0b",
          icon: <FiClock size={12} />,
        };
      default:
        return {
          bg: "#64748b15",
          color: "#64748b",
          icon: null,
        };
    }
  };

  return (
    <div style={styles.container(colors)}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title(colors)}>Courses</h1>
          <p style={styles.subtitle(colors)}>Manage your course content</p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => window.print()}
            style={styles.exportBtn(colors)}
            >
            <FiDownload size={16} /> Print
            </button>

          <button
            onClick={() => navigate("/admin/addCourse")}
            style={styles.addBtn}
          >
            <FiPlus size={16} /> Add Course
          </button>
        </div>
      </header>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<FiBookOpen size={20} />}
          value={stats.totalCourses}
          label="Total Courses"
          color="#6366f1"
          colors={colors}
        />
        <StatCard
          icon={<FiCheckCircle size={20} />}
          value={stats.published}
          label="Published"
          color="#10b981"
          colors={colors}
        />
        <StatCard
          icon={<FiClock size={20} />}
          value={stats.draft}
          label="Drafts"
          color="#f59e0b"
          colors={colors}
        />
      </div>

      {/* TOOLBAR */}
      <div style={styles.toolbar(colors)}>
        <div style={styles.searchBox(colors)}>
          <FiSearch size={18} color={colors.textMuted} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={styles.searchInput(colors)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          style={styles.select(colors)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button onClick={handleSearch} style={styles.searchBtn}>
          Search
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard(colors)}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
          </div>
        ) : courses.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: colors.textMuted }}>
                No courses found.
            </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th style={styles.th(colors)}>Course</th>
                <th style={styles.th(colors)}>Category</th>
                <th style={styles.th(colors)}>Lessons</th>
                <th style={styles.th(colors)}>Status</th>
                <th style={styles.th(colors)}>Created</th>
                <th style={{ ...styles.th(colors), textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => {
                const statusStyle = getStatusStyle(course.status);

                return (
                  <tr
                    key={course.id}
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={styles.courseThumb}>
                          <FiBookOpen size={20} color="#fff" />
                        </div>
                        <div>
                          <p style={styles.courseTitle(colors)}>
                            {course.title}
                          </p>
                          <p style={styles.courseDesc(colors)}>
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td style={{ ...styles.td, color: colors.textMuted }}>
                      {course.category?.name}
                    </td>

                    <td style={styles.td}>{course.lessons_count}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {statusStyle.icon} {course.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td style={{ ...styles.td, color: colors.textMuted }}>
                      {new Date(course.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={styles.actions}>
                        <button 
                            onClick={() => navigate(`/admin/courses/${course.id}`)}
                            style={styles.iconBtn(colors)}>
                          <FiEye />
                        </button>

                        <button
                            onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                            style={styles.iconBtn(colors)}>
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => toggleStatus(course.id)}
                          style={styles.iconBtn(colors)}
                        >
                          {course.status === "published" ? (
                            <FiLock />
                          ) : (
                            <FiGlobe />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(course.id)}
                          style={{
                            ...styles.iconBtn(colors),
                            color: colors.danger,
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div style={styles.pagination(colors)}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={styles.pageBtn(colors)}
        >
          Previous
        </button>

        <span style={{ color: colors.textMuted }}>
          Page {page} of {lastPage}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === lastPage}
          style={styles.pageBtn(colors)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* StatCard unchanged */
function StatCard({ icon, value, label, color, colors }) {
  return (
    <div style={styles.statCard(colors)}>
      <div style={{ ...styles.statIcon, background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <p style={styles.statValue(colors)}>{value}</p>
        <p style={styles.statLabel(colors)}>{label}</p>
      </div>
    </div>
  );
}
const styles = {
  container: (colors) => ({
    padding: "1.5rem",
    background: colors.bg,
    minHeight: "100vh",
  }),

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
  },

  title: (colors) => ({
    fontSize: "1.75rem",
    fontWeight: 700,
    margin: 0,
    color: colors.text,
  }),

  subtitle: (colors) => ({
    fontSize: "0.9rem",
    marginTop: "0.35rem",
    color: colors.textMuted,
  }),

  headerActions: {
    display: "flex",
    gap: "0.75rem",
  },

  exportBtn: (colors) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 1rem",
    borderRadius: 10,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    cursor: "pointer",
  }),

  uploadBtn: (colors) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 1rem",
    borderRadius: 10,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    cursor: "pointer",
  }),

  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 1rem",
    borderRadius: 10,
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1.25rem",
    marginBottom: "2rem",
  },

  statCard: (colors) => ({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.5rem",
    borderRadius: 16,
    background: colors.card,
    border: `1px solid ${colors.border}`,
  }),

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: (colors) => ({
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: 0,
    color: colors.text,
  }),

  statLabel: (colors) => ({
    fontSize: "0.85rem",
    marginTop: "0.25rem",
    color: colors.textMuted,
  }),

  toolbar: (colors) => ({
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    borderRadius: 12,
    marginBottom: "1.25rem",
    background: colors.card,
    border: `1px solid ${colors.border}`,
    flexWrap: "wrap",
  }),

  searchBox: (colors) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0 1rem",
    height: 42,
    flex: 1,
    maxWidth: 400,
    borderRadius: 10,
    background: colors.cardAlt,
    border: `1px solid ${colors.border}`,
  }),

  searchInput: (colors) => ({
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "0.9rem",
    color: colors.text,
  }),

  select: (colors) => ({
    padding: "0.6rem 1rem",
    borderRadius: 10,
    fontSize: "0.9rem",
    background: colors.cardAlt,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    cursor: "pointer",
  }),

  searchBtn: {
    padding: "0.6rem 1.25rem",
    borderRadius: 10,
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
  },

  tableCard: (colors) => ({
    borderRadius: 16,
    overflow: "hidden",
    background: colors.card,
    border: `1px solid ${colors.border}`,
  }),

  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
  },

  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: (colors) => ({
    padding: "1rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    textAlign: "left",
    color: colors.textMuted,
  }),

  td: {
    padding: "1rem",
    fontSize: "0.9rem",
  },

  courseThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#6366f1",
  },

  courseTitle: (colors) => ({
    margin: 0,
    fontWeight: 600,
    color: colors.text,
  }),

  courseDesc: (colors) => ({
    margin: "0.25rem 0 0",
    fontSize: "0.85rem",
    color: colors.textMuted,
  }),

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
  },

  actions: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },

  iconBtn: (colors) => ({
    padding: 8,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: colors.textMuted,
    cursor: "pointer",
  }),

  pagination: (colors) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
  }),

  pageBtn: (colors) => ({
    padding: "0.5rem 1rem",
    borderRadius: 8,
    background: colors.cardAlt,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    cursor: "pointer",
  }),
};