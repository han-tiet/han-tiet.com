## 🔥 Hotfix Summary

<!-- Briefly describe the critical issue being fixed and its impact -->

**Hotfix branch:** `hotfix/`
**Target branch:** `main`

## Severity

- [ ] Critical (production down / data loss / security)
- [ ] High (major functionality broken)
- [ ] Medium (significant but workaround exists)

## Related Issue(s) / Incident

<!-- Link the incident, ticket, or bug report -->

- Fixes #
- Incident link:

## Root Cause

<!-- What caused the issue? -->

## Fix Description

<!-- What does this change do to resolve it? Keep the diff as minimal and targeted as possible. -->

-
-

## How to Test

<!-- Steps for a reviewer to verify the fix locally or in staging -->

1.
2.
3.

## Risk Assessment

<!-- What could this change break? What's the blast radius? -->

- **Risk level:** Low / Medium / High
- **Areas affected:**

## Rollback Plan

<!-- How do we revert quickly if this makes things worse? -->

-

## Checklist

- [ ] This is the smallest possible change to fix the issue
- [ ] I have tested this fix against the reported issue
- [ ] I have verified this does not reintroduce previously fixed bugs
- [ ] Existing tests pass, and I've added a regression test where practical
- [ ] I have notified relevant stakeholders (on-call, team lead, etc.)
- [ ] This branch is up to date with `main`
- [ ] I have a plan to also merge this fix back into `develop` (to avoid it being lost on the next release)

## Deployment Notes

<!-- Any migrations, config/env changes, feature flags, or manual deploy steps -->

## Post-Merge Actions

- [ ] Deploy to production
- [ ] Verify fix in production
- [ ] Merge/cherry-pick into `develop`
- [ ] Close incident / update status page
- [ ] Post-mortem scheduled (if applicable)

## Additional Context

<!-- Anything else reviewers should know -->
