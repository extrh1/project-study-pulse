import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";

// ================= COMPONENTS =================
import Navbar from "./components/Navbar";
import AdminLayout from "./pages/admin/AdminLayout";

// ================= PAGES - USER =================
import Login from "./pages/login";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/support";
import EditProfile from "./pages/EditProfile";
import Stats from "./pages/stats"; 
import Subjects from "./pages/Subjects";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons"
import Badges from "./pages/Badges";
import Quizzes from "./pages/Quizzes";
import AddQuiz from "./pages/AddQuiz";
import EditQuiz from "./pages/EditQuiz";
import TakeQuiz from "./pages/TakeQuiz";

// ================= PAGES - ADMIN =================
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminCourses from "./pages/admin/Courses";
import AdminSubjects from "./pages/admin/Subjects";
import AdminLessons from "./pages/admin/Lessons";
import AdminBadges from "./pages/admin/Badges";

import AddCategory from "./pages/admin/addCategory";
import AddCourse from "./pages/admin/AddCourse";
import AddSubject from "./pages/admin/AddSubject";
import AddLesson from "./pages/admin/AddLesson";
import AddBadge from "./pages/admin/AddBadge";

import EditCategory from "./pages/admin/EditCategory";
import EditCourse from "./pages/admin/EditCourse";
import EditSubject from "./pages/admin/EditSubject";
import EditLesson from "./pages/admin/EditLesson";
import EditBadge from "./pages/admin/EditBadge";

import CategoryDetails from "./pages/admin/ShowCategory";
import ShowCourse from "./pages/admin/ShowCourse";

// ================= OTHER =================
import NotFound from "./pages/notFound";
import Forgot from "./pages/forgot";
import ForgotVerify from "./pages/forgotVerify";
import ResetPassword from "./pages/ResetPassword";

// ================= PROTECTED ROUTE =================
import ProtectedRoute from "./routes/ProtectedRoute";

// ================= MAIN LAYOUT =================
const MainLayout = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="with-navbar">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Outlet />
    </div>
  );
};

// ================= APP =================
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/verify" element={<ForgotVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED USER ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home darkMode={darkMode} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/stats" element={<Stats darkMode={darkMode} />} />
          <Route path="/subjects" element={<Subjects darkMode={darkMode} />} />
          <Route path="/courses" element={<Courses darkMode={darkMode} />} />
          <Route path="/lessons" element={<Lessons darkMode={darkMode} />} />
          <Route path="/badges" element={<Badges darkMode={darkMode} />} />
          <Route path="/quizzes" element={<Quizzes darkMode={darkMode} />} />
          <Route path="/add-quiz" element={<AddQuiz darkMode={darkMode} />} />
          <Route path="/edit-quiz/:id" element={<EditQuiz darkMode={darkMode} />} />
          <Route path="/take-quiz/:id" element={<TakeQuiz darkMode={darkMode} />} />
          <Route path="/edit-profile" element={<EditProfile darkMode={darkMode} />} />
          <Route path="/support" element={<Support darkMode={darkMode} />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Dashboard */}
          <Route path="dashboard" element={<AdminDashboard darkMode={darkMode} />} />
          
          {/* Users */}
          <Route path="users" element={<AdminUsers darkMode={darkMode} />} />
          
          {/* Categories */}
          <Route path="categories" element={<AdminCategories darkMode={darkMode} />} />
          <Route path="addCategory" element={<AddCategory darkMode={darkMode} />} />
          <Route path="categories/:id" element={<CategoryDetails darkMode={darkMode} />} />
          <Route path="categories/edit/:id" element={<EditCategory darkMode={darkMode} />} />
          
          {/* Courses */}
          <Route path="courses" element={<AdminCourses darkMode={darkMode} />} />
          <Route path="addCourse" element={<AddCourse darkMode={darkMode} />} />
          <Route path="courses/:id" element={<ShowCourse darkMode={darkMode} />} />
          <Route path="courses/edit/:id" element={<EditCourse darkMode={darkMode} />} />
          
          {/* Subjects */}
          <Route path="subjects" element={<AdminSubjects darkMode={darkMode} />} />
          <Route path="addSubject" element={<AddSubject darkMode={darkMode} />} />
          <Route path="subjects/:id" element={<AdminSubjects darkMode={darkMode} />} />
          <Route path="subjects/edit/:id" element={<EditSubject darkMode={darkMode} />} />
          
          {/* Lessons */}
          <Route path="lessons" element={<AdminLessons darkMode={darkMode} />} />
          <Route path="addLesson" element={<AddLesson darkMode={darkMode} />} />
          <Route path="lessons/:id" element={<AdminLessons darkMode={darkMode} />} />
          <Route path="lessons/edit/:id" element={<EditLesson darkMode={darkMode} />} />
          
          {/* Badges */}
          <Route path="badges" element={<AdminBadges darkMode={darkMode} />} />
          <Route path="addBadge" element={<AddBadge darkMode={darkMode} />} />
          <Route path="badges/:id" element={<AdminBadges darkMode={darkMode} />} />
          <Route path="badges/edit/:id" element={<EditBadge darkMode={darkMode} />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound darkMode={darkMode} />} />
      </Routes>
    </Router>
  );
}

export default App;