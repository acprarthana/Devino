const mongoose = require("mongoose");
const stageSchema = new mongoose.Schema(
  {
    projectType: {
      type: String,
      required: true,
      enum: ["restaurant", "portfolio", "ecommerce"],
    },
    stageNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    problemStatement: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },
    expectedOutput: {
      type: String,
      default: "",
    },
    starterFiles: {
      type: [String],
      default: [],
    },
    tasks: {
      type: [String],
      default: [],
    },
    minScore: {
      type: Number,
      default: 60,
    },
    isLockedByDefault: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Stage", stageSchema);
