# Supabase Production Readiness (Issue #143)

## Scope

- Related Issue: #143
- Check date: 2026-05-19
- Purpose: prepare Supabase production readiness before a later Netlify production deployment.
- Netlify deployment: not run in this Issue.

## Readiness Status

Supabase production readiness status: `blocked`

Reason: the repository has local Supabase migrations for the current MVP schema and RLS policies, but no Supabase production project could be confirmed for `my-brand-workspace` from the connected Supabase account. Production database migration, RLS verification, Auth admin account creation, and Netlify env value setup are blocked until the user creates or identifies the production Supabase project.

No Supabase URL, publishable key, anon key value, service role key, database password, access token, or credential is recorded in this file.

## Production Project Status

Status: `unknown`

Result:

- The connected Supabase project list did not include a project clearly named for `my-brand-workspace`, `harry-brand-workspace`, or the production workspace dashboard.
- A production project may still exist outside the connected account or under a different name, but it is not confirmed from this checkout.

Required user action:

1. Create or identify the Supabase production project in the Supabase Dashboard.
2. Use a clear project name, for example `my-brand-workspace-production`.
3. Choose the production region intentionally before applying migrations.
4. Do not create paid resources unless the user explicitly approves the cost and target organization.

Dashboard setup path:

1. Open Supabase Dashboard.
2. Select the intended organization.
3. Create a new project or open the existing production project.
4. Keep the database password and project API keys out of the repository, PR body, comments, and local documentation.

## Local Schema and Migration Readiness

Status: `ready locally; production application blocked`

Local migration files:

1. `supabase/migrations/20260514000000_create_saas_v1_core_tables.sql`
   - Creates `public.projects`
   - Creates `public.clients`
   - Creates `public.tasks`
   - Creates `public.income_records`
   - Creates `public.workspace_settings`
2. `supabase/migrations/20260514130200_add_saas_v1_rls_policies.sql`
   - Enables row level security on the five MVP tables.
   - Adds owner-scoped select, insert, update, and delete policies using `auth.uid() = user_id`.

No schema, RLS, or migration file was modified for this Issue.

## RLS Readiness

Status: `ready locally; production verification blocked`

The local RLS migration enables RLS for:

- `public.projects`
- `public.clients`
- `public.tasks`
- `public.income_records`
- `public.workspace_settings`

The local policies are scoped to the authenticated user's `user_id`. Production RLS readiness can only be marked `pass` after the production project exists, migrations have been applied there, and policies have been verified against the production database.

Production follow-up checks:

- Confirm each MVP table has RLS enabled.
- Confirm each owner-scoped policy exists after migration.
- Run Supabase security advisors against the production project.
- Confirm the tables are exposed to the Data API for the intended roles. Supabase changed new project behavior in April 2026 so new tables may not be exposed automatically; if production reads/writes fail after migration, verify Data API exposure and role grants without exposing secrets.

## Production Migration Plan

Status: `blocked until production project exists`

Recommended CLI flow after the user creates or identifies the production project:

```txt
npx.cmd supabase --help
npx.cmd supabase link --project-ref <production-project-ref>
npx.cmd supabase migration list
npx.cmd supabase db push
npx.cmd supabase migration list
```

Notes:

- `supabase link` requires the production project ref and may prompt for the remote database password.
- Do not print, commit, or paste the database password, access token, service role key, or any API key value.
- `supabase migration list` should be checked before and after applying migrations to compare local and remote migration history.
- `supabase db push` should only be run after confirming the target production project is correct.
- If production migration history is not empty or does not match the local files, stop and inspect before applying changes.

Expected migrations to apply to a new production project:

1. `20260514000000_create_saas_v1_core_tables`
2. `20260514130200_add_saas_v1_rls_policies`

## Auth Admin Account Setup

Status: `blocked until production project exists`

The private workspace production admin account should be created in Supabase Auth, not stored in the repository.

Recommended setup path:

1. Open the production Supabase project.
2. Go to Authentication / Users.
3. Add the private workspace admin user.
4. Set a strong password or invite flow in the Dashboard.
5. Store credentials only in the user's password manager.

Do not:

- Commit the admin email/password to the repository.
- Print the password in PRs, comments, logs, or documentation.
- Add a public signup flow in this Issue.
- Use a service role key in frontend code.

## Netlify Follow-up Env Key Names

Status: `names ready; values blocked until production project exists`

The later Netlify production setup will need these key names only:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No values are included here.

## Forbidden Env File Check

Status: `pass`

Checked command:

```txt
git ls-files .env .env.local .env.*
```

Result:

- Only `.env.example` is tracked.
- `.env` and `.env.local` are ignored by `.gitignore`.
- No forbidden env file was added or modified for this Issue.

## Verification Results

Status: `pass with elevated reruns`

Commands:

```txt
npm.cmd run build
npm.cmd run test
git diff --check
```

Results:

- `npm.cmd run build`
  - Non-elevated run: blocked by the known Windows access restriction while resolving `vite.config.ts`.
  - Elevated rerun: passed; Vite production build completed.
- `npm.cmd run test`
  - Non-elevated run: blocked by the known Windows access restriction while resolving `vite.config.ts`.
  - Elevated rerun: passed; `15` test files and `99` tests passed.
- `git diff --check`
  - Passed with no whitespace errors.

## Blockers and Next Steps

Blockers:

- Production Supabase project is not confirmed.
- Production project ref is not available.
- Production database password is not available and should not be recorded in the repo.
- Production migrations and RLS policies cannot be verified until the production project exists.
- Production Auth admin account cannot be created until the production project exists.
- Netlify env values cannot be configured until the production Supabase URL and anon key are available.

Next steps:

1. User creates or identifies the Supabase production project.
2. User confirms the target organization, region, and project ref.
3. Link the repo to the production project with Supabase CLI without recording secrets.
4. Review `supabase migration list`.
5. Apply the two existing local migrations with `supabase db push`.
6. Verify RLS policies and Supabase security advisors in production.
7. Create the private admin user in Supabase Auth.
8. In a later Netlify deployment Issue, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify without exposing values.

## Scope Check

- Netlify deployed: no
- App code changed: no
- Auth / CRUD / Dashboard / Reports logic changed: no
- Supabase schema, RLS, or migrations changed: no
- New migration added: no
- Dependencies changed: no
- `package.json` or `package-lock.json` changed: no
- `.env` or `.env.local` changed: no
- PR #105 / `workspace_settings` implementation touched: no
- Obsidian or Notion touched: no
- Sensitive values output or committed: no
- Scope exceeded: no
