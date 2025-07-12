// frontend/src/components/Student/NotificationsNotice.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsNotice = () => {
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

    if (loading) return <p>Loading notifications...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h4>Notifications and Notices</h4>
            <p>This is where students can view university-wide announcements and notifications.</p>
            <h5>Recent Notices (from Backend):</h5>
            <ul>
                {notices.map(notice => (
                    <li key={notice.id}><strong>{notice.title}</strong> - {notice.date}</li>
                ))}
            </ul>
            {/* Add your UI elements here */}
        </div>
    );
};

export default NotificationsNotice;