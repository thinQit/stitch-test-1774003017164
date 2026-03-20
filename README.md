# ProjectFlow

ProjectFlow is a Next.js 14 + TypeScript landing site and lightweight admin for an AI-powered project management SaaS. It includes a responsive Tailwind CSS marketing site, admin CRUD dashboard, and REST API endpoints.

## Features
- Hero with gradient, feature cards, pricing tiers, and footer
- Subscription and contact capture forms with validation
- Admin dashboard for managing features, pricing, and site content
- Auth-protected admin APIs with JWT
- Health endpoint and checkout stub

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/health`
- `GET /api/features`
- `POST /api/features` (admin)
- `PUT /api/features/:id` (admin)
- `DELETE /api/features/:id` (admin)
- `GET /api/pricing`
- `POST /api/pricing` (admin)
- `POST /api/subscribers`
- `POST /api/contact`
- `POST /api/checkout`
- `GET /api/content`
- `PUT /api/content` (admin)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

## Admin Auth
Use the login form in `/admin`. Set `ADMIN_PASSWORD` to bootstrap the first admin user.
