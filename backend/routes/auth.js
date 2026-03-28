const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Ensure you have the auth middleware imported
const authController = require('../controllers/authController');

// ... existing routes (login, register, etc.) ...

// ADD THIS LINE:
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
