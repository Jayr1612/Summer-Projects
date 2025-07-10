const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// --- Login Endpoint Logic ---
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // **FIX: Check for JWT_SECRET before attempting to sign a token**
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

// --- Student Registration with QR/ID ---
exports.registerStudent = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const uniqueId = `STU-${uuidv4().slice(0, 8).toUpperCase()}`;
        const qrCodeDataUrl = await QRCode.toDataURL(uniqueId);
        
        const newUser = new User({ 
            email, 
            password, 
            name, 
            role: 'Student', 
            uniqueId, 
            qrCodeDataUrl 
        });
        
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        
        res.status(201).json({ message: "Student registered successfully", userId: newUser.id });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};