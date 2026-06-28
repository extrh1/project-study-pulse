import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, BookOpen } from "lucide-react";
import api from "../api/api";

const Quizzes = ({ darkMode }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#a78bfa" : "#8b5cf6",
    accentHover: darkMode ? "#c4b5fd" : "#a855f7",
    // FIX #6: added missing success color that was used by the Take button
    success: darkMode ? "#10b981" : "#059669",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    cardShadow: darkMode ? "0 20px 55px rgba(0,0,0,0.45)" : "0 18px 50px rgba(0,0,0,0.13)",
  };

  useEffect(() => {
    api
      .get("/quizzes")
      .then((res) => {
        setQuizzes(res.data.data);
        console.log(res.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch quizzes.");
      });
  }, []);

const handleDelete = async (id) => {
  console.log("DELETE CLICK", id);
  
  setDeletingId(id);

  try {
    const res = await api.delete(`/quizzes/${id}`);

    console.log("API OK", res.data);

    setQuizzes((prev) => {
      const updated = prev.filter((quiz) => quiz.id !== id);
      console.log("NEW LIST", updated);
      return updated;
    });

  } catch (err) {
    console.log("ERROR", err.response?.data);
    setError("Failed to delete quiz");
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
              Quizzes
            </h1>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: "17px",
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}
            >
              Manage your quizzes and track student performance.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-quiz")}
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: `0 10px 30px rgba(167, 139, 250, 0.3)`,
            }}
            // FIX #12: use e.currentTarget instead of e.target so hover works
            // even when the cursor is over the child icon
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 15px 40px rgba(167, 139, 250, 0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 10px 30px rgba(167, 139, 250, 0.3)`;
            }}
          >
            <PlusCircle size={18} />
            Add Quiz
          </button>
        </div>

        {/* QUIZZES TABLE */}
        <div
          style={{
            background: theme.glass,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: theme.cardShadow,
          }}
        >
          {error ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#ef4444" }}>
              <p>{error}</p>
            </div>
          ) : quizzes.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ background: `${theme.accent}10`, borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: "16px", textAlign: "left", color: theme.textPrimary, fontWeight: 700 }}>
                      Quiz
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: theme.textPrimary, fontWeight: 700 }}>
                      Lesson
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: theme.textPrimary, fontWeight: 700 }}>
                      Questions
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: theme.textPrimary, fontWeight: 700 }}>
                      Passing Score
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: theme.textPrimary, fontWeight: 700 }}>
                      Your Score
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: theme.textPrimary, fontWeight: 700 }}>
                      Status
                    </th>
                    <th style={{ padding: "16px", textAlign: "center", color: theme.textPrimary, fontWeight: 700 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr
                      key={quiz.id}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        transition: "background 0.2s",
                      }}
                      // FIX #12: use e.currentTarget for row hover
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${theme.accent}05`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "16px", color: theme.textPrimary, fontWeight: 600 }}>
                        {quiz.title}
                      </td>
                      <td style={{ padding: "16px", color: theme.textSecondary, fontSize: "14px" }}>
                        {quiz.lesson?.title || "N/A"}
                      </td>
                      <td style={{ padding: "16px", color: theme.textSecondary }}>
                        {quiz.total_questions} questions
                      </td>
                      <td style={{ padding: "16px", color: theme.textSecondary }}>
                        {quiz.passing_score}%
                      </td>
                      <td style={{ padding: "16px", color: theme.textSecondary }}>
                        {quiz.user_score != null ? `${quiz.user_score}%` : "0%"}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            background: quiz.is_published ? `${theme.accent}20` : "#ef444420",
                            color: quiz.is_published ? theme.accent : "#ef4444",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {quiz.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        {/* FIX #6: theme.success is now defined so these styles render correctly */}
                        <button
                          onClick={() => navigate(`/take-quiz/${quiz.id}`)}
                          style={{
                            background: `${theme.success}20`,
                            color: theme.success,
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${theme.success}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${theme.success}20`;
                          }}
                        >
                          Take
                        </button>
                        <button
                          onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
                          style={{
                            background: `${theme.accent}20`,
                            color: theme.accent,
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${theme.accent}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${theme.accent}20`;
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("CLICK DELETE", quiz.id);
                            handleDelete(quiz.id);
                          }}
                          disabled={deletingId === quiz.id}
                          style={{
                            background: "#ef444420",
                            color: "#ef4444",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            opacity: deletingId === quiz.id ? 0.5 : 1,
                            position: "relative",
                            zIndex: 999,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "48px", textAlign: "center", color: theme.textSecondary }}>
              <BookOpen size={48} style={{ opacity: 0.5, margin: "0 auto 16px" }} />
              <p>No quizzes available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;