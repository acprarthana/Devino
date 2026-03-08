const express = require("express");
const router = express.Router();
const {submitCodeForReview} = require("../controllers/project.controller");
const {
  createProject,
  completeStage,
  getAllProjects,
} = require("../controllers/project.controller");
router.post("/:id/review", submitCodeForReview);
router.post("/", createProject);
router.post("/:id/complete-stage", completeStage);
router.get("/", getAllProjects);
module.exports = router;
