// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Mock User Data (Replace with actual database logic later) ---
const users = {
    'admin@example.com': { password: 'adminpassword', userType: 'admin', id: 'ADM001' },
    'faculty@example.com': { password: 'facultypassword', userType: 'faculty', id: 'FAC001' },
    'student@example.com': { password: 'studentpassword', userType: 'student', id: 'STU001' },
    'stu123': { password: 'password', userType: 'student', id: 'STU123' }, // Example student ID login
    'fac456': { password: 'password', userType: 'faculty', id: 'FAC456' } // Example faculty code login
};
// ...existing code...

// --- Registration Endpoint ---
app.post('/api/register', (req, res) => {
    const { username, password, userType, id } = req.body;

    if (!username || !password || !userType || !id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (users[username]) {
        return res.status(409).json({ message: 'User already exists' });
    }

    users[username] = { password, userType, id };
    console.log(`User registered: ${username}`);
    res.status(201).json({ message: 'Registration successful', userType, userId: id });
});

// ...existing code...
// --- Login Endpoint ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    if (user && user.password === password) {
        console.log(`Login successful for: ${username}`);
        res.status(200).json({
            message: 'Login successful',
            userType: user.userType,
            userId: user.id
        });
    } else {
        console.log(`Login failed for: ${username}`);
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// --- Admin API Endpoints (Mock Data) ---
app.get('/api/admin/users', (req, res) => {
    res.json([
        { id: 'STU001', name: 'Alice Smith', type: 'student' },
        { id: 'FAC001', name: 'Dr. John Doe', type: 'faculty' },
        { id: 'ADM001', name: 'Super Admin', type: 'admin' }
    ]);
});

app.get('/api/admin/courses', (req, res) => {
    res.json([
        { id: 'CS101', name: 'Intro to Programming' },
        { id: 'MA201', name: 'Calculus I' }
    ]);
});

// --- Faculty API Endpoints (Mock Data) ---
app.get('/api/faculty/:facultyId/classes', (req, res) => {
    const { facultyId } = req.params;
    res.json([
        { id: 'C001', name: 'Web Dev Basics', facultyId: facultyId },
        { id: 'C002', name: 'Data Structures', facultyId: facultyId }
    ]);
});

app.post('/api/faculty/:facultyId/grades', (req, res) => {
    console.log(`Faculty ${req.params.facultyId} received grade entry:`, req.body);
    res.status(200).json({ message: 'Grade received (not saved)', data: req.body });
});

// --- Student API Endpoints (Mock Data) ---
app.get('/api/student/:studentId/timetable', (req, res) => {
    const { studentId } = req.params;
    res.json([
        { id: 'T001', course: 'CS101', time: 'Mon 9:00 AM', room: 'A101', studentId: studentId },
        { id: 'T002', course: 'MA201', time: 'Wed 11:00 AM', room: 'B203', studentId: studentId }
    ]);
});

app.get('/api/student/:studentId/grades', (req, res) => {
    const { studentId } = req.params;
    res.json([
        { course: 'CS101', grade: 'A', gpa: 4.0, studentId: studentId },
        { course: 'MA201', grade: 'B+', gpa: 3.3, studentId: studentId }
    ]);
});

// --- Generic Endpoints (e.g., Notices) ---
app.get('/api/notices', (req, res) => {
    res.json([
        { id: 'N001', title: 'Semester Exams Start', date: '2025-12-01' },
        { id: 'N002', title: 'Holiday Notification', date: '2025-08-15' }
    ]);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// backend/index.js

// ... (keep all the existing code for express, mongoose, cors, etc.)

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));       // <-- ADD THIS
app.use('/api/faculty', require('./routes/faculty'));   // <-- ADD THIS
app.use('/api/student', require('./routes/student'));   // <-- ADD THIS
app.use('/api/notices', require('./routes/notice'));     // <-- ADD THIS

// ... (keep the existing code for starting the server)