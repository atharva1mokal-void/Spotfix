const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['roads', 'water', 'garbage', 'sanitation', 'streetlights', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'in_progress', 'info_requested', 'pending_verification', 'resolved', 'rejected'],
    default: 'submitted'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: String,
  beforeImageUrl: String,
  afterImageUrl: String,
  infoImageUrl: String,
  department: { type: String },
  assignedTo: { type: String },
  resolutionNotes: { type: String },
  infoRequestMessage: { type: String },
  infoProvidedMessage: { type: String },
  adminVerificationNotes: { type: String },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
