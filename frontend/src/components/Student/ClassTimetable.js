// frontend/src/components/Student/ClassTimetable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const studentId = localStorage.getItem('userId'); // Get current student ID

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!studentId) {
                setError('Student ID not found. Please log in again.');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/student/${studentId}/timetable`);
                setTimetable(response.data);
            } catch (err) {
                setError('Failed to fetch timetable.');
                console.error('Error fetching timetable:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, [studentId]);

    if (loading) return <p>Loading timetable...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h4>Your Class Timetable</h4>
            <p>This is where students can view their class schedules.</p>
            <h5>Your Timetable (from Backend):</h5>
            <ul>
                {timetable.map(item => (
                    <li key={item.id}>{item.course}: {item.time} in {item.room}</li>
                ))}
            </ul>
            {/* Add your UI elements here */}
        </div>
    );
};

export default ClassTimetable;