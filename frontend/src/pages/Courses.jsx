import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  PlusCircle, 
  Trash2, 
  BookOpen, 
  Edit3, 
  ChevronLeft, 
  Loader2, 
  AlertTriangle,
  Search,
  CheckCircle2
} from "lucide-react";
import api from "../api/api";

// Utility function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
};

const Courses = ({ darkMode }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(255, 255, 255, 0.98)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    border: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
    shadow: darkMode ? "0 25px 70px rgba(0,0,0,0.6)" : "0 20px 60px rgba(0,0,0,0.14)",
    cardShadow: darkMode ? "0 20px 50px rgba(0,0,0,0.4)" : "0 16px 45px rgba(0,0,0,0.12)",
  };

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  // Success message from navigation
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  }, [location.state]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      // You can add toast notification here
    } finally {
      setLoading(false);
    }
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(course => course.id !== id));
      setFilteredCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const isDeleting = (id) => deletingId === id;

  if (loading) {
    return <LoadingState theme={theme} darkMode={darkMode} />;
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 767px) {
          .courses-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        padding: "100px 20px 60px",
        background: `linear-gradient(135deg, ${theme.bg} 0%, ${darkMode ? '#0f0f23' : '#f1f5f9'} 100%)`,
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px",
        }}>
        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div style={{
            background: `linear-gradient(135deg, ${theme.success}22 0%, ${theme.success}44 100%)`,
            border: `1px solid ${theme.success}40`,
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "32px",
            color: theme.success,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backdropFilter: "blur(20px)",
            animation: "slideDown 0.3s ease",
          }}>
            <CheckCircle2 size={20} />
            {successMessage}
          </div>
        )}

        {/* HEADER */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginBottom: "48px",
          paddingBottom: "32px",
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{ flex: 1 }}>
            <h1 className="text-primary" style={{
              margin: 0,
              fontSize: "3.25rem",
              fontWeight: 900,
              lineHeight: "1.1",
            }}>
              Courses
            </h1>
            <p style={{
              margin: "20px 0 0",
              fontSize: "18px",
              color: theme.textSecondary,
              lineHeight: "1.7",
              maxWidth: "600px",
            }}>
              Manage and organize your courses effectively.
            </p>
          </div>

          {/* CONTROLS */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            {/* SEARCH */}
            <div style={{ flex: 1, maxWidth: "500px" }}>
              <div style={{
                position: "relative",
                background: theme.glass,
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                padding: "4px",
                backdropFilter: "blur(20px)",
              }}>
                <Search size={20} style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textSecondary,
                  zIndex: 2,
                }} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "18px 20px 18px 56px",
                    background: "transparent",
                    border: "none",
                    color: theme.textPrimary,
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() => navigate("/add-course")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                padding: "22px 40px",
                borderRadius: "28px",
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 16px 45px ${darkMode ? "rgba(125,211,252,0.4)" : "rgba(14,165,233,0.4)"}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(20px)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = `0 24px 60px ${darkMode ? "rgba(125,211,252,0.5)" : "rgba(14,165,233,0.5)"}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 16px 45px ${darkMode ? "rgba(125,211,252,0.4)" : "rgba(14,165,233,0.4)"}`;
              }}
            >
              <PlusCircle size={22} />
              Add Course
            </button>
          </div>
        </div>

        {/* COURSES GRID */}
        <div 
          className="courses-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "32px",
          }}
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                darkMode={darkMode}
                theme={theme}
                onDelete={handleDelete}
                isDeleting={isDeleting(course.id)}
                onEdit={() => navigate(`/edit-course/${course.id}`)}
                onView={() => navigate(`/course/${course.id}`)}
              />
            ))
          ) : (
            <EmptyState 
              searchQuery={searchQuery} 
              theme={theme} 
              onAdd={() => navigate("/add-course")}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

// ENHANCED COURSE CARD
const CourseCard = ({ course, darkMode, theme, onDelete, onEdit, onView, isDeleting }) => {
  return (
    <div 
      style={{
        padding: "40px",
        background: theme.glass,
        backdropFilter: "blur(30px)",
        borderRadius: "36px",
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
        e.currentTarget.style.boxShadow = darkMode 
          ? "0 40px 100px rgba(0,0,0,0.7)" 
          : "0 35px 90px rgba(0,0,0,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = theme.cardShadow;
      }}
      onClick={onView}
    >
      {/* Gradient overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentHover})`,
      }} />

      {/* CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "32px",
        }}>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: "13px",
              fontWeight: 700,
              color: theme.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 20px",
              background: `rgba(125, 211, 252, 0.2)`,
              borderRadius: "24px",
              border: `1px solid ${theme.accent}30`,
              backdropFilter: "blur(12px)",
            }}>
              {course.subject?.name || "No Subject"}
            </span>
            <h2 style={{
              margin: "20px 0 0",
              fontSize: "32px",
              fontWeight: 900,
              lineHeight: "1.2",
              color: theme.textPrimary,
              letterSpacing: "-0.02em",
              wordBreak: "break-word",
            }}>
              {course.title}
            </h2>
            {course.subject?.name && (
              <p style={{
                margin: "8px 0 0",
                fontSize: "14px",
                color: theme.textSecondary,
                fontWeight: 500,
              }}>
                Subject: <span style={{ color: theme.accent, fontWeight: 600 }}>{course.subject.name}</span>
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div style={{
            display: "flex",
            gap: "12px",
            minWidth: "fit-content",
          }}>
            <ActionButton
              icon={Edit3}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              tooltip="Edit Course"
              color={theme.accent}
              theme={theme}
            />
            <ActionButton
              icon={Trash2}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course.id);
              }}
              disabled={isDeleting}
              loading={isDeleting}
              tooltip="Delete Course"
              color={theme.danger}
              theme={theme}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <p style={{
          fontSize: "17px",
          color: theme.textSecondary,
          lineHeight: "1.7",
          marginBottom: "40px",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {course.description || "No description available."}
        </p>

        {/* STATS */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
          marginTop: "auto",
        }}>
          <CourseStat label="Lessons" value={course.lesson_count ?? 0} theme={theme} />
          <CourseStat label="Progress" value={`${course.progress ?? 0}%`} theme={theme} />
          <StatusBadge active={course.is_active ?? true} theme={theme} />
        </div>
      </div>
    </div>
  );
};

