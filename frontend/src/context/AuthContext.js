import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if a token and user role exist in localStorage on initial load
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');

        if (token && userRole && userId) {
            setUser({ role: userRole, id: userId, token: token });
        }
        setLoading(false); // Finished loading initial auth state
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', userData.userType);
        localStorage.setItem('userId', userData.userId);
        setUser({ role: userData.userType, id: userData.userId, token: userData.token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setUser(null);
    };

    // The value provided to consuming components
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};