const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// --- Login Endpoint ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isApproved) {
            return res.status(403).json({ message: 'Your account is pending admin approval.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            userType: user.role,
            userId: user.id
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Student Registration ---
exports.registerStudent = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const uniqueId = `STU-${uuidv4().slice(0, 8).toUpperCase()}`;
        const qrCodeDataUrl = await QRCode.toDataURL(uniqueId);

        const newUser = new User({
            name,
            email,
            password,
            role: 'Student',
            uniqueId,
            qrCodeDataUrl,
            isApproved: true // Auto-approval for students
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        res.status(201).json({ message: "Student registration successful! You can now log in." });

    } catch (err) {
        console.error('Student Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- Faculty Registration ---
exports.registerFaculty = async (req, res) => {
    const { name, email, password, department } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
            department,
            role: 'Faculty',
            isApproved: false // Requires admin approval
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        res.status(201).json({ message: "Faculty registration successful! Your account is pending approval." });

    } catch (err) {
        console.error('Faculty Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
