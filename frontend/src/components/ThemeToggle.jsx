import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { lightTheme, darkTheme } from "../theme/colors";

function ThemeToggle({ darkMode, toggleDarkMode }) {
  const [hover, setHover] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

  // FIX: icon always visible
  const iconColor = darkMode ? "#ffffff" : "#0f172a";

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle theme"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? darkMode
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.06)"
          : "transparent",

        border: "none",
        cursor: "pointer",

        color: iconColor,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: "8px",
        borderRadius: "10px",

        transition: "all 0.2s ease",
      }}
    >
      {darkMode ? <Moon size={20} color={iconColor} /> : <Sun size={20} color={iconColor} />}
    </button>
  );
}

export default ThemeToggle;