# han-tiet.com

The source for [han-tiet.com](https://han-tiet.com), Han Tiet's personal portfolio site. It is built with Next.js 16 (App Router) and React 19 and deployed on Vercel.

Alongside the portfolio pages, the site hosts two self-contained demo apps:

| App                        | Route                              | What it does                                                                                                                       |
| -------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **GIFHunter**              | `/projects/gif-hunter`             | GIF search engine that queries Giphy and Klipy in parallel and merges the results, and still returns results when one API is down. |
| **Spotify Artist Collage** | `/projects/spotify-artist-collage` | Signs in with Spotify (OAuth via Better Auth) and builds a collage of the user's top 50 most-listened-to artists.                  |

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix), MUI (GIFHunter only)
- **Animation:** Motion (framer-motion), GSAP
- **Auth & data:** Better Auth (Spotify provider), Prisma 7, PostgreSQL
- **Email:** AWS SES (contact form) with an SNS webhook for bounces and complaints
- **Forms:** react-hook-form + zod
- **Observability:** Sentry, Vercel Analytics

## Getting started

### Prerequisites

- Node.js 20.9 or later
- A PostgreSQL database (needed for the Spotify Artist Collage)
- API credentials for the features you want to run locally (see [Environment variables](#environment-variables))

### Install and run

```bash
npm install          # also runs `prisma generate` via postinstall
npx prisma migrate dev
npm run dev
```

The dev server runs with `--experimental-https` and serves **https://localhost:3000**. HTTPS is required because Better Auth and the Spotify OAuth redirect are configured for `https` only. The local certificates are in `certificates/`.

## Environment variables

Create `.env` and/or `.env.development.local` in the project root. Both are gitignored.

> [!NOTE]
> The Prisma CLI (`prisma.config.ts`) loads variables through `dotenv/config`, which reads only `.env`. Put `DATABASE_URL` in `.env` so `npx prisma migrate dev` can find it.

| Variable                                      | Used by                | Description                                                             |
| --------------------------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`                                | Prisma / Better Auth   | PostgreSQL connection string                                            |
| `BETTER_AUTH_SECRET`                          | Better Auth            | Secret used to sign sessions                                            |
| `SPOTIFY_ID` / `SPOTIFY_SECRET`               | Spotify Artist Collage | Spotify app client ID and secret                                        |
| `NEXT_PUBLIC_HOST`                            | Better Auth            | Local dev host, e.g. `localhost:3000` (no protocol)                     |
| `GH_API_KEY_1` / `GH_API_KEY_2`               | GIFHunter              | Giphy and Klipy API keys                                                |
| `AWS_REGION`                                  | Contact form           | Region of the SES account                                               |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Contact form           | IAM credentials with SES send and suppression-list permissions          |
| `HAN_EMAIL_ADDRESS`                           | Contact form           | Address that receives contact form messages                             |
| `NOREPLY_EMAIL_ADDRESS`                       | Contact form           | Verified SES sender address                                             |
| `NEXT_PUBLIC_IMAGEHOST`                       | Site-wide              | Base URL for images and videos (the contents of `public/han-tiet.com/`) |
| `NEXT_PUBLIC_SENTRY_DSN`                      | Sentry                 | Sentry project DSN                                                      |
| `SENTRY_AUTH_TOKEN`                           | Build                  | Lets `next build` upload source maps to Sentry                          |

On Vercel, `NEXT_PUBLIC_VERCEL_ENV`, `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` and `NEXT_PUBLIC_VERCEL_BRANCH_URL` are provided automatically and take the place of `NEXT_PUBLIC_HOST`.

### Spotify app setup

In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), add this redirect URI for each host you run the app on:

```
https://<host>/projects/spotify-artist-collage/api/auth/callback/spotify
```

For local development that is `https://localhost:3000/projects/spotify-artist-collage/api/auth/callback/spotify`. If sign-in fails, check this URI and the host variables above first.

## Scripts

| Command                  | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run dev`            | Start the dev server (Turbopack, HTTPS) at https://localhost:3000 |
| `npm run build`          | Production build. Sentry uploads source maps during the build     |
| `npm run start`          | Serve the production build                                        |
| `npm run lint`           | Run ESLint                                                        |
| `npx prettier . --check` | Check formatting                                                  |
| `npx tsc --noEmit`       | Type-check the project                                            |
| `npx prisma generate`    | Regenerate the Prisma client into `src/generated/prisma`          |
| `npx prisma migrate dev` | Apply and create database migrations                              |

> [!IMPORTANT]
> `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so `npm run build` does not fail on type errors. Run `npx tsc --noEmit` to catch them.

## Project structure

```
prisma/                     Prisma schema and migrations (Better Auth models)
public/                     Static assets
src/
├── app/                    App Router routes
│   ├── actions/            Server actions (contact form)
│   ├── api/                SNS webhook for SES bounces and complaints
│   ├── contact/            /contact
│   └── projects/           /projects and the demo app routes
│       ├── gif-hunter/
│       └── spotify-artist-collage/
├── components/             Shared site components
│   └── ui/                 shadcn/ui primitives
├── constants/routes.ts     All internal routes (use ROUTES, not string literals)
├── data/projects.ts        Project cards shown on /projects
├── features/               Components for each demo app
│   ├── gif-hunter/
│   └── spotify-artist-collage/
├── generated/prisma/       Generated Prisma client (gitignored)
└── lib/                    Auth, Prisma client, SES helpers
```

The path alias `@/*` maps to `src/*`.

## Contributing workflow

- **Branches:** feature branches are named after their ticket (`HAN-NNN`) and are branched from and merged into `develop`. `main` is production. Releases are merged from `develop` into `main`. Hotfixes use `vX.Y.Z` branches that are merged into `main` and then back into `develop`.
- **Commits:** messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:` …). commitlint enforces this.
- **Git hooks (Husky):**
  - `pre-commit` runs ESLint, lint-staged and Prettier
  - `pre-push` runs `prettier . --check`
  - `commit-msg` runs commitlint
- **Pull requests:** templates for feature, release and hotfix PRs are in `.github/`.

## License

[MIT](LICENSE) © Han Tiet
