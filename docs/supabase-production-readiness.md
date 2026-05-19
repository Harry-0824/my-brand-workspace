# Supabase Production Backend Readiness (Issue #145)

## Scope

- Related Issue: #145
- Check date: 2026-05-19
- Purpose: prepare the production Supabase backend before a later Netlify production deployment.
- Netlify deployment: not run in this Issue.

## Production Backend Status

Production backend status: `partial`

Reason: the production Supabase project is confirmed, linked, migrated, and verified for the database tables, RLS, and owner-scoped policies. The remaining manual step is creating or inviting the private workspace admin account in Supabase Auth.

No Supabase URL, anon key value, service role key, database password, access token, token value, API key value, or credential is recorded in this file.

## Supabase CLI Status

Status: `pass`

Checks:

```txt
npx.cmd supabase --version
npx.cmd supabase --help
npx.cmd supabase projects list
npx.cmd supabase migration list
```

Results:

- CLI availability: `pass`
- CLI version checked: `2.100.1`
- CLI help checked: `pass`
- CLI login/project list: `pass`
  - `npx.cmd supabase projects list` can list projects after user-side login.
- Linked project: `yes`
  - `my-brand-workspace-production` is marked as the linked project.

## Production Project Status

Status: `confirmed`

Confirmed production project:

- Name: `my-brand-workspace-production`
- Ref: `rxujeuyypgmgqgrysfbx`
- Region: Oceania (Sydney)

No project API keys, service role keys, database password, access tokens, or credential values were printed or recorded.

## Project Link Status

Status: `linked`

Command run:

```txt
npx.cmd supabase link --project-ref rxujeuyypgmgqgrysfbx
```

Result:

- Finished successfully.
- `npx.cmd supabase projects list` marks `my-brand-workspace-production` as linked.
- Supabase CLI created local `supabase/.temp/` metadata. Those files were not committed.

## Local Schema and Migration Readiness

Status: `ready locally`

Migration files in `supabase/migrations`:

1. `20260514000000_create_saas_v1_core_tables.sql`
   - Creates `public.projects`
   - Creates `public.clients`
   - Creates `public.tasks`
   - Creates `public.income_records`
   - Creates `public.workspace_settings`
2. `20260514130200_add_saas_v1_rls_policies.sql`
   - Enables row level security on the five MVP tables.
   - Adds owner-scoped select, insert, update, and delete policies using `auth.uid() = user_id`.

No schema, RLS, or migration SQL was modified for this Issue.

## Production Migration Status

Status: `applied`

Pre-push migration check:

```txt
npx.cmd supabase migration list
```

Result before push:

- Local migrations present:
  - `20260514000000`
  - `20260514130200`
- Remote migration history was empty.
- Linked target was confirmed as `my-brand-workspace-production`.

Apply command:

```txt
npx.cmd supabase db push
```

Result:

- Applied `20260514000000_create_saas_v1_core_tables.sql`.
- Applied `20260514130200_add_saas_v1_rls_policies.sql`.

Post-push migration check:

```txt
npx.cmd supabase migration list
```

Result after push:

- Local `20260514000000` matches remote `20260514000000`.
- Local `20260514130200` matches remote `20260514130200`.

## Production Tables and RLS Verification

Status: `pass`

Verified production tables:

- `projects`
- `clients`
- `tasks`
- `income_records`
- `workspace_settings`

Verified RLS:

- RLS is enabled on all five tables.
- Each table has owner-scoped select, insert, update, and delete policies.
- Select/delete policies use `auth.uid() = user_id`.
- Insert policies use `with check (auth.uid() = user_id)`.
- Update policies use both `using (auth.uid() = user_id)` and `with check (auth.uid() = user_id)`.

Verification commands:

```txt
npx.cmd supabase db query --linked "select table_name from information_schema.tables where table_schema = 'public' and table_name in ('projects','clients','tasks','income_records','workspace_settings') order by table_name;"
npx.cmd supabase db query --linked "select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename in ('projects','clients','tasks','income_records','workspace_settings') order by tablename;"
npx.cmd supabase db query --linked "select tablename, policyname, cmd, qual, with_check from pg_policies where schemaname = 'public' and tablename in ('projects','clients','tasks','income_records','workspace_settings') order by tablename, cmd, policyname;"
```

Note: one RLS metadata query initially timed out during parallel execution, then passed when rerun separately. The rerun also showed transient Supabase pooler authentication throttling messages before returning the expected RLS rows.

## Auth Admin Account

Status: `requires user action`

Production private workspace admin account should be created manually in Supabase Dashboard:

1. Supabase Dashboard
2. Production project
3. Authentication
4. Users
5. Add user / Invite user

Do not:

- Store admin credentials in the repository.
- Print the admin password in terminal output, PRs, comments, or docs.
- Add a public signup flow in this Issue.
- Use service role keys in frontend code.

## Netlify Follow-up Env Key Names

Status: `names ready; values available in Supabase Dashboard, not recorded here`

The later Netlify production setup will need these key names only:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No values are included here.

## Forbidden Env File Check

Status: `pass`

Checked command:

```txt
git ls-files .env .env.local .env.production .env.development .env.test .env.*.local .env.*
```

Result:

- Only `.env.example` is tracked.
- No `.env`, `.env.local`, production env file, API key, token, credential, database password, or service role key file was added for this Issue.

## Verification Results

Status: `pass with Auth admin account still manual`

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
- Supabase CLI project and migration checks
  - CLI version/help checks passed.
  - Production project was visible after user-side login.
  - Production project link succeeded.
  - Migration list passed before and after `db push`.
  - Production table, RLS, and policy metadata checks passed.

## Blockers and Next Steps

Blockers:

- Production Auth admin account still needs user setup in Dashboard.
- Netlify environment setup and production deploy remain out of scope for this Issue.

Next steps:

1. User creates or invites the private admin account in Supabase Auth.
2. In a later Netlify Issue, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` without exposing values.
3. In the same later Netlify Issue, perform the production frontend deploy.

## Scope Check

- Netlify deployed: no
- App code changed: no
- Auth / CRUD / Dashboard / Reports logic changed: no
- Supabase schema, RLS, or migration SQL changed: no
- New migration added: no
- Dependencies changed: no
- `package.json` or `package-lock.json` changed: no
- `.env` or `.env.local` changed: no
- PR #105 / `workspace_settings` implementation touched: no
- Obsidian or Notion touched: no
- Sensitive values output or committed: no
- Scope exceeded: no
