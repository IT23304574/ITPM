const express = require('express');
const router = express.Router();
const {
  submitRequest,
  getRequests,
  approveRequest,
  rejectRequest
} = require('../controllers/requestController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/requests
// @desc    Submit a new registration request
// @access  Public
router.post('/', submitRequest);

// @route   GET /api/requests
// @desc    Get all registration requests
// @access  Private/Admin
router.get('/', auth, admin, getRequests);

// @route   POST /api/requests/:id/approve
// @desc    Approve a registration request
// @access  Private/Admin
router.post('/:id/approve', auth, admin, approveRequest);

// @route   POST /api/requests/:id/reject
// @desc    Reject a registration request
// @access  Private/Admin
router.post('/:id/reject', auth, admin, rejectRequest);

module.exports = router;