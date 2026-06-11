import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, BookOpen, BookMarked, Layers, FileText, Trophy, TrendingUp } from "lucide-react";
import logo from "../assets/logo-removebg-preview2.png";
import Notification from "./Notification";
import ProfileMenu from "./ProfileMenu";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const links = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Dashboard", icon: TrendingUp, path: "/dashboard" },
    { name: "Subjects", icon: Layers, path: "/subjects" },
    { name: "Courses", icon: BookOpen, path: "/courses" },
    { name: "Lessons", icon: FileText, path: "/lessons" },
    { name: "Quizzes", icon: BookMarked, path: "/quizzes" },
    { name: "Badges", icon: Trophy, path: "/badges" },
    { name: "Stats", icon: TrendingUp, path: "/stats" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "64px",
          background: darkMode ? "#0f172a" : "#f8fafc",
          color: darkMode ? "white" : "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 16px" : "0 32px",
          zIndex: 1000,
          boxShadow: darkMode
            ? "0 1px 10px rgba(0,0,0,0.3)"
            : "0 1px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: darkMode ? "white" : "#0f172a",
              }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          <img src={logo} alt="logo" style={{ height: isMobile ? "32px" : "36px" }} />
          {!isMobile && <strong>StudyPulse</strong>}
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: "none",
                    color:
                      location.pathname === link.path
                        ? "#38bdf8"
                        : darkMode
                        ? "white"
                        : "#0f172a",
                    fontWeight: location.pathname === link.path ? "600" : "500",
                    fontSize: "14px",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          {!isMobile && <Notification darkMode={darkMode} />}
          <ProfileMenu darkMode={darkMode} onLogout={handleLogout} />
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode ? "#0f172a" : "#f8fafc",
            zIndex: 999,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#38bdf8" : darkMode ? "white" : "#0f172a",
                  background: isActive
                    ? darkMode
                      ? "rgba(56, 189, 248, 0.15)"
                      : "rgba(56, 189, 248, 0.1)"
                    : "transparent",
                  fontWeight: isActive ? "600" : "500",
                  borderLeft: isActive ? "3px solid #38bdf8" : "3px solid transparent",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Navbar;