import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

import api from "../api/api";

const Stats = ({ darkMode }) => {
  const [data, setData] = useState([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/stats-chart");
      setData(res.data);
    } catch (err) {
      console.log("Stats error:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    window.addEventListener("studyPulseQuizSubmitted", fetchStats);
    return () => {
      window.removeEventListener("studyPulseQuizSubmitted", fetchStats);
    };
  }, [fetchStats]);

  const styles = {
    container: {
      minHeight: "calc(100vh - 64px)",
      padding: "40px 20px",
      color: darkMode ? "#f8fafc" : "#0f172a",
      background: darkMode
        ? "linear-gradient(135deg, #020617 0%, #111827 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      marginTop: "64px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "40px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginBottom: "10px",
      background: "linear-gradient(90deg, #38bdf8, #8b5cf6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      color: darkMode ? "#cbd5e1" : "#475569",
      marginBottom: "40px",
      maxWidth: "760px",
      lineHeight: 1.8,
    },
    chartCard: {
      width: "100%",
      height: 340,
      background: darkMode ? "rgba(30, 41, 59, 0.95)" : "#ffffff",
      padding: "24px",
      borderRadius: "24px",
      marginBottom: "30px",
      border: darkMode ? "1px solid rgba(148,163,184,0.16)" : "1px solid rgba(148,163,184,0.24)",
      boxShadow: darkMode
        ? "0 30px 80px rgba(15, 23, 42, 0.35)"
        : "0 25px 60px rgba(15, 23, 42, 0.08)",
    },
    chartHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
    },
    chartTitle: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: darkMode ? "#f8fafc" : "#111827",
      margin: 0,
    },
    chartSubtitle: {
      fontSize: "0.9rem",
      color: darkMode ? "#94a3b8" : "#64748b",
      margin: 0,
    },
    emptyState: {
      minHeight: "280px",
      display: "grid",
      placeItems: "center",
      color: darkMode ? "#cbd5e1" : "#475569",
      fontSize: "1rem",
      opacity: 0.85,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Learning Stats</h1>
          <p style={styles.subtitle}>
            Track your study progress and quiz performance over time.
          </p>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <p style={styles.chartTitle}>Study Progress</p>
              <p style={styles.chartSubtitle}>View your learning activity for the past week.</p>
            </div>
            <span style={styles.chartSubtitle}>Last 7 days</span>
          </div>

          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(148,163,184,0.18)" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={darkMode ? "#cbd5e1" : "#334155"} tickLine={false} axisLine={false} />
                <YAxis stroke={darkMode ? "#cbd5e1" : "#334155"} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: darkMode ? "#0f172a" : "#ffffff", borderRadius: 16, border: "1px solid rgba(148,163,184,0.2)" }} />
                <Line type="monotone" dataKey="hours" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyState}>Loading chart data…</div>
          )}
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <p style={styles.chartTitle}>Quiz Performance</p>
              <p style={styles.chartSubtitle}>Compare your quiz completion and scores.</p>
            </div>
          </div>

          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(148,163,184,0.18)" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={darkMode ? "#cbd5e1" : "#334155"} tickLine={false} axisLine={false} />
                <YAxis stroke={darkMode ? "#cbd5e1" : "#334155"} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: darkMode ? "#0f172a" : "#ffffff", borderRadius: 16, border: "1px solid rgba(148,163,184,0.2)" }} />
                <Bar dataKey="quizzes" fill="#f59e0b" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyState}>Loading chart data…</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;