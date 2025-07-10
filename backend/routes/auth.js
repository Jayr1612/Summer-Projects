const express = require('express');
const router = express.Router();
const { login, registerStudent } = require('../controllers/authController'); // Make sure you have authController.js

// Defines the API endpoints for authentication
router.post('/login', login);
router.post('/register/student', registerStudent); // Example registration route

module.exports = router;