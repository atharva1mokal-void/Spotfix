require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Issue = require('./src/models/Issue');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SpotFix';

const departments = [
  'Public Works (PWD)',
  'Water Supply (CIDCO)',
  'Sanitation Department',
  'Electrical Department',
  'General Administration',
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Issue.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const authPassword = await bcrypt.hash('Auth@123', salt);
  const citizenPassword = await bcrypt.hash('Citizen@123', salt);

  // Create Admin
  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@spotfix.gov.in',
    mobile: '9999999999',
    password: adminPassword,
    userType: 'admin',
  });

  // Create Authorities (one per department)
  const authorities = await User.create([
    { name: 'Rajesh Kumar', email: 'pwd@spotfix.gov.in', mobile: '8888888881', password: authPassword, userType: 'authority', department: 'Public Works (PWD)' },
    { name: 'Priya Sharma', email: 'water@spotfix.gov.in', mobile: '8888888882', password: authPassword, userType: 'authority', department: 'Water Supply (CIDCO)' },
    { name: 'Sunil Patil', email: 'sanitation@spotfix.gov.in', mobile: '8888888883', password: authPassword, userType: 'authority', department: 'Sanitation Department' },
    { name: 'Meera Singh', email: 'electrical@spotfix.gov.in', mobile: '8888888884', password: authPassword, userType: 'authority', department: 'Electrical Department' },
    { name: 'Arun Verma', email: 'admin2@spotfix.gov.in', mobile: '8888888885', password: authPassword, userType: 'authority', department: 'General Administration' },
  ]);

  // Create Citizens
  const citizens = await User.create([
    { name: 'Amit Patel', email: 'amit@example.com', mobile: '9876543210', password: citizenPassword, userType: 'citizen' },
    { name: 'Sunita Joshi', email: 'sunita@example.com', mobile: '9876543211', password: citizenPassword, userType: 'citizen' },
    { name: 'Vikram Rao', email: 'vikram@example.com', mobile: '9876543212', password: citizenPassword, userType: 'citizen' },
  ]);

  console.log('👤 Users created');

  // Create sample issues
  const categoryToDept = {
    roads: 'Public Works (PWD)',
    water: 'Water Supply (CIDCO)',
    garbage: 'Sanitation Department',
    sanitation: 'Sanitation Department',
    streetlights: 'Electrical Department',
    other: 'General Administration',
  };

  const sampleIssues = [
    { title: 'Large pothole on MG Road', description: 'There is a large pothole near Sector 12 junction that has been there for 2 weeks. It is causing accidents.', category: 'roads', priority: 'high', status: 'submitted', location: { lat: 19.0330, lng: 73.0297, address: 'MG Road, Sector 12, Kharghar' }, reportedBy: citizens[0]._id },
    { title: 'Water pipe burst near park', description: 'The main water supply pipe near Central Park has burst. Water is flooding the road.', category: 'water', priority: 'high', status: 'in_progress', location: { lat: 19.0350, lng: 73.0310, address: 'Central Park, Kharghar' }, reportedBy: citizens[1]._id, assignedTo: 'Priya Sharma', resolutionNotes: null },
    { title: 'Overflowing garbage bin', description: 'The garbage bin near the bus stop has been overflowing for 3 days. It is causing a foul smell.', category: 'garbage', priority: 'medium', status: 'resolved', location: { lat: 19.0315, lng: 73.0285, address: 'Bus Stop, Sector 15, Kharghar' }, reportedBy: citizens[2]._id, resolutionNotes: 'Garbage collected and bin cleaned. Extra collection scheduled for this area.', assignedTo: 'Sunil Patil' },
    { title: 'Broken street light', description: 'Street light near Lane 5 has been non-functional for a week. Very unsafe at night.', category: 'streetlights', priority: 'medium', status: 'submitted', location: { lat: 19.0340, lng: 73.0320, address: 'Lane 5, Sector 8, Kharghar' }, reportedBy: citizens[0]._id },
    { title: 'Open manhole cover', description: 'There is an open manhole cover near the school. Very dangerous for children and pedestrians.', category: 'sanitation', priority: 'high', status: 'in_progress', location: { lat: 19.0325, lng: 73.0300, address: 'Near Primary School, Sector 14, Kharghar' }, reportedBy: citizens[1]._id, assignedTo: 'Sunil Patil' },
    { title: 'Road waterlogging after rain', description: 'The road near the market area gets completely flooded after every rain. Proper drainage needed.', category: 'roads', priority: 'medium', status: 'submitted', location: { lat: 19.0360, lng: 73.0290, address: 'Market Area, Kharghar' }, reportedBy: citizens[2]._id },
    { title: 'No street lights in the entire lane', description: 'The entire residential lane has no working street lights. Residents are afraid to walk at night.', category: 'streetlights', priority: 'high', status: 'resolved', location: { lat: 19.0305, lng: 73.0315, address: 'Residential Lane 3, Sector 11, Kharghar' }, reportedBy: citizens[0]._id, resolutionNotes: 'All 8 street lights in the lane have been repaired and tested.', assignedTo: 'Meera Singh' },
  ];

  for (const issue of sampleIssues) {
    issue.department = categoryToDept[issue.category] || 'General Administration';
  }

  await Issue.create(sampleIssues);
  console.log('📋 Sample issues created');

  console.log('\n✅ Database seeded successfully!\n');
  console.log('--- LOGIN CREDENTIALS ---');
  console.log('ADMIN:     admin@spotfix.gov.in / Admin@123');
  console.log('AUTHORITY (PWD):         pwd@spotfix.gov.in / Auth@123');
  console.log('AUTHORITY (Water):       water@spotfix.gov.in / Auth@123');
  console.log('AUTHORITY (Sanitation):  sanitation@spotfix.gov.in / Auth@123');
  console.log('AUTHORITY (Electrical):  electrical@spotfix.gov.in / Auth@123');
  console.log('CITIZEN:   amit@example.com / Citizen@123');
  console.log('CITIZEN:   sunita@example.com / Citizen@123');

  mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
