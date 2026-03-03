// chatValidation.js
exports.canUserChat = (trip, userId) => {
  const isOrganizer = trip.organizer.toString() === userId;
  const isJoined = trip.joinedStudents.some(s => (s.user || s).toString() === userId);
  return isOrganizer || isJoined;
};