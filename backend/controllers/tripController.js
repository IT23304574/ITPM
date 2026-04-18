const Trip = require('../models/Trip');

const User = require('../models/User');
const mongoose = require('mongoose');

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

// GET /trips/organizer/:userId/stats (protected)
exports.getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.params.userId;

    // Validate organizerId
    if (!mongoose.Types.ObjectId.isValid(organizerId)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    const stats = await Trip.aggregate([
      {
        $match: {
          organizer: new mongoose.Types.ObjectId(organizerId),
          rating: { $exists: true, $ne: null, $gt: 0 },
        },
      },
      {
        $group: {
          _id: '$organizer',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      res.json({
        averageRating: stats[0].averageRating,
        ratingCount: stats[0].ratingCount,
      });
    } else {
      res.json({ averageRating: 0, ratingCount: 0 });
    }
  } catch (err) {
    console.error('❌ Get organizer stats error:', err.message);
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

    if (!phoneNumber) {
      return res.status(400).json({ msg: 'Phone number is required to join.' });
    }

    // The user requested a 5ms delay. While this can sometimes reduce the chance of a race condition,
    // it is not a reliable solution. A much better approach is to use an atomic database operation
    // that checks conditions and updates the document in a single step, which we will do below.
    await new Promise(resolve => setTimeout(resolve, 5));

    // First, try to add the user to the trip only if they are not already in it and there is space.
    // This is an atomic operation and prevents race conditions.
    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        status: { $ne: 'started' },
        'joinedStudents.user': { $ne: userId }, // User is not already in the trip
        $expr: { $lt: [{ $size: '$joinedStudents' }, { $subtract: ['$maxSeats', 1] }] } // Check for available seats
      },
      {
        $push: { joinedStudents: { user: userId, dropLocation, phoneNumber } }
      },
      { new: true }
    );

    if (updatedTrip) {
      // Successfully joined the trip.
      await updatedTrip.populate('organizer', 'studentId profileImage');
      await updatedTrip.populate('joinedStudents.user', 'studentId gender profileImage');
      return res.json(updatedTrip);
    }

    // If the above operation failed, it could be for several reasons:
    // 1. The trip is full.
    // 2. The user has already joined (and might be trying to update their details).
    // 3. The trip has started.
    // 4. The trip doesn't exist.

    // Let's check the trip state to give a more specific error.
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    if (trip.status === 'started') {
      return res.status(400).json({ msg: 'Trip has already started' });
    }

    const isAlreadyJoined = trip.joinedStudents.some(student => (student.user || student).toString() === userId);

    if (isAlreadyJoined) {
      // The user is already in the trip, so let's update their details. This is also an atomic operation.
      const tripAfterUpdate = await Trip.findOneAndUpdate(
        { _id: tripId, 'joinedStudents.user': userId },
        {
          $set: {
            'joinedStudents.$.dropLocation': dropLocation,
            'joinedStudents.$.phoneNumber': phoneNumber
          }
        },
        { new: true }
      )
      .populate('organizer', 'studentId profileImage')
      .populate('joinedStudents.user', 'studentId gender profileImage');

      return res.json(tripAfterUpdate);
      }

    // If we reach here, the user was not already joined, and the initial atomic update failed.
    // The most likely remaining reason is that the vehicle is full.
    return res.status(400).json({ msg: 'Vehicle is full.' });

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
    if (req.body.rating) {
      const receivedRating = Number(req.body.rating);
      if (!isNaN(receivedRating) && receivedRating > 0) {
        trip.rating = receivedRating;
        console.log(`[DEBUG] Trip ID ${trip._id} is being updated with rating: ${trip.rating}`);
      } else {
        console.log(`[DEBUG] Received invalid rating value: ${req.body.rating}`);
      }
    }
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

// GET /trips/stats/global
exports.getGlobalStats = async (req, res) => {
  try {
    const ratingStats = await Trip.aggregate([
      { $match: { rating: { $exists: true, $gt: 0 } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    // Get trip counts by vehicle type
    const vehicleStats = await Trip.aggregate([
      { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
    ]);

    // Get top 3 destinations
    const topDestinations = await Trip.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalTrips = await Trip.countDocuments();

    res.json({
      averageRating: ratingStats.length > 0 ? ratingStats[0].averageRating : 0,
      totalUsers,
      totalTrips,
      vehicleStats,
      topDestinations
    });
  } catch (err) {
    console.error('❌ Get global stats error:', err.message);
    res.status(500).send('Server Error');
  }
};

