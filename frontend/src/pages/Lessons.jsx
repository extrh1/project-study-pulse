import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, BookOpen, Edit3, MessageCircle, X } from "lucide-react";
import api from "../api/api";
import StudyAssistant from "../components/StudyAssistant";

const Lessons = ({ darkMode }) => {
  const [lessons, setLessons] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedLessonForChat, setSelectedLessonForChat] = useState(null);
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
    api
      .get("/lessons")
      .then((res) => setLessons(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    setDeletingId(id);

    try {
      await api.delete(`/lessons/${id}`);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
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
            marginBottom: "48px",
          }}
        >
          <div>
            <h1 className="text-primary" style={{
              margin: 0,
              fontSize: "3.25rem",
              fontWeight: 900,
              lineHeight: "1.1",
            }}>
              Lessons
            </h1>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: "17px",
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}
            >
                Explore your course lessons and study with your assistant.
            </p>
          </div>
        </div>

        {/* LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "32px",
          }}
        >
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
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
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "22px",
                  right: "22px",
                  display: "flex",
                  gap: "12px",
                }}>
                  <button
                    onClick={() => {
                      setSelectedLessonForChat(lesson.id);
                      setShowChat(true);
                    }}
                    title="Open study assistant"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "18px",
                      border: "none",
                      background: "rgba(168, 85, 247, 0.18)",
                      color: "#a855f7",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(168, 85, 247, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(168, 85, 247, 0.18)";
                    }}
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>

                <div style={{ marginBottom: "26px" }}>
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
                </div>

                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: "15px",
                    lineHeight: "1.8",
                    minHeight: "100px",
                  }}
                >
                  {lesson.content}
                </p>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 40px",
                background: theme.glass,
                borderRadius: "32px",
                border: `1px solid ${theme.border}`,
                boxShadow: theme.cardShadow,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "28px",
                  color: theme.textPrimary,
                }}
              >
                No lessons created yet.
              </h3>
              <p
                style={{
                  marginTop: "16px",
                  color: theme.textSecondary,
                  fontSize: "16px",
                  lineHeight: "1.7",
                }}
              >
                Add your first lesson to organize your course flow in the same polished style as subjects and courses.
              </p>
            </div>
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
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              borderRadius: "16px",
              overflow: "hidden",
            }}>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 1001,
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "none",
                  color: "#fff",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
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
  );
};

export default Lessons;