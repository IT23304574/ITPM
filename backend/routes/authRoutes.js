const express = require('express');
const router = express.Router();
const {
  login,
  adminRegister,
  changePassword,
  getAllStudents,
  adminUpdateStudentPassword,
  updateProfile,
  deleteStudents
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public
router.post('/login', login);
router.post('/admin/register', adminRegister); // consider protecting in real use

// Protected
router.post('/change-password', auth, changePassword);
router.get('/students', auth, getAllStudents);
router.put('/admin/update-password', auth, adminUpdateStudentPassword);
router.put('/profile', auth, updateProfile);
router.delete('/students', auth, deleteStudents);

module.exports = router;