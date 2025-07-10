const express = require('express');
const router = express.Router();
const { getAllUsers, getCourses } = require('../controllers/adminController');

// Defines the API endpoints
// GET /api/admin/users
router.get('/users', getAllUsers);

// GET /api/admin/courses
router.get('/courses', getCourses);

module.exports = router;