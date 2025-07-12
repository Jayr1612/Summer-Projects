// frontend/src/components/Admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/users');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h4>Manage Users (Students, Faculty, Staff)</h4>
            <p>This is where you'll implement user creation, editing, and deletion.</p>
            <p>Fetched {users.length} mock users from backend.</p>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} ({user.type}) - ID: {user.id}</li>
                ))}
            </ul>
            {/* Your UI for adding/editing/deleting users */}
        </div>
    );
};

export default UserManagement;