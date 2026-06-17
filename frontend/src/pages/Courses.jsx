import React, { useEffect, useState, useCallback } from "react";
import { 
  Loader2,
  AlertTriangle,
  Search,
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
  const [searchQuery, setSearchQuery] = useState("");

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(255, 255, 255, 0.98)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    success: "#10b981",
    danger: "#ef4444",
    border: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
    cardShadow: darkMode ? "0 20px 50px rgba(0,0,0,0.4)" : "0 16px 45px rgba(0,0,0,0.12)",
  };

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

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
                Organize your courses effectively.
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
              />
            ))
          ) : (
            <EmptyState 
              searchQuery={searchQuery} 
              theme={theme} 
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

// ENHANCED COURSE CARD
const CourseCard = ({ course, darkMode, theme }) => {
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

const EmptyState = ({ searchQuery, theme }) => (
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