# AGENTS.md

Codex must read and follow this file before making changes in this repository.

This file defines repository-level rules for `Harry-0824/my-brand-workspace`.

The current GitHub Issue is the task source of truth.

---

## Project Overview

- Product name: `My Brand Workspace`
- Product type: solo freelancer task and project management SaaS
- Primary user: single freelancer / solo operator
- UI language: Traditional Chinese
- Design direction: dark, low-eye-strain, minimal SaaS, premium tech feel
- Development direction: desktop first
- Current development priority: complete a stable Supabase-backed MVP before broad architecture refactors

---

## Tech Stack

- React
- Vite
- TypeScript
- styled-components
- Vitest
- Testing Library
- npm
- Netlify frontend deployment
- Database: Supabase
- Future backend: Render if explicitly requested by a future Issue

Do not make these technology changes unless a GitHub Issue explicitly requests them:

- Do not migrate to Next.js.
- Do not add Tailwind CSS.
- Do not add UI frameworks.
- Do not add Redux, Zustand, React Query, or other state management libraries.
- Do not change the package manager.
- Do not introduce new dependencies unless the Issue explicitly requires them.

---

## Source of Truth

Follow this priority order:

1. Current GitHub Issue
2. This `AGENTS.md`
3. Existing code patterns
4. Existing tests
5. Package scripts

If there is a conflict, the current GitHub Issue and this file win.

---

## Task Rules

- Follow the current GitHub Issue only.
- One Issue should solve one task only.
- Do not implement features that are not requested in the Issue.
- Do not perform broad refactors unless explicitly requested.
- Do not modify unrelated files.
- Do not fix unrelated bugs unless they block the current Issue.
- Do not create extra documentation files unless the Issue explicitly requests them.
- Keep changes small, focused, and reviewable.
- Preserve existing behavior unless the Issue explicitly asks to change it.

When in doubt, choose the smallest safe implementation that satisfies the Acceptance Criteria.

---

## Development Rules

- Use TypeScript consistently.
- Prefer simple, readable implementation over clever abstractions.
- Prefer explicit logic over hidden magic.
- Avoid speculative abstraction.
- Avoid single-use abstraction.
- Avoid hidden side effects.
- Avoid giant shared utility files.
- Use Traditional Chinese for user-facing UI text.
- Keep desktop-first implementation unless responsive behavior is explicitly requested.
- Avoid large formatting-only changes.
- Avoid moving files unless the Issue explicitly asks for file movement or refactor.
- Avoid changing routes, app structure, or public API behavior unless required by the Issue.
- Do not modify deployment settings unless the Issue is specifically about deployment.
- Do not modify `package.json` or lockfiles unless the Issue explicitly requires dependency or script changes.

---

## AI-Friendly Codebase Rules

- Prefer simple and predictable code.
- Prefer explicit logic over clever abstractions.
- Keep feature boundaries isolated.
- Avoid hidden side effects.
- Avoid giant shared utilities.
- Avoid speculative abstraction.
- Keep components and modules focused on one responsibility.
- New code should be understandable by humans and AI agents later.
- Follow existing project structure before introducing a new structure.

---

## Modular Architecture Rules

Use these rules when working on pages, features, Supabase integration, or refactors.

- Prefer feature-based boundaries when adding or organizing functionality.
- Each feature should own its own components, types, hooks, mock data, and services when practical.
- Pages should compose feature components and avoid business logic.
- Shared components must be generic and must not contain feature-specific business terms.
- Data access should go through services, helpers, hooks, or dedicated data-layer files when practical.
- Do not call Supabase or API clients directly from multiple unrelated page components.
- Do not move unrelated files while working on a feature module.
- Do not introduce new dependencies for architecture cleanup unless explicitly requested.
- Prefer small, reviewable PRs over broad architecture changes.

Examples of generic shared components:

- `Button`
- `Card`
- `Badge`
- `EmptyState`
- `LoadingState`
- `ErrorState`

Examples of feature-specific components that should not be placed in generic shared UI:

- `ProjectCard`
- `TaskStatusBadge`
- `ClientList`
- `PaymentTable`
- `DashboardSummaryCard`

Rule of thumb:

If a component name contains a business term such as Project, Task, Client, Payment, Report, or Dashboard, it usually belongs to that feature, not generic shared UI.

---

## Data Integration Rules

For Supabase, API, CRUD, or persistence-related Issues:

- Keep changes limited to the target data flow.
- Do not perform broad modularization or folder restructuring in the same Issue.
- Avoid rewriting existing page layout unless required for data integration.
- Preserve existing UI and routes unless the Issue explicitly requests changes.
- Isolate data access in a service, helper, hook, or data-layer file when practical.
- Do not duplicate Supabase queries across unrelated components.
- Handle loading, error, and empty states when the user-facing behavior changes.
- Do not implement full CRUD unless the Issue explicitly requests full CRUD.
- Do not change database schema, migrations, or RLS policies unless the Issue explicitly requests it.
- Do not expose Supabase service role keys in frontend code.

Preferred data feature order:

1. Read-only
2. Create
3. Update
4. Delete or archive

Do not combine all stages into one Issue unless the Issue explicitly asks for it.

---

## UI Rules

- Use Traditional Chinese for all user-facing UI text.
- Keep the dark, low-eye-strain SaaS visual direction.
- Use `styled-components`.
- Reuse `src/styles/theme.ts` tokens when possible.
- Reuse existing layout and UI patterns when possible.
- Reuse `GlobalStyle` instead of creating duplicate global CSS.
- Keep desktop-first layout unless responsive behavior is explicitly requested.
- Avoid neon cyberpunk, gaming HUD, pure black backgrounds, or high-saturation colors.
- Avoid introducing external icon, animation, or chart libraries unless explicitly requested.
- Do not replace the existing styling approach unless the Issue explicitly asks for it.
- Do not perform broad redesigns unless explicitly scoped by the Issue.

