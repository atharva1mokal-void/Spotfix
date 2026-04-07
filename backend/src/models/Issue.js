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
    enum: ['submitted', 'in_progress', 'resolved', 'rejected'],
    default: 'submitted'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  reportedBy: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  imageUrl: String,
  department: String,
  assignedTo: String,
  resolutionNotes: String,
  beforeImageUrl: String,
  afterImageUrl: String,
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

module.exports = mongoose.model('Issue', issueSchema);
