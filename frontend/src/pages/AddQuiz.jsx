import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import api from "../api/api";

const AddQuiz = ({ darkMode }) => {
  const [lessonsWithDetails, setLessonsWithDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [error, setError] = useState("");

  const [quizData, setQuizData] = useState({
    lesson_id: "",
    title: "",
    questions_count: 5,
    passing_score: 70,
  });

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const theme = {
    bg: darkMode ? "#0a0a0f" : "#f8fafc",
    glass: darkMode ? "rgba(26,26,46,0.95)" : "rgba(248,250,252,0.95)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#a1a1aa" : "#64748b",
    accent: darkMode ? "#a78bfa" : "#8b5cf6",
    accentHover: darkMode ? "#c084fc" : "#a78bfa",
    success: darkMode ? "#10b981" : "#059669",
    border: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    input: darkMode ? "#1a1a2e" : "#ffffff",
    shadow: darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)",
  };

  // Load lessons
  useEffect(() => {
    setLessonsLoading(true);
    api.get("/lessons")
      .then((res) => {
          console.log("LESSONS RESPONSE:", res.data);

          setLessonsWithDetails(
              Array.isArray(res.data) 
              ? res.data 
              : res.data.data
          );
      })
      .catch((err) => {
        console.error("Failed to load lessons:", err);
        setError("Failed to load lessons");
      })
      .finally(() => {
        setLessonsLoading(false);
      });
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDropdown) {
        if (e.key === "Escape") {
          setShowDropdown(false);
          searchInputRef.current?.focus();
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showDropdown]);

  // SEARCH
  const handleSearchChange = useCallback((e) => {
    const q = e.target.value.toLowerCase().trim();
    setSearchQuery(e.target.value);
    setError("");

    if (!q) {
      setFilteredLessons([]);
      setShowDropdown(false);
      return;
    }

    const filtered = (Array.isArray(lessonsWithDetails) ? lessonsWithDetails : []).filter((l) =>
      l.title?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q) ||
      l.course?.title?.toLowerCase().includes(q) ||
      l.subject?.name?.toLowerCase().includes(q)
    );

    setFilteredLessons(filtered.slice(0, 8));
    setShowDropdown(true);
  }, [lessonsWithDetails]);

  // SELECT LESSON
  const handleSelectLesson = useCallback((lesson) => {
    setSelectedLesson(lesson);
    setQuizData((prev) => ({
      ...prev,
      lesson_id: lesson.id,
      title: `${lesson.title} Quiz`,
    }));
    setSearchQuery(lesson.title);
    setShowDropdown(false);
    setError("");
  }, []);

  // UPDATE QUIZ COUNT
  const handleQuestionsCountChange = useCallback((count) => {
    setQuizData((prev) => ({
      ...prev,
      questions_count: parseInt(count, 10),
    }));
  }, []);

  const handlePassingScoreChange = useCallback((value) => {
    setQuizData((prev) => ({
      ...prev,
      passing_score: Math.min(100, Math.max(0, parseInt(value, 10) || 0)),
    }));
  }, []);

  // AUTO GENERATE
  const handleAutoGenerate = async () => {
    if (!selectedLesson) {
      setError("Please select a lesson first");
      return;
    }

    if (!quizData.title.trim()) {
      setError("Please enter a quiz title");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auto-quiz", {
        lesson_id: selectedLesson.id,
        title: quizData.title.trim(),
        questions_count: quizData.questions_count,
        passing_score: quizData.passing_score,
      });

      if (res.data.quiz_id || res.data.id) {
        navigate(`/take-quiz/${res.data.quiz_id || res.data.id}`, {
          state: {
            success: "Quiz created successfully!",
            fallback: res.data.message?.includes("Fallback") || res.data.message?.includes("fallback")
          }
        });
      } else {
        setError("Failed to create quiz - invalid response");
      }
    } catch (err) {
      console.error("Quiz generation error:", err);

      let errorMsg = "Failed to generate quiz. ";

      if (err.response?.data?.message) {
        errorMsg += err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg += err.response.data.error;
      } else if (err.response?.status === 500) {
        errorMsg += "Server error - Using fallback questions. Please try again.";
      } else if (err.response?.status === 429) {
        errorMsg += "Too many requests - Please wait a moment and try again.";
      } else if (err.message) {
        errorMsg += err.message;
      } else {
        errorMsg += "Please try again.";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "100px 20px 40px",
      background: `linear-gradient(135deg, ${theme.bg} 0%, ${darkMode ? '#0f0f23' : '#f1f5f9'} 100%)`
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "40px" }}>
          {/* FIX #12: use e.currentTarget so hover applies to the button,
              not to whichever child element (icon) the cursor happens to be over */}
          <button
            onClick={() => navigate("/quizzes")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: theme.accent,
              padding: "12px 0",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
              e.currentTarget.style.color = theme.accentHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = theme.accent;
            }}
          >
            <ArrowLeft size={20} />
            Back to Quizzes
          </button>

          <h1 className="text-primary" style={{
            margin: "32px 0 12px",
            fontSize: "2.75rem",
            fontWeight: 800,
            lineHeight: "1.2"
          }}>
            Create Quiz
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: "18px",
            lineHeight: "1.6",
            maxWidth: "500px"
          }}>
            Select a lesson
          </p>
        </div>

        {/* SEARCH LESSONS */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="🔍 Search lessons to generate quiz..."
            style={{
              width: "100%",
              padding: "18px 20px",
              background: theme.input,
              color: theme.textPrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: "12px",
              fontSize: "16px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: `0 4px 20px ${theme.shadow}`,
            }}
            onFocus={() => {
              if (filteredLessons.length > 0) setShowDropdown(true);
            }}
          />

          {showDropdown && filteredLessons.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: theme.glass,
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
                marginTop: "8px",
                maxHeight: "320px",
                overflow: "auto",
                zIndex: 100,
                backdropFilter: "blur(25px)",
                boxShadow: `0 20px 40px ${theme.shadow}`,
              }}
            >
              {filteredLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  tabIndex={0}
                  onClick={() => handleSelectLesson(lesson)}
                  style={{
                    padding: "18px 20px",
                    cursor: "pointer",
                    borderBottom: index < filteredLessons.length - 1 ? `1px solid ${theme.border}` : "none",
                    transition: "all 0.2s ease",
                    color: theme.textPrimary,
                  }}
                  // FIX #12: use e.currentTarget on dropdown items too
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(139,92,246,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "4px"
                  }}>
                    {lesson.title}
                  </div>
                  {/* FIX #16: show course/subject context in dropdown */}
                  {(lesson.course?.title || lesson.subject?.name) && (
                    <div style={{
                      fontSize: "12px",
                      color: theme.accent,
                      marginBottom: "2px",
                      fontWeight: 500,
                    }}>
                      {[lesson.subject?.name, lesson.course?.title].filter(Boolean).join(" › ")}
                    </div>
                  )}
                  {lesson.description && (
                    <div style={{
                      fontSize: "14px",
                      color: theme.textSecondary,
                      lineHeight: "1.4"
                    }}>
                      {lesson.description.length > 100
                        ? `${lesson.description.substring(0, 100)}...`
                        : lesson.description
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SELECTED LESSON */}
        {selectedLesson && (
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: darkMode
              ? "rgba(167,139,250,0.15)"
              : "rgba(139,92,246,0.08)",
            border: `2px solid ${theme.accent}`,
            borderRadius: "12px",
            transition: "all 0.3s ease",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: theme.accent,
              fontWeight: 600,
              fontSize: "16px"
            }}>
              <CheckCircle size={20} />
              Selected: {selectedLesson.title}
            </div>
          </div>
        )}

        {/* QUIZ TITLE */}
        <input
          value={quizData.title}
          onChange={(e) =>
            setQuizData({ ...quizData, title: e.target.value })
          }
          placeholder="Quiz title (e.g. 'Python Basics Quiz')"
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "18px 20px",
            background: theme.input,
            color: theme.textPrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: "12px",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: `0 4px 20px ${theme.shadow}`,
          }}
        />

        {/* QUESTIONS COUNT */}
        <select
          value={quizData.questions_count}
          onChange={(e) => handleQuestionsCountChange(e.target.value)}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "18px 20px",
            background: theme.input,
            color: theme.textPrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: "12px",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: `0 4px 20px ${theme.shadow}`,
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 16px center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "18px",
            paddingRight: "50px",
          }}
        >
          <option value={3}>3 Questions (Quick Quiz)</option>
          <option value={5}>5 Questions</option>
          <option value={7}>7 Questions</option>
          <option value={10}>10 Questions (Comprehensive)</option>
          <option value={15}>15 Questions (Advanced)</option>
          <option value={20}>20 Questions (Deep Review)</option>
          <option value={25}>25 Questions (Full Exam)</option>
        </select>

        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: theme.textPrimary, fontWeight: 600 }}>
            Passing Score (%)
          </label>
          <input
            type="number"
            value={quizData.passing_score}
            onChange={(e) => handlePassingScoreChange(e.target.value)}
            min="0"
            max="100"
            style={{
              width: "100%",
              padding: "18px 20px",
              background: theme.input,
              color: theme.textPrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: "12px",
              fontSize: "16px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: `0 4px 20px ${theme.shadow}`,
            }}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            marginTop: "20px",
            padding: "16px 20px",
            background: darkMode ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            color: "#ef4444",
          }}>
            {error}
          </div>
        )}

        {/* GENERATE BUTTON */}
        <button
          onClick={handleAutoGenerate}
          disabled={loading || lessonsLoading || !selectedLesson}
          style={{
            marginTop: "32px",
            width: "100%",
            padding: "20px",
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
            color: "#ffffff",
            border: "none",
            borderRadius: "16px",
            fontSize: "18px",
            fontWeight: 600,
            cursor: loading || lessonsLoading || !selectedLesson ? "not-allowed" : "pointer",
            opacity: (loading || lessonsLoading || !selectedLesson) ? 0.6 : 1,
            transition: "all 0.3s ease",
            boxShadow: `0 10px 30px ${darkMode ? "rgba(167,139,250,0.4)" : "rgba(139,92,246,0.3)"}`,
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            if (!loading && !lessonsLoading && selectedLesson) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 15px 40px ${darkMode ? "rgba(167,139,250,0.5)" : "rgba(139,92,246,0.4)"}`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 10px 30px ${darkMode ? "rgba(167,139,250,0.4)" : "rgba(139,92,246,0.3)"}`;
          }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
              Generating your quiz ...
            </>
          ) : (
            <>Generate</>
          )}
        </button>

        {/* LOADING STATE */}
        {lessonsLoading && (
          <div style={{
            marginTop: "40px",
            padding: "40px 20px",
            textAlign: "center",
            color: theme.textSecondary,
          }}>
            <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
            Loading lessons...
          </div>
        )}
      </div>
    </div>
  );
};

export default AddQuiz;