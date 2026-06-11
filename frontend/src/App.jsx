import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/navbar";

// PAGES
import Login from "./pages/login";
import Home from "./pages/home";

// DASHBOARD
import Dashboard from "./pages/Dashboard";

// STATS, SETTINGS, SUPPORT
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Support from "./pages/support";

// PROFILE
import EditProfile from "./pages/EditProfile";

// 404 & PASSWORD RESET
import NotFound from "./pages/notFound";
import Forgot from "./pages/forgot";
import ForgotVerify from "./pages/forgotVerify";
import ResetPassword from "./pages/ResetPassword";

// SUBJECTS
import Subjects from "./pages/Subjects";
import AddSubject from "./pages/AddSubject";
import EditSubject from "./pages/EditSubject";

// LESSONS
import Lessons from "./pages/Lessons";
import AddLesson from "./pages/AddLesson";
import EditLesson from "./pages/EditLesson";

// COURSES
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";

// BADGES
import Badges from "./pages/Badges";
import AddBadge from "./pages/AddBadge";
import EditBadge from "./pages/EditBadge";

// QUIZZES
import Quizzes from "./pages/Quizzes";
import AddQuiz from "./pages/AddQuiz";
import EditQuiz from "./pages/EditQuiz";
import TakeQuiz from "./pages/TakeQuiz";

// PROTECTED ROUTE
import ProtectedRoute from "./routes/ProtectedRoute";

// LAYOUT
const Layout = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="with-navbar">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Outlet />
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/verify" element={<ForgotVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED */}
        <Route
          element={
            <ProtectedRoute>
              <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home darkMode={darkMode} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />

          {/* SUBJECTS */}
          <Route path="/subjects" element={<Subjects darkMode={darkMode} />} />
          <Route path="/add-subject" element={<AddSubject darkMode={darkMode} />} />
          <Route path="/edit-subject/:id" element={<EditSubject darkMode={darkMode} />} />

          {/* COURSES */}
          <Route path="/courses" element={<Courses darkMode={darkMode} />} />
          <Route path="/add-course" element={<AddCourse darkMode={darkMode} />} />
          <Route path="/edit-course/:id" element={<EditCourse darkMode={darkMode} />} />

          {/* LESSONS */}
          <Route path="/lessons" element={<Lessons darkMode={darkMode} />} />
          <Route path="/add-lesson" element={<AddLesson darkMode={darkMode} />} />
          <Route path="/edit-lesson/:id" element={<EditLesson darkMode={darkMode} />} />

          {/* BADGES */}
          <Route path="/badges" element={<Badges darkMode={darkMode} />} />
          <Route path="/add-badge" element={<AddBadge darkMode={darkMode} />} />
          <Route path="/edit-badge/:id" element={<EditBadge darkMode={darkMode} />} />

          {/* QUIZZES */}
          <Route path="/quizzes" element={<Quizzes darkMode={darkMode} />} />
          <Route path="/add-quiz" element={<AddQuiz darkMode={darkMode} />} />
          <Route path="/edit-quiz/:id" element={<EditQuiz darkMode={darkMode} />} />
          <Route path="/take-quiz/:id" element={<TakeQuiz darkMode={darkMode} />} />

          {/* OTHER */}
          <Route path="/stats" element={<Stats darkMode={darkMode} />} />
          <Route path="/edit-profile" element={<EditProfile darkMode={darkMode} />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} />} />
          <Route path="/support" element={<Support darkMode={darkMode} />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound darkMode={darkMode} />} />

      </Routes>
    </Router>
  );
}

export default App;