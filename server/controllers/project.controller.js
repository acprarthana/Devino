const Project = require("../models/project");
const { analyzeCode } = require("../src/services/ai.service");
const AILog = require("../models/AILog");

exports.submitCodeForReview = async (req, res) => {
  try {
    const { codeSnippet, stage, projectContext } = req.body; 
    const projectId = req.params.id;
    const feedback = await analyzeCode(codeSnippet, stage, projectContext);

    const aiLog = new AILog({
      projectId, 
      codeSnippet,
      feedback, 
      timestamp: new Date() 
    });
    await aiLog.save();

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    console.error('Error in code review:', error);
    res.status(500).json({ success: false, message: 'AI review failed' });
  }
};
exports.createProject = async (req, res) => {
  try {
    const { projectType } = req.body;
    // if (!projectType) {
    //   return res.status(400).json({ message: "Project type is required" });
    // }
    const newProject = new Project({
      // userId: req.user.id,
      projectType,
      currentStage: 1,
      completedStages: [],
      progressPercentage: 0,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.completeStage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { stageNumber } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (stageNumber !== project.currentStage) {
      return res
        .status(400)
        .json({ message: "You must complete stages sequentially" });
    }
    if (project.completedStages.includes(stageNumber))
      return res.status(400).json({ message: "Stage already completed" });
    project.completedStages.push(stageNumber);
    project.currentStage += 1;
    const totalStages = 5;
    project.progressPercentage =
      (project.completedStages.length / totalStages) * 100;
    await project.save();
    res.status(200).json({
      message: "Stage completed successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};