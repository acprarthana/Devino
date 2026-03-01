# 🕷 Devino

Stage-Based Web Development Platform with AI-Powered Code Validation

Devino is a structured, project-first learning platform that helps users build real, deployable full-stack applications. Instead of isolated tutorials, Devino enforces a stage-based workflow:

Frontend → Backend → Database → Authentication → Deployment

Each stage must pass AI-assisted validation powered by Google Gemini API before unlocking the next.

---

## Problem

Many learners understand web development concepts but fail to ship real applications. Projects remain incomplete and deployment is often ignored.

Devino bridges this gap by enforcing structured execution.

---

## Core Modules

### Authentication Engine
- JWT-based authentication
- Role-based authorization
- Secure API middleware

### Project & Stage Engine
- Stage progression logic
- Unlock rules
- Persistent progress tracking

### AI Intelligence Layer
- Gemini API integration
- Structured JSON response validation
- Code review and stage validation

### UI System
- Next.js frontend
- Tailwind CSS styling
- Accessible horror-themed design

---

## Tech Stack

Frontend: Next.js (TypeScript), Tailwind CSS  
Backend: Node.js, Express  
Database: MongoDB Atlas  
AI: Google Gemini API  
CI/CD: GitHub Actions  

---

## Local Setup

Clone the repository:
git clone https://github.com/NisargaK-21/Devino.git

cd Devino


Install dependencies:

Frontend:
cd client
npm install


Backend:
cd server
npm install


Create `.env` file based on `.env.example`.

---

## Contributing

Please read `CONTRIBUTING.md` before submitting changes.

---

## License

MIT License