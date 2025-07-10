// frontend/src/components/Faculty/ClassManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const facultyId = localStorage.getItem('userId'); // Get current faculty ID

    useEffect(() => {
        const fetchClasses = async () => {
            if (!facultyId) {
                setError('Faculty ID not found. Please log in again.');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/faculty/${facultyId}/classes`);
                setClasses(response.data);
            } catch (err) {
                setError('Failed to fetch classes.');
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [facultyId]);

    if (loading) return <p>Loading classes...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h4>Manage Your Classes</h4>
            <p>This is where you'll implement UI to view assigned classes, students in each class.</p>
            <h5>Assigned Classes (from Backend):</h5>
            <ul>
                {classes.map(cls => (
                    <li key={cls.id}>{cls.name} (ID: {cls.id})</li>
                ))}
            </ul>
            {/* Add your UI elements here */}
        </div>
    );
};

export default ClassManagement;