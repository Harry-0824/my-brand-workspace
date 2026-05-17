# AGENTS.md

Codex must read and follow this file before making changes in this repository.

This file defines repository-level rules. The current GitHub Issue is the task source of truth.

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
- Future database: Supabase
- Future backend: Render

Do not make these technology changes unless a GitHub Issue explicitly requests them:

- Do not migrate to Next.js.
- Do not add Tailwind CSS.
- Do not add UI frameworks.
- Do not add Redux, Zustand, React Query, or other state management libraries.
- Do not change the package manager.
- Do not introduce new dependencies unless the Issue explicitly requires them.

---

## Task Source of Truth

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
- Use Traditional Chinese for user-facing UI text.
- Keep desktop-first implementation unless responsive behavior is explicitly requested.
- Avoid large formatting-only changes.
- Avoid moving files unless the Issue explicitly asks for file movement or refactor.
- Avoid changing routes, app structure, or public API behavior unless required by the Issue.
- Do not modify deployment settings unless the Issue is specifically about deployment.
- Do not modify `package.json` or lockfiles unless the Issue explicitly requires dependency or script changes.

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

Preferred data feature order:

1. Read-only
2. Create
3. Update
4. Delete or archive

Do not combine all stages into one Issue unless the Issue explicitly asks for it.

---

## Styling Rules

- Use `styled-components`.
- Reuse `src/styles/theme.ts` tokens when possible.
- Reuse existing layout and UI patterns when possible.
- Reuse `GlobalStyle` instead of creating duplicate global CSS.
- Keep the dark, low-eye-strain SaaS visual direction.
- Avoid neon cyberpunk, gaming HUD, pure black backgrounds, or high-saturation colors.
- Avoid introducing external icon, animation, or chart libraries unless explicitly requested.
- Do not replace the existing styling approach unless the Issue explicitly asks for it.

---

## Testing Rules

- Add or update tests when behavior changes.
- Use Vitest and Testing Library.
- Prefer tests that verify user-visible behavior.
- Do not add brittle tests that only verify implementation details.
- Run the following before opening a PR when practical:

```txt
npm run test
npm run build
If npm run lint is configured, run it before opening a PR.
If npm run lint is not configured, state that clearly in the PR description.
For docs-only changes, run:
git diff --check

and state when build/test were not required.

Security Rules
Do not commit .env, .env.local, API keys, tokens, secrets, or credentials.
Do not hard-code Supabase keys or backend secrets.
Do not expose service role keys in frontend code.
Do not include secrets in PR descriptions, comments, tests, or documentation.
Use environment variables only when explicitly requested by a GitHub Issue.
Keep secrets out of source code, commit history, and generated files.
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
PR Requirements

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

Suggested Branch Naming

Use these branch prefixes:

feature/*
fix/*
docs/*

Examples:

feature/tasks-read-only-data
feature/projects-create-flow
fix/sidebar-active-state
docs/update-agents-rules
```
