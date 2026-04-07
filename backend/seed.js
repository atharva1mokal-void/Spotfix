const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SpotFix';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const demoUsers = [
      {
        name: 'Demo Citizen',
        email: 'citizen@spotfix.gov',
        mobile: '1234567890',
        password: 'citizen123',
        userType: 'citizen'
      },
      {
        name: 'Traffic Authority',
        email: 'authority@spotfix.gov',
        mobile: '2345678901',
        password: 'authority123',
        userType: 'authority',
        department: 'transport'
      },
      {
        name: 'System Admin',
        email: 'admin@spotfix.gov',
        mobile: '3456789012',
        password: 'admin123',
        userType: 'admin'
      }
    ];

    for (const userData of demoUsers) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        const plainPassword = userData.password;
        userData.password = await bcrypt.hash(plainPassword, salt);
        
        await User.create(userData);
        console.log(`✅ Default ${userData.userType} created: ${userData.email} / ${plainPassword}`);
      } else {
        console.log(`ℹ️ ${userData.userType} already exists: ${userData.email}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
