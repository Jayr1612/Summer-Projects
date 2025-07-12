import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

// --- Placeholder Components for each management section ---
// In a real application, these would be in their own files.

const ClassManagement = ({ classes }) => (
    <div>
        <h4>Your Classes:</h4>
        <ul style={styles.list}>
            {classes.map(c => (
                <li key={c.id} style={styles.listItem}>{c.name}</li>
            ))}
        </ul>
    </div>
);
const AttendanceMarking = () => <p>Tools for marking student attendance will be here.</p>;
const GradeEntry = () => <p>Forms for entering student grades will be here.</p>;
const CourseMaterialsUpload = () => <p>Uploader for course materials like PDFs and presentations.</p>;
const Messages = () => <p>A messaging center for communicating with students.</p>;
const Feedback = () => <p>A section to view feedback from students.</p>;


const FacultyDashboard = () => {
    const [classes, setClasses] = useState([]);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        // Fetch data specific to the logged-in faculty member
        const fetchData = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                };
                
                // Fetch classes for this faculty member
                const classesRes = await axios.get(`http://localhost:5000/api/faculty/${user.id}/classes`, config);
                setClasses(classesRes.data);

            } catch (error) {
                console.error("Failed to fetch faculty data", error);
            }
        };

        fetchData();
    }, [user]);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Faculty Dashboard</h1>
                <button onClick={logout} style={styles.logoutButton}>Logout</button>
            </header>
            
            <div style={styles.content}>
                <div style={styles.section}>
                    <h3>Class Management</h3>
                    <ClassManagement classes={classes} />
                </div>
                <div style={styles.section}>
                    <h3>Attendance Marking</h3>
                    <AttendanceMarking />
                </div>
                <div style={styles.section}>
                    <h3>Grade Entry</h3>
                    <GradeEntry />
                </div>
                <div style={styles.section}>
                    <h3>Course Materials Upload</h3>
                    <CourseMaterialsUpload />
                </div>
                <div style={styles.section}>
                    <h3>Messages</h3>
                    <Messages />
                </div>
                <div style={styles.section}>
                    <h3>Feedback</h3>
                    <Feedback />
                </div>
            </div>
        </div>
    );
};

// Styles for the Faculty Dashboard (Verdant Growth theme)
const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#F9F6F2', minHeight: '100vh' },
    header: { backgroundColor: '#2C5F2D', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoutButton: { backgroundColor: '#E87A5D', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    content: { padding: '20px' },
    section: {
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #CAD2C5'
    },
    list: { listStyleType: 'none', padding: 0 },
    listItem: { padding: '10px', borderBottom: '1px solid #eee' }
};

export default FacultyDashboard;