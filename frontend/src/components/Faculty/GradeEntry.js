// frontend/src/components/Faculty/GradeEntry.js
import React, { useState } from 'react';
import axios from 'axios';

const GradeEntry = () => {
    const [studentId, setStudentId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [grade, setGrade] = useState('');
    const [message, setMessage] = useState('');
    const facultyId = localStorage.getItem('userId');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!facultyId) {
            setMessage('Faculty ID not found. Cannot submit grade.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/api/faculty/${facultyId}/grades`, {
                studentId,
                courseId,
                grade,
            });
            setMessage(response.data.message + ` (Grade: ${response.data.data.grade})`);
            setStudentId('');
            setCourseId('');
            setGrade('');
        } catch (err) {
            setMessage('Failed to submit grade.');
            console.error('Error submitting grade:', err);
        }
    };

    return (
        <div>
            <h4>Enter Student Grades</h4>
            <p>This is where you'll implement UI for entering grades for students.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Course ID"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Grade (e.g., A, B+)"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                />
                <button type="submit">Submit Grade</button>
            </form>
            {message && <p>{message}</p>}
            {/* Add your UI elements here */}
        </div>
    );
};

export default GradeEntry;