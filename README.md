# 🕷 Devino

## Project Overview

**Devino** is a stage-based web development learning platform with AI-powered code validation. It guides users through building complete, deployable full-stack applications using a structured workflow:

```
Frontend → Backend → Database → Authentication → Deployment
```

Each stage requires passing AI validation (powered by Google Gemini) before progression. This ensures learners complete real projects rather than isolated exercises.[file:1]

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js UI    │◄──►│   Express API    │◄──►│ MongoDB Atlas   │
│ (TypeScript)    │    │ (Node.js)        │    │ (Projects/Users)│
└─────────┬───────┘    └──────┬──────────┘    └─────┬──────────┘
         │                    │                      │
         │                    │                      │
         ▼                    ▼                      ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Stage Engine   │    │ Auth Middleware   │    │ Progress Data   │
│ (Progress Logic)│    │ (JWT/RBAC)        │    │ (Unlock Status) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    AI Validation Layer                        │
│                   (Google Gemini API)                         │
│  - Code Review                                                │
│  - JSON Response Parsing                                      │
│  - Stage Gatekeeping                                          │
└──────────────────────────────────────────────────────────────┘
```

**Data Flow**: User submits code → AI validates → Stage unlocks → Progress saved → UI updates.[file:1]

## Tech Stack

| Component     | Technology              |
|---------------|-------------------------|
| Frontend      | Next.js 14 (TypeScript), Tailwind CSS |
| Backend       | Node.js, Express.js     |
| Database      | MongoDB Atlas           |
| AI Validation | Google Gemini API       |
| Auth          | JWT, Role-Based Access  |
| Deployment    | GitHub Actions (CI/CD)  |[file:1]

## Developer Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### Step 1: Clone & Install
```bash
git clone https://github.com/NisargaK-21/Devino.git
cd Devino
```

### Step 2: Frontend
```bash
cd client
npm install
npm run dev  # http://localhost:3000
```

### Step 3: Backend
```bash
cd ../server
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev  # http://localhost:5000
```

### Step 4: Environment Variables
Copy `.env.example` to `.env` in both `/client` and `/server`:

```
# server/.env
MONGODB_URI=your_mongo_connection_string
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
PORT=5000

# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 5: Test
```bash
# Backend health check
curl http://localhost:5000/api/health

# Create test user via /api/auth/register
```

## API Documentation

### Base URL
`http://localhost:5000/api` (dev) / `https://api.devino.app/api` (prod)

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

**Register Example**:
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "role": "student"
}
```

### Projects & Stages
```
GET  /api/projects              # List user projects
POST /api/projects              # Create new project
GET  /api/projects/:id          # Project details
POST /api/projects/:id/stages/:stage/submit  # Submit code for validation
GET  /api/projects/:id/progress # Stage progress
```

**Submit Code Example**:
```json
POST /api/projects/123/stages/frontend/submit
{
  "code": "// Your frontend code here",
  "files": ["index.html", "styles.css"]
}
```

**Response**:
```json
{
  "approved": true,
  "feedback": "Great structure! Consider adding semantic HTML.",
  "nextStage": "backend"
}
```

### Health Check
```
GET /api/health
```

**All endpoints require JWT auth except auth/register and auth/login.**

## Core Modules

- **Auth Engine**: JWT tokens, role-based access (admin/student)
- **Stage Engine**: Linear progression with unlock gates
- **AI Layer**: Gemini-powered code review & validation
- **UI**: Responsive horror-themed Next.js app[file:1]

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push & PR

See `CONTRIBUTING.md` for details.[file:1]

## License

MIT License[file:1]
