// Get timetable for a specific student
exports.getTimetable = async (req, res) => {
    const { studentId } = req.params;
    // TODO: Replace with database query to build timetable for this studentId
    const mockTimetable = [
        { id: 'T001', course: 'CS101', time: 'Mon 9:00 AM', room: 'A101', studentId: studentId },
        { id: 'T002', course: 'MA201', time: 'Wed 11:00 AM', room: 'B203', studentId: studentId }
    ];
    res.json(mockTimetable);
};

// Get grades for a specific student
exports.getGrades = async (req, res) => {
    const { studentId } = req.params;
    // TODO: Replace with database query to find grades for this studentId
    const mockGrades = [
        { course: 'CS101', grade: 'A', gpa: 4.0, studentId: studentId },
        { course: 'MA201', grade: 'B+', gpa: 3.3, studentId: studentId }
    ];
    res.json(mockGrades);
};