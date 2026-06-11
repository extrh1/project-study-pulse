import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiBook,
  FiBookOpen,
  FiList,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

const Sidebar = ({ darkMode }) => {
  const baseLink =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all";

  const activeLink = darkMode
    ? "bg-slate-800 text-blue-400"
    : "bg-gray-200 text-blue-600";

  const inactiveLink = darkMode
    ? "text-white hover:bg-slate-800"
    : "text-gray-800 hover:bg-gray-100";

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        position: "fixed",
        top: "64px",
        left: 0,
        background: darkMode ? "#0f172a" : "#ffffff",
        borderRight: "1px solid #ddd",
        padding: "20px",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>StudyPulse</h3>

      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiHome size={18} /> Home
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiGrid size={18} /> Dashboard
      </NavLink>

      <NavLink
        to="/subjects"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiBook size={18} /> Subjects
      </NavLink>

      <NavLink
        to="/courses"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiBookOpen size={18} /> Courses
      </NavLink>

      <NavLink
        to="/lessons"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiList size={18} /> Lessons
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiBarChart2 size={18} /> Stats
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiSettings size={18} /> Settings
      </NavLink>

      <NavLink
        to="/support"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : inactiveLink}`
        }
      >
        <FiHelpCircle size={18} /> Support
      </NavLink>
    </div>
  );
};

export default Sidebar;