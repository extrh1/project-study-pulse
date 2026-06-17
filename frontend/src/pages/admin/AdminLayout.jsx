import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ darkMode = false, onToggleDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const colors = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    text: darkMode ? "#f1f5f9" : "#1e293b",
  };

  return (
    <div style={styles.wrapper(darkMode)}>
      <AdminSidebar 
        darkMode={darkMode} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <div style={styles.mainContainer(darkMode)}>
        <Navbar 
          darkMode={darkMode} 
          onToggleDarkMode={onToggleDarkMode}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main style={styles.content(darkMode, sidebarOpen)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: (darkMode) => ({
    display: "flex",
    minHeight: "100vh",
    background: darkMode ? "#0f172a" : "#f8fafc",
  }),

  mainContainer: (darkMode) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    marginLeft: "260px", // Default sidebar width
    transition: "margin-left 0.3s ease",
  }),

  content: (darkMode, sidebarOpen) => ({
    flex: 1,
    marginTop: "64px",
    marginLeft: sidebarOpen ? "0px" : "-180px", // Adjust when collapsed
    padding: "24px",
    background: darkMode ? "#0f172a" : "#f8fafc",
    minHeight: "calc(100vh - 64px)",
    transition: "all 0.3s ease",
  }),
};