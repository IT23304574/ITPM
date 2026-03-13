exports.addChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user is organizer or joined
    const isOrganizer = trip.organizer.toString() === req.user.id;
    const isJoined = trip.joinedStudents.some(s => (s.user || s).toString() === req.user.id);

    if (!isOrganizer && !isJoined) {
      return res.status(401).json({ msg: 'Not authorized to chat in this trip' });
    }

    const newMsg = {
      sender: req.user.id,
      message,
      timestamp: new Date()
    };

    trip.chat.push(newMsg);
    await trip.save();

    await trip.populate('chat.sender', 'studentId profileImage');
    res.json(trip.chat);
  } catch (err) {
    console.error('❌ Add chat error:', err.message);
    res.status(500).send('Server Error');
  }
};

// GET /trips/:id/chat (protected)
exports.getTripChat = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('chat.sender', 'studentId profileImage');
    
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Allow participants to see chat
    res.json(trip.chat);
  } catch (err) {
    console.error('❌ Get chat error:', err.message);
    res.status(500).send('Server Error');
  }
};
