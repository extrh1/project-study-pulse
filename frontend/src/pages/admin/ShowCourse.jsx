import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, BookOpen, User, Calendar, Tag, Loader2, List } from "lucide-react";
import api from "../../api/api"

const ShowCourse = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.95)" : "rgba(248, 250, 252, 0.95)",
    surface: darkMode ? "#1a1a2e" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#7dd3fc" : "#0ea5e9",
    accentHover: darkMode ? "#9de0fe" : "#0284c7",
    border: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    shadow: darkMode ? "0 25px 70px rgba(0,0,0,0.6)" : "0 20px 60px rgba(0,0,0,0.14)",
    success: darkMode ? "#34d399" : "#10b981",
    warning: darkMode ? "#fbbf24" : "#f59e0b",
    danger: darkMode ? "#f87171" : "#ef4444",
  };

  useEffect(() => {
    api.get(`/admin/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch(() => {
        setError("Failed to load course details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return theme.success;
      case 'draft': return theme.warning;
      case 'archived': return theme.danger;
      default: return theme.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'archived': return 'Archived';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        background: theme.bg,
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "48px",
          background: theme.glass,
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: `1px solid ${theme.border}`,
        }}>
          <Loader2 size={48} style={{ 
            color: theme.accent, 
            animation: "spin 1s linear infinite" 
          }} />
          <div style={{ fontSize: "18px", fontWeight: 500, color: theme.textSecondary }}>
            Loading course details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        background: theme.bg,
      }}>
        <div style={{
          padding: "48px",
          background: theme.glass,
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: `1px solid ${theme.border}`,
          textAlign: "center",
          maxWidth: "500px",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
          <h2 style={{
            color: theme.textPrimary,
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
          }}>
            Course Not Found
          </h2>
          <p style={{
            color: theme.textSecondary,
            fontSize: "16px",
            marginBottom: "24px",
          }}>
            {error || "The course you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/admin/courses")}
            style={{
              padding: "14px 32px",
              borderRadius: "16px",
              border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 12px 35px rgba(14, 165, 233, 0.4)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      padding: "80px 20px 40px",
      background: theme.bg,
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <button
            onClick={() => navigate("/admin/courses")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "16px",
              border: `1px solid ${theme.border}`,
              background: "transparent",
              color: theme.textSecondary,
              fontWeight: 500,
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
              e.target.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateX(0)";
            }}
          >
            <ArrowLeft size={20} />
            Back to Courses
          </button>

          <button
            onClick={() => navigate(`/admin/courses/edit/${id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              borderRadius: "16px",
              border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: `0 8px 25px rgba(14, 165, 233, 0.3)`,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 16px 40px rgba(14, 165, 233, 0.4)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = `0 8px 25px rgba(14, 165, 233, 0.3)`;
            }}
          >
            <Edit3 size={18} />
            Edit Course
          </button>
        </div>

        <div style={{
          background: theme.glass,
          backdropFilter: "blur(30px)",
          borderRadius: "36px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          overflow: "hidden",
        }}>
          
          <div style={{
            padding: "48px 48px 32px",
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    padding: "6px 16px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: getStatusColor(course.status),
                    color: "#fff",
                    textTransform: "capitalize",
                  }}>
                    {getStatusLabel(course.status)}
                  </span>
                  {course.subject && (
                    <span style={{
                      padding: "6px 16px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      fontWeight: 500,
                      background: darkMode ? "rgba(125, 211, 252, 0.15)" : "rgba(14, 165, 233, 0.1)",
                      color: theme.accent,
                      border: `1px solid ${theme.border}`,
                    }}>
                      {course.subject.name}
                    </span>
                  )}
                  {course.category && (
                    <span style={{
                      padding: "6px 16px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      fontWeight: 500,
                      background: darkMode ? "rgba(52, 211, 153, 0.15)" : "rgba(16, 185, 129, 0.1)",
                      color: theme.success,
                      border: `1px solid ${theme.border}`,
                    }}>
                      {course.category.name}
                    </span>
                  )}
                </div>

                <h1 style={{
                  margin: 0,
                  fontSize: "36px",
                  fontWeight: 800,
                  lineHeight: "1.2",
                  color: theme.textPrimary,
                  letterSpacing: "-0.02em",
                }}>
                  {course.title}
                </h1>
              </div>

              <div style={{
                display: "flex",
                gap: "12px",
                flexShrink: 0,
              }}>
                <div style={{
                  padding: "12px 20px",
                  borderRadius: "16px",
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${theme.border}`,
                  textAlign: "center",
                }}>
                  <div style={{
                    fontSize: "13px",
                    color: theme.textSecondary,
                    fontWeight: 500,
                  }}>
                    ID
                  </div>
                  <div style={{
                    fontSize: "16px",
                    color: theme.textPrimary,
                    fontWeight: 700,
                  }}>
                    #{course.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "40px 48px" }}>
            
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "16px",
                fontWeight: 700,
                color: theme.textPrimary,
                marginBottom: "16px",
              }}>
                <BookOpen size={20} style={{ color: theme.accent }} />
                Description
              </h3>
              <div style={{
                padding: "20px 24px",
                borderRadius: "16px",
                background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
                fontSize: "16px",
                lineHeight: "1.8",
              }}>
                {course.description || (
                  <span style={{ color: theme.textSecondary, fontStyle: "italic" }}>
                    No description provided.
                  </span>
                )}
              </div>
            </div>

            {/* LESSONS SECTION */}
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "16px",
                fontWeight: 700,
                color: theme.textPrimary,
                marginBottom: "16px",
              }}>
                <List size={20} style={{ color: theme.accent }} />
                Lessons ({course.lessons?.length ?? 0})
              </h3>
              <div style={{
                padding: "20px 24px",
                borderRadius: "16px",
                background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${theme.border}`,
              }}>
                {course.lessons && course.lessons.length > 0 ? (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}>
                    {course.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "10px",
                          background: theme.surface,
                          border: `1px solid ${theme.border}`,
                          color: theme.textPrimary,
                          fontSize: "15px",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}>
                          {lesson.order || lesson.id}
                        </span>
                        {lesson.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: theme.textSecondary, fontStyle: "italic" }}>
                    No lessons available for this course.
                  </span>
                )}
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}>
              {course.user && (
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: theme.textSecondary,
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}>
                    <User size={16} />
                    Instructor
                  </div>
                  <div style={{
                    fontSize: "15px",
                    color: theme.textPrimary,
                    fontWeight: 600,
                  }}>
                    {course.user.name || "N/A"}
                  </div>
                </div>
              )}

              {course.created_at && (
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: theme.textSecondary,
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}>
                    <Calendar size={16} />
                    Created
                  </div>
                  <div style={{
                    fontSize: "15px",
                    color: theme.textPrimary,
                    fontWeight: 600,
                  }}>
                    {new Date(course.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}

              {course.updated_at && (
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: theme.textSecondary,
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}>
                    <Calendar size={16} />
                    Updated
                  </div>
                  <div style={{
                    fontSize: "15px",
                    color: theme.textPrimary,
                    fontWeight: 600,
                  }}>
                    {new Date(course.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCourse;