const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      required: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ["restaurant", "portfolio", "ecommerce"],
    },
    currentStage: {
      type: Number,
      default: 1,
    },
    stageStatus: {
      type: [
        {
          stageNumber: Number,
          status: {
            type: String,
            enum: ["locked", "unlocked", "in_progress", "passed", "failed", "skipped"],
            default: "locked",
          },
          attempts: { type: Number, default: 0 },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    completedStages: {
      type: [Number],
      default: [],
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    version: {
      type: Number,
      default: 1,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);
module.exports = mongoose.model("Project", projectSchema);
