<!-- PR title format: [Release] vX.Y.Z - Short description -->

## 🚀 Release Summary

<!-- Briefly describe what this release delivers and why it is shipping now -->

**Release version:** `vX.Y.Z`
**Source branch:** `develop`
**Target branch:** `main`
**Previous release:** `vX.Y.Z`

## Release Type

- [ ] Major (breaking changes)
- [ ] Minor (new features, backwards compatible)
- [ ] Patch (bug fixes only)

## Included Changes

<!-- List the merged feature PRs / tickets going out in this release, e.g. HAN-024: Contact form tests (#57) -->

### Features

-

### Fixes

-

### Chores / Refactors / Tests

-

## Hotfix Sync

<!-- Confirm every hotfix merged into `main` since the last release has been merged back into `develop` -->

- [ ] All hotfixes since the previous release are already in `develop`
- Hotfixes included:

## Breaking Changes

<!-- Anything that changes existing behaviour, routes, APIs, or data. Write "None" if not applicable. -->

## Database Migrations

<!-- List any Prisma migrations in this release and confirm they have been applied/tested against a production-like database -->

- [ ] No migrations in this release
- [ ] Migrations included and tested:

## Environment & Configuration Changes

<!-- New or changed env vars (Vercel, AWS SES, Spotify, Sentry, etc.), third-party dashboard settings, OAuth redirect URIs -->

- [ ] No env/config changes
- [ ] Changes required (set in production **before** merging):

## Pre-Release Verification

<!-- Verify the develop branch preview deployment before merging -->

- **Preview deployment URL:**

- [ ] `npm run lint` passes
- [ ] `npx prettier . --check` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Smoke-tested the preview deployment:
  - [ ] Portfolio pages (`/`, `/projects`, `/contact`)
  - [ ] Contact form sends and confirms email
  - [ ] GIFHunter search returns results
  - [ ] Spotify Artist Collage login and collage load
- [ ] No new errors in Sentry for the preview deployment

## Risk Assessment

<!-- What could this release break? What's the blast radius? -->

- **Risk level:** Low / Medium / High
- **Areas affected:**

## Rollback Plan

<!-- How do we revert quickly if the release causes problems? e.g. promote the previous Vercel deployment, revert the merge commit -->

-

## Checklist

- [ ] `develop` is up to date with `main`, and there are no merge conflicts
- [ ] All PRs included in this release have been reviewed and merged into `develop`
- [ ] Version number has been bumped in `package.json`
- [ ] Documentation (README, CLAUDE.md) is updated where needed
- [ ] Release notes below are ready to publish

## Release Notes

<!-- User-facing summary to copy into the GitHub Release for this tag -->

## Post-Merge Actions

- [ ] Verify the production deployment on Vercel succeeded
- [ ] Smoke-test production
- [ ] Monitor Sentry for new errors
- [ ] Create the `vX.Y.Z` tag and GitHub Release
- [ ] Merge `main` back into `develop` if the merge created any differences
- [ ] Close the related milestone / tickets

## Additional Context

<!-- Anything else reviewers should know -->
