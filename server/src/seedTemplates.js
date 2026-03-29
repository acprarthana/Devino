const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('../models/Template');

dotenv.config();

const templates = [
  {
    name: 'Portfolio Website',
    projectType: 'portfolio',
    description: 'Build a personal portfolio to showcase your projects and skills',
    stageCount: 5,
    preloadCode: {
      stage1: '<!-- Start with your HTML skeleton -->',
      stage2: '// API endpoints and backend entrypoint',
      stage3: '// DB model scaffold',
      stage4: '// Auth implementation',
      stage5: '// Deployment pipeline example',
    },
    requirements: [
      'Stage 1: Frontend - Responsive HTML/CSS layout',
      'Stage 2: Backend - Express.js API with routes',
      'Stage 3: Database - MongoDB collections and queries',
      'Stage 4: Auth - JWT login/signup system',
      'Stage 5: Deploy - Production deployment on Vercel/Railway',
    ],
  },
  {
    name: 'Restaurant Website',
    projectType: 'restaurant',
    description: 'Build a restaurant site with menus, reservations, and ordering',
    stageCount: 5,
    preloadCode: {
      stage1: '<!-- Restaurant landing responsive frontend -->',
    },
    requirements: [
      'Stage 1: Frontend homepage, menu and reservation form',
      'Stage 2: Backend endpoints for menu and reservation',
      'Stage 3: Database for dishes, bookings, and users',
      'Stage 4: Auth/roles for admins and customers',
      'Stage 5: Deployment with SSL and CI/CD',
    ],
  },
  {
    name: 'E-Commerce Store',
    projectType: 'ecommerce',
    description: 'Build a full e-commerce shop with cart and checkout',
    stageCount: 5,
    preloadCode: {
      stage1: '<!-- E-commerce landing page and product grid -->',
    },
    requirements: [
      'Stage 1: Product catalog frontend with search',
      'Stage 2: Cart API and checkout flow',
      'Stage 3: Order persistence and inventory via MongoDB',
      'Stage 4: User accounts with authentication',
      'Stage 5: Production deployment and monitoring',
    ],
  },
];

async function run() {
  const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!dbURI) {
    throw new Error('Missing MongoDB URI environment variable');
  }

  await mongoose.connect(dbURI);

  const existing = await Template.countDocuments();
  if (existing > 0) {
    console.log(`Templates already seeded (${existing}). Skipping creation.`);
    const docs = await Template.find().lean();
    docs.forEach((t) => {
      console.log(`- ${t.projectType}: ${t._id} (${t.name})`);
    });
    process.exit(0);
  }

  for (const template of templates) {
    const saved = await Template.create(template);
    console.log(`Seeded ${saved.projectType}: ${saved._id}`);
  }

  console.log('Template seed complete.');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});