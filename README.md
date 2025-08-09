# Trading App (Spring Boot + Supabase)

- Single Spring Boot application with server-rendered Thymeleaf UI
- Google Login (OAuth2 client) and Supabase JWT validation for API endpoints
- Connects to Supabase Postgres for data
- Real-time P&L computed from market quotes (Yahoo Finance)

## Quick start

1. Copy `.env.example` to `.env` and fill values:
   - `DB_URL`, `DB_USER`, `DB_PASSWORD` (Supabase DB)
   - `SUPABASE_JWKS_URL` (for validating Supabase tokens if you hit API routes)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` for server-side Google Login
   - `CORS_ALLOWED_ORIGINS` (needed only if you consume APIs from a separate host)
2. Build and run:
   - `cd backend && mvn spring-boot:run`
   - Open http://localhost:8080
3. Or with Docker:
   - `docker compose up --build`

## Routes
- `/` Dashboard with login and P&L widget (server-rendered)
- `/api/portfolio` JSON snapshot, `/api/portfolio/stream` SSE
- `/api/trades` list/create, `/api/trades/{id}/close` close
- `/api/performance` daily P&L

## Notes
- Ensure Supabase schema is applied from `supabase/migrations/`.
- Symbols must match your market (e.g., `AAPL`, `INFY.NS`).