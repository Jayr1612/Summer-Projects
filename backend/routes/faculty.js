const express = require('express');
const router = express.Router();
const { getFacultyClasses, submitGrades } = require('../controllers/facultyController');

// GET /api/faculty/FAC123/classes
router.get('/:facultyId/classes', getFacultyClasses);

// POST /api/faculty/FAC123/grades
router.post('/:facultyId/grades', submitGrades);

module.exports = router;