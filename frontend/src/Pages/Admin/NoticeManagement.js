// frontend/src/components/Admin/NoticeManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoticeManagement = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notices');
                setNotices(response.data);
            } catch (err) {
                setError('Failed to fetch notices.');
                console.error('Error fetching notices:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) return <p>Loading notices...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h4>Manage Notices and Academic Calendar</h4>
            <p>This is where you'll implement UI for creating, editing, and publishing notices.</p>
            <h5>Current Notices (from Backend):</h5>
            <ul>
                {notices.map(notice => (
                    <li key={notice.id}>{notice.title} - {notice.date}</li>
                ))}
            </ul>
            {/* Add your UI elements here */}
        </div>
    );
};

export default NoticeManagement;