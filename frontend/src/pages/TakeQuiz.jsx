import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

import api from "../api/api";
import { notifyQuizCompleted } from "../services/notificationService";
import Toast from "../components/Toast";

const TakeQuiz = ({ darkMode }) => {

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toast, setToast] = useState(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [showSidebar] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIX #2: ref so the timer can always call the latest submit handler
  // without capturing a stale closure
  const isSubmittingRef = useRef(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26, 26, 46, 0.92)" : "rgba(248, 250, 252, 0.92)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#a78bfa" : "#8b5cf6",
    border: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    input: darkMode ? "#1a1a2e" : "#ffffff",
    danger: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  };

  // LOAD QUIZ
  // FIX #4: correct_answer is intentionally NOT stored or used client-side;
  // scoring happens entirely on the server (submitAttempt in QuizController).
  // We only save navigation state to localStorage — not the full quiz with answers.
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Restore only navigation state (current question + answers), not the quiz data itself,
        // so correct answers are never persisted in localStorage.
        const savedNav = localStorage.getItem(`quiz_nav_${id}`);

        const res = await api.get(`/quizzes/${id}`);
        const quizData = res.data || {};
        quizData.questions = quizData.questions || [];

        setQuiz(quizData);

        if (savedNav) {
          const parsed = JSON.parse(savedNav);
          setAnswers(parsed.answers || {});
          setTimeLeft(parsed.timeLeft || quizData.questions.length * 2 * 60);
          setCurrentQuestionIdx(parsed.currentQuestionIdx || 0);
        } else {
          const initialAnswers = {};
          quizData.questions.forEach((q) => {
            initialAnswers[q.id] = "";
          });
          setAnswers(initialAnswers);
          setTimeLeft(quizData.questions.length * 2 * 60);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
          (err.message === "Network Error" ? "Failed to generate quiz. Network Error" : 
          "Error loading quiz. Please try again later.");
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  // FIX #1 & #2: wrap handleSubmitQuiz in useCallback and keep a ref to it
  // so the timer always calls the up-to-date version (no stale closure).
  const handleSubmitQuiz = useCallback(async (e) => {
    if (e) e.preventDefault();
    // FIX #2: guard against double-submit using a ref (immune to closure staleness)
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const answeredQuestions = Object.values(answers).filter(
        (a) => a && a.toString().trim() !== ""
      );

      if (answeredQuestions.length === 0) {
        setToast({
          message: "Please answer at least one question.",
          type: "warning",
        });
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      const res = await api.post(`/quizzes/${id}/submit`, {
        answers,
      });

      setResult(res.data);
      setSubmitted(true);
      window.dispatchEvent(
        new CustomEvent("studyPulseQuizSubmitted", {
          detail: {
            quizId: id,
            score: res.data.score,
            xpEarned: res.data.xp_earned,
            newLevel: res.data.new_level,
          },
        })
      );

      // FIX #4: clear only the nav state key (not the quiz data, which we no longer cache)
      localStorage.removeItem(`quiz_nav_${id}`);

      await notifyQuizCompleted(
        quiz.title,
        res.data.score,
        res.data.passed
      );

      setToast({
        message: res.data.passed
          ? `Congratulations! You passed the quiz with a score of ${res.data.score}%.`
          : `You failed the quiz with a score of ${res.data.score}%.`,
        type: res.data.passed ? "success" : "warning",
      });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message ||
          "Error submitting quiz. Please try again later.",
        type: "error",
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [answers, id, quiz]);

  // Keep a ref always pointing to the latest handleSubmitQuiz
  const handleSubmitQuizRef = useRef(handleSubmitQuiz);
  useEffect(() => {
    handleSubmitQuizRef.current = handleSubmitQuiz;
  }, [handleSubmitQuiz]);

  // TIMER
  // FIX #1: timer calls handleSubmitQuizRef.current so it always gets the
  // latest version with fresh answers — no stale closure.
  useEffect(() => {
    if (!quiz || submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use the ref so we always have up-to-date answers
          setTimeout(() => handleSubmitQuizRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, submitted]);

  // SAVE PROGRESS (navigation state only — no quiz data / correct answers)
  // FIX #4: store only answers + UI state, never quiz.questions
  useEffect(() => {
    if (quiz && !submitted) {
      localStorage.setItem(
        `quiz_nav_${id}`,
        JSON.stringify({
          answers,
          timeLeft,
          currentQuestionIdx,
        })
      );
    }
  }, [quiz, answers, timeLeft, currentQuestionIdx, id, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return theme.danger;
    if (timeLeft <= 300) return theme.warning;
    return theme.accent;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isQuestionAnswered = (questionId) => {
    return (
      answers[questionId] &&
      answers[questionId].toString().trim() !== ""
    );
  };

  // ERROR
  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: theme.textPrimary }}>Error</h2>
          <p style={{ color: theme.textSecondary }}>{error}</p>
          <button
            onClick={() => navigate("/quizzes")}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: theme.accent,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // LOADING
  if (loading && !quiz) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textPrimary }}>
        Loading quiz...
      </div>
    );
  }

  // NOT FOUND
  if (!quiz) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textPrimary }}>
        Quiz not found.
      </div>
    );
  }

  // RESULT
  if (submitted && result) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <div style={{ background: theme.glass, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "40px", textAlign: "center", width: "100%", maxWidth: "600px" }}>
          {result.passed ? (
            <CheckCircle size={80} color={theme.success} />
          ) : (
            <XCircle size={80} color={theme.danger} />
          )}

          <h1 style={{ marginTop: "20px", color: result.passed ? theme.success : theme.danger }}>
            {result.message || (result.passed ? "Passed!" : "Failed!")}
          </h1>

          <h2 style={{ fontSize: "48px", color: theme.textPrimary }}>
            {result.score}%
          </h2>

          <p style={{ color: theme.textSecondary, fontWeight: 600 }}>
            Score: {result.score}% · Passing Score: {quiz.passing_score}%
          </p>

          {result.xp_earned != null && (
            <p style={{ color: theme.textSecondary, margin: "8px 0" }}>
              XP Earned: {result.xp_earned}
            </p>
          )}

          {result.new_level && (
            <p style={{ color: theme.textPrimary, fontWeight: 700, marginTop: "16px" }}>
              {result.levels_gained > 0
                ? `Level up! You are now level ${result.new_level}.`
                : `Current level: ${result.new_level}`}
            </p>
          )}

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
            {/* FIX #3: "Try Again" uses window.location.href to force a full
                remount so all state (answers, submitted, result, timer) resets */}
            <button
              onClick={() => { window.location.href = `/take-quiz/${id}`; }}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: `${theme.accent}20`,
                color: theme.accent,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: `${theme.success}`,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              View Dashboard
            </button>

            <button
              onClick={() => {
                // Force full reload so /api/quizzes uses latest quiz_attempts
                window.location.href = "/quizzes";
              }}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background: theme.accent,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Back to Quizzes
            </button>

          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIdx];

  // FIX #5: render the correct input for each question_type
  const renderQuestionInput = (question) => {
  let options = [];

  try {
    if (Array.isArray(question.options)) {
      options = question.options;
    } else if (typeof question.options === "string") {
      options = JSON.parse(question.options);
    } else if (
      question.options &&
      typeof question.options === "object"
    ) {
      options = Object.values(question.options);
    }
  } catch (error) {
    console.error("Options parsing error:", error);
    options = [];
  }

  switch (question.question_type) {
    case "multiple_choice":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {options.map((option, index) => (
            <label
              key={index}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                value={option}
                checked={answers[question.id] === option}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    case "true_false":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {["true", "false"].map((val) => (
            <label
              key={val}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: `2px solid ${
                  answers[question.id] === val
                    ? theme.accent
                    : theme.border
                }`,
                display: "flex",
                gap: "12px",
                cursor: "pointer",
                color: theme.textPrimary,
                background:
                  answers[question.id] === val
                    ? `${theme.accent}10`
                    : "transparent",
              }}
            >
              <input
                type="radio"
                value={val}
                checked={answers[question.id] === val}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
              <span>{val === "true" ? "True" : "False"}</span>
            </label>
          ))}
        </div>
      );

    case "short_answer":
      return (
        <textarea
          value={answers[question.id] || ""}
          onChange={(e) =>
            handleAnswerChange(question.id, e.target.value)
          }
          placeholder="Type your answer here..."
          rows={4}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: `2px solid ${theme.border}`,
            background: theme.input,
            color: theme.textPrimary,
          }}
        />
      );

    default:
      return (
        <p style={{ color: theme.textSecondary }}>
          Unsupported question type
        </p>
      );
  }
};

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "80px 20px 40px", display: "flex", gap: "24px" }}>
      {showSidebar && (
        <div style={{ width: "250px" }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: "16px" }}>
            Questions
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {quiz.questions?.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIdx(idx)}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: `2px solid ${
                    currentQuestionIdx === idx ? theme.accent : theme.border
                  }`,
                  background:
                    currentQuestionIdx === idx
                      ? `${theme.accent}20`
                      : isQuestionAnswered(q.id)
                      ? `${theme.success}20`
                      : theme.glass,
                  color: theme.textPrimary,
                  cursor: "pointer",
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1, maxWidth: "850px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
          <button
            onClick={() => navigate("/quizzes")}
            style={{ border: "none", background: "transparent", color: theme.accent, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>
            <p style={{ color: theme.textSecondary, marginBottom: "5px" }}>
              Question {currentQuestionIdx + 1} of {quiz.questions?.length || 0}
            </p>

            <div style={{ width: "220px", height: "5px", background: theme.border, borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${((currentQuestionIdx + 1) / (quiz.questions?.length || 1)) * 100}%`,
                  height: "100%",
                  background: theme.accent,
                }}
              />
            </div>
          </div>

          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${getTimeColor()}20`, color: getTimeColor(), display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {currentQuestion && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentQuestionIdx < quiz.questions.length - 1) {
                setCurrentQuestionIdx(currentQuestionIdx + 1);
              }
            }}
          >
            <div style={{ background: theme.glass, border: `1px solid ${theme.border}`, borderRadius: "18px", padding: "30px" }}>
              <h2 style={{ color: theme.textPrimary, marginBottom: "25px" }}>
                {currentQuestion.question_text}
              </h2>

              {/* FIX #5: delegate rendering to renderQuestionInput which handles
                  multiple_choice, true_false, and short_answer */}
              {renderQuestionInput(currentQuestion)}
            </div>

            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: currentQuestionIdx === 0 ? theme.border : `${theme.accent}20`,
                  color: currentQuestionIdx === 0 ? theme.textSecondary : theme.accent,
                  cursor: currentQuestionIdx === 0 ? "not-allowed" : "pointer",
                }}
              >
                ← Previous
              </button>

              {currentQuestionIdx < quiz.questions.length - 1 ? (
                <button
                  type="submit"
                  disabled={!isQuestionAnswered(currentQuestion.id)}
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "10px",
                    background: theme.accent,
                    color: "#fff",
                    cursor: "pointer",
                    opacity: !isQuestionAnswered(currentQuestion.id) ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "10px",
                    background: theme.success,
                    color: "#fff",
                    cursor: "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} duration={4000} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default TakeQuiz;