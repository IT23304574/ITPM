const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { createRecharge } = require('../controllers/rechargeController');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory instead of disk

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Route to create a recharge request
router.post('/', auth, upload.single('proof'), createRecharge);

module.exports = router;