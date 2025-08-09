# Trading App (Spring Boot + React + Supabase)

- Backend: Java Spring Boot (resource server) connected to Supabase Postgres
- Frontend: React (Vite) using Supabase Auth (Google) and backend APIs

## Quick start

1. Copy `.env.example` to `.env` and fill values (`VITE_*`, `DB_*`, `SUPABASE_JWKS_URL`)
2. Run with Docker Compose:
   - `docker compose up --build`
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080 (Swagger at `/swagger-ui`)

Or run locally:
- Backend: `cd backend && mvn spring-boot:run`
- Frontend: `npm install && npm run dev`

Ensure your Supabase DB has the schema from `supabase/migrations/`.

## Notes
- Backend validates Supabase JWTs. Pass `Authorization: Bearer <access_token>` from frontend.
- Real-time P&L stream available at `/api/portfolio/stream`.
- Update market symbols to match your exchange (e.g. `AAPL`, `INFY.NS`).