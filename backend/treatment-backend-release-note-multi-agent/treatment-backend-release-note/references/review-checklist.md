# Release Review Checklist

## Git and release identity
- [ ] Confirm source and target refs, SHA and merge base; confirm direction of promotion.
- [ ] Inspect commit range AND merge-base diff; note divergent histories and cherry-picks.
- [ ] Record whether comparison is proposed changes or actually deployed changes.
- [ ] Inspect existing release note convention and avoid overwriting documents.

## Business and implementation
- [ ] Review changed domain rules, serializers, views, services and permission checks.
- [ ] Distinguish behavior change from refactor, formatting, tests and tooling.
- [ ] Check backwards-incompatible request/response changes, pagination, filters, authorization and error/status codes.
- [ ] Review model migrations, constraints, locks, backfills, data deletion and database availability impact.
- [ ] Review Celery jobs, retries, queues, schedules, event formats and in-flight message compatibility.
- [ ] Review third-party service calls, authentication, API versions and irreversible external side effects.
- [ ] Review environment settings, secrets (never copy into note), feature flags and deploy ordering.
- [ ] Include security, monitoring, performance and operational changes when present.

## Assurance and recovery
- [ ] Identify actual test results versus test files merely changed.
- [ ] Capture traceable paths, commits, PRs and tickets only if supported.
- [ ] Assess consumer upgrade or coordination requirements.
- [ ] Check rollback artifact availability, migration reversibility, backup/restore, data transformations, jobs and integrations.
- [ ] Describe validation after deployment and after rollback.

## Output gate
- [ ] All release-note text is English and factual.
- [ ] Saved note contains business, code, compatibility, verification, traceability and rollback sections.
- [ ] Agent gives Persian business bullet summary **after saving**, only in chat; never in the note.
