// frontend/src/components/Student/GradesGPA.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradesGPA = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const studentId = localStorage.getItem('userId'); // Get current student ID

    useEffect(() => {
        const fetchGrades = async () => {
            if (!studentId) {
                setError('Student ID not found. Please log in again.');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/student/${studentId}/grades`);
                setGrades(response.data);
            } catch (err) {
                setError('Failed to fetch grades.');
                console.error('Error fetching grades:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [studentId]);

    if (loading) return <p>Loading grades...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h4>Your Grades and GPA</h4>
            <p>This is where students can view their academic performance.</p>
            <h5>Your Grades (from Backend):</h5>
            <ul>
                {grades.map((gradeItem, index) => (
                    <li key={index}>{gradeItem.course}: {gradeItem.grade} (GPA: {gradeItem.gpa})</li>
                ))}
            </ul>
            {/* Add your UI elements here */}
        </div>
    );
};

export default GradesGPA;