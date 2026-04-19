const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const issueController = require('../controllers/issueController');

// --- Specific routes BEFORE parameterized routes ---

// GET /api/issues/analytics — Admin analytics (must be before /:id)
router.get('/analytics', auth, issueController.getAnalytics);

// GET /api/issues/stream — SSE for real-time updates (must be before /:id)
router.get('/stream', auth, issueController.streamIssues);

// GET /api/issues/community — All public issues for community feed
router.get('/community', auth, issueController.getCommunityIssues);

// GET /api/issues/my — Citizen's own issues
router.get('/my', auth, issueController.getMyIssues);

// GET /api/issues/department — Authority's department issues
router.get('/department', auth, issueController.getDepartmentIssues);

// --- General routes ---

// GET /api/issues — All issues (Admin)
router.get('/', auth, issueController.getIssues);

// POST /api/issues/predict-category — Auto-detect issue type from image
router.post('/predict-category', [auth, upload.single('image')], issueController.predictCategory);

// POST /api/issues — Report a new issue (Citizen)
router.post('/', [auth, upload.single('image')], issueController.createIssue);

// GET /api/issues/:id — Get single issue
router.get('/:id', auth, issueController.getIssueById);

// PATCH /api/issues/:id — Update status/notes (Authority/Admin) with optional updateImage
router.patch('/:id', [auth, upload.single('updateImage')], issueController.updateIssue);

// PATCH /api/issues/:id/assign — Admin reassign department
router.patch('/:id/assign', auth, issueController.reassignIssue);

router.patch('/:id/upvote', auth, issueController.upvoteIssue);

module.exports = router;
