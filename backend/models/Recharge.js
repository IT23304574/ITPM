const mongoose = require("mongoose");

const rechargeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    amount: { type: Number, required: true },
    proof: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recharge", rechargeSchema);