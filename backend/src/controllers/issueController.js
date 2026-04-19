const Issue = require('../models/Issue');
const User = require('../models/User');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Department routing: matches frontend categoryConfig exactly
// roads     → Roads & Potholes      → Public Works (PWD)
// water     → Water Supply          → Water Supply (CIDCO)
// garbage   → Garbage & Waste       → Sanitation Department
// sanitation→ Drainage & Sewage     → Sanitation Department
// streetlights → Street Lights      → Electrical Department
// other     → Other Issues          → General Administration
const categoryToDepartment = {
  roads: 'Public Works (PWD)',
  water: 'Water Supply (CIDCO)',
  garbage: 'Sanitation Department',
  sanitation: 'Sanitation Department',
  streetlights: 'Electrical Department',
  other: 'General Administration',
};

// GET /api/issues — All issues (Admin only)
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ reportedAt: -1 })
      .populate('reportedBy', 'name email')
      .populate('upvotedBy', 'name');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching issues', error: err.message });
  }
};

// GET /api/issues/my — Citizen's own issues
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ 
      $or: [
        { reportedBy: req.user.id },
        { upvotedBy: req.user.id }
      ]
    }).sort({ reportedAt: -1 }).populate('reportedBy', 'name email');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your issues', error: err.message });
  }
};

// GET /api/issues/community — All public issues for community feed (anonymized/filtered)
exports.getCommunityIssues = async (req, res) => {
  try {
    // Only return issues that are public (you can filter by status or distance here)
    // We populate only the first name or hide personal details for privacy
    const issues = await Issue.find({ reportedBy: { $ne: req.user.id } })
      .sort({ reportedAt: -1 })
      .limit(50) // Limit to avoid heavy payloads
      .populate('reportedBy', 'name'); // Only send name, not email/phone
    
    // Anonymize names (e.g. "Aditya K." instead of full name)
    const anonymizedIssues = issues.map(issue => {
      const obj = issue.toObject();
      if (obj.reportedBy && obj.reportedBy.name) {
        const names = obj.reportedBy.name.split(' ');
        obj.reportedBy.name = names.length > 1 ? `${names[0]} ${names[1].charAt(0)}.` : names[0];
      } else if (!obj.reportedBy) {
        obj.reportedBy = { name: 'Anonymous Neighbor' };
      }
      return obj;
    });

    res.json(anonymizedIssues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching community issues', error: err.message });
  }
};

// GET /api/issues/department — Issues for the authority's department
exports.getDepartmentIssues = async (req, res) => {
  try {
    let deptFilter = req.query.department || req.user.department;
    
    if (!deptFilter) {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      if (user) deptFilter = user.department;
    }

    if (!deptFilter) {
      return res.status(400).json({ message: 'No department found for this authority' });
    }
    const issues = await Issue.find({ department: deptFilter }).sort({ reportedAt: -1 })
      .populate('reportedBy', 'name email')
      .populate('upvotedBy', 'name');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching department issues', error: err.message });
  }
};

// GET /api/issues/analytics — Aggregated analytics for Admin
exports.getAnalytics = async (req, res) => {
  try {
    const [statusStats, categoryStats, departmentStats] = await Promise.all([
      // By status
      Issue.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // By category
      Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      // By department (resolved vs total)
      Issue.aggregate([
        {
          $group: {
            _id: '$department',
            total: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $in: ['$status', ['submitted', 'in_progress']] }, 1, 0] }
            },
          }
        }
      ]),
    ]);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrends = await Issue.aggregate([
      { $match: { reportedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$reportedAt' },
            month: { $month: '$reportedAt' },
          },
          submitted: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });

    res.json({
      totalIssues,
      resolvedIssues,
      resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0,
      pendingIssues: await Issue.countDocuments({ status: { $in: ['submitted', 'in_progress'] } }),
      statusStats,
      categoryStats,
      departmentStats,
      monthlyTrends,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics', error: err.message });
  }
};

// POST /api/issues — Report a new issue
exports.createIssue = async (req, res) => {
  try {
    const issueData = req.body;
    if (req.file) {
      issueData.beforeImageUrl = `/uploads/${req.file.filename}`;
      issueData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Parse location if it comes as a string (from FormData)
    if (typeof issueData.location === 'string') {
      issueData.location = JSON.parse(issueData.location);
    }

    // Auto-assign department based on category
    if (issueData.category && categoryToDepartment[issueData.category]) {
      issueData.department = categoryToDepartment[issueData.category];
    }

    const newIssue = new Issue({
      ...issueData,
      reportedBy: req.user.id,
    });
    const savedIssue = await newIssue.save();
    await savedIssue.populate('reportedBy', 'name email');
    res.status(201).json(savedIssue);
  } catch (err) {
    res.status(400).json({ message: 'Error creating issue', error: err.message });
  }
};

// GET /api/issues/:id — Get a single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('upvotedBy', 'name');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching issue', error: err.message });
  }
};

