# han-tiet.com

The source for [han-tiet.com](https://han-tiet.com), my personal portfolio site. It is built with Next.js 16 (App Router) and React 19 and deployed on Vercel. |

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix)
- **Animation:** Motion (framer-motion), GSAP
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

## Portfolio Projects

### GIFHunter

_Paste screenshot/demo vid here_
A GIF search engine that queries Giphy and Klipy in parallel and merges the results, and still returns results when one API is down.

<a href="https://han-tiet.com/project/gif-hunter">View here</a>

#### Tech Stack

- Framework: Next.js 16, React 19, Typescript
- Styling: Tailwind CSS v4, MUI

#### Features

- Index page: The user can type a query into the search bar to search for GIFs related to the query.
- Results page: Loads and displays GIFs to the user based on their search query. Search query persists in the search bar.

#### Areas of Interest

- `src/app/projects/gif-hunter/search/page.tsx` (<a href="">Link</a>) - fetches from each API in parallel and normalises the different response shapes into one `Gif` type.
- `src/features/gif-hunter/components/Results.tsx` (<a href="">Link</a>) - displays GIFs in a MaterialUI mosaic component after they have all been fetched. If an API cannot be accessed, displays GIFs from any remaining available APIs.
- `src/features/gif-hunter/components/SearchBar.tsx` (<a href="">Link</a>) - submits an input as a searchParam via a form that is then appended to the URL and read by fetchResults.

#### Challenges

- When simulating a situation where one of the two APIs could not be reached, the user would be redirected to the error page even though an API could still be accessed. This was caused by the promises from both API fetch functions being awaited in a `Promise.all`, which throws an error as long as one of the promises is rejected. Changing `Promise.all` to `Promise.allSettled` fixed the issue since `Promise.allSettled` only throws an error if **both** promises are rejected.

- If a query was searched while another query was being fetched, the website would sometimes hang indefinitely without displaying results for either query. This was caused by `<Results>`not unmounting after a new search, leading to some GIFs from the second query to not be counted and the `allLoaded` condition required to display GIFs not being fulfilled. This issue was fixed by adding a key to `<Results>`, which allowed it to unmount and remount with each new search. Also, the count function was changed to a callback function that counted both cached and uncached GIFs, so `allLoaded` can be met and the website can display GIFs.

#### Testing

#### Known Issues

-

#### Potential Additions

- Download GIFs at different resolutions
- List of filters (e.g API, NSFW, AI generated GIFs)
- Replace title with custom logo

### Spotify Artist Collage

_Paste screenshot/demo vid here_
Signs into Spotify with OAuth (via Better Auth) and builds a collage of the user's top 50 most-listened-to artists.

<a href="https://han-tiet.com/project/spotify-artist-collage">View here</a>

#### Tech Stack

- Framework: Next.js 16, React 19, Typescript
- Styling: Tailwind CSS v4, shadcn (Radix)
- Backend: PostgreSQL, Prisma 7
- Auth: OAuth via Better Auth

#### Features

- Login page: The user can click on a button to log in to and authenticate their Spotify account.
- Collage page: After successful authentication, sequentially fades in profile images of the user's top 50 most listened to Spotify artists to create a collage.

#### Areas of Interest

- `src/app/projects/spotify-artist-collage/page.tsx` (<a href="">Link</a>) - fetches the access token from Spotify's API, authenticates the user and fetches the user's name and most listened to artists.
- `src/features/spotify-artist-collage/src/components/Collage.tsx` (<a href="">Link</a>) - Sequentially loads in profile images of the user's top 50 most listened to Spotify artists with a fade-up animation to create a collage. When an image is hovered, an overlay fades in showing the artist's rank and name and when an image is clicked, the user is redirected to the artist's Spotify page.

#### Challenges

- Trying to log in led to the the website returning an API error even though previous logins were successful. This was caused by Better Auth 1.7 changing what Ids are accepted by `getAccessToken`. Instead of `providerId`, `getAccessToken` now requires an `accountId` passed to it for OAuth login to be successful. To solve the issue, the fetch logic was changed so that `accountId` was passed from headers to `getAccessToken` and `providerId` was removed.

- Since multiple users will be logging into this website, a database was required to securely store user data. Initially, MySQL was considered due to being low-cost and secure. However, it was found that hosting the project on Vercel meant that traditional methods of backend integration would not be supported. In the end, the project would connect to a postgreSQL database via a Prisma ORM, since this setup was the only one that was compatible with Vercel while using a relational database.

#### Testing

#### Known Issues

-

#### Potential Additions

- Other music streaming services (Apple Music, Amazon Prime Music etc)
- More unique methods of displaying artists (three.js for 3D components)

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
