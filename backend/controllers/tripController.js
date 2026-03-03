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