# Sweet Shop Management System — TDD Full Stack Application

## Overview
Production-ready Express + TypeScript + PostgreSQL backend with JWT auth and TDD, plus Vite React frontend using Context API, React Router, Axios, and TailwindCSS. Features include user/admin auth, sweets CRUD, search, purchase, restock, and admin-only actions. Database schema lives in `backend/app/db/schema.sql`.

## Folder Structure (required)
```
/backend
  package.json
  tsconfig.json
  jest.config.ts
  .env.example
  /app
    /db
      schema.sql
    /middleware
    /models
    /routers
    /schemas
    /services
    /tests
    config.ts
    db.ts
    server.ts
/frontend
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  .env.example
  /src
    /components
    /context
    /pages
    /services
    App.tsx
    main.tsx
    index.css
```

## Backend Setup
1. `cd backend`
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET`, `PORT`.
3. Install deps: `npm install`
4. Run Postgres (e.g., `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`), create DB matching `DATABASE_URL`.
5. Run dev API: `npm run dev`
6. API base: `http://localhost:4000`

### Database Migration
`npm run dev` auto-runs `backend/app/db/schema.sql`. To run manually:
```
psql "$DATABASE_URL" -f app/db/schema.sql
```

### Backend Tests (TDD)
```
npm test
```
Suites include auth (register/login/jwt), sweets CRUD (admin create/delete), search, update, and inventory (purchase/restock with stock checks). Clear setup/teardown via `resetDB` and assertions with supertest + Jest.

## Frontend Setup (Vite + Tailwind)
1. `cd frontend`
2. Copy `.env.example` to `.env` and set `VITE_API_URL` (default `http://localhost:4000`).
3. Install deps: `npm install`
4. Run dev UI: `npm run dev` (defaults to `http://localhost:5173`)

## Frontend Features
- Register/Login with token persistence (Context API)
- Protected routes and admin-only guard
- Dashboard: list, search, purchase (disabled when qty = 0)
- Admin Panel: add, update (blur price/qty fields), delete, restock sweets

## Deployment Notes
- Backend: build with `npm run build` and run `node dist/server.js`; ensure env vars and PostgreSQL reachable. Add reverse proxy/HTTPS as needed.
- Frontend: `npm run build` then serve `dist/` (e.g., `npm run preview` or static host). Point `VITE_API_URL` to deployed API.
- Apply `schema.sql` to production database before start.

## Example Commit Messages (Red → Green → Refactor)
- Red: `test: add failing auth scenarios (register/login jwt)`
- Green: `feat: pass auth tests with register/login handlers`
- Refactor: `refactor: share jwt helper and trim router noise`

**Remember to append to each commit:**
```
Co-authored-by: AI Tool <ai@users.noreply.github.com>
```

## Required AI Usage Section
- **Tools used:** Code generation, planning, TDD scaffold, README drafting
- **How AI assisted:** Auth, sweets, inventory flows, Jest + supertest tests, React pages, and deployment instructions were drafted by AI to meet the specification quickly.
- **Reflection:** AI accelerated boilerplate and coverage of edge cases; review credentials/env before deploy and adjust styling/UX as desired.

## Screenshots Placeholder
Add screenshots of Dashboard and Admin Panel here once available.
