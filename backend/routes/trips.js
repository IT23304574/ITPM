const express = require('express');
const router = express.Router();
const {
  createTrip,
  getAllTrips,
  joinTrip,
  deleteTrip,
  startTrip,
  addChatMessage,
  getTripChat,
  getOrganizerStats,
  getGlobalStats // Make sure this is imported
} = require('../controllers/tripController');
const auth = require('../middleware/authMiddleware'); // Assuming this is your auth middleware

// @route   POST api/trips/create
// @desc    Create a trip
// @access  Private
router.post('/create', auth, createTrip);

// @route   GET api/trips
// @desc    Get all trips
// @access  Private
router.get('/', auth, getAllTrips);

// @route   GET api/trips/stats/global
// @desc    Get global average rating
// @access  Public (or Private via auth if you prefer)
router.get('/stats/global', getGlobalStats); // IMPORTANT: This must be BEFORE /:id

// @route   GET api/trips/organizer/:userId/stats
// @desc    Get stats for a specific organizer
// @access  Private
router.get('/organizer/:userId/stats', auth, getOrganizerStats);

// @route   PUT api/trips/join/:id
// @desc    Join a trip
// @access  Private
router.put('/join/:id', auth, joinTrip);

// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', auth, deleteTrip);

// @route   PUT api/trips/:id/start
// @desc    Start a trip and save rating
// @access  Private
router.put('/:id/start', auth, startTrip);

// @route   POST api/trips/:id/chat
// @desc    Add a message to trip chat
// @access  Private
router.post('/:id/chat', auth, addChatMessage);

// @route   GET api/trips/:id/chat
// @desc    Get trip chat
// @access  Private
router.get('/:id/chat', auth, getTripChat);

module.exports = router;