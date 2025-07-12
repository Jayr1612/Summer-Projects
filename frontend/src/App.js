import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Page imports (adjust if needed based on your project structure)
import LoginPage from './pages/Auth/LoginPage';
import RegistrationPage from './pages/Auth/RegistrationPage';

import AdminDashboard from './pages/Admin/AdminDashboard';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Faculty Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
            <Route path="/faculty" element={<FacultyDashboard />} />
          </Route>

          {/* Student Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
