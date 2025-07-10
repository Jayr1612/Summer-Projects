// Get all notices
exports.getAllNotices = async (req, res) => {
    // TODO: Replace with database query once you have a Notice model
    const mockNotices = [
        { id: 'N001', title: 'Semester Exams Start', date: '2025-12-01' },
        { id: 'N002', title: 'Holiday Notification', date: '2025-08-15' }
    ];
    res.json(mockNotices);
};