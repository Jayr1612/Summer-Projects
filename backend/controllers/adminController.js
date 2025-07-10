const User = require('../models/User');

// Get all users from the database
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and exclude their password field for security
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all courses (using mock data until a Course model is created)
exports.getCourses = async (req, res) => {
    // TODO: Replace this with a database query once you have a Course model
    const mockCourses = [
        { id: 'CS101', name: 'Intro to Programming' },
        { id: 'MA201', name: 'Calculus I' }
    ];
    res.json(mockCourses);
};