const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const issueController = require('../controllers/issueController');

// 1. Get all issues
router.get('/', issueController.getIssues);

// 2. Report a new issue
router.post('/', [auth, upload.single('image')], issueController.createIssue);

// 3. Get a single issue by ID
router.get('/:id', issueController.getIssueById);

// 4. Update an issue (for authorities/admin)
router.patch('/:id', issueController.updateIssue);

module.exports = router;
