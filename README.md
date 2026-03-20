# ProjectFlow

ProjectFlow is a full-stack Next.js + TypeScript SaaS landing site and lightweight admin backend for an AI-powered project management product. It includes a pixel-matching landing page, pricing pages, contact capture, and admin CRUD for plans and leads.

## Features
- Hero landing page with gradient, feature cards, pricing tiers, and footer
- Newsletter subscribe and enterprise contact capture
- Admin dashboard for managing pricing plans and viewing leads
- Health check API and structured data endpoints
- JWT-based admin authentication

## Setup
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health` — health check
- `GET /api/plans` — list pricing plans
- `POST /api/plans` — create plan (auth)
- `PUT /api/plans/:id` — update plan (auth)
- `DELETE /api/plans/:id` — delete plan (auth)
- `GET /api/features` — list feature cards
- `POST /api/subscribe` — newsletter signup
- `POST /api/contact` — enterprise contact
- `GET /api/leads` — list leads (auth)
- `POST /api/auth/login` — admin login
- `POST /api/auth/register` — admin registration
- `GET /api/auth/me` — current admin user

## Notes
- Prisma uses SQLite for local development.
- Set `JWT_SECRET` in `.env` for auth.
