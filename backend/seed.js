const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing user to ensure password reset
    await User.deleteOne({ studentId: 'IT001' });
    await Admin.deleteOne({ adminId: 'ADM001' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    const user = new User({
      studentId: 'IT001',
      password: hashedPassword,
      role: 'student',
      isFirstLogin: true
    });
    await user.save();
    console.log('✅ User IT001 created/reset with password "123"');

    const admin = new Admin({
      adminId: 'ADM001',
      password: hashedPassword,
      role: 'admin',
      isFirstLogin: true
    });
    await admin.save();
    console.log('✅ Admin ADM001 created/reset with password "123"');

    await mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();