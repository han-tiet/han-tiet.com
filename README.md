# han-tiet.com

The source for [han-tiet.com](https://han-tiet.com), my personal portfolio site. It is built with Next.js 16 (App Router) and React 19 and deployed on Vercel.

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
