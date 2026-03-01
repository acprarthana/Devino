# Architecture — Devino (concise)

## High level
- **Client (Next.js)**: UI, stage flow, editor preview.
- **Server (Express)**: REST APIs — auth, projects, stages, ai.
- **DB (MongoDB Atlas)**: users, projects, stages, ai_logs.
- **AI (Gemini)**: called from server, returns structured JSON.

## Main collections (summary)
- `users` — { _id, name, email, passwordHash, role, createdAt }
- `projects` — { _id, ownerId, type, currentStage, progress, createdAt }
- `stages` — { projectId, number, tasks, unlocked, complete }
- `ai_logs` — { _id, userId, projectId, prompt, response, model, tokens, createdAt }

## AI flow
1. Client sends code snapshot or stage snapshot to server.
2. Server builds a prompt from templates.
3. `ai.service` calls Gemini (server -> Gemini).
4. Server validates JSON schema and stores `ai_logs`.
5. Server returns parsed feedback to client.

## Security notes
- Do not call Gemini from the frontend.
- Keep secrets in environment variables.
- Apply rate limiting to AI endpoints.
- Use HTTPS in production.

## Deployment
- Frontend → Vercel
- Backend → Railway / Render
- DB → MongoDB Atlas
- CI → GitHub Actions