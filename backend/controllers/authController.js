const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

const DEFAULT_PASSWORD = 'ChangeMe123';

// POST /auth/login
exports.login = async (req, res) => {
  const { studentId, password, role } = req.body;

  try {
    let user;
    if (role === 'Admin') {
      user = await Admin.findOne({ adminId: studentId });
    } else {
      user = await User.findOne({ studentId });
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (role !== 'Admin' && user.isBlocked) {
      return res.status(403).json({ msg: 'Your account has been blocked. Please contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      userId: user._id,
      studentId: user.studentId || user.adminId,
      role: user.role,
      isFirstLogin: user.isFirstLogin
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).send('Server Error');
  }
};

// POST /auth/admin/register
// NOTE: In a real app, protect this route and check req.user.role === 'admin'.
exports.adminRegister = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    let user = await User.findOne({ studentId });
    if (user) {
      return res.status(400).json({ msg: 'Student ID already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || DEFAULT_PASSWORD, salt);

    user = new User({
      studentId,
      password: hashedPassword,
      role: 'student',
      isFirstLogin: true
    });

    await user.save();

    res.status(201).json({
      msg: 'Student registered successfully',
      studentId: user.studentId
    });
  } catch (err) {
    console.error('❌ Admin register error:', err.message);
    res.status(500).send('Server Error');
  }
};

// POST /auth/change-password  (protected)
exports.changePassword = async (req, res) => {
  // Accept either 'newPassword' or 'password' from frontend
  const { newPassword, password } = req.body;
  const passwordToUpdate = newPassword || password;

  if (!req.user) {
    console.error("❌ Change Password Error: req.user is undefined. Check if authMiddleware is applied to this route.");
    return res.status(401).json({ msg: 'Unauthorized. Please log in again.' });
  }

  if (!passwordToUpdate) {
    return res.status(400).json({ msg: 'New password is required' });
  }

  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id);
    } else {
      user = await User.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(passwordToUpdate, salt);
    user.isFirstLogin = false;

    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Change password error:', err.message);
    res.status(500).send('Server Error');
  }
};

// GET /auth/students (protected, admin only)
exports.getAllStudents = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error('❌ Get students error:', err.message);
    res.status(500).send('Server Error');
  }
};

// PUT /auth/admin/update-password (protected, admin only)
exports.adminUpdateStudentPassword = async (req, res) => {
  const { studentId, newPassword } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Admin update password error:', err.message);
    res.status(500).send('Server Error');
  }
};

// PUT /auth/admin/toggle-block (protected, admin only)
exports.toggleBlockStudent = async (req, res) => {
  const { studentId } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ msg: `Student ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
  } catch (err) {
    console.error('❌ Admin toggle block error:', err.message);
    res.status(500).send('Server Error');
  }
};

// PUT /auth/profile (protected)
exports.updateProfile = async (req, res) => {
  try {
    const { profileImage, gender, age, year, semester } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (profileImage) user.profileImage = profileImage;
    if (gender) user.gender = gender;
    if (age) user.age = age;
    if (year) user.year = year;
    if (semester) user.semester = semester;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('❌ Update profile error:', err.message);
    res.status(500).send('Server Error');
  }
};

// DELETE /auth/students (protected, admin only)
exports.deleteStudents = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ msg: 'Invalid request: No IDs provided' });
    }
    await User.deleteMany({ _id: { $in: ids } });
    res.json({ msg: 'Students deleted successfully' });
  } catch (err) {
    console.error('❌ Bulk delete students error:', err.message);
    res.status(500).json({ msg: 'Server error: Failed to delete students' });
  }
};