// PATCH /api/issues/:id — Update issue status (authority/admin)
exports.updateIssue = async (req, res) => {
  try {
    const updatePayload = { ...req.body, updatedAt: Date.now() };

    // Handle updateImage upload (for resolution or supplementary info)
    if (req.file) {
      if (req.body.status === 'pending_verification') {
        updatePayload.afterImageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.status === 'in_progress') {
        // If uploading an image while transitioning to in_progress (Provide Details)
        updatePayload.infoImageUrl = `/uploads/${req.file.filename}`;
      } else {
        // Fallback for general updates if needed
        updatePayload.afterImageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    ).populate('reportedBy', 'name email')
    .populate('upvotedBy', 'name');
    
    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });

    // BROADCAST UPDATE FOR REAL-TIME
    broadcastUpdate(updatedIssue);

    // AWARD KARMA ON RESOLUTION
    if (req.body.status === 'resolved') {
      try {
        // Reporter gets 50 karma
        await User.findByIdAndUpdate(updatedIssue.reportedBy._id, { $inc: { karma: 50 } });
        
        // Upvoters each get 10 karma
        if (updatedIssue.upvotedBy && updatedIssue.upvotedBy.length > 0) {
          await User.updateMany(
            { _id: { $in: updatedIssue.upvotedBy } },
            { $inc: { karma: 10 } }
          );
        }
      } catch (err) {
        console.error('Karma awarding failed:', err);
      }
    }

    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: 'Error updating issue', error: err.message });
  }
};

// PATCH /api/issues/:id/assign — Admin reassigns issue to a different department
exports.reassignIssue = async (req, res) => {
  try {
    const { department } = req.body;
    if (!department) return res.status(400).json({ message: 'Department is required' });

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { department, updatedAt: Date.now() },
      { new: true }
    ).populate('reportedBy', 'name email');

    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: 'Error reassigning issue', error: err.message });
  }
};

// PATCH /api/issues/:id/upvote — Toggle upvote
exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const userId = req.user.id;
    const hasUpvoted = issue.upvotedBy.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      issue.upvotedBy = issue.upvotedBy.filter(id => id.toString() !== userId);
    } else {
      // Add upvote
      issue.upvotedBy.push(userId);
    }

    await issue.save();
    const updatedIssue = await Issue.findById(req.params.id).populate('reportedBy', 'name email');
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: 'Error toggling upvote', error: err.message });
  }
};

// POST /api/issues/predict-category — Auto-detect issue type from image
exports.predictCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const filePath = path.join(__dirname, '../../', req.file.path);
    
    // Prepare form data for the Python AI service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    // Call Python AI service (running on port 8000)
    const response = await axios.post('http://localhost:8000/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Clean up: optionally delete the temp file if it's ONLY for prediction
    // However, the frontend usually uploads and then submits the whole form.
    // In our case, this is a "preview" prediction, so we can keep it or delete it.
    // For now, let's just return the result.

    res.json(response.data);
  } catch (err) {
    console.error('AI Prediction Error Details:', {
      message: err.message,
      code: err.code,
      url: err.config?.url,
      stack: err.stack
    });
    // If AI service is down, fall back gracefully
    res.status(503).json({ 
      success: false, 
      message: 'AI Service is currently unavailable. Please wait for the model to finish loading.', 
      error: err.message 
    });
  }
};

// --- REAL-TIME UPDATES (SSE) ---
let clients = [];

// GET /api/issues/stream — SSE for real-time updates
exports.streamIssues = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
};

// Helper to broadcast updates (called when an issue is updated)
const broadcastUpdate = (issue) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(issue)}\n\n`);
  });
};

// We need to modify updateIssue to call broadcastUpdate
// Actually, let's just export it so other controllers can use it if needed, 
// but we'll integrate it into updateIssue here.
