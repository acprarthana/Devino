const express = require('express');
const router = express.Router();
const Stage = require('../models/Stage');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const stages = await Stage.find().sort({ projectType:1, stageNumber:1 });
    res.json({ success: true, stages });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const stage = await Stage.findById(req.params.id);
    if (!stage) return res.status(404).json({ success: false, message: 'Stage not found' });
    res.json({ success: true, stage });
  } catch (err) {
    next(err);
  }
});

module.exports = router;