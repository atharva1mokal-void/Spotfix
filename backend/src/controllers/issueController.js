const Issue = require('../models/Issue');

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ reportedAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching issues', error: err.message });
  }
};

// Report a new issue
exports.createIssue = async (req, res) => {
  try {
    const issueData = req.body;
    if (req.file) {
      issueData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Parse location if it comes as a string (from FormData)
    if (typeof issueData.location === 'string') {
      issueData.location = JSON.parse(issueData.location);
    }

    const newIssue = new Issue({
      ...issueData,
      reportedBy: req.user.id // Use authenticated user's ID
    });
    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    res.status(400).json({ message: 'Error creating issue', error: err.message });
  }
};

// Get a single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching issue', error: err.message });
  }
};

// Update an issue (for authorities/admin)
exports.updateIssue = async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true }
    );
    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: 'Error updating issue', error: err.message });
  }
};
