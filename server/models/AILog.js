const mongoose = require('mongoose'); 
const aiLogSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', 
    required: true 
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
  },
  stageNumber: { type: Number, required: true },
  codeSnippet: { 
    type: String, 
    required: true 
  },
  promptHash: { type: String },
  model: { type: String, default: 'gemini-1.5-flash' },
  rawResponse: { type: Object, default: {} },
  parsedFeedback: {
    approved: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    errors: { type: Array, default: [] },
    warnings: { type: Array, default: [] },
    suggestions: { type: Array, default: [] },
    message: { type: String, default: '' },
  },
  timestamp: { 
    type: Date,
    default: Date.now 
  }
});

const AILog = mongoose.model('AILog', aiLogSchema); 
module.exports = AILog; 