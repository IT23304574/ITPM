const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');

exports.submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message, studentId } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }
    const newMessage = new ContactMessage({ name, email, subject, message, studentId });
    await newMessage.save();
    res.status(201).json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error('Submit contact message error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    
    const enrichedMessages = await Promise.all(messages.map(async (msg) => {
      if (msg.studentId) {
        const user = await User.findOne({ studentId: msg.studentId }).select('gender age year semester').lean();
        if (user) msg.studentDetails = user;
      }
      return msg;
    }));

    res.json(enrichedMessages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};