
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xssClean = require('xss-clean');


const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/project.routes');


const envFile = path.resolve(__dirname, '.env');
dotenv.config({ path: envFile });
console.log('Server cwd:', process.cwd());
console.log('Loading env from:', envFile);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));
app.use(xssClean());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// 2. DATABASE CONNECTION
// This handles both MONGODB_URI and MONGO_URI to prevent connection errors
const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!dbURI) {
  console.error(' MongoDB URI missing. Set MONGODB_URI or MONGO_URI in server/.env');
  process.exit(1);
}

mongoose
  .connect(dbURI)
  .then(() => console.log("✅ MongoDB Connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

// 3. ROUTE DEFINITIONS
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));

// Authentication Routes (Signup, Login, etc.)
app.use('/api/auth', authRoutes);

// Project Routes (Create, View, Delete projects)
app.use('/api/projects', projectRoutes);

// Stage Templates
const stageRoutes = require('./routes/stage.routes');
app.use('/api/stages', stageRoutes);

// 4. GLOBAL ERROR HANDLING
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

// 5. SERVER STARTUP
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

