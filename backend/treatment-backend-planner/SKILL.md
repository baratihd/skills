---
name: treatment-backend-planner
description: Design implementation-ready, safe change plans for the Treatment Django backend, including Django APIs, ORM, migrations, Celery, integrations, security, and cross-app refactors. Use before substantial implementation or when architecture or change impact needs evaluation.
---

# Treatment Backend Planner

This is a **planning skill**, shared across Codex, OpenCode, and Claude Code. Produce an actionable design based on verified repository evidence; **do not modify application code or execute migrations** in planning mode unless explicitly requested.

## Discover and verify context

1. Identify the requested outcome, acceptance criteria, working branch, target branch (if relevant), and intended deployment environment. Do not assume `production` or `development` branch names. Check `git status` and refs before comparing. Never overwrite uncommitted work.
2. Read the relevant existing product/business documents (Persian) and technical/quality documents (English) when available. If missing, flag exactly which documentation is missing; do not invent business requirements.
3. If Graphify is installed and an applicable current graph is available, optionally use `graphify query`, `path`, or `explain` to orient; **never require Graphify**. If unavailable or stale, search the relevant source, migrations, settings and tests directly. Treat graphs as hints, not evidence.
4. Verify classes, call sites, permissions, data flows, configuration, database constraints and external dependencies in actual source code.
5. Determine Python/Django/runtime versions from active project configuration and lock files. Report inconsistencies; do not hard-code historical framework versions.
6. For branch comparisons use the actual user-specified source and destination refs; distinguish commit history from working-tree changes. Do not fetch remote refs without considering user authorization/network availability.

## Architecture and change-impact review

- Identify owning app and boundaries; avoid unnecessary abstractions or cross-app coupling. Apply SOLID and clean layering pragmatically, not mechanically.
- Verify public API contracts (routes, serializers, field types, status/error formats, pagination, filtering), compatibility with frontend/PWA, and authentication/authorization/tenant isolation.
- Analyze ORM query costs, N+1, transactions and locks, constraints, concurrency, data consistency, migration ordering, and reversibility.
- Include async and external effects (Celery retries and idempotency, `transaction.on_commit`, cache invalidation, Elasticsearch/index synchronisation, HTTP timeouts and errors, SMS gateways).
- Analyze observability, security and secrets, operations, rollout, rollback, feature flags and deployment sequencing as relevant.
- Separate **verified current behavior**, **documented intended behavior**, **proposed change**, and **open questions**. Clearly identify any mismatch.
- Consider testability and existing testing infrastructure; no real third-party/SMS/Celery dispatch in routine automated tests.

## Required output

Produce a decision-complete plan with:
1. Scope, objective, constraints and acceptance criteria.
2. Evidence and relevant source paths, plus source/target revision when used.
3. Current architecture/data flow and proposed architecture/data flow, with ownership of components.
4. Ordered implementation steps, affected public interfaces, and compatibility measures.
5. Migration/backfill strategy, failure handling, observability, rollout and rollback (if applicable).
6. Explicit Unit/Integration/API/E2E/Smoke (FireTest), migration, security and performance scenarios proportional to risk.
7. Documentation updates needed and affected documentation pages.
8. Uncertainties, assumptions, trade-offs and blocked decisions; ask targeted questions only when necessary.

## Skill collaboration

- When `treatment-django-engineer` invokes this skill, return the plan first; the engineer owns implementation, integration and final reporting.
- Recommend `django-product-documentation` to update impacted documentation and `treatment-backend-testing` to implement tests, but **do not claim these skills ran** unless found and actually invoked/read.
- If a dependent skill is absent, record the missing dependency and provide a usable fallback plan without fabricating its rules.
- This skill does not automatically run on every trivial typo or formatting change; tailor planning effort to impact.

## Non-negotiable safeguards

Never invent domain policies, data models, undocumented API behavior, or test results. No silent destructive database operations, commits, deployment, or changes to unrelated files. Do not claim coverage, build, migration, or integration success without executing and measuring it.
