import api from "../api/api";

export const createNotification = async (title, message, type = "info") => {
  try {
    const response = await api.post("/notifications", {
      title,
      message,
      type,
    });
    return response.data;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Quiz notifications
export const notifyQuizCompleted = async (quizTitle, score, passed) => {
  const title = passed ? "Quiz Passed" : "Quiz Not Passed";
  const message = `You completed "${quizTitle}" with a score of ${score}%.`;
  return createNotification(title, message, passed ? "success" : "warning");
};

// Badge notifications
export const notifyBadgeEarned = async (badgeName) => {
  const title = "Badge Unlocked";
  const message = `You've earned the "${badgeName}" badge!`;
  return createNotification(title, message, "success");
};

// Lesson notifications
export const notifyLessonCompleted = async (lessonTitle) => {
  const title = "Lesson Completed";
  const message = `Great job! You've completed "${lessonTitle}".`;
  return createNotification(title, message, "success");
};

// Course notifications
export const notifyCourseProgress = async (courseTitle, progress) => {
  const title = "Course Progress";
  const message = `Your progress in "${courseTitle}" is now ${progress}%.`;
  return createNotification(title, message, "info");
};

export default {
  createNotification,
  notifyQuizCompleted,
  notifyBadgeEarned,
  notifyLessonCompleted,
  notifyCourseProgress,
};
