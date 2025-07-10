const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique IDs
const QRCode = require('qrcode');      // Import qrcode for QR generation
const User = require('./models/User'); 

// Load environment variables from .env file
dotenv.config();

// --- The user data you want to create ---
const usersToSeed = [
    {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin',
    },
    {
        name: 'Dr. Evelyn Reed',
        email: 'faculty@example.com',
        password: 'password123',
        role: 'Faculty',
        department: 'Computer Science'
    },
    {
        name: 'Alex Johnson',
        email: 'student@example.com',
        password: 'password123',
        role: 'Student',
    },
];

const seedDatabase = async () => {
    try {
        // --- 1. Connect to MongoDB Atlas ---
        if (!process.env.MONGO_URI) {
            console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // --- 2. Clear Existing Users ---
        await User.deleteMany({});
        console.log('Existing users cleared.');

        // --- 3. Process and Prepare Users for Insertion ---
        const processedUsers = await Promise.all(
            usersToSeed.map(async (user) => {
                // Encrypt the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                
                let uniqueId = null;
                let qrCodeDataUrl = null;

                // Generate Unique ID and QR Code only for Student and Faculty
                if (user.role === 'Student') {
                    uniqueId = `STU-${uuidv4().slice(0, 8).toUpperCase()}`;
                    qrCodeDataUrl = await QRCode.toDataURL(uniqueId);
                } else if (user.role === 'Faculty') {
                    uniqueId = `FAC-${uuidv4().slice(0, 8).toUpperCase()}`;
                    qrCodeDataUrl = await QRCode.toDataURL(uniqueId);
                }

                return { 
                    ...user, 
                    password: hashedPassword,
                    uniqueId: uniqueId,
                    qrCodeDataUrl: qrCodeDataUrl
                };
            })
        );
        
        // --- 4. Insert the New, Fully-Processed Users ---
        await User.insertMany(processedUsers);
        console.log('Database has been seeded successfully with IDs and QR codes!');
        
    } catch (error) {
        console.error('Error while seeding database:', error);
    } finally {
        // --- 5. Disconnect from the Database ---
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit();
    }
};

// --- Run the Seeder ---
seedDatabase();
