const Recharge = require('../models/Recharge');
const User = require('../models/User');

exports.submitRecharge = async (req, res) => {
  try {
    const { name, studentId, amount } = req.body;
    
    // If using multer and sending file, it would be in req.file
    // For now, we assume the proof is sent either as a file or base64
    const proof = req.file ? req.file.buffer.toString('base64') : req.body.proof;

    const newRecharge = new Recharge({
      name,
      studentId: studentId?.trim(),
      amount,
      proof: proof || 'No proof provided'
    });

    await newRecharge.save();
    res.status(201).json({ msg: 'Recharge request submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getPendingRecharges = async (req, res) => {
  try {
    const recharges = await Recharge.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(recharges);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateRechargeStatus = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    const recharge = await Recharge.findById(req.params.id);
    if (!recharge) return res.status(404).json({ msg: 'Recharge request not found' });
    if (recharge.status !== 'pending') return res.status(400).json({ msg: 'Request already processed' });

    if (status === 'approved') {
      const user = await User.findOne({ studentId: recharge.studentId.trim() });
      if (!user) return res.status(404).json({ msg: 'Student not found' });
      
      user.balance = (user.balance || 0) + recharge.amount;
      await user.save();
    }

    recharge.status = status;
    await recharge.save();
    res.json({ msg: `Recharge ${status} successfully` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};