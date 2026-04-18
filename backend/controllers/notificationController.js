const Notification = require('../models/Notification');

exports.sendNotification = async (req, res) => {
  try {
    const { studentId, message } = req.body;
    if (!studentId || !message) {
      return res.status(400).json({ msg: 'Recipient and message are required' });
    }
    const newNotif = new Notification({ recipientId: studentId, message });
    await newNotif.save();
    res.status(201).json({ msg: 'Notification sent successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getStudentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};