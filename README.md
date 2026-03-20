# ProjectFlow

ProjectFlow is a full-stack Next.js + TypeScript SaaS landing site and basic dashboard for an AI-powered project management tool. It includes a marketing homepage, pricing, auth stubs, and projects CRUD APIs.

## Features
- Gradient hero landing page with features, pricing, subscribe and contact forms
- Auth stubs with JWT + bcryptjs
- Protected dashboard and projects CRUD
- Tailwind CSS + TypeScript scaffolding

## Quickstart
```bash
npm install
npx prisma generate
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` and update values:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_BASE_URL`

## Scripts
- `npm run dev` - start development server
- `npm run build` - build (includes prisma generate)
- `npm run start` - start production server
- `npm run lint` - run ESLint
- `npm run test` - run Jest

## API Endpoints
- `GET /api/health`
- `POST /api/subscribe`
- `POST /api/contact`
- `GET /api/features`
- `GET /api/pricing`
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

## Notes
- Prisma uses SQLite by default for development (`prisma/dev.db`).
- To swap to Postgres, update `DATABASE_URL` and run migrations.
