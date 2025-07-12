import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const [role, setRole] = useState('Student');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password, department } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        const url = role === 'Student' 
            ? 'http://localhost:5000/api/auth/register/student' 
            : 'http://localhost:5000/api/auth/register/faculty';
        
        try {
            const res = await axios.post(url, formData);
            setMessage(res.data.message);
            // Optional: redirect to login after a delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formBox}>
                <h2>Create Your Account</h2>
                <div style={styles.roleSelector}>
                    <button onClick={() => setRole('Student')} style={role === 'Student' ? styles.activeRole : styles.inactiveRole}>I am a Student</button>
                    <button onClick={() => setRole('Faculty')} style={role === 'Faculty' ? styles.activeRole : styles.inactiveRole}>I am a Faculty</button>
                </div>

                <form onSubmit={onSubmit}>
                    <input type="text" name="name" value={name} onChange={onChange} placeholder="Full Name" required style={styles.input} />
                    <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required style={styles.input} />
                    {role === 'Faculty' && (
                        <input type="text" name="department" value={department} onChange={onChange} placeholder="Department" required style={styles.input} />
                    )}
                    <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required minLength="6" style={styles.input} />
                    <button type="submit" style={styles.button}>Register</button>
                </form>

                {message && <p style={styles.successMessage}>{message}</p>}
                {error && <p style={styles.errorMessage}>{error}</p>}

                <p style={styles.loginLink}>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
        </div>
    );
};

// Styles for Registration Page
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' },
    formBox: { background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' },
    roleSelector: { display: 'flex', justifyContent: 'center', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    activeRole: { flex: 1, padding: '10px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' },
    inactiveRole: { flex: 1, padding: '10px', border: 'none', background: 'transparent', cursor: 'pointer' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    successMessage: { color: 'green', marginTop: '15px' },
    errorMessage: { color: 'red', marginTop: '15px' },
    loginLink: { marginTop: '20px' }
};

export default RegistrationPage;

