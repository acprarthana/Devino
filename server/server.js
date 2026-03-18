// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();
// const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   }),
// );
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));
// const projectRoutes = require("./routes/project.routes");
// app.use("/api/projects", projectRoutes);
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import Routes
const authRoutes = require("./routes/authRoutes"); 
const projectRoutes = require("./routes/project.routes");

// Initialize Environment Variables
dotenv.config();

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:3000", // Allows your React frontend to connect
  })
);
app.use(express.json()); // Allows the server to understand JSON data in requests

// 2. DATABASE CONNECTION
// This handles both MONGODB_URI and MONGO_URI to prevent connection errors
const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("✅ MongoDB Connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop the server if DB connection fails
  });

// 3. ROUTE DEFINITIONS
// Authentication Routes (Signup, Login, etc.)
app.use("/api/auth", authRoutes);

// Project Routes (Create, View, Delete projects)
app.use("/api/projects", projectRoutes);

// 4. SERVER STARTUP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

