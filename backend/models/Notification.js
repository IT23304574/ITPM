const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true }, // This will store the Student IT Number
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);