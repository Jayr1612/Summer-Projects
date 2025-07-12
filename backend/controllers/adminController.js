const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// --- Get all users (excluding passwords) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error('Get All Users Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get mock course list (until DB model exists) ---
exports.getCourses = async (req, res) => {
    const mockCourses = [
        { id: 'CS101', name: 'Intro to Programming' },
        { id: 'MA201', name: 'Calculus I' }
    ];
    res.json(mockCourses);
};

// --- Get pending faculty registrations ---
exports.getPendingFaculty = async (req, res) => {
    try {
        const pendingFaculty = await User.find({ role: 'Faculty', isApproved: false }).select('-password');
        res.json(pendingFaculty);
    } catch (err) {
        console.error('Get Pending Faculty Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// --- Approve a faculty member ---
exports.approveFaculty = async (req, res) => {
    try {
        const faculty = await User.findById(req.params.id);
        if (!faculty || faculty.role !== 'Faculty') {
            return res.status(404).json({ msg: 'Faculty member not found or invalid role' });
        }

        // Generate QR and ID
        faculty.uniqueId = `FAC-${uuidv4().slice(0, 8).toUpperCase()}`;
        faculty.qrCodeDataUrl = await QRCode.toDataURL(faculty.uniqueId);
        faculty.isApproved = true;

        await faculty.save();

        res.json({
            msg: 'Faculty member approved successfully',
            faculty: {
                id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                department: faculty.department,
                uniqueId: faculty.uniqueId,
                qrCodeDataUrl: faculty.qrCodeDataUrl,
                isApproved: faculty.isApproved
            }
        });
    } catch (err) {
        console.error('Approve Faculty Error:', err.message);
        res.status(500).send('Server Error');
    }
};
