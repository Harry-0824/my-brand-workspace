# MVP Smoke Test Results (Issue #135)

## Scope and Source

- Source checklist: `docs/mvp-smoke-test-checklist.md`
- Related prerequisite: PR #134 was merged before this run.
- Validation type for this Issue: interactive MVP smoke test result recording only.
- Allowed changed file: `docs/mvp-smoke-test-results.md`

## Execution Context

- Date: 2026-05-18
- Repo branch for this Issue: `feature/issue-135-interactive-smoke-test`
- Local app URL tested: `http://127.0.0.1:5173/`
- Test method: in-app browser interactive walkthrough against the local Vite app using the configured local Supabase frontend environment.
- Sensitive value handling: env values, Supabase keys, tokens, and passwords were not written into this document.

## Result Summary

| Major Section | Status | Notes |
| --- | --- | --- |
| Auth flows | pass | Signup, logout, login, signed-in refresh, signed-out refresh, and user data isolation were verified interactively. |
| Projects CRUD | pass | Empty/list state loaded; create, read/search, update, delete were verified. One final smoke project was left to verify dashboard/report summaries. |
| Clients CRUD | pass | Empty/list state loaded; create, read/search, update, delete were verified. One final smoke client was left to verify dashboard/report summaries. |
| Tasks CRUD | pass | Empty/list state loaded; create, read/search, update, delete were verified. One final smoke task was left to verify dashboard/report summaries. |
| Income Records CRUD | pass | Empty/list state loaded; create, read/search, update, delete were verified. One final paid smoke income record was left to verify dashboard/report summaries. |
| Dashboard real-data summary | pass | Dashboard reflected the smoke data: projects `1`, tasks `1`, clients `1`, income `NT$1,350`. |
| Reports real-data summary | pass | Reports reflected the smoke data: projects `1`, tasks `1`, clients `1`, income `NT$1,350`, paid income `NT$1,350`. |
| Local app startup | pass | Non-elevated dev server startup failed due existing Windows access restrictions; elevated startup served the app successfully. |
| Build verification (`npm.cmd run build`) | pass | Passed after elevated rerun. |
| Test verification (`npm.cmd run test`) | pass | Passed after elevated rerun. |
| Secret safety / committed env file check | pass | No forbidden tracked `.env*` files were found; only `.env.example` is tracked. |

## Evidence Notes

### 1. PR prerequisite

- PR #134 was confirmed merged before Issue #135 execution started.
- Merge commit: `92e852c1fc50f4159694862d6f81b8857692a30e`
- This Issue did not modify PR #134 or PR #105.

### 2. Auth

Status: `pass`

Verified actions:

- Signup with a new smoke-test account created an active authenticated session.
- Logout returned the UI to the unauthenticated state.
- Refresh after logout preserved the unauthenticated state.
- Login with the smoke-test account restored the authenticated state.
- Refresh after login preserved the authenticated state.
- A second smoke-test account did not see the first account's Projects / Clients / Tasks / Income Records smoke data.

### 3. Projects CRUD

Status: `pass`

Verified actions:

- Projects page loaded an empty/list state without crashing.
- Created a smoke project and confirmed it was visible in search/list results.
- Updated the smoke project title and confirmed the updated value was visible.
- Deleted the updated smoke project and confirmed it was removed from filtered results.
- Created one final smoke project so Dashboard/Reports could verify real-data summaries.

### 4. Clients CRUD

Status: `pass`

Verified actions:

- Clients page loaded an empty/list state without crashing.
- Created a smoke client and confirmed it was visible in search/list results.
- Updated the smoke client name and confirmed the updated value was visible.
- Deleted the updated smoke client and confirmed it was removed from filtered results.
- Created one final smoke client so Dashboard/Reports could verify real-data summaries.

### 5. Tasks CRUD

Status: `pass`

Verified actions:

- Tasks page loaded an empty/list state without crashing.
- Created a smoke task and confirmed it was visible in search/list results.
- Updated the smoke task title and confirmed the updated value was visible.
- Deleted the updated smoke task and confirmed it was removed from filtered results.
- Created one final smoke task so Dashboard/Reports could verify real-data summaries.

### 6. Income Records CRUD

Status: `pass`

Verified actions:

- Income Records page loaded an empty/list state without crashing.
- Created a smoke income record and confirmed it was visible in search/list results.
- Updated the smoke income record title and amount and confirmed the updated value was visible.
- Deleted the updated smoke income record and confirmed it was removed from filtered results.
- Created one final paid smoke income record so Dashboard/Reports could verify real-data summaries.

### 7. Dashboard

Status: `pass`

Verified real-data values after the final smoke records were created:

- Project total: `1`
- Active project count: `1`
- Task total: `1`
- Pending task count: `1`
- Client total: `1`
- Total income amount: `NT$1,350`

### 8. Reports

Status: `pass`

Verified real-data values after the final smoke records were created:

- Total income amount: `NT$1,350`
- Project total: `1`
- Task total: `1`
- Client total: `1`
- Active project count: `1`
- Pending task count: `1`
- Paid income amount: `NT$1,350`

### 9. Local app startup

Status: `pass`

- `npm.cmd run dev -- --host 127.0.0.1 --port 5173`
  - non-elevated: failed with `Cannot read directory "..": Access is denied.` and vite config resolution error
  - elevated rerun: passed; local app returned HTTP 200 at `http://127.0.0.1:5173/`

### 10. Build/Test command outcomes

- `npm.cmd run build`
  - non-elevated: failed with `Cannot read directory "..": Access is denied.` and vite config resolution error
  - elevated rerun: passed

- `npm.cmd run test`
  - non-elevated: failed with `Cannot read directory "..": Access is denied.` and vite config resolution error
  - elevated rerun: passed (`14 files`, `91 tests`)

### 11. Secret / tracked env file safety

Status: `pass`

- No env values, API keys, access tokens, service role keys, or passwords were recorded in this document.
- Forbidden tracked env file check result: `NO_FORBIDDEN_ENV_FILES_TRACKED`
- Only `.env.example` is tracked.

## Pass / Fail / Blocked Details by Checklist Area

### Pass

- Auth signup/login/logout/session-aware UI
- User data isolation between two smoke-test accounts
- Projects CRUD
- Clients CRUD
- Tasks CRUD
- Income Records CRUD
- Dashboard real-data summary
- Reports real-data summary
- Local app startup after elevated rerun
- Build after elevated rerun
- Test after elevated rerun
- Secret safety / tracked env file check

### Fail

- None in this run.

### Blocked

- None in this run.

## Follow-up Candidates (Do Not Fix in This Issue)

- None from this smoke test run.

## Out-of-Scope Confirmation

- No app code changes were made.
- No Auth/CRUD/Dashboard/Reports logic changes were made.
- No Supabase schema/RLS/migration changes were made.
- No dependencies were added.
- No `package.json` or lockfile changes were made.
- No `.env`, API key, secret, token, password, or service role key was committed.
- No PR #105 / `workspace_settings` bootstrap changes were made.
- No modular refactor was performed.
- No Obsidian or Notion content was modified.
