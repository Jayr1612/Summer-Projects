import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

// --- FacultyApproval Component ---
const FacultyApproval = ({ token }) => {
    const [pending, setPending] = useState([]);

    const fetchPending = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/admin/faculty/pending', config);
            setPending(res.data);
        } catch (error) {
            console.error("Could not fetch pending faculty", error);
        }
    };

    useEffect(() => {
        if (token) fetchPending();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/faculty/approve/${id}`, {}, config);
            fetchPending();
        } catch (error) {
            console.error("Could not approve faculty", error);
        }
    };

    return (
        <div>
            {pending.length === 0 ? <p>No pending faculty registrations.</p> : (
                <ul style={styles.list}>
                    {pending.map(fac => (
                        <li key={fac._id} style={{ ...styles.listItem, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{fac.name} ({fac.email}) - {fac.department}</span>
                            <button onClick={() => handleApprove(fac._id)} style={styles.approveButton}>Approve</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Reusable List Display Components ---
const UserManagement = ({ users }) => (
    <ul style={styles.list}>
        {users.map(u => (
            <li key={u._id || u.id} style={styles.listItem}>
                {u.name} ({u.role || u.type}) - {u.email}
            </li>
        ))}
    </ul>
);

const CourseManagement = ({ courses }) => (
    <ul style={styles.list}>
        {courses.map(course => (
            <li key={course.id} style={styles.listItem}>
                {course.name} ({course.id})
            </li>
        ))}
    </ul>
);

// --- Placeholder Admin Tools ---
const TimetableManagement = () => <p>Timetable management tools will be here.</p>;
const NoticeManagement = () => <p>Academic calendar and notice management tools will be here.</p>;
const FeeManagement = () => <p>Fee management and payment tracking tools will be here.</p>;
const OverallManagement = () => <p>Overall site statistics and management tools will be here.</p>;

// --- Main Admin Dashboard ---
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                };
                const usersRes = await axios.get('http://localhost:5000/api/admin/users', config);
                setUsers(usersRes.data);

                const coursesRes = await axios.get('http://localhost:5000/api/admin/courses', config);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            }
        };

        if (user?.token) fetchData();
    }, [user]);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Admin Dashboard</h1>
                <button onClick={logout} style={styles.logoutButton}>Logout</button>
            </header>

            <div style={styles.content}>
                <div style={styles.section}>
                    <h2>Pending Faculty Registrations</h2>
                    <FacultyApproval token={user?.token} />
                </div>

                <div style={styles.section}>
                    <h2>User Management</h2>
                    <UserManagement users={users.filter(u => u.isApproved)} />
                </div>

                <div style={styles.section}>
                    <h2>Course & Department Management</h2>
                    <CourseManagement courses={courses} />
                </div>

                <div style={styles.section}>
                    <h2>Timetable Management</h2>
                    <TimetableManagement />
                </div>

                <div style={styles.section}>
                    <h2>Notice Management (Academic Calendar)</h2>
                    <NoticeManagement />
                </div>

                <div style={styles.section}>
                    <h2>Fee Management</h2>
                    <FeeManagement />
                </div>

                <div style={styles.section}>
                    <h2>Overall Management</h2>
                    <OverallManagement />
                </div>
            </div>
        </div>
    );
};

// --- Styles ---
const styles = {
    container: {
        fontFamily: 'sans-serif',
        backgroundColor: '#F4F7F9',
        minHeight: '100vh'
    },
    header: {
        backgroundColor: '#0B2A49',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoutButton: {
        backgroundColor: '#FFC107',
        color: '#0B2A49',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    content: {
        padding: '20px'
    },
    section: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    list: {
        listStyleType: 'none',
        padding: 0
    },
    listItem: {
        padding: '10px',
        borderBottom: '1px solid #eee'
    },
    approveButton: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default AdminDashboard;
