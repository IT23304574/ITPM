const mongoose = require('mongoose');

const RegistrationRequestSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    // Example validation for an IT number like 'IT23304574'
    match: [/^IT\d{8}$/, 'Please fill a valid IT number (e.g., IT23304574)']
  },
  message: {
    type: String,
    required: [true, 'A message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('RegistrationRequest', RegistrationRequestSchema);