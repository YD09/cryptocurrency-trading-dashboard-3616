# Trade Crafter Configuration Guide

## Authentication Setup

### Option 1: Supabase Auth (Recommended)

1. **Get Supabase Anon Key:**
   - Go to your Supabase project: `https://pejnrpfnmsdeapgyuqhj.supabase.co`
   - Navigate to Settings → API
   - Copy the "anon public" key

2. **Create `.env` file:**
   ```env
   VITE_SUPABASE_URL=https://pejnrpfnmsdeapgyuqhj.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

3. **Configure Email Templates in Supabase:**
   - Go to Authentication → Email Templates
   - Customize the confirmation and reset templates

4. **Enable Phone Auth (Optional):**
   - Go to Authentication → Settings
   - Enable "Enable phone confirmations"

### Option 2: Custom SMTP Email

1. **Get SMTP Credentials:**
   - **Gmail:** Use App Password (not regular password)
   - **Outlook:** Use App Password
   - **Custom SMTP:** Get from your email provider

2. **Create `.env` file:**
   ```env
   # SMTP Configuration
   VITE_SMTP_HOST=smtp.gmail.com
   VITE_SMTP_PORT=587
   VITE_SMTP_USER=your_email@gmail.com
   VITE_SMTP_PASS=your_app_password_here
   ```

3. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate App Password: Google Account → Security → App Passwords
   - Use the generated password as `VITE_SMTP_PASS`

### Option 3: Twilio SMS

1. **Get Twilio Credentials:**
   - Sign up at [twilio.com](https://twilio.com)
   - Get Account SID and Auth Token from dashboard
   - Get a phone number for sending SMS

2. **Create `.env` file:**
   ```env
   # Twilio Configuration
   VITE_TWILIO_ACCOUNT_SID=your_account_sid
   VITE_TWILIO_AUTH_TOKEN=your_auth_token
   VITE_TWILIO_FROM_NUMBER=+1234567890
   ```

## Development Mode

If no credentials are provided, the app runs in **Development Mode**:
- ✅ All UI/UX works
- ✅ Mock authentication (no real emails/SMS)
- ✅ All features functional for testing
- ⚠️ No real email/SMS delivery

## Production Setup

For production deployment:

1. **Environment Variables:** Set all required credentials
2. **Email Templates:** Customize in Supabase or use SMTP
3. **SMS Service:** Configure Twilio or similar service
4. **Database:** Run Supabase migrations
5. **Domain:** Update redirect URLs in Supabase settings

## Testing

- **Development:** Use mock auth (no real emails/SMS)
- **Staging:** Use real credentials with test data
- **Production:** Full authentication with real services

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and passwords
- Enable 2FA on all service accounts 

## Backend (Spring Boot) Setup

- Create a `.env` by copying `.env.example` and fill in:
  - `DB_URL`, `DB_USER`, `DB_PASSWORD` from your Supabase database settings
  - `SUPABASE_JWKS_URL` as `https://<project-ref>.supabase.co/auth/v1/keys`
  - Frontend vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`

### Run locally

- Backend:
  - `cd backend && mvn spring-boot:run`
- Frontend:
  - `npm install`
  - `npm run dev`

### Run with Docker Compose

- `docker compose up --build`
  - Frontend at http://localhost:5173
  - Backend at http://localhost:8080

### Auth

- Frontend continues to use Supabase Auth (including Google). The backend validates Supabase JWTs via `SUPABASE_JWKS_URL`.
- Send the Supabase access token in `Authorization: Bearer <token>` to backend endpoints.

### Realtime P&L

- Endpoint `GET /api/portfolio` returns a computed snapshot (balance, equity, pnl)
- SSE stream at `GET /api/portfolio/stream` pushes updated snapshots every 5 seconds using Yahoo Finance quotes.

### Trading Endpoints

- `GET /api/trades`
- `POST /api/trades` body:
```
{ "symbol": "AAPL", "type": "BUY", "volume": 10 }
```
- `POST /api/trades/{id}/close`

Adjust symbols to your market (e.g. `INFY.NS`). 