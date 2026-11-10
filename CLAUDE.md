# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (han-tiet.com) built on Next.js 16 App Router + React 19, deployed on Vercel. Besides the portfolio pages (`/`, `/projects`, `/contact`) it hosts two self-contained demo apps under `/projects/*`: **GIFHunter** and **Spotify Artist Collage**.

## Commands

```bash
npm run dev          # next dev --turbopack --experimental-https (serves https://localhost:3000)
npm run build        # next build (wrapped by Sentry, uploads source maps)
npm run lint         # eslint .
npx prettier . --check
npm test             # vitest run (unit/component tests)
npm run test:watch   # vitest in watch mode
npx vitest run src/lib/classifyError.test.ts   # single file; add -t "<name>" for a single test
npm run test:e2e     # playwright test (starts npm run dev if it isn't already running)
npm run test:e2e:ui  # playwright UI mode
npx prisma generate  # also runs on postinstall; client output is src/generated/prisma (gitignored)
npx prisma migrate dev
```

`next.config.ts` sets `typescript.ignoreBuildErrors: true`, so `npm run build` will not catch type errors — run `npx tsc --noEmit` to type-check.

## Testing

- **Unit/component tests (Vitest):** configured in `vitest.config.mts` (jsdom environment, `@/*` alias, v8 coverage; `vitest.setup.ts` loads the `@testing-library/jest-dom` matchers). Test files live in `src/lib/*.test.ts(x)`, whatever module they cover. External services are always mocked, so no `.env` or network is needed: SES via `vi.mock("@aws-sdk/client-ses")` with a `vi.hoisted` `send` mock, Giphy/Klipy via `vi.stubGlobal("fetch", …)`, server actions and `sonner` via `vi.mock`, and env vars via `vi.stubEnv`.
- **End-to-end tests (Playwright):** configured in `playwright.config.ts`, tests in `e2e/`. They run against `https://localhost:3000` (`ignoreHTTPSErrors` for the local certificates) in three projects: `desktop`, `phone` (Pixel 7) and `phone-landscape`, so each test runs three times. They use the real dev server and `.env`, but stub external sites in the browser with `page.route` where possible. Tests tagged `@live` call real third-party APIs (Giphy/Klipy); skip them with `npm run test:e2e -- --grep-invert @live`. Run `npx playwright install` once to download the browsers.
- Vitest excludes `e2e/**`, but it does not exclude `.claude/worktrees/`, so with a local worktree present it picks up duplicate copies of the tests. Run `npx vitest run --exclude ".claude/**"` for accurate counts.

## Git workflow

- Husky hooks: `pre-commit` runs lint, lint-staged, and `prettier . --write`; `pre-push` runs `prettier . --check`; `commit-msg` enforces Conventional Commits (`feat:`, `fix:`, `build:`, `test:` …) via commitlint.
- Feature branches are named `HAN-NNN` (ticket number), branched from and merged into `develop`. `main` is production; releases are merged from `develop`, and hotfixes use `vX.Y.Z` branches merged into `main` then back into `develop`.

## Architecture

- **Path alias:** `@/*` → `src/*`.
- **Routes:** all internal paths live in `src/constants/routes.ts` (`ROUTES`); use these rather than string literals. Project cards on `/projects` are driven by `src/data/projects.ts`.
- **Feature code:** each demo app keeps its components in `src/features/<app>/` (Spotify's are nested under `src/features/spotify-artist-collage/src/components/`), while its routes live in `src/app/projects/<app>/`. Shared site components are in `src/components/`, with shadcn/ui primitives (new-york style) in `src/components/ui/`.
- **Mixed styling:** Tailwind v4 (configured in `src/app/globals.css`, not `tailwind.config.js`) is used site-wide; GIFHunter uses MUI (`sx` props, wrapped by `AppRouterCacheProvider` in the root layout). MUI breakpoints differ from Tailwind's (MUI `md` = 900px, Tailwind `md` = 768px), so GIFHunter uses raw media queries where it must match Tailwind pages.
- **Custom Tailwind variants** (defined in `globals.css`): `desktop` (fine pointer, ≥48rem), `touch` (coarse pointer), `tablet-landscape`, `handheld`. Short landscape phones are targeted inline with `[@media(max-height:500px)_and_(orientation:landscape)]:`. Responsive work should account for these rather than width breakpoints alone.
- **Animation:** framer-motion (`motion`) for scroll/carousel effects; GSAP is also installed.

### Spotify Artist Collage (auth + DB)

- Better Auth (`src/lib/auth.ts` server, `src/lib/auth-client.ts` client) with the Spotify social provider. Its `basePath` is `/projects/spotify-artist-collage/api/auth`, served by the catch-all handler in `src/app/projects/spotify-artist-collage/api/auth/[...all]/route.ts`.
- Allowed hosts, trusted origins and the OAuth redirect URI are built from `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`, `NEXT_PUBLIC_VERCEL_BRANCH_URL` and `NEXT_PUBLIC_HOST` (local dev host). Login breakage is usually one of these being wrong.
- Sessions are stored in Postgres via Prisma 7 (`prisma/schema.prisma`, Better Auth's User/Session/Account/Verification models). `src/lib/prisma.ts` uses the `@prisma/adapter-pg` driver adapter and imports from the generated client at `src/generated/prisma/client`.
- The collage page is a server component that checks the session, gets the Spotify access token via `auth.api.getAccessToken`, and calls the Spotify Web API directly.

### GIFHunter

- `src/app/projects/gif-hunter/search/page.tsx` is a server component that calls `fetchResults` and `APIErrorMessage` from `src/features/gif-hunter/lib/fetchResults.ts`. `fetchResults` queries Giphy and Klipy in parallel with `Promise.allSettled` (keys `GH_API_KEY_1`, `GH_API_KEY_2`; the query is URL-encoded and non-OK responses count as failures), then merges the results into `{ key, src, id, title }` objects. `key` is prefixed by provider (`giphy-<id>` / `klipy-<id>`) because ids can collide across the two APIs; `Results` uses `key`, not `id`. If one API fails, the page shows an error message.

### Contact form / AWS SES

- `src/app/actions/handleContactForm.ts` is a server action (zod validation) that sends two emails through SES: one to `HAN_EMAIL_ADDRESS` from `NOREPLY_EMAIL_ADDRESS`, and a confirmation to the sender. Errors are mapped by `src/lib/ses/classifyError.ts` into a uniform `SESResult` (`userMessage` shown in a toast, `internalMessage` logged). `ContactForm.tsx` consumes it via `useActionState`.
- `src/app/api/route.ts` (`POST /api`) is the SNS webhook for SES bounce/complaint notifications: it verifies the SNS signature, confirms subscriptions, and adds permanently bounced or complaining addresses to the SES suppression list.

### Observability

- Sentry is configured in `sentry.server.config.ts`, `sentry.edge.config.ts`, `src/instrumentation.ts` and `src/instrumentation-client.ts`, with a `/monitoring` tunnel route. Vercel Analytics is mounted in the root layout.

## Environment

Env vars live in `.env` / `.env.development.local` (gitignored). Key ones: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `SPOTIFY_ID`, `SPOTIFY_SECRET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `HAN_EMAIL_ADDRESS`, `NOREPLY_EMAIL_ADDRESS`, `NEXT_PUBLIC_HOST`, `NEXT_PUBLIC_IMAGEHOST` (base URL for the images and videos in `public/han-tiet.com/`), `NEXT_PUBLIC_SENTRY_DSN`, `GH_API_KEY_1`, `GH_API_KEY_2`. Local HTTPS certificates are in `certificates/`.
