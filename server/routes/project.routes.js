const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProject,
  getProgress,
  submitCodeForReview,
  getStageSubmissions,
  retryStage,
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.get('/:id/progress', getProgress);
router.post('/:id/stages/:stage/submit', submitCodeForReview);
router.get('/:id/stages/:stage/submissions', getStageSubmissions);
router.post('/:id/stages/:stage/retry', retryStage);

module.exports = router;
