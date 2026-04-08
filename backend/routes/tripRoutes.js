const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
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

// All routes require auth (except where specified)

// Public routes
router.get('/stats/global', getGlobalStats);

// Private routes (require auth)
router.post('/create', auth, createTrip);
router.get('/', auth, getAllTrips);
router.get('/organizer/:userId/stats', auth, getOrganizerStats);
router.post('/join', auth, joinTrip);
router.delete('/:id', auth, deleteTrip);
router.put('/:id/start', auth, startTrip);
router.post('/:id/chat', auth, addChatMessage);
router.get('/:id/chat', auth, getTripChat);

module.exports = router;