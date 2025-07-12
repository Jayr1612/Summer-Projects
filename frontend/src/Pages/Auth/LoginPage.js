import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// --- SVG Icon Components for password visibility ---
const EyeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
    </svg>
);

const EyeSlashIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" {...props}>
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.94 5.94 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288.822.822.083.083.083.083a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.88 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 6.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
);
// --- End of SVG Icon Components ---

const LogoPlaceholder = () => (
    <div style={styles.logo}>
        Institution Logo
    </div>
);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // States for interactive UI styling
    const [isButtonHovered, setButtonHovered] = useState(false);
    const [isUserFocused, setUserFocused] = useState(false);
    const [isPassFocused, setPassFocused] = useState(false);

    const { login } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            
            login(response.data);

            const userType = response.data.userType;
            if (userType === 'Admin') {
                navigate('/admin');
            } else if (userType === 'Faculty') {
                navigate('/faculty');
            } else if (userType === 'Student') {
                navigate('/student');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', err);
        }
    };

    // Dynamic styles for interactive elements
    const buttonStyle = {
        ...styles.button,
        backgroundColor: isButtonHovered ? '#E69500' : styles.button.backgroundColor,
    };
    const userInputStyle = {
        ...styles.input,
        borderColor: isUserFocused ? '#FFA800' : '#CED4DA',
    };
     const passInputStyle = {
        ...styles.input,
        borderColor: isPassFocused ? '#FFA800' : '#CED4DA',
        paddingRight: '40px',
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <LogoPlaceholder />
                <h2 style={styles.title}>Sign in to your Portal</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email or ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={userInputStyle}
                            onFocus={() => setUserFocused(true)}
                            onBlur={() => setUserFocused(false)}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={passInputStyle}
                                onFocus={() => setPassFocused(true)}
                                onBlur={() => setPassFocused(false)}
                            />
                            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </span>
                        </div>
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button 
                        type="submit" 
                        style={buttonStyle}
                        onMouseEnter={() => setButtonHovered(true)}
                        onMouseLeave={() => setButtonHovered(false)}
                    >
                        Sign In
                    </button>
                </form>
                <a href="/forgot-password" style={styles.forgotPassword}>Forgot Password?</a>
                <div style={styles.mockCredentials}>
                    <strong>Mock Credentials:</strong><br />
                    Admin: admin@example.com / password123<br />
                    Faculty: faculty@example.com / password123<br />
                    Student: student@example.com / password123
                </div>
            </div>
        </div>
    );
};

// --- Styles using the "Gateway Gold" theme ---
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'sans-serif' },
    loginBox: { backgroundColor: '#FFFFFF', padding: '40px 30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', textAlign: 'center', width: '100%', maxWidth: '400px' },
    logo: { fontSize: '24px', fontWeight: 'bold', color: '#212529', marginBottom: '10px' },
    title: { color: '#212529', marginBottom: '25px', fontWeight: '600' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { textAlign: 'left' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#495057' },
    input: { width: '100%', padding: '12px', border: '1px solid #CED4DA', borderRadius: '4px', boxSizing: 'border-box', fontSize: '16px', transition: 'border-color 0.2s ease' },
    passwordWrapper: { position: 'relative', width: '100%' },
    eyeIcon: { position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6C757D' },
    button: { padding: '12px 20px', backgroundColor: '#FFA800', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', transition: 'background-color 0.2s ease' },
    error: { color: '#D93025', fontSize: '14px', textAlign: 'center' },
    forgotPassword: { display: 'block', marginTop: '20px', color: '#6C757D', textDecoration: 'none', fontSize: '14px' },
    mockCredentials: { marginTop: '25px', fontSize: '13px', color: '#6C757D', textAlign: 'left', borderTop: '1px solid #E9ECEF', paddingTop: '15px', lineHeight: '1.6' }
};

export default LoginPage;
