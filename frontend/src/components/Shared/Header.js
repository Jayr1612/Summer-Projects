// frontend/src/components/Shared/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ userType, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        onLogout(); // Clear state in App.js
        navigate('/');
    };

    return (
        <header style={headerStyles.header}>
            <h1 style={headerStyles.title}>University Management System</h1>
            <nav>
                <ul style={headerStyles.navList}>
                    {userType && (
                        <>
                            <li><Link to={`/${userType}`} style={headerStyles.navLink}>Dashboard</Link></li>
                            <li><button onClick={handleLogout} style={headerStyles.logoutButton}>Logout</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

const headerStyles = {
    header: {
        backgroundColor: '#282c34',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
        margin: 0,
        fontSize: '1.8em',
    },
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        gap: '20px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.1em',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    logoutButton: {
        background: 'none',
        border: '1px solid #ff4d4d',
        color: '#ff4d4d',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.1em',
        transition: 'background-color 0.2s, color 0.2s',
        '&:hover': {
            backgroundColor: '#ff4d4d',
            color: 'white',
        },
    },
};

export default Header;