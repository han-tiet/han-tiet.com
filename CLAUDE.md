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
npx prisma generate  # also runs on postinstall; client output is src/generated/prisma (gitignored)
npx prisma migrate dev
```

There is no test suite. `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so `npm run build` will not catch type errors — run `npx tsc --noEmit` to type-check.

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

- `src/app/projects/gif-hunter/search/page.tsx` is a server component that queries Giphy and Klipy in parallel with `Promise.allSettled` (keys `GH_API_KEY_1`, `GH_API_KEY_2`), merges the results, and shows an error message if one API fails.

### Contact form / AWS SES

- `src/app/actions/handleContactForm.ts` is a server action (zod validation) that sends two emails through SES: one to `HAN_EMAIL_ADDRESS` from `NOREPLY_EMAIL_ADDRESS`, and a confirmation to the sender. Errors are mapped by `src/lib/ses/classifyError.ts` into a uniform `SESResult` (`userMessage` shown in a toast, `internalMessage` logged). `ContactForm.tsx` consumes it via `useActionState`.
- `src/app/api/route.ts` (`POST /api`) is the SNS webhook for SES bounce/complaint notifications: it verifies the SNS signature, confirms subscriptions, and adds permanently bounced or complaining addresses to the SES suppression list.

### Observability

- Sentry is configured in `sentry.server.config.ts`, `sentry.edge.config.ts`, `src/instrumentation.ts` and `src/instrumentation-client.ts`, with a `/monitoring` tunnel route. Vercel Analytics is mounted in the root layout.

## Environment

Env vars live in `.env` / `.env.development.local` (gitignored). Key ones: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `SPOTIFY_ID`, `SPOTIFY_SECRET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `HAN_EMAIL_ADDRESS`, `NOREPLY_EMAIL_ADDRESS`, `NEXT_PUBLIC_HOST`, `NEXT_PUBLIC_IMAGEHOST` (base URL for the images and videos in `public/han-tiet.com/`), `NEXT_PUBLIC_SENTRY_DSN`, `GH_API_KEY_1`, `GH_API_KEY_2`. Local HTTPS certificates are in `certificates/`.
