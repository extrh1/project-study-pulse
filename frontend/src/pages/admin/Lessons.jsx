import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, BookOpen, Edit3, MessageCircle, X, Search, Filter, ChevronDown } from "lucide-react";
import api from "../../api/api";
import StudyAssistant from "../../components/StudyAssistant";

const AdminLessons = ({ darkMode }) => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedLessonForChat, setSelectedLessonForChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    cardShadow: darkMode ? "0 20px 55px rgba(0,0,0,0.45)" : "0 18px 50px rgba(0,0,0,0.13)",
  };

  useEffect(() => {
    loadLessons();
    loadCourses();
    loadSubjects();
  }, []);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/lessons");
      console.log("Admin Lessons data:", res.data);
      const data = res.data.data || res.data;
      setLessons(data);
      setFilteredLessons(data);
    } catch (err) {
      console.error("Failed to load lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await api.get("/admin/subjects");
      setSubjects(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  };

  // Filter lessons when search term or filters change
  useEffect(() => {
    let filtered = lessons;

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(lesson => 
        lesson.course_id === parseInt(selectedCourse)
      );
    }

    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(lesson => 
        lesson.subject_id === parseInt(selectedSubject)
      );
    }

    // Search by lesson title, course name, or subject name
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(term) ||
        (lesson.course && lesson.course.title.toLowerCase().includes(term)) ||
        (lesson.subject && lesson.subject.name.toLowerCase().includes(term))
      );
    }

    setFilteredLessons(filtered);
  }, [searchTerm, selectedCourse, selectedSubject, lessons]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    setDeletingId(id);

    try {
      await api.delete(`/admin/lessons/${id}`);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("");
    setSelectedSubject("");
    setShowFilters(false);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedCourse || selectedSubject;

  // Add CSS for animations
  const styles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
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
    @media (max-width: 768px) {
      .lessons-grid {
        grid-template-columns: 1fr !important;
      }
      .search-container {
        flex-direction: column !important;
      }
      .filter-actions {
        width: 100% !important;
        justify-content: stretch !important;
      }
      .filter-actions button {
        flex: 1 !important;
      }
    }
  `;

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.bg,
      }}>
        <div style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}>
          <div style={{ 
            width: "48px", 
            height: "48px", 
            border: "3px solid rgba(125, 211, 252, 0.1)",
            borderTop: "3px solid #7dd3fc",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: theme.textSecondary, fontSize: "16px" }}>Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 20px 40px",
          background: theme.bg,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div>
              <span style={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "10px 22px",
                background: `rgba(125, 211, 252, 0.2)`,
                borderRadius: "24px",
                border: `1px solid ${theme.accent}`,
                marginBottom: "20px",
                display: "inline-block",
              }}>
                Admin - Manage Lessons
              </span>

              <h1 style={{
                margin: "20px 0 0",
                fontSize: "2.5rem",
                fontWeight: 900,
                lineHeight: "1.1",
                color: theme.textPrimary,
              }}>
                All Lessons
              </h1>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: "17px",
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                  maxWidth: "600px",
                }}
              >
                View and manage all lessons across all courses and subjects.
              </p>
            </div>

            <div style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}>
              <button
                onClick={() => navigate("/admin/addLesson")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 28px",
                  borderRadius: "28px",
                  background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 18px 45px rgba(14, 165, 233, 0.35)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 22px 55px rgba(14, 165, 233, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 18px 45px rgba(14, 165, 233, 0.35)";
                }}
              >
                <PlusCircle size={18} />
                Add New Lesson
              </button>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <div style={{
            marginBottom: "32px",
          }}>
            {/* Search Bar */}
            <div className="search-container" style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              <div style={{
                flex: "1",
                minWidth: "250px",
                position: "relative",
              }}>
                <Search size={18} style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textSecondary,
                }} />
                <input
                  type="text"
                  placeholder="Search by title, course, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 42px",
                    borderRadius: "16px",
                    border: `1px solid ${theme.border}`,
                    background: theme.glass,
                    color: theme.textPrimary,
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(14, 165, 233, 0.15)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: theme.textSecondary,
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="filter-actions" style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 20px",
                    borderRadius: "16px",
                    border: `1px solid ${showFilters ? theme.accent : theme.border}`,
                    background: showFilters ? `rgba(14, 165, 233, 0.1)` : theme.glass,
                    color: showFilters ? theme.accent : theme.textSecondary,
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "all 0.3s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Filter size={18} />
                  Filters
                  {hasActiveFilters && (
                    <span style={{
                      background: theme.accent,
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}>
                      {selectedCourse && selectedSubject ? 2 : (selectedCourse || selectedSubject ? 1 : 0)}
                    </span>
                  )}
                  <ChevronDown size={16} style={{
                    transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }} />
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{
                      padding: "14px 20px",
                      borderRadius: "16px",
                      border: `1px solid ${theme.border}`,
                      background: theme.glass,
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "all 0.3s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#ef4444";
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = theme.glass;
                    }}
                  >
                    Clear All
                  </button>
                )}

                <span style={{
                  color: theme.textSecondary,
                  fontSize: "14px",
                  marginLeft: "8px",
                  whiteSpace: "nowrap",
                }}>
                  {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div style={{
                marginTop: "16px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                animation: "slideDown 0.3s ease",
                padding: "20px",
                background: theme.glass,
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  flex: "1",
                  minWidth: "180px",
                }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.textSecondary,
                    marginBottom: "6px",
                  }}>
                    Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      background: darkMode ? "rgba(255,255,255,0.05)" : "#fff",
                      color: theme.textPrimary,
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{
                  flex: "1",
                  minWidth: "180px",
                }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.textSecondary,
                    marginBottom: "6px",
                  }}>
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      background: darkMode ? "rgba(255,255,255,0.05)" : "#fff",
                      color: theme.textPrimary,
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                }}>
                  <button
                    onClick={clearFilters}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      background: theme.glass,
                      color: theme.textSecondary,
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LESSONS GRID */}
          <div className="lessons-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "32px",
            }}
          >
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  style={{
                    padding: "36px",
                    background: theme.glass,
                    backdropFilter: "blur(24px)",
                    borderRadius: "32px",
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.cardShadow,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = darkMode 
                      ? "0 30px 70px rgba(0,0,0,0.6)" 
                      : "0 25px 60px rgba(0,0,0,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = theme.cardShadow;
                  }}
                >
                  {/* Gradient top bar */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentHover})`,
                  }} />

                  {/* Action Buttons */}
                  <div style={{
                    position: "absolute",
                    top: "22px",
                    right: "22px",
                    display: "flex",
                    gap: "10px",
                    zIndex: 10,
                  }}>
                    {/* Edit Button */}
                    <button
                      onClick={() => navigate(`/admin/lessons/edit/${lesson.id}`)}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "16px",
                        border: `1px solid ${theme.border}`,
                        background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        color: "#3b82f6",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
                        e.currentTarget.style.borderColor = "#3b82f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                        e.currentTarget.style.borderColor = theme.border;
                      }}
                    >
                      <Edit3 size={18} />
                    </button>

                    {/* Chat Button */}
                    <button
                      onClick={() => {
                        setSelectedLessonForChat(lesson.id);
                        setShowChat(true);
                      }}
                      title="Open study assistant"
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "16px",
                        border: `1px solid ${theme.border}`,
                        background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        color: "#a855f7",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
                        e.currentTarget.style.borderColor = "#a855f7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                        e.currentTarget.style.borderColor = theme.border;
                      }}
                    >
                      <MessageCircle size={18} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      disabled={deletingId === lesson.id}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "16px",
                        border: `1px solid ${theme.border}`,
                        background: deletingId === lesson.id
                          ? "rgba(239, 68, 68, 0.2)"
                          : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        color: "#ef4444",
                        cursor: deletingId === lesson.id ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        opacity: deletingId === lesson.id ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== lesson.id) {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                          e.currentTarget.style.borderColor = "#ef4444";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== lesson.id) {
                          e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                          e.currentTarget.style.borderColor = theme.border;
                        }
                      }}
                    >
                      {deletingId === lesson.id ? (
                        <div style={{ 
                          width: "18px", 
                          height: "18px", 
                          border: "2px solid #ef4444",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ marginBottom: "26px", paddingRight: "80px" }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "28px",
                        fontWeight: 800,
                        color: theme.textPrimary,
                        lineHeight: "1.2",
                      }}
                    >
                      {lesson.title}
                    </h2>
                    
                    {/* Display Subject */}
                    {lesson.subject?.name && (
                      <p
                        style={{
                          margin: "14px 0 0",
                          color: theme.textSecondary,
                          fontSize: "15px",
                          lineHeight: "1.7",
                        }}
                      >
                        Subject: <span style={{ color: theme.accent, fontWeight: 600 }}>{lesson.subject.name}</span>
                      </p>
                    )}
                    
                    {/* Display Course */}
                    {lesson.course?.title && (
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: theme.textSecondary,
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                      >
                        Course: <span style={{ color: theme.accent, fontWeight: 500 }}>{lesson.course.title}</span>
                      </p>
                    )}

                    {/* Display Lesson ID (admin only) */}
                    <p
                      style={{
                        margin: "8px 0 0",
                        color: theme.textSecondary,
                        fontSize: "12px",
                        lineHeight: "1.6",
                        opacity: 0.5,
                      }}
                    >
                      ID: {lesson.id}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState 
                theme={theme} 
                darkMode={darkMode} 
                onAdd={() => navigate("/admin/addLesson")}
                hasFilters={hasActiveFilters}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          {/* STUDY ASSISTANT MODAL */}
          {showChat && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: "700px",
                maxHeight: "90vh",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                animation: "slideUp 0.3s ease",
              }}>
                <button
                  onClick={() => {
                    setShowChat(false);
                    setSelectedLessonForChat(null);
                  }}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    zIndex: 1001,
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "none",
                    color: "#fff",
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <X size={20} />
                </button>
                <StudyAssistant lessonId={selectedLessonForChat} darkMode={darkMode} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Empty State Component
