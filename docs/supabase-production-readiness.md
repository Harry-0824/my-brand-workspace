# Supabase Production Backend Readiness (Issue #145)

## Scope

- Related Issue: #145
- Check date: 2026-05-19
- Purpose: prepare the production Supabase backend before a later Netlify production deployment.
- Netlify deployment: not run in this Issue.

## Production Backend Status

Production backend status: `blocked`

Reason: Supabase CLI is available, and the repository has local migrations for the MVP tables and RLS policies, but no `my-brand-workspace` production Supabase project is confirmed. Supabase CLI is also not authenticated in this environment, so project linking and remote migration checks cannot proceed without user action.

No Supabase URL, anon key value, service role key, database password, access token, token value, API key value, or credential is recorded in this file.

## Supabase CLI Status

Status: `partial`

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
- CLI login/project list: `blocked`
  - `npx.cmd supabase projects list` reported that an access token was not provided.
  - Required user action: run `npx.cmd supabase login` and complete the browser/token flow without sharing the token.
- Linked project: `no`
  - `npx.cmd supabase migration list` reported that no project ref was found and asked whether `supabase link` had been run.

## Production Project Status

Status: `not confirmed`

Supabase connector project discovery found existing projects, but none clearly matched the intended production backend name:

- `Harry-0824-Robot-project`
- `mg-website-db`

Expected production project name:

- `my-brand-workspace-production`

Required user action:

1. Confirm whether a production Supabase project already exists under a different name.
2. If it does not exist, create it in the Supabase Dashboard with the intended organization and region.
3. Do not create paid resources unless the user explicitly approves the organization, region, and cost.
4. Keep database password, access tokens, service role keys, and API key values out of the repository and PR discussion.

## Project Link Status

Status: `not linked`

Link command direction after user confirms the production project ref:

```txt
npx.cmd supabase link --project-ref <production-project-ref>
```

Notes:

- The production project ref is not a secret, but it must identify the correct production project.
- If the CLI prompts for the database password, the user should type it directly into the prompt.
- Do not paste, print, document, or commit the database password.
- Do not pass secrets through command history if an interactive prompt is available.

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

Status: `not applied`

Blocked reason:

- Production project is not confirmed.
- Supabase CLI is not logged in.
- The repo is not linked to a production project.
- Remote migration history cannot be inspected safely.

Required sequence after user confirms project and logs in:

```txt
npx.cmd supabase migration list
npx.cmd supabase db push
npx.cmd supabase migration list
```

Expected behavior before `db push`:

- Confirm the linked project is `my-brand-workspace-production` or the user-approved production project.
- Confirm remote migration history is empty for a new project, or exactly matches the expected existing production state.
- Stop if migration history is unexpected.

Expected migrations for a new production project:

1. `20260514000000_create_saas_v1_core_tables`
2. `20260514130200_add_saas_v1_rls_policies`

## Production Tables and RLS Verification

Status: `blocked`

Production tables not verified because no production project is linked:

- `projects`
- `clients`
- `tasks`
- `income_records`
- `workspace_settings`

Production RLS not verified because no production project is linked.

Expected verification after migrations are applied:

- Confirm all five tables exist in `public`.
- Confirm RLS is enabled on all five tables.
- Confirm owner-scoped policies exist for select, insert, update, and delete.
- Run Supabase security advisors for the production project.
- Confirm Data API exposure and grants are correct for the intended roles, especially because new Supabase projects may not automatically expose newly created tables to the Data API.

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

Status: `names ready; values blocked until production project exists`

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

Status: `pass with documented Supabase blockers`

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
  - Project list blocked because CLI has no access token.
  - Migration list blocked because the repo is not linked to a project ref.

## Blockers and Next Steps

Blockers:

- Supabase CLI is not logged in; `supabase projects list` requires `supabase login` or `SUPABASE_ACCESS_TOKEN`.
- Production Supabase project is not confirmed.
- Production project ref is not available.
- Repository is not linked to a production project.
- Production migration history cannot be checked.
- Production migrations were not applied.
- Production tables and RLS were not verified.
- Production Auth admin account still needs user setup in Dashboard.

Next steps:

1. User runs `npx.cmd supabase login` and completes authentication without sharing the token.
2. User creates or confirms the Supabase production project, preferably `my-brand-workspace-production`.
3. User confirms organization, region, and production project ref.
4. Link the repo with `npx.cmd supabase link --project-ref <production-project-ref>`.
5. Run `npx.cmd supabase migration list` and confirm remote history is safe.
6. Run `npx.cmd supabase db push` only after target project and migration history are confirmed.
7. Re-run `npx.cmd supabase migration list`.
8. Verify production tables, RLS, policies, and security advisors.
9. Create or invite the private admin account in Supabase Auth.
10. In a later Netlify Issue, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` without exposing values.

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
