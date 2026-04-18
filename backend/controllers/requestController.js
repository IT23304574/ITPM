const RegistrationRequest = require('../models/RegistrationRequest');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// @route   POST /api/requests
// @desc    Submit a new registration request
// @access  Public
exports.submitRequest = async (req, res) => {
  const { studentId, message } = req.body;

  if (!studentId) {
    return res.status(400).json({ msg: 'Please provide a Student ID.' });
  }

  try {
    // Check if user or a pending request already exists
    let user = await User.findOne({ studentId });
    if (user) {
      return res.status(400).json({ msg: 'A user with this Student ID already exists.' });
    }

    /* Previous Request Logic (Commented out for Direct Registration)
    let existingRequest = await RegistrationRequest.findOne({ studentId });
    if (existingRequest && existingRequest.status === 'pending') {
        return res.status(400).json({ msg: 'A registration request for this Student ID is already pending.' });
    }

    // If a previous request was rejected, allow them to create a new one by updating the old one
    if (existingRequest) {
        existingRequest.message = message;
        existingRequest.status = 'pending';
        await existingRequest.save();
        return res.status(200).json({ msg: 'Your previous request has been updated and resubmitted.' });
    }

    const newRequest = new RegistrationRequest({
      studentId,
      message,
    });

    await newRequest.save();

    res.status(201).json({ msg: 'Your registration request has been sent successfully. The admin will review it.' });
    */

    // --- New Direct Registration Logic ---

    // Generate a random password (8 characters)
    const generatedPassword = Math.random().toString(36).slice(2, 10);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    user = new User({
      studentId,
      password: hashedPassword,
      role: 'student',
      isFirstLogin: true
    });

    await user.save();

    // Send email
    const studentEmail = `${studentId.toLowerCase()}@my.sliit.lk`;

    // Check for credentials in multiple common env variable names
    const emailUser = process.env.EMAIL_USERNAME || process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: emailUser,
      to: studentEmail,
      subject: 'RideShare Account Created',
      text: `Welcome to RideShare!\n\nYour account has been created successfully.\n\nUsername: ${studentId}\nPassword: ${generatedPassword}\n\nPlease log in and change your password immediately.`
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(201).json({ msg: `Account created successfully. Login details sent to ${studentEmail}.` });
    } catch (emailErr) {
      console.error('❌ Failed to send email:', emailErr.message);
      // Fallback: If email fails, show password in response (for debugging/dev purposes)
      res.status(201).json({ 
        msg: `Account created, but email failed to send. Your password is: ${generatedPassword}`,
        emailError: true 
      });
    }
  } catch (err) {
    console.error('❌ Submit request error:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/requests
// @desc    Get all registration requests (for admin)
// @access  Private/Admin
exports.getRequests = async (req, res) => {
  try {
    const requests = await RegistrationRequest.find().sort({ status: 1, createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('❌ Get requests error:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/requests/:id/approve
// @desc    Approve a registration request and create user
// @access  Private/Admin
exports.approveRequest = async (req, res) => {
  // const { password } = req.body;

  // Generate a random password (8 characters)
  const generatedPassword = Math.random().toString(36).slice(2, 10);

  // if (!password) {
  //   return res.status(400).json({ msg: 'A password for the new user is required.' });
  // }

  try {
    const request = await RegistrationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found.' });
    }

    if (request.status !== 'pending') {
        return res.status(400).json({ msg: `This request has already been ${request.status}.` });
    }

    const { studentId } = request;

    let user = await User.findOne({ studentId });
    if (user) {
      request.status = 'rejected';
      await request.save();
      return res.status(400).json({ msg: 'A user with this Student ID already exists. Request has been rejected.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    user = new User({
      studentId,
      password: hashedPassword,
      role: 'student',
      isFirstLogin: true
    });
    await user.save();

    request.status = 'approved';
    await request.save();

    // Previous code:
    // res.json({ msg: `User ${studentId} created successfully.` });

    // New logic to send email
    const studentEmail = `${studentId.toLowerCase()}@my.sliit.lk`;

    const emailUser = process.env.EMAIL_USERNAME || process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use 'hotmail', 'outlook', etc.
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: emailUser,
      to: studentEmail,
      subject: 'RideShare Registration Approved',
      text: `Your registration request has been approved.\n\nUsername: ${studentId}\nPassword: ${generatedPassword}\n\nPlease log in and change your password immediately.`
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ msg: `User ${studentId} created successfully. Password sent to ${studentEmail}.` });
    } catch (emailErr) {
      console.error('❌ Failed to send email:', emailErr.message);
      res.json({ msg: `User ${studentId} created, but email failed. Password: ${generatedPassword}` });
    }
  } catch (err) {
    console.error('❌ Approve request error:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/requests/:id/reject
// @desc    Reject a registration request
// @access  Private/Admin
exports.rejectRequest = async (req, res) => {
    try {
        const request = await RegistrationRequest.findByIdAndUpdate(req.params.id, { status: 'rejected' });
        if (!request) return res.status(404).json({ msg: 'Request not found.' });
        res.json({ msg: `Request for ${request.studentId} has been rejected.` });
    } catch (err) {
        console.error('❌ Reject request error:', err.message);
        res.status(500).send('Server Error');
    }
};