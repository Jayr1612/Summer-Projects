import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    // If still checking auth state, you can show a loader
    if (loading) {
        return <div>Loading...</div>;
    }
    
    // Check if user is authenticated and has one of the allowed roles
    const isAuthorized = isAuthenticated && allowedRoles.includes(user.role);

    if (!isAuthorized) {
        // If not authenticated or not authorized, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If authorized, render the child components (the actual dashboard)
    return <Outlet />;
};

export default ProtectedRoute;
