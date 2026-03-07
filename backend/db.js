const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed');
    console.error('-----------------------------');
    console.error(`Error: ${error.message}\n`);
    if (error.message.includes('querySrv')) {
      console.error('❌ HINT: Your network is blocking the DNS SRV lookup. Please use the "Standard Connection String" (mongodb://...) from MongoDB Atlas.');
    }
    if (error.message.includes('whitelisted')) {
      console.error('❌ HINT: Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('👉 Add your IP here: https://cloud.mongodb.com/v2#/security/network/accessList\n');
    }
    process.exit(1);
  }
};

module.exports = connectDB;