---

## React Rules

- Prefer functional components.
- Keep component state local unless shared state is clearly required.
- Do not introduce global state libraries unless requested.
- Keep hooks focused and readable.
- Do not mix unrelated UI, data, and routing logic in one large component.
- Pages should compose feature components and avoid unnecessary business logic.

---

## TypeScript Rules

- Use TypeScript strictly.
- Avoid `any`.
- Prefer explicit domain types when they improve clarity.
- Do not silence TypeScript errors with unsafe casts unless there is no reasonable alternative.
- Do not weaken types just to pass tests.

---

## Testing Rules

- Add or update tests when behavior changes.
- Use Vitest and Testing Library.
- Prefer tests that verify user-visible behavior.
- Do not add brittle tests that only verify implementation details.
- Run the smallest relevant verification first.

Run the following before opening a PR when practical:

```txt
npm run test
npm run build

If npm run lint is configured, run it before opening a PR.

If npm run lint is not configured, state that clearly in the PR description.

For docs-only changes, run:

git diff --check

Then state when build/test were not required.

If a command cannot be run, report:

command executed
result
reason it could not complete
whether the failure is related to the current Issue

Do not change tests only to make them pass unless the Issue requires updating behavior.

Security Rules
Do not commit .env, .env.local, API keys, tokens, secrets, or credentials.
Do not hard-code Supabase keys or backend secrets.
Do not expose service role keys in frontend code.
Do not include secrets in PR descriptions, comments, tests, or documentation.
Use environment variables only when explicitly requested by a GitHub Issue.
Keep secrets out of source code, commit history, and generated files.
Deployment Rules
Deployment target: Netlify.
Do not change Netlify settings unless requested.
Do not add deployment secrets.
Do not commit .netlify/.
If build fails because of environment variables, report the missing variable name only.
Do not invent placeholder secrets.
Do not modify deployment configuration unless the Issue is specifically about deployment.
File Scope Rules

Before finishing, check the changed files.

The PR should not include:

unrelated files
unrelated formatting changes
unrelated route changes
unrelated dependency changes
unrelated docs
temporary files
debug logs
generated files that are not required by the Issue
.env or secret files

If a file was changed accidentally, revert it before opening the PR.

Documentation Rules
Do not create new Markdown files unless the Issue explicitly requests documentation.
Do not create handoff, summary, planning, or temporary docs inside the repo unless requested.
Keep repository documentation minimal and directly useful.
Do not update external Obsidian or Notion content from this repository.
Do not create WORKFLOW.md, TODO.md, PROJECT_BRIEF.md, ARCHITECTURE.md, NOTES.md, AI_GUIDE.md, or similar files unless specifically requested.
Git Rules
Main branch: main
Feature branches: feature/*
Fix branches: fix/*
Docs branches: docs/*

Do not commit directly to main unless explicitly instructed.

Suggested branch examples:

feature/tasks-read-only-data
feature/projects-create-flow
fix/sidebar-active-state
docs/update-agents-rules
Pull Request Requirements

Every PR description must include:

## Summary

-

## Related Issue

Closes #

## Changed Files

-

## How to Test

-

## Risk

-

## Out of Scope

-

## Scope Check

- Did this PR modify unrelated files?
- Did this PR exceed the Issue scope?
- Were any dependencies added or changed?
- Were any secrets, `.env` files, API keys, or credentials touched?

The PR must clearly state whether the Issue scope was exceeded.

PR summary should include:

What changed
Why it changed
Files changed
Verification commands and results
Any known limitations

PR must clearly mention if:

Some verification could not be run
The implementation intentionally skipped out-of-scope work
Follow-up Issues are needed
Review and Merge Rules

For review and merge tasks:

Do not modify files.
Check PR status, changed files, and mergeability.
Confirm the PR scope matches the Issue.
Do not merge draft PRs.
Merge only when the user explicitly asks.
Report merge commit after merge.
If there is a merge conflict, failed check, unexpected file change, or uncertainty about whether the PR is safe to merge, stop and report the issue.
PR Merge Cleanup Rules

After a PR is successfully merged, delete the PR head branch if it is a temporary feature/*, fix/*, or docs/* branch.

Only delete the branch after confirming:

the PR was merged successfully
the branch is the PR head branch
the branch belongs to the same repository, not a fork
the branch name matches feature/*, fix/*, or docs/*

Do not delete:

main
master
develop
release/*
production/*
any protected branch
any branch that does not clearly belong to the merged PR

Do not force-delete branches.

Delete both when safe:

the remote PR branch
the local PR branch

Recommended commands:

git checkout main
git pull origin main
git branch -d <branch-name>
git push origin --delete <branch-name>

If local branch deletion fails, do not use git branch -D unless the user explicitly approves.

If branch deletion is not available in the current tool/environment, report:

branch name
whether remote branch still exists
whether local branch still exists
exact manual cleanup commands

If branch deletion fails, report the failure instead of attempting risky cleanup.

Out of Scope by Default

Unless explicitly requested, do not:

Refactor the whole app
Rebuild routing
Redesign the layout system
Add a new state management library
Add a UI framework
Add authentication
Add payment features
Add database schema or RLS changes
Modify migrations
Modify deployment settings
Modify Obsidian notes
Modify Notion records
Create unrelated documentation
Clean up unrelated branches
Change package manager
Add new infrastructure
Notes for Codex
Think before coding.
Prefer boring, maintainable solutions.
Make minimal, reviewable changes.
Respect the GitHub Issue scope.
If the Issue is ambiguous, choose the smallest interpretation and document the assumption.
If the requested work is too broad, propose a smaller Issue split instead of implementing everything.
```
