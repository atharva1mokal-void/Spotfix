const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['citizen', 'authority', 'admin'], required: true },
  department: { type: String },
});

module.exports = mongoose.model('User', userSchema);
