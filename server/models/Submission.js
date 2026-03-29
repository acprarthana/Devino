const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    stageNumber: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    codeSnippet: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'passed', 'failed', 'error'],
      default: 'pending',
    },
    attempt: {
      type: Number,
      default: 1,
    },
    aiResult: {
      approved: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      errors: { type: Array, default: [] },
      warnings: { type: Array, default: [] },
      suggestions: { type: Array, default: [] },
      raw: { type: Object, default: {} },
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Submission', submissionSchema);
