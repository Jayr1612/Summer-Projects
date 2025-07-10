const express = require('express');
const router = express.Router();
const { getTimetable, getGrades } = require('../controllers/studentController');

// GET /api/student/STU123/timetable
router.get('/:studentId/timetable', getTimetable);

// GET /api/student/STU123/grades
router.get('/:studentId/grades', getGrades);

module.exports = router;