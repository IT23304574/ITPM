const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    isFirstLogin: {
      type: Boolean,
      default: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: ''
    },
    age: {
      type: Number
    },
    year: {
      type: String
    },
    semester: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);