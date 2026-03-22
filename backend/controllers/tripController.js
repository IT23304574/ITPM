const Trip = require('../models/Trip');

const SEATS_BY_VEHICLE = {
  TukTuk: 2,       // Treewheeler
  'Small Car': 3,
  'Medium Car': 4,
  Van: 7
};

// POST /trips/create  (protected)
exports.createTrip = async (req, res) => {
  try {
    const { destination, vehicleType, totalFare, startLocation, phoneNumber, organizerGender, organizerAge, organizerYear, organizerSemester } = req.body;

    const type = vehicleType || 'TukTuk';
    const maxSeats = SEATS_BY_VEHICLE[type] || 2;

    const trip = new Trip({
      organizer: req.user.id || req.user._id, // Handle both id formats
      startLocation,
      phoneNumber,
      destination,
      vehicleType: type,
      maxSeats,
      totalFare: Number(totalFare),
      organizerGender,
      organizerAge,
      organizerYear,
      organizerSemester,
      joinedStudents: []
    });

    await trip.save();
    await trip.populate('organizer', 'studentId profileImage');

    res.status(201).json(trip);
  } catch (err) {
    console.error('❌ Create trip error:', err.message);
    res.status(500).send('Server Error');
  }
};

// GET /trips  (protected)
exports.getAllTrips = async (req, res) => {
  try {
    const { startLocation, destination } = req.query;
    const query = {};

    if (startLocation) {
      // Case-insensitive search for pickup location
      query.startLocation = { $regex: startLocation, $options: 'i' };
    }

    if (destination) {
      // Case-insensitive search for drop location
      query.destination = { $regex: destination, $options: 'i' };
    }

    // Exclude trips that have already started
    query.status = { $ne: 'started' };

    const trips = await Trip.find(query)
      .select('-chat') // Exclude chat history from the list view for performance
      .populate('organizer', 'studentId profileImage')
      .populate('joinedStudents.user', 'studentId gender profileImage')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error('❌ Get all trips error:', err.message);
    res.status(500).send('Server Error');
  }
};

// POST /trips/:id/chat (protected)
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

// PUT /trips/join/:id or POST /trips/join { tripId } (protected)
exports.joinTrip = async (req, res) => {
  try {
    const tripId = req.params.id || req.body.tripId;
    const { dropLocation, phoneNumber } = req.body;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    if (trip.status === 'started') {
      return res.status(400).json({ msg: 'Trip has already started' });
    }

    if (!phoneNumber) {
      return res.status(400).json({ msg: 'Phone number is required to join.' });
    }

    // Remove the user if they already joined (to allow updating details)
    // We use filter to handle both old schema (IDs) and new schema (Objects)
    let isUpdate = false;
    trip.joinedStudents = trip.joinedStudents.filter((student) => {
      const studentId = (student.user || student).toString();
      if (studentId === userId) {
        isUpdate = true;
        return false; // Remove existing entry
      }
      return true; // Keep others
    });

    // If it's a new join (not an update), check capacity
    if (!isUpdate && trip.joinedStudents.length >= trip.maxSeats - 1) {
      return res.status(400).json({ msg: 'Vehicle is full' });
    }

    trip.joinedStudents.push({ user: userId, dropLocation, phoneNumber });
    trip.markModified('joinedStudents');
    await trip.save();

    await trip.populate('organizer', 'studentId profileImage');
    await trip.populate('joinedStudents.user', 'studentId gender profileImage');
    res.json(trip);
  } catch (err) {
    console.error('❌ Join trip error:', err.message);
    res.status(500).send('Server Error');
  }
};

// DELETE /trips/:id (protected)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user is the organizer
    if (trip.organizer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await trip.deleteOne();

    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error('❌ Delete trip error:', err.message);
    res.status(500).send('Server Error');
  }
};

// PUT /trips/:id/start (protected)
exports.startTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    if (trip.organizer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    trip.status = 'started';
    await trip.save();

    // // Automatically delete the trip after 15 seconds
    // setTimeout(async () => {
    //   try {
    //     await Trip.findByIdAndDelete(req.params.id);
    //     console.log(`✅ Trip ${req.params.id} automatically deleted after 15 seconds.`);
    //   } catch (err) {
    //     console.error(`❌ Error auto-deleting trip ${req.params.id}:`, err.message);
    //   }
    // }, 15000);

    res.json(trip);
  } catch (err) {
    console.error('❌ Start trip error:', err.message);
    res.status(500).send('Server Error');
  }
};