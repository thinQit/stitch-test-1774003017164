# ProjectFlow

ProjectFlow is a full-stack Next.js + TypeScript landing site and lightweight admin dashboard for an AI-powered project management SaaS. It includes a responsive Tailwind CSS design, structured API routes, Prisma ORM with SQLite, and a simple admin token gate for pricing and lead management.

## Features
- Gradient hero, feature cards, pricing tiers, and newsletter capture
- Public APIs for health, features, tiers, lead capture, and checkout
- Admin dashboard for pricing tiers and leads (token protected)
- Prisma + SQLite for local development
- Tailwind CSS design system with reusable UI components

## Getting Started
1. Copy environment template:
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
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `DATABASE_URL` - SQLite connection string (e.g. `file:./dev.db`)
- `ADMIN_TOKEN` - Token for admin API routes
- `NEXT_PUBLIC_APP_URL` - Public URL for CORS or analytics
- `STRIPE_SECRET_KEY` - Placeholder for future Stripe integration

## API Endpoints
- `GET /api/health`
- `GET /api/features`
- `GET /api/tiers`
- `POST /api/subscribe`
- `POST /api/checkout`
- `GET /api/admin/tiers`
- `POST /api/admin/tiers`
- `PUT /api/admin/tiers/:id`
- `DELETE /api/admin/tiers/:id`
- `GET /api/admin/leads`

## Admin Access
Use the token stored in `ADMIN_TOKEN` and enter it in the Admin dashboard. The token must be sent as a `Bearer` token in the `Authorization` header.

## Testing
```bash
npm run test
```

## License
© 2026 ProjectFlow
