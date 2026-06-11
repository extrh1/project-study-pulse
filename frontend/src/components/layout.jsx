const Layout = ({ children, darkMode }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        marginTop: "64px",
        color: darkMode ? "#f8fafc" : "#0f172a",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a, #1e293b)"
          : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        transition: "all 0.3s",
      }}
    >
      {children}

      <footer
        style={{
          marginTop: 40,
          textAlign: "center",
          opacity: 0.75,
          fontSize: 14,
          color: darkMode ? "#cbd5e1" : "#475569",
        }}
      >
        Study Pulse © 2026 • Made with Heba for learners
      </footer>
    </div>
  );
};

export default Layout;