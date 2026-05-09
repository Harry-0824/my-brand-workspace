# AGENTS.md

Codex must read and follow this file before making changes in this repository.

## Project Overview

- Product name: `My Brand Workspace`
- Product type: solo freelancer task and project management SaaS
- Primary user: single freelancer / solo operator
- UI language: Traditional Chinese
- Design direction: dark, low-eye-strain, minimal SaaS, premium tech feel
- Development direction: desktop first

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

Do not make these technology changes unless a future GitHub Issue explicitly requests them:

- Do not migrate to Next.js.
- Do not add Tailwind CSS.
- Do not add UI frameworks unless explicitly requested by an Issue.
- Do not add Redux, Zustand, or React Query unless explicitly requested by an Issue.

## Development Rules

- Follow the current GitHub Issue only.
- One Issue should solve one task only.
- Do not perform broad refactors unless explicitly requested.
- Do not modify unrelated files.
- Do not introduce unnecessary dependencies.
- Keep changes small and reviewable.
- Preserve existing behavior unless the Issue explicitly asks to change it.
- Prefer simple, readable implementation over clever abstractions.
- Use Traditional Chinese for user-facing UI text.
- Keep desktop-first implementation unless responsive behavior is explicitly requested.

## Styling Rules

- Use `styled-components`.
- Reuse `src/styles/theme.ts` tokens when possible.
- Reuse `GlobalStyle` instead of creating duplicate global CSS.
- Keep the dark low-eye-strain SaaS visual direction.
- Avoid neon cyberpunk, gaming HUD, pure black backgrounds, or high-saturation colors.
- Avoid introducing external icon or chart libraries unless explicitly requested.

## Testing Rules

- Add or update tests when behavior changes.
- Use Vitest and Testing Library.
- Run `npm run build` before opening a PR when practical.
- Run `npm run test` before opening a PR when practical.
- If `npm run lint` is not configured, state that clearly in the PR description.
- For docs-only changes, run `git diff --check` and state when build/test were not required.

## Security Rules

- Do not commit `.env`, `.env.local`, API keys, tokens, secrets, or credentials.
- Do not hard-code Supabase keys or backend secrets.
- Use environment variables only when explicitly requested by a future Issue.
- Keep secrets out of source code and PR descriptions.

## PR Requirements

Every PR description must include:

- Summary
- Related Issue
- Changed files
- How to Test
- Risk
- Out of Scope confirmation
- Whether any Issue scope was exceeded

## Suggested Branch Naming

Use these branch prefixes:

```txt
feature/*
fix/*
docs/*
```

For Issue #3, use:

```txt
docs/add-agents-md
```
