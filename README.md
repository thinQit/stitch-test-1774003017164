# ProjectFlow

ProjectFlow is a full-stack Next.js + TypeScript landing site and light SaaS backend for an AI-powered project management product. It includes a modern Tailwind CSS UI, gradient hero, feature cards, pricing tiers, lead capture, and an admin leads dashboard.

## Features
- Gradient hero with CTA
- Feature cards (Smart Scheduling, Automated Reporting, Team Insights)
- 3-tier pricing (Starter, Pro, Enterprise)
- Lead capture form with tier selection
- Admin leads dashboard with filtering and contacted toggle
- API endpoints for health, features, pricing, leads, and subscription intent

## Setup
1. Copy `.env.example` to `.env` and fill in environment variables.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health`
- `GET /api/features`
- `GET /api/pricing`
- `POST /api/leads`
- `POST /api/subscribe`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

## Admin
The admin leads dashboard is available at `/admin/leads`. Authenticate using the login API or provide the `ADMIN_TOKEN` in the `x-admin-token` header for protected requests.
