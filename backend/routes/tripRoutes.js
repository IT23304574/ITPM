const express = require('express');
const router = express.Router();

const {

  addChatMessage,
  getTripChat,
} = require('../controllers/tripController');


router.post('/:id/chat', auth, addChatMessage);
router.get('/:id/chat', auth, getTripChat);

  createTrip,
  getAllTrips,
  joinTrip,
  deleteTrip,
  startTrip,
  addChatMessage,
  getTripChat,
  getOrganizerStats,
  getGlobalStats
} = require('../controllers/tripController');

const auth = require('../middleware/auth');

// All routes require auth
router.post('/create', auth, createTrip);
router.get('/', auth, getAllTrips);

// @route   GET api/trips/stats/global
// @desc    Get global average rating
// @access  Public
router.get('/stats/global', getGlobalStats);

// @route   GET api/trips/organizer/:userId/stats
// @desc    Get stats for a specific organizer
// @access  Private
router.get('/organizer/:userId/stats', auth, getOrganizerStats);

router.put('/join/:id', auth, joinTrip);
router.post('/join', auth, joinTrip);
router.delete('/:id', auth, deleteTrip);
router.put('/:id/start', auth, startTrip);
router.post('/:id/chat', auth, addChatMessage);
router.get('/:id/chat', auth, getTripChat);

module.exports = router;

