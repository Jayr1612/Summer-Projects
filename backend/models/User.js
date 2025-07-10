const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Admin', 'Faculty', 'Student'],
    required: true
  },
  uniqueId: {
    type: String,
    unique: true,
    sparse: true // Allows this field to be null for some users (e.g., admin) without causing a unique index error
  },
  qrCodeDataUrl: {
    type: String
  },
  department: {
    type: String // Primarily for faculty
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
