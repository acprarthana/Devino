const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stage = require('../models/Stage');

dotenv.config();

const stages = [
  {
    projectType: 'portfolio',
    stageNumber: 1,
    title: 'Frontend UI',
    description: 'Build responsive portfolio homepage with hero and projects sections',
    problemStatement: 'Construct the frontend with HTML/CSS and optionally React components.',
    requirements: ['Mobile-first', 'Accessibility semantics', 'SEO heading structure', 'Dark mode toggle'],
    expectedOutput: 'A working static page that matches design spec',
    tasks: ['Create sections', 'Add navigation', 'Responsive layout', 'Include contact form placeholder'],
    minScore: 70,
    isLockedByDefault: false,
  },
  {
    projectType: 'portfolio',
    stageNumber: 2,
    title: 'Backend API',
    description: 'Implement REST API endpoints for project data and contact submissions',
    problemStatement: 'Create Express.js endpoints that serve project and message resources.',
    requirements: ['CRUD API', 'Input validation', 'Error handling', 'CORS protection'],
    expectedOutput: 'Working /api/projects and /api/contact routes',
    tasks: ['Create routes', 'Validate payload', 'Send email stub on contact'],
    minScore: 70,
    isLockedByDefault: false,
  },
  {
    projectType: 'portfolio',
    stageNumber: 3,
    title: 'Database Integration',
    description: 'Integrate MongoDB data model and persistence for users and projects',
    problemStatement: 'Design schemas and create database-backed endpoints.',
    requirements: ['Mongoose schemas', 'Project collection', 'User collection', 'Indexed fields'],
    expectedOutput: 'Data saved/retrieved from MongoDB',
    tasks: ['Define models', 'Add repository layer', 'Ensure transactions where needed'],
    minScore: 70,
    isLockedByDefault: false,
  },
  {
    projectType: 'portfolio',
    stageNumber: 4,
    title: 'Authentication',
    description: 'Add JWT auth and protected CRUD operations',
    problemStatement: 'Secure API with register/login and access control',
    requirements: ['bcrypt password', 'JWT access/refresh', 'roles', 'middleware'],
    expectedOutput: 'Only authenticated users can manage their portfolios',
    tasks: ['Implement auth routes', 'Protect endpoints', 'Refresh tokens'],
    minScore: 80,
    isLockedByDefault: false,
  },
  {
    projectType: 'portfolio',
    stageNumber: 5,
    title: 'Deployment',
    description: 'Build CI/CD and deploy to production environment',
    problemStatement: 'Setup GitHub Actions and environment config for staging/prod',
    requirements: ['key vault', 'config', 'health checks', 'monitoring'],
    expectedOutput: 'Deployed app reachable through URL',
    tasks: ['Add workflow file', 'Status badges', 'Rollback plan'],
    minScore: 80,
    isLockedByDefault: false,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  for (const stage of stages) {
    await Stage.findOneAndUpdate(
      { projectType: stage.projectType, stageNumber: stage.stageNumber },
      stage,
      { upsert: true, new: true }
    );
  }
  console.log('Stage templates seeded.');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});