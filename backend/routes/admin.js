const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getCourses,
    getPendingFaculty,
    approveFaculty
} = require('../controllers/adminController');

// --- Admin routes ---
router.get('/users', getAllUsers);
router.get('/courses', getCourses);
router.get('/faculty/pending', getPendingFaculty);
router.put('/faculty/approve/:id', approveFaculty); // PUT is appropriate for updates

module.exports = router;