const EmptyState = ({ theme, darkMode, onAdd, hasFilters, onClearFilters }) => {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "80px 40px",
        background: theme.glass,
        backdropFilter: "blur(24px)",
        borderRadius: "32px",
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
      }}
    >
      <BookOpen 
        size={64} 
        style={{ 
          color: theme.textSecondary,
          opacity: 0.4,
          marginBottom: "24px",
        }} 
      />
      <h3
        style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: 700,
          color: theme.textPrimary,
        }}
      >
        {hasFilters ? "No lessons match your filters" : "No lessons created yet"}
      </h3>
      <p
        style={{
          marginTop: "16px",
          color: theme.textSecondary,
          fontSize: "16px",
          lineHeight: "1.7",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {hasFilters 
          ? "Try adjusting your search or filter criteria to see more lessons."
          : "Start by creating your first lesson to organize your course content."}
      </p>
      {hasFilters ? (
        <button
          onClick={onClearFilters}
          style={{
            marginTop: "32px",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 32px",
            borderRadius: "28px",
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 20px 50px rgba(14, 165, 233, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Clear Filters
        </button>
      ) : (
        <button
          onClick={onAdd}
          style={{
            marginTop: "32px",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 32px",
            borderRadius: "28px",
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 20px 50px rgba(14, 165, 233, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <PlusCircle size={20} />
          Create First Lesson
        </button>
      )}
    </div>
  );
};

export default AdminLessons;