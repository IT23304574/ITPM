const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startLocation: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    vehicleType: {
      type: String,
      enum: ['TukTuk', 'Small Car', 'Medium Car', 'Van'],
      default: 'TukTuk',
      required: true
    },
    maxSeats: {
      type: Number,
      required: true
    },
    totalFare: {
      type: Number,
      required: true
    },
    organizerGender: {
      type: String
    },
    organizerAge: {
      type: Number
    },
    organizerYear: {
      type: String
    },
    organizerSemester: {
      type: String
    },
    status: {
      type: String,
      enum: ['planned', 'started', 'completed'],
      default: 'planned'
    },
    rating: {
      type: Number,
      default: 0
    },
    joinedStudents: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        dropLocation: String,
        phoneNumber: String
      }
    ],
    chat: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);