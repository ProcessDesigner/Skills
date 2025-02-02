import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/Signup";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import AdminPage from "./pages/AdminPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./custom/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import AboutPage from "./pages/AboutPage";
import TestPage from "./pages/TestPage";
import UserProfile from "./pages/UserProfile";
import LearningPath from "./pages/LearningPath";
import LandingPage from "./pages/LandingPage";
import TeacherTestCreation from "./pages/TeacherTestCreation";
import StudentTestDashboard from "./pages/TestDashboard";
import StudentMarksPage from "./pages/StudentMarks";
import TestResultsPage from "./pages/TestsResultsPage";
import GetMarks from "./pages/GetMarks";
import { getUser } from "./store/Slices/AuthSlice";
import ProtectedRoute from "./pages/Authentication/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userprofile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/testdashboard"
          element={
            <ProtectedRoute>
              <StudentTestDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createtest"
          element={
            // <ProtectedRoute requiredRole="teacher">
              <TeacherTestCreation />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/getmarks/*" element={<ProtectedRoute><GetMarks /></ProtectedRoute>} />
        <Route path="/previoustests" element={<ProtectedRoute><TestResultsPage /></ProtectedRoute>} />
        <Route path="/marks" element={<ProtectedRoute><StudentMarksPage /></ProtectedRoute>} />
        <Route path="/test/:id" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
        <Route path="/dsasheet" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
