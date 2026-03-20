# ProjectFlow

ProjectFlow is a full-stack Next.js + TypeScript landing site and lightweight API for an AI-powered project management SaaS. It includes a gradient hero, feature cards, pricing tiers, subscribe flow, enterprise contact, and a health check API.

## Features
- Modern Tailwind UI matching the approved wireframe
- Feature and pricing APIs
- Subscribe and enterprise contact endpoints with validation
- Reusable components: Hero, FeatureCard, PricingCard, Button, Footer, Modal
- Prisma + SQLite for data storage

## Getting Started
```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

## API Endpoints
- `GET /api/health`
- `GET /api/features`
- `GET /api/pricing`
- `POST /api/subscribe`
- `POST /api/contact-enterprise`
- `GET /api/site-metadata`

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build production
- `npm run start` – start production
- `npm run lint` – lint code

## Notes
- Configure `DATABASE_URL` for production (Postgres supported via Prisma).
- Customize branding and colors via `src/app/globals.css` and `/api/site-metadata`.
