const mongoose = require('mongoose');

const RechargeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  proof: { type: String, required: true }, // Store filename or base64
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recharge', RechargeSchema);