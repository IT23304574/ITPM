const Recharge = require("../models/Recharge");

exports.createRecharge = async (req, res) => {
  try {
    const { name, studentId, amount } = req.body;

    let proof = null;
    if (req.file) {
      // Convert buffer to base64 string
      proof = req.file.buffer.toString('base64');
    }

    const newRecharge = new Recharge({
      name,
      studentId,
      amount,
      proof,
    });

    await newRecharge.save();

    res.status(201).json({
      success: true,
      message: "Recharge request submitted",
      data: newRecharge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating recharge",
      error: error.message,
    });
  }
};