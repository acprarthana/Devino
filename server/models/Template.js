const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    projectType: {
      type: String,
      required: true,
      trim: true,
      enum: ['portfolio', 'restaurant', 'ecommerce'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    stageCount: {
      type: Number,
      required: true,
      default: 5,
      min: 1,
      max: 10,
    },
    preloadCode: {
      type: Map,
      of: String,
      default: {},
    },
    requirements: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'requirements must be a non-empty array of strings',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Template', templateSchema);