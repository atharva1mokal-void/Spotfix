const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['citizen', 'authority', 'admin'], required: true },
  department: { type: String },
  isBanned: { type: Boolean, default: false },
  karma: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
