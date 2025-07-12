import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

// --- Placeholder Components for each student feature ---
// In a real application, these would be in their own files.

const ClassTimetable = ({ timetable }) => (
    <ul style={styles.list}>
        {timetable.map(item => (
            <li key={item.id} style={styles.listItem}>
                <strong>{item.course}:</strong> {item.time} in Room {item.room}
            </li>
        ))}
    </ul>
);
const GradesGPA = ({ grades }) => (
     <ul style={styles.list}>
        {grades.map(item => (
            <li key={item.course} style={styles.listItem}>
                <strong>{item.course}:</strong> Grade {item.grade} (GPA: {item.gpa})
            </li>
        ))}
    </ul>
);
const CourseRegistration = () => <p>Course registration forms and status will be here.</p>;
const Attendance = () => <p>Your attendance records for all classes will be displayed here.</p>;
const FeePayment = () => <p>Fee payment portals and history will be available here.</p>;
const NotificationsNotice = () => <p>Important university notices and notifications will appear here.</p>;
const SupportFeedback = () => <p>A place to submit feedback or create support tickets.</p>;


const StudentDashboard = () => {
    const [timetable, setTimetable] = useState([]);
    const [grades, setGrades] = useState([]);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                };
                
                // Fetch timetable
                const timetableRes = await axios.get(`http://localhost:5000/api/student/${user.id}/timetable`, config);
                setTimetable(timetableRes.data);

                // Fetch grades
                const gradesRes = await axios.get(`http://localhost:5000/api/student/${user.id}/grades`, config);
                setGrades(gradesRes.data);

            } catch (error) {
                console.error("Failed to fetch student data", error);
            }
        };
        fetchData();
    }, [user]);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Student Dashboard</h1>
                <button onClick={logout} style={styles.logoutButton}>Logout</button>
            </header>
            <div style={styles.content}>
                <div style={styles.section}>
                    <h3>Class Timetable</h3>
                    <ClassTimetable timetable={timetable} />
                </div>
                <div style={styles.section}>
                    <h3>Grades & GPA</h3>
                    <GradesGPA grades={grades} />
                </div>
                <div style={styles.section}>
                    <h3>Course Registration</h3>
                    <CourseRegistration />
                </div>
                <div style={styles.section}>
                    <h3>Attendance</h3>
                    <Attendance />
                </div>
                <div style={styles.section}>
                    <h3>Fee Payment</h3>
                    <FeePayment />
                </div>
                <div style={styles.section}>
                    <h3>Notifications/Notices</h3>
                    <NotificationsNotice />
                </div>
                <div style={styles.section}>
                    <h3>Support (Feedback)</h3>
                    <SupportFeedback />
                </div>
            </div>
        </div>
    );
};

// Styles for the Student Dashboard (Digital Slate & Neon Teal theme)
const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#1A1D24', color: '#EAEAEA', minHeight: '100vh' },
    header: { backgroundColor: '#252A34', color: '#EAEAEA', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoutButton: { backgroundColor: '#00F6FF', color: '#1A1D24', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    content: { padding: '20px' },
    section: {
        backgroundColor: '#252A34',
        color: '#EAEAEA',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        border: '1px solid #333',
    },
    list: { listStyleType: 'none', padding: 0 },
    listItem: { padding: '10px', borderBottom: '1px solid #333' }
};

export default StudentDashboard;
