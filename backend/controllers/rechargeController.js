const Recharge = require("../models/Recharge");

exports.createRecharge = async (req, res) => {
  try {
    const { name, studentId, amount } = req.body;

    const newRecharge = new Recharge({
      name,
      studentId,
      amount,
      proof: req.file ? req.file.path : null,
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