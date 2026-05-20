# My Brand Workspace

A private, Supabase-backed workspace MVP for solo freelancers. Manage projects, clients, tasks, and income records in one dark, desktop-first SaaS UI.

## Status

Production-validated MVP. Deployed on Netlify. All core CRUD flows and authentication are live and smoke-tested.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React + TypeScript |
| Build tool | Vite |
| Styling | styled-components |
| Testing | Vitest + Testing Library |
| Database | Supabase (PostgreSQL + RLS) |
| Hosting | Netlify |

## Key Features

- Projects — create, read, search, update, delete
- Clients — create, read, search, update, delete
- Tasks — create, read, search, update, delete
- Income Records — create, read, search, update, delete
- Dashboard — real-data summary (projects, tasks, clients, income)
- Reports — aggregated overview
- Authentication — private workspace; unauthenticated users are redirected to login

## Auth Behavior

This workspace is private. Unauthenticated users cannot access any workspace route. All data is isolated per authenticated user via Supabase Row Level Security.

## Local Development

```bash
npm install
npm run dev
```

Run tests:

```bash
npm run test
```

Build for production:

```bash
npm run build
```

## Environment Variables

Create a `.env.local` file (not committed) with:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not use service role keys in the frontend.

## Supabase Notes

- Core tables and RLS policies are defined in `supabase/migrations/`.
- The frontend uses only the anon key. Row Level Security enforces data isolation.
- Do not expose service role keys in frontend code.

## Netlify Notes

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback redirect is configured in `netlify.toml`.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Netlify environment variables panel.

## Style Organization

Each component follows a colocated file convention:

```
Component.tsx          — logic, JSX, data
Component.styles.ts    — styled-components definitions
```

Global theme tokens live in `src/styles/theme.ts`. Global base styles live in `src/styles/GlobalStyle.ts`.

## AI Workflow Notes

- Changes follow GitHub Issues as the source of truth.
- `AGENTS.md` defines repository-level rules for scope, tech stack, and conventions.
- Each Issue targets one focused task. PRs are reviewed against Issue scope before merge.

