const express = require('express');
const router = express.Router();
const multer = require('multer');
const rechargeController = require('../controllers/rechargeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Basic configuration for multer to handle memory storage for this example
// or you can configure diskStorage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
}); // 5MB limit

// @route   POST /api/recharge
router.post('/', upload.single('proof'), rechargeController.submitRecharge);

// @route   GET /api/recharge
router.get('/', auth, admin, rechargeController.getPendingRecharges);

// @route   PUT /api/recharge/:id
router.put('/:id', auth, admin, rechargeController.updateRechargeStatus);

module.exports = router;