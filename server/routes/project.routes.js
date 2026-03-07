const express = require("express");
const router = express.Router();
const {
  createProject,
  completeStage,
  getAllProjects,
} = require("../controllers/project.controller");
router.post("/", createProject);
router.post("/:id/complete-stage", completeStage);
router.get("/", getAllProjects);
module.exports = router;
