const Template = require('../models/Template');

exports.createTemplate = async (req, res, next) => {
  try {
    const { name, projectType, description, stageCount = 5, preloadCode = {}, requirements } = req.body;

    if (!name || !projectType || !description || !requirements || !Array.isArray(requirements) || requirements.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields or invalid requirements' });
    }

    const template = new Template({ name, projectType, description, stageCount, preloadCode, requirements });
    await template.save();
    res.status(201).json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

exports.listTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find().sort({ projectType: 1, name: 1 });
    res.json({ success: true, templates });
  } catch (error) {
    next(error);
  }
};

exports.getTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.projectType && !['portfolio', 'restaurant', 'ecommerce'].includes(updates.projectType)) {
      return res.status(400).json({ success: false, message: 'Invalid projectType' });
    }

    const template = await Template.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
};