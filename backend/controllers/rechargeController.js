const Recharge = require("../models/Recharge");

exports.createRecharge = async (req, res) => {
  try {
    const { name, studentId, amount } = req.body;

    // Validate required fields
    if (!name || !studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Name, Student ID, and Amount are required",
      });
    }

    let proof = null;
    if (req.file) {
      // Convert buffer to base64 string
      proof = req.file.buffer.toString('base64');
    }

    const newRecharge = new Recharge({
      name,
      studentId,
      amount: Number(amount),
      proof,
    });

    await newRecharge.save();

    res.status(201).json({
      success: true,
      message: "Recharge request submitted successfully. Payment verification is pending.",
      data: newRecharge,
    });
  } catch (error) {
    console.error('Error creating recharge:', error);
    res.status(500).json({
      success: false,
      message: "Error creating recharge",
      error: error.message,
    });
  }
};