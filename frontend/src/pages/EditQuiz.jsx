import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import api from "../api/api";

const EditQuiz = ({ darkMode }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answer: "",
    points: 1,
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#a78bfa" : "#8b5cf6",
    border: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    input: darkMode ? "#1a1a2e" : "#ffffff",
  };

  useEffect(() => {
    api.get(`/quizzes/${id}`).then((res) => {
      setQuiz(res.data);
      setQuestions(res.data.questions || []);
    });
  }, [id]);

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: name === "passing_score" ? parseInt(value) : name === "is_published" ? e.target.checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/quizzes/${id}`, quiz);
      alert("Quiz updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${questionId}`);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      alert("Error deleting question");
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", padding: "80px 20px 40px", background: theme.bg }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/quizzes")}
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
          Back to Quizzes
        </button>

        <h1 style={{ fontSize: "44px", fontWeight: 800, color: theme.textPrimary, marginBottom: "32px" }}>
          Edit Quiz
        </h1>

        <div
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
            <label style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}>
              Quiz Title
            </label>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleQuizChange}
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
              value={quiz.description || ""}
              onChange={handleQuizChange}
              rows={3}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ color: theme.textPrimary, fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Passing Score (%)
              </label>
              <input
                type="number"
                name="passing_score"
                value={quiz.passing_score}
                onChange={handleQuizChange}
                min="0"
                max="100"
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

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                marginTop: "auto",
              }}
            >
              <input
                type="checkbox"
                name="is_published"
                checked={quiz.is_published}
                onChange={handleQuizChange}
                style={{ cursor: "pointer" }}
              />
              <span style={{ color: theme.textPrimary, fontWeight: 600 }}>Published</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: "14px 28px",
              background: `linear-gradient(135deg, ${theme.accent}, #c4b5fd)`,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Quiz"}
          </button>

          <hr style={{ border: "none", borderTop: `1px solid ${theme.border}` }} />

          <div>
            <h3 style={{ color: theme.textPrimary, marginBottom: "16px", fontWeight: 700 }}>
              Questions ({questions.length})
            </h3>

            {questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  background: `${theme.accent}05`,
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div>
                  <p style={{ color: theme.textPrimary, fontWeight: 600, margin: "0 0 8px" }}>
                    Q{idx + 1}: {q.question_text}
                  </p>
                  <p style={{ color: theme.textSecondary, fontSize: "12px", margin: 0 }}>
                    Points: {q.points} | Answer: {q.correct_answer}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
