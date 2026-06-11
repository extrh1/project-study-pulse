import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import {
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiAward,
  FiActivity,
  FiCheckCircle,
  FiStar
} from "react-icons/fi";

export default function Dashboard({ darkMode }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    progress: 0,
    studyTime: 0,
    badges: 0,
    level: 1,
    xp: 0,
    xpProgress: 0,
    xpForNextLevel: 100,
    xpPercentage: 0,
    quizzesAttempted: 0,
    quizzesPassed: 0,
    quizzesFailed: 0,
    averageQuizScore: 0,
    quizPassRate: 0,
    courseTrend: 0,
    studyTimeTrend: 0,
  });
  const [userBadges, setUserBadges] = useState([]);

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Learner");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        api.get("/profile"),
        api.get("/dashboard/stats"),
        api.get("/dashboard/activity"),
        api.get("/user/badges")
      ]);

      const [userRes, statsRes, activityRes, badgesRes] = results;

      if (userRes.status === "fulfilled") {
        const userData = userRes.value.data?.user || userRes.value.data;
        setUserName(userData?.name || "Learner");
      }

      if (statsRes.status === "fulfilled") {
        const statsData = statsRes.value.data?.stats || statsRes.value.data;
        setStats(statsData);
      }

      if (activityRes.status === "fulfilled") {
        setRecentActivity(activityRes.value.data || []);
      }

      if (badgesRes.status === "fulfilled") {
        setUserBadges(badgesRes.value.data || []);
      }

      if (results.some((result) => result.status === "rejected")) {
        console.warn("Dashboard partial load failure:", results);
      }
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = `Dashboard - Study Pulse`;
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const handleQuizSubmitted = () => {
      loadDashboard();
    };

    window.addEventListener("studyPulseQuizSubmitted", handleQuizSubmitted);
    return () => {
      window.removeEventListener("studyPulseQuizSubmitted", handleQuizSubmitted);
    };
  }, [loadDashboard]);

  const colors = {
    bg: darkMode
      ? "linear-gradient(135deg, #0f172a, #1e293b)"
      : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    text: darkMode ? "#f8fafc" : "#0f172a"
  };

  if (loading) {
    return (
      <Layout darkMode={darkMode} sidebar={<Sidebar darkMode={darkMode} />}>
        <LoadingDashboard darkMode={darkMode} />
      </Layout>
    );
  }

  const studyTimeTrend = typeof stats.studyTimeTrend === "number"
    ? stats.studyTimeTrend
    : Math.max(0, Math.ceil(stats.studyTime / 4));

  const courseTrend = typeof stats.courseTrend === "number"
    ? stats.courseTrend
    : 0;

  return (
    <Layout darkMode={darkMode} sidebar={<Sidebar darkMode={darkMode} />}>
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
          marginTop: "64px",
          background: colors.bg,
          color: colors.text
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Dashboard</h1>
              <p style={styles.subtitle}>
                Welcome back, {userName}!
              </p>
            </div>

            <div style={styles.refreshBtn} onClick={loadDashboard}>
              ↻ Refresh
            </div>
          </div>

          {/* LEVEL SECTION */}
          <div style={{ marginBottom: "3rem" }}>
            <div style={styles.levelContainer(darkMode)}>
              <div style={styles.levelInfo}>
                <div style={styles.levelBadge}>{stats.level}</div>

                <div>
                  <h2 style={styles.levelTitle}>{userName}'s Level</h2>
                  <p style={styles.levelDesc}>{stats.xp} XP</p>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={styles.xpProgressLabel}>
                  <span>
                    {stats.xpProgress}/{stats.xpForNextLevel}
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    {stats.xpPercentage}%
                  </span>
                </div>

                <div style={styles.progressBarContainer}>
                  <div
                    style={styles.progressBar(stats.xpPercentage)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BADGES SECTION */}
          {userBadges.length > 0 && (
            <div style={{ marginBottom: "3rem" }}>
              <div style={styles.badgesContainer(darkMode)}>
                <h3 style={styles.badgesTitle}>{userBadges[0]?.name || "Recent Badges"}</h3>
                <div style={styles.badgesGrid}>
                  {userBadges.slice(0, 6).map((userBadge) => (
                    <div key={userBadge.id} style={styles.badgeCard(darkMode)}>
                      <div style={styles.badgeIcon}>
                        <i className={userBadge.icon} style={{ fontSize: "1.5rem" }}></i>
                      </div>
                      <div style={styles.badgeInfo}>
                        <div style={styles.badgeName}>{userBadge.name}</div>
                        <div style={styles.badgeDesc}>{userBadge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {userBadges.length > 6 && (
                  <button style={styles.viewAllBadgesBtn} onClick={() => navigate('/badges')}>
                    View All Badges
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STATS */}
          <div style={styles.grid}>
            <Card
              icon={<FiStar />}
              title={`Level`}
              value={stats.level}
              trend={`${stats.xpProgress}/${stats.xpForNextLevel} XP`}
              positive={true}
              color="#ec4899"
              darkMode={darkMode}
            />

            <Card
              icon={<FiBookOpen />}
              title={`Total Courses`}
              value={stats.courses.toLocaleString()}
              trend={`${courseTrend >= 0 ? "+" : ""}${courseTrend}`}
              positive={courseTrend >= 0}
              color="#3b82f6"
              darkMode={darkMode}
            />

            <Card
              icon={<FiTrendingUp />}
              title={`Progress`}
              value={`${stats.progress}%`}
              trend={`+${Math.floor(stats.progress / 10)}%`}
              positive={true}
              color="#10b981"
              darkMode={darkMode}
            />

            <Card
              icon={<FiClock />}
              title={`Study Time`}
              value={`${stats.studyTime}h`}
              trend={`${studyTimeTrend >= 0 ? "+" : "-"}${Math.abs(studyTimeTrend)}h`}
              positive={studyTimeTrend >= 0}
              color="#f59e0b"
              darkMode={darkMode}
            />

            <Card
              icon={<FiAward />}
              title={'Badges'}
              value={stats.badges}
              trend={`+${Math.floor(stats.badges / 3)}`}
              positive={true}
              color="#8b5cf6"
              darkMode={darkMode}
            />

            <Card
              icon={<FiCheckCircle />}
              title={`Quizzes Attempted`}
              value={stats.quizzesAttempted.toLocaleString()}
              trend={`${stats.quizPassRate}% pass rate`}
              positive={stats.quizPassRate >= 70}
              color="#10b981"
              darkMode={darkMode}
            />

            <Card
              icon={<FiTrendingUp />}
              title={`Average Quiz Score`}
              value={`${stats.averageQuizScore}%`}
              trend={`${stats.quizzesPassed} passed`}
              positive={stats.averageQuizScore >= 70}
              color="#f59e0b"
              darkMode={darkMode}
            />
          </div>

          {/* RECENT ACTIVITY */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>{`${userName}'s Recent Activity`}</h3>
              <button style={styles.viewAllBtn}>{`View All ${userName}'s Activity`}</button>
            </div>

            {recentActivity.length > 0 ? (
              <div style={styles.activityList}>
                {recentActivity.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    activity={activity}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyActivity darkMode={darkMode} />
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Quick Actions</h3>
            </div>

            <div style={styles.actionButtons}>
              <ActionButton
                icon={<FiBookOpen />}
                label="Continue Learning"
                color="#3b82f6"
                darkMode={darkMode}
              />

              <ActionButton
                icon={<FiTrendingUp />}
                label="View Progress"
                color="#10b981"
                darkMode={darkMode}
              />

              <ActionButton
                icon={<FiAward />}
                label="Achievements"
                color="#f59e0b"
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ================= LOADING ================= */
const LoadingDashboard = ({ darkMode }) => {
  const colors = {
    text: darkMode ? "#94a3b8" : "#64748b",
    shimmer: darkMode ? "#1e293b" : "#f1f5f9"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        marginTop: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode ? "#0f172a" : "#f8fafc"
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            border: `4px solid ${colors.shimmer}`,
            borderTop: `4px solid ${colors.text}`,
            borderRadius: "50%",
            margin: "0 auto 2rem",
            animation: "spin 1s linear infinite"
          }}
        />

        <h2 style={{ color: colors.text, margin: "0 0 1rem 0" }}>
          Loading Dashboard...
        </h2>

        <p style={{ color: colors.text, opacity: 0.7 }}>
          Fetching your learning stats
        </p>
      </div>
    </div>
  );
};

/* ================= CARD ================= */
const Card = ({ icon, title, value, trend, positive, color, darkMode }) => (
  <div style={styles.cardBase(darkMode)}>
    <div style={styles.cardIcon(color)}>{icon}</div>

    <div>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>

      <div style={styles.trendIndicator}>
        <span style={{ color: positive ? "#10b981" : "#ef4444" }}>
          {positive ? "↑" : "↓"} {trend}
        </span>

        <span style={styles.trendText}>this week</span>
      </div>
    </div>
  </div>
);

/* ================= ACTIVITY ================= */
const ActivityItem = ({ activity, darkMode }) => (
  <div style={styles.activityItem(darkMode)}>
    <div style={styles.activityIcon}>
      <FiCheckCircle size={20} color="#10b981" />
    </div>

    <div style={{ flex: 1 }}>
      <p style={styles.activityTitle}>{activity.title}</p>
      <p style={styles.activityTime}>{activity.time}</p>
    </div>
  </div>
);

const EmptyActivity = ({ darkMode }) => (
  <div style={styles.emptyState(darkMode)}>
    <FiActivity size={48} color={darkMode ? "#94a3b8" : "#9ca3af"} />

    <h3
      style={{
        color: darkMode ? "#94a3b8" : "#6b7280",
        margin: "1rem 0 0.5rem 0"
      }}
    >
      No recent activity
    </h3>

    <p
      style={{
        color: darkMode ? "#64748b" : "#9ca3af",
        margin: 0
      }}
    >
      Start your first course to see activity here
    </p>
  </div>
);

/* ================= ACTION BUTTON ================= */
const ActionButton = ({ icon, label, color, darkMode }) => (
  <button style={styles.actionBtn(color, darkMode)}>
    <div style={styles.actionIcon(color)}>{icon}</div>
    <span>{label}</span>
  </button>
);

/* ================= STYLES ================= */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)"
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    lineHeight: 1.1
  },

  subtitle: {
    fontSize: "1.1rem",
    margin: "0.5rem 0 0 0",
    opacity: 0.8
  },

  refreshBtn: {
    padding: "8px 16px",
    background: "rgba(102, 126, 234, 0.2)",
    border: "1px solid rgba(102, 126, 234, 0.3)",
    borderRadius: "10px",
    color: "#667eea",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontWeight: "500"
  },

  levelContainer: (darkMode) => ({
    background: darkMode
      ? "rgba(30, 41, 59, 0.8)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: darkMode
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.06)",
    padding: "2rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "2rem"
  }),

  levelInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem"
  },

  levelBadge: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ec4899, #db2777)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#fff"
  },

  levelTitle: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: "700"
  },

  levelDesc: {
    margin: "0.5rem 0 0 0",
    opacity: 0.7,
    fontSize: "0.95rem"
  },

  xpProgressLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
    fontWeight: "500"
  },

  progressBarContainer: {
    width: "100%",
    height: "10px",
    background: "rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden"
  },

  progressBar: (percentage) => ({
    width: `${percentage}%`,
    height: "100%",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    transition: "width 0.3s ease",
    borderRadius: "10px"
  }),

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem"
  },

  cardBase: (darkMode) => ({
    background: darkMode
      ? "rgba(30, 41, 59, 0.8)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "2rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem"
  }),

  cardIcon: (color) => ({
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "1.25rem"
  }),

  cardTitle: {
    margin: "0 0 0.25rem 0",
    fontSize: "0.9rem",
    fontWeight: "500",
    opacity: 0.8,
    textTransform: "uppercase"
  },

  cardValue: {
    margin: 0,
    fontSize: "2.25rem",
    fontWeight: "800"
  },

  trendIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    marginTop: "0.5rem",
    fontSize: "0.85rem",
    fontWeight: "600"
  },

  trendText: {
    opacity: 0.7,
    fontSize: "0.8rem"
  },

  section: {
    marginTop: "2rem"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700"
  },

  viewAllBtn: {
    padding: "6px 14px",
    background: "rgba(102, 126, 234, 0.2)",
    border: "1px solid rgba(102, 126, 234, 0.3)",
    borderRadius: "8px",
    color: "#667eea",
    cursor: "pointer"
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },

  activityItem: (darkMode) => ({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem",
    background: darkMode
      ? "rgba(30, 41, 59, 0.6)"
      : "rgba(255, 255, 255, 0.8)",
    borderRadius: "14px"
  }),

  activityIcon: {
    flexShrink: 0
  },

  activityTitle: {
    margin: "0 0 0.25rem 0",
    fontWeight: "600"
  },

  activityTime: {
    margin: 0,
    fontSize: "0.85rem",
    opacity: 0.7
  },

  emptyState: (darkMode) => ({
    textAlign: "center",
    padding: "3rem 2rem",
    background: darkMode
      ? "rgba(30, 41, 59, 0.5)"
      : "rgba(255, 255, 255, 0.7)",
    borderRadius: "16px"
  }),

  actionButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem"
  },

  actionBtn: (color, darkMode) => ({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem 1.5rem",
    borderRadius: "16px",
    background: darkMode
      ? `rgba(${hexToRgb(color)}, 0.2)`
      : `rgba(${hexToRgb(color)}, 0.1)`,
    color,
    cursor: "pointer",
    fontWeight: "600",
    border: `1px solid rgba(${hexToRgb(color)}, 0.3)`
  }),

  actionIcon: (color) => ({
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff"
  }),

  // Badges styles
  badgesContainer: (darkMode) => ({
    background: darkMode
      ? "rgba(30, 41, 59, 0.8)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: darkMode
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.06)",
    padding: "2rem",
    borderRadius: "20px"
  }),

  badgesTitle: {
    margin: "0 0 1.5rem 0",
    fontSize: "1.5rem",
    fontWeight: "700"
  },

  badgesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem"
  },

  badgeCard: (darkMode) => ({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    background: darkMode
      ? "rgba(15, 23, 42, 0.8)"
      : "rgba(248, 250, 252, 0.8)",
    borderRadius: "12px",
    border: darkMode
      ? "1px solid rgba(255,255,255,0.05)"
      : "1px solid rgba(0,0,0,0.03)"
  }),

  badgeIcon: {
    fontSize: "2rem",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    borderRadius: "12px",
    flexShrink: 0,
    color: "#fff"
  },

  badgeInfo: {
    flex: 1
  },

  badgeName: {
    fontSize: "1rem",
    fontWeight: "700",
    marginBottom: "0.25rem"
  },

  badgeDesc: {
    fontSize: "0.85rem",
    opacity: 0.7,
    lineHeight: "1.4"
  },

  viewAllBadgesBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem"
  }
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0,0,0";
}