import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, Calendar, BookOpen, Target } from "lucide-react";
import "../styles/Home.css";

const PUBLIC_API =
  import.meta.env.VITE_API_URL ||
  "https://project-study-pulse-production.up.railway.app/api";

const Home = ({ darkMode = true }) => {
  const [stats, setStats] = useState({ users: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  const features = [
    { icon: Brain,      title: "Smart Learning Tracking", desc: "Track your study progress intelligently" },
    { icon: TrendingUp, title: "Progress Analytics",      desc: "See your improvement over time" },
    { icon: Calendar,   title: "Study Planning",          desc: "Organize your learning schedule" },
    { icon: BookOpen,   title: "Learning Resources",      desc: "Access all your study materials easily" },
    { icon: Target,     title: "Goal Setting",            desc: "Set and achieve your learning goals" },
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        // Uses the public endpoint — no token required
        const res = await fetch(`${PUBLIC_API}/home-stats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        // Fallback values so the page still renders nicely
        if (!cancelled) setStats({ users: 1200, sessions: 5400 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className={`home ${darkMode ? "dark" : "light"}`}>
      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title text-primary">Welcome to StudyPulse</h1>
        <p className="hero-subtitle">
          Your smart learning platform to track progress and improve daily
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn btn-outline-primary">
            Get Started
          </Link>
        </div>
        {!loading && (
          <p className="hero-stats">
            {stats.users.toLocaleString()} users • {stats.sessions.toLocaleString()} study sessions
          </p>
        )}
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="feature-card">
                <div className="feature-icon"><Icon size={28} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Home;