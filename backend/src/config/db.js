const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (err.message.includes('IP not whitelisted')) {
      console.warn('⚠️ WARNING: Your IP address may not be whitelisted in MongoDB Atlas.');
    }
  }
};

module.exports = connectDB;
