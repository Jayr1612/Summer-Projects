import React from 'react'; // 'useContext' would be imported here if needed
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

// Corrected import paths to match your file structure
import LoginPage from './Pages/LoginPage'; // Changed this line
import AdminDashboard from './components/Admin/AdminDashboard';
import FacultyDashboard from './components/Faculty/FacultyDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
                
                {/* Faculty Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
                    <Route path="/faculty" element={<FacultyDashboard />} />
                </Route>

                {/* Student Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
                    <Route path="/student" element={<StudentDashboard />} />
                </Route>
                
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" />} />

            </Routes>
        </Router>
    </AuthProvider>
  );
}

// Corrected the export statement
export default App;
