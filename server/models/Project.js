const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    projectType: {
      type: String,
      required: true,
      enum: ["restaurant", "portfolio", "ecommerce"],
    },
    currentStage: {
      type: Number,
      default: 1,
    },
    completedStages: {
      type: [Number],
      default: [],
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);
module.exports = mongoose.model("Project", projectSchema);
