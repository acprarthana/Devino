const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public template listing and fetch
router.get('/templates', templateController.listTemplates);
router.get('/templates/:id', templateController.getTemplate);

// Admin-only template management
router.post('/admin/templates', authenticate, authorize('admin'), templateController.createTemplate);
router.put('/admin/templates/:id', authenticate, authorize('admin'), templateController.updateTemplate);
router.delete('/admin/templates/:id', authenticate, authorize('admin'), templateController.deleteTemplate);

module.exports = router;