// REUSABLE COMPONENTS
const ActionButton = ({ icon: Icon, onClick, disabled, loading, tooltip, color, theme }) => (
  <div style={{ position: "relative" }}>
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: 56,
        height: 56,
        borderRadius: "20px",
        background: disabled || loading 
          ? "rgba(0,0,0,0.1)" 
          : `rgba(${hexToRgb(color)}, 0.15)`,
        border: `1px solid ${color}30`,
        color: disabled || loading ? theme.textSecondary : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: (disabled || loading) ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        backdropFilter: "blur(16px)",
        opacity: (disabled || loading) ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.background = `rgba(${hexToRgb(color)}, 0.25)`;
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = `0 12px 30px rgba(${hexToRgb(color)}, 0.3)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.background = `rgba(${hexToRgb(color)}, 0.15)`;
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "none";
        }
      }}
      title={tooltip}
    >
      {loading ? (
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        <Icon size={20} />
      )}
    </button>
  </div>
);

const CourseStat = ({ label, value, theme }) => (
  <div style={{
    padding: "12px 24px",
    borderRadius: "28px",
    background: theme.glass,
    border: `1px solid ${theme.border}`,
    color: theme.textPrimary,
    fontSize: "15px",
    fontWeight: 600,
    backdropFilter: "blur(16px)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}>
    <span style={{ 
      fontSize: "18px", 
      fontWeight: 800,
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {value}
    </span>
    <span style={{ opacity: 0.8 }}>{label}</span>
  </div>
);

const StatusBadge = ({ active, theme }) => {
  const statusColor = active ? theme.success : theme.danger;
  return (
    <div style={{
      padding: "12px 24px",
      borderRadius: "28px",
      background: `rgba(${hexToRgb(statusColor)}, ${active ? '0.18' : '0.14'})`,
      border: `1px solid ${statusColor}30`,
      color: statusColor,
      fontSize: "15px",
      fontWeight: 700,
      backdropFilter: "blur(16px)",
    }}>
      {active ? "Active" : "Inactive"}
    </div>
  );
};

const EmptyState = ({ searchQuery, theme, onAdd }) => (
  <div style={{
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 20px",
    background: theme.glass,
    border: `1px solid ${theme.border}`,
    borderRadius: "24px",
    color: theme.textSecondary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    backdropFilter: "blur(20px)",
  }}>
    <AlertTriangle size={48} />
    <div style={{ fontSize: "18px", fontWeight: 600 }}>
      {searchQuery ? "No courses found for your search." : "No courses available."}
    </div>
    <button
      onClick={onAdd}
      style={{
        padding: "12px 24px",
        borderRadius: "28px",
        background: theme.glass,
        border: `1px solid ${theme.border}`,
        color: theme.textPrimary,
        fontSize: "15px",
        fontWeight: 600,
        backdropFilter: "blur(16px)",
      }}
    >
      Create Your First Course
    </button>
  </div>
);

const LoadingState = ({ theme, darkMode }) => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, ${theme.bg} 0%, ${darkMode ? '#0f0f23' : '#f1f5f9'} 100%)`,
  }}>
    <div style={{
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    }}>
      <Loader2 size={48} style={{ animation: "spin 1s linear infinite", color: theme.accent }} />
      <p style={{ color: theme.textSecondary, fontSize: "16px" }}>Loading courses...</p>
    </div>
  </div>
);

export default Courses;