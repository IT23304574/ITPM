// chatValidation.js
exports.canUserChat = (trip, userId) => {
  const isOrganizer = trip.organizer.toString() === userId;
  const isJoined = trip.joinedStudents.some(s => (s.user || s).toString() === userId);
  return isOrganizer || isJoined;
};
// chatHandler.js
exports.addMessageToTrip = async (trip, userId, message) => {
  const newMsg = {
    sender: userId,
    message,
    timestamp: new Date()
  };
  trip.chat.push(newMsg);
  await trip.save();
  await trip.populate('chat.sender', 'studentId profileImage');
  return trip.chat;
};
// chatController.js
const { canUserChat } = require('./chatValidation');
const { addMessageToTrip } = require('./chatHandler');

exports.addChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    if (!canUserChat(trip, req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized to chat in this trip' });
    }

    const chat = await addMessageToTrip(trip, req.user.id, message);
    res.json(chat);
  } catch (err) {
    console.error('❌ Add chat error:', err.message);
    res.status(500).send('Server Error');
  